// Importa la capa de servicio, donde reside la lógica de negocio (validaciones e interacción con el modelo)
const StockService = require('../services/stock.service');

// Define la clase de controlador que mapea las peticiones HTTP a la lógica de negocio
class StockController {

  // --- 1. Crear Nuevo Registro de Stock (POST /api/stock) ---

  /**
   * Maneja la petición para crear un nuevo registro de stock (asociado a un producto).
   */
  static async crear(req, res, next) {
    try {
      // Registro de la petición entrante
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: POST /api/stock');
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la tarea de creación a la capa de servicio
      const stock = await StockService.crear(req.body);

      // Registro de la respuesta exitosa
      console.log('✅ RESPUESTA EXITOSA: Stock creado');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente con código 201 Created
      res.status(201).json({
        success: true,
        message: 'Stock creado exitosamente',
        data: stock
      });

    } catch (error) {
      // Captura y pasa el error al middleware global de manejo de errores
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 2. Obtener Todos los Registros de Stock (GET /api/stock) ---

  /**
   * Maneja la petición para obtener una lista de todos los registros de stock.
   */
  static async obtenerTodos(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/stock');

      // Delega la obtención de datos al servicio
      const stocks = await StockService.obtenerTodos();

      console.log('✅ RESPUESTA EXITOSA:', stocks.length, 'registros encontrados');
      console.log('==========================================\n');

      // Envía la respuesta JSON al cliente
      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 3. Obtener Registro de Stock por ID (GET /api/stock/:id) ---

  /**
   * Maneja la petición para obtener un registro de stock por su ID.
   */
  static async obtenerPorId(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/stock/${req.params.id}`);

      // Delega la búsqueda por ID al servicio
      const stock = await StockService.obtenerPorId(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Stock encontrado');
      console.log('==========================================\n');

      res.json({
        success: true,
        data: stock
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Stock no encontrado' (responde con 404)
      if (error.message === 'Stock no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 4. Obtener Stock por ID de Producto (GET /api/stock/producto/:productoId) ---

  /**
   * Maneja la petición para obtener el registro de stock asociado a un producto.
   */
  static async obtenerPorProducto(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: GET /api/stock/producto/${req.params.productoId}`);

      // Delega la búsqueda por ID de producto al servicio
      const stock = await StockService.obtenerPorProducto(req.params.productoId);

      console.log('✅ RESPUESTA EXITOSA: Stock encontrado');
      console.log('==========================================\n');

      res.json({
        success: true,
        data: stock
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para el caso de 'Stock no encontrado para el producto' (responde con 404)
      if (error.message.includes('Stock no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 5. Obtener Productos con Stock Bajo (GET /api/stock/bajo-stock) ---

  /**
   * Maneja la petición para obtener una lista de productos cuyo stock está en niveles bajos.
   */
  static async obtenerBajoStock(req, res, next) {
    try {
      console.log('==========================================');
      console.log('🚀 POSTMAN REQUEST: GET /api/stock/bajo-stock');

      // Delega la lógica de filtrado al servicio
      const stocks = await StockService.obtenerBajoStock();

      console.log('✅ RESPUESTA EXITOSA:', stocks.length, 'productos con stock bajo');
      console.log('==========================================\n');

      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 6. Actualizar Registro de Stock (PUT /api/stock/:id) ---

  /**
   * Maneja la petición para actualizar campos de un registro de stock.
   */
  static async actualizar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/stock/${req.params.id}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      // Delega la actualización al servicio
      const stock = await StockService.actualizar(req.params.id, req.body);

      console.log('✅ RESPUESTA EXITOSA: Stock actualizado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Stock actualizado exitosamente',
        data: stock
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para 'Stock no encontrado'
      if (error.message === 'Stock no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }

  // --- 7. Aumentar Stock (Transaccional) (PUT /api/stock/aumentar/:productoId) ---

  /**
   * Maneja la petición para aumentar la cantidad de stock de un producto específico.
   * Útil para registrar entradas de inventario.
   */
  static async aumentarStock(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: PUT /api/stock/aumentar/${req.params.productoId}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      const { cantidad } = req.body;

      // Validación mínima en el controlador
      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ // 400 Bad Request
          success: false,
          message: 'La cantidad a aumentar debe ser un número entero mayor a 0'
        });
      }

      // Delega la operación transaccional al servicio
      const resultado = await StockService.aumentarStock(req.params.productoId, cantidad);

      console.log('✅ RESPUESTA EXITOSA: Stock aumentado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Stock aumentado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // El servicio manejará errores como 'Stock no encontrado para el producto'
      next(error);
    }
  }

  // --- 8. Descontar Stock (Transaccional) (PUT /api/stock/descontar/:productoId) ---

  /**
   * Maneja la petición para descontar la cantidad de stock de un producto específico.
   * Útil para registrar salidas de inventario o ventas manuales.
   */
  static async descontarStock(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 REQUEST: PUT /api/stock/descontar/${req.params.productoId}`);
      console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

      const { cantidad } = req.body;

      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La cantidad a descontar debe ser un número entero mayor a 0'
        });
      }

      const resultado = await StockService.descontarStock(req.params.productoId, cantidad);

      console.log('✅ RESPUESTA EXITOSA: Stock descontado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Stock descontado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');
      next(error);
    }
  }

  // --- 9. Eliminar Registro de Stock (DELETE /api/stock/:id) ---

  /**
   * Maneja la petición para eliminar un registro de stock.
   */
  static async eliminar(req, res, next) {
    try {
      console.log('==========================================');
      console.log(`🚀 POSTMAN REQUEST: DELETE /api/stock/${req.params.id}`);

      // Delega la eliminación al servicio
      const resultado = await StockService.eliminar(req.params.id);

      console.log('✅ RESPUESTA EXITOSA: Stock eliminado');
      console.log('==========================================\n');

      res.json({
        success: true,
        message: 'Stock eliminado exitosamente',
        data: resultado
      });

    } catch (error) {
      console.log('❌ ERROR:', error.message);
      console.log('==========================================\n');

      // Manejo específico para 'Stock no encontrado'
      if (error.message === 'Stock no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      next(error);
    }
  }
}

// Exporta el controlador para ser utilizado por el router
module.exports = StockController;