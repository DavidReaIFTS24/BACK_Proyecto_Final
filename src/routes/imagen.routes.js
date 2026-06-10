const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../../config/cloudinary');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Multer en memoria: el archivo nunca toca el disco del servidor
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
});

/**
 * Sube el buffer de multer a Cloudinary usando un stream,
 * evitando escribir archivos temporales en disco.
 */
const subirACloudinary = (buffer, opciones) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(opciones, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * POST /api/imagenes/upload
 * Recibe una imagen (multipart/form-data), la sube a Cloudinary
 * y devuelve la URL pública optimizada.
 * Requiere token JWT válido.
 */
router.post('/upload', verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió ninguna imagen',
      });
    }

    // Subir a Cloudinary dentro de la carpeta "productos"
    const resultado = await subirACloudinary(req.file.buffer, {
      folder: 'magnum/productos',       // carpeta en tu cuenta de Cloudinary
      resource_type: 'image',
      transformation: [
        { width: 800, crop: 'limit' },  // máximo 800px de ancho (sin upscaling)
        { quality: 'auto' },            // compresión automática
        { fetch_format: 'auto' },       // formato óptimo (WebP si el browser lo soporta)
      ],
    });

    console.log(`✅ Imagen subida a Cloudinary: ${resultado.secure_url}`);

    return res.status(200).json({
      success: true,
      message: 'Imagen subida correctamente',
      data: {
        url:       resultado.secure_url,   // URL https lista para guardar en Firestore
        public_id: resultado.public_id,    // ID en Cloudinary (útil si querés borrar la imagen luego)
      },
    });

  } catch (error) {
    console.error('❌ Error al subir imagen a Cloudinary:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al subir la imagen',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/imagenes/:publicId
 * Elimina una imagen de Cloudinary dado su public_id.
 * Útil cuando se elimina un producto.
 * Requiere token JWT de admin.
 */
router.delete('/*publicId', verificarToken, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    await cloudinary.uploader.destroy(publicId);

    console.log(`🗑️  Imagen eliminada de Cloudinary: ${publicId}`);

    return res.status(200).json({
      success: true,
      message: 'Imagen eliminada correctamente',
    });
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la imagen',
      error: error.message,
    });
  }
});

module.exports = router;