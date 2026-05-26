// Importa la capa de servicio, donde reside la lógica de negocio (validaciones e interacción con el modelo)
const UsuarioService = require('../services/usuario.service');

// Define la clase de controlador que mapea las peticiones HTTP a la lógica de negocio
class UsuarioController {

  // --- 1. Obtener Todos los Usuarios (GET /api/usuarios) ---
  
  /**
   * Maneja la petición para obtener una lista de todos los usuarios.
   */
  static async obtenerTodos(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/usuarios');
      // Accede a la información del usuario autenticado (adjuntada por el middleware verificarToken)
      console.log('👤 Usuario autenticado:', req.usuario.email); 

      // Delega la tarea de obtener datos a la capa de servicio
      const usuarios = await UsuarioService.obtenerTodos();

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA:', usuarios.length, 'usuarios encontrados');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente
      res.json({
        success: true,
        count: usuarios.length,
        data: usuarios
      });

    } catch (error) {
      // Captura cualquier error lanzado por el servicio o errores internos
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      // Pasa el error al middleware global de manejo de errores
      next(error); 
    }
  }

  // --- 2. Obtener Usuario por ID (GET /api/usuarios/:id) ---
  
  /**
   * Maneja la petición para obtener un usuario por su ID.
   */
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      // Obtiene el ID de los parámetros de la ruta
      console.log(`🚀 POSTMAN REQUEST: GET /api/usuarios/${req.params.id}`);

      // Delega la búsqueda al servicio
      const usuario = await UsuarioService.obtenerPorId(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Usuario encontrado');
      console.log('==========================================\n');

      // Envía el usuario encontrado
      res.json({
        success: true,
        data: usuario
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Usuario no encontrado' (responde con 404)
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 3. Actualizar Usuario (PUT /api/usuarios/:id) ---
  
  /**
   * Maneja la petición para actualizar los datos de un usuario.
   */
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/usuarios/${req.params.id}`);
      // Muestra los datos que se intentan actualizar
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la actualización al servicio, pasando el ID y los datos del cuerpo de la petición
      const usuario = await UsuarioService.actualizar(req.params.id, req.body);

      console.log('✅ RESPUESTA EXITOSA: Usuario actualizado');
      console.log('==========================================\n');

      // Envía el resultado actualizado
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuario
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Usuario no encontrado'
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      // El servicio también podría lanzar errores de validación (que serían capturados por el errorHandler global)
      next(error);
    }
  }

  // --- 4. Eliminar Usuario (DELETE /api/usuarios/:id) ---

  /**
   * Maneja la petición para eliminar (soft delete) un usuario.
   */
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/usuarios/${req.params.id}`);

      // Delega la eliminación al servicio
      const resultado = await UsuarioService.eliminar(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Usuario eliminado');
      console.log('==========================================\n');

      // Envía la confirmación
      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Usuario no encontrado'
      if (error.message === 'Usuario no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
  // --- 5. Crear Nuevo Usuario (POST /api/usuarios) --- [NUEVO]
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
}

// Exporta el controlador para ser utilizado por el router
module.exports = UsuarioController;