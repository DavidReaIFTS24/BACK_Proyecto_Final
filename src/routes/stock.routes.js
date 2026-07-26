const express = require('express');
const router = express.Router();

const StockController = require('../controllers/stock.controller');
const { verificarToken, esAdminOEmpleado } = require('../middlewares/auth.middleware'); 

// ── Rutas de Lectura ──────────────────────────────────────────────────────────

// GET /api/stock
router.get('/', verificarToken, esAdminOEmpleado, StockController.obtenerTodos);

// GET /api/stock/bajo-stock  ← ANTES de /:id
router.get('/bajo-stock', verificarToken, esAdminOEmpleado, StockController.obtenerBajoStock);

// GET /api/stock/producto/:productoId  ← ANTES de /:id
router.get('/producto/:productoId', verificarToken, esAdminOEmpleado, StockController.obtenerPorProducto);

// GET /api/stock/:id  ← AL FINAL de los GETs
router.get('/:id', verificarToken, esAdminOEmpleado, StockController.obtenerPorId);

// ── Rutas de Escritura ────────────────────────────────────────────────────────

// POST /api/stock
router.post('/', verificarToken, esAdminOEmpleado, StockController.crear);

// PUT /api/stock/aumentar/:productoId  ← ANTES de /:id
router.put('/aumentar/:productoId', verificarToken, esAdminOEmpleado, StockController.aumentarStock);

// PUT /api/stock/descontar/:productoId  ← ANTES de /:id
router.put('/descontar/:productoId', verificarToken, esAdminOEmpleado, StockController.descontarStock);

// PUT /api/stock/:id  ← AL FINAL de los PUTs
router.put('/:id', verificarToken, esAdminOEmpleado, StockController.actualizar);

// DELETE /api/stock/:id
router.delete('/:id', verificarToken, esAdminOEmpleado, StockController.eliminar);

module.exports = router;