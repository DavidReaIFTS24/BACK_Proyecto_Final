const UsuarioService = require('../services/usuario.service');

class UsuarioController {

  // --- 1. Crear Nuevo Usuario (POST /api/usuarios) --- [NUEVO]
  /**
   * ✅ NUEVO: Permite a un admin crear un usuario directamente desde el panel.
   * Requiere: nombre, email, password, rol.
   */
  static async crear(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 REQUEST: POST /api/usuarios');
      console.log('📦 Body recibido:', JSON.stringify({ ...req.body, password: '***' }));

      const usuario = await UsuarioService.registrarUsuario(req.body);

      console.log('✅ RESPUESTA EXITOSA: Usuario creado por admin');
      console.log('==========================================\n');

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: usuario
      });
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      if (error.message === 'El email ya está registrado') {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  // --- 2. Obtener Todos los Usuarios (GET /api/usuarios) ---
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/usuarios');
      console.log('👤 Usuario autenticado:', req.usuario.email);
      const usuarios = await UsuarioService.obtenerTodos();
      console.log('✅ RESPUESTA EXITOSA:', usuarios.length, 'usuarios encontrados');
      console.log('==========================================\n');
      res.json({ success: true, count: usuarios.length, data: usuarios });
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 3. Obtener Usuario por ID (GET /api/usuarios/:id) ---
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/usuarios/${req.params.id}`);
      const usuario = await UsuarioService.obtenerPorId(req.params.id);
      console.log('✅ RESPUESTA EXITOSA: Usuario encontrado');
      console.log('==========================================\n');
      res.json({ success: true, data: usuario });
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  // --- 4. Actualizar Usuario (PUT /api/usuarios/:id) ---
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/usuarios/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
      const usuario = await UsuarioService.actualizar(req.params.id, req.body);
      console.log('✅ RESPUESTA EXITOSA: Usuario actualizado');
      console.log('==========================================\n');
      res.json({ success: true, message: 'Usuario actualizado exitosamente', data: usuario });
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  // --- 5. Eliminar Usuario (DELETE /api/usuarios/:id) ---
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/usuarios/${req.params.id}`);
      const resultado = await UsuarioService.eliminar(req.params.id);
      console.log('✅ RESPUESTA EXITOSA: Usuario eliminado');
      console.log('==========================================\n');
      res.json({ success: true, message: 'Usuario eliminado exitosamente', data: resultado });
    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
}

module.exports = UsuarioController;