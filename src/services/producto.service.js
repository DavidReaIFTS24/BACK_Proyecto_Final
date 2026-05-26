const ProductoModel = require('../models/producto.model');
const CategoriaModel = require('../models/categoria.model');
const StockModel = require('../models/stock.model');

class ProductoService {
  static async crear(datosProducto) {
    console.log('📝 Servicio: Creando nuevo producto...');
    if (!datosProducto.nombre || !datosProducto.precio || !datosProducto.categoriaId) {
      throw new Error('Nombre, precio y categoría son requeridos');
    }
    const categoria = await CategoriaModel.obtenerPorId(datosProducto.categoriaId);
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    const producto = await ProductoModel.crear(datosProducto);
    await StockModel.crear({
      productoId: producto.id,
      cantidad: 0,
      stockMinimo: 5
    });
    console.log(`✅ Producto creado: ${producto.nombre}`);
    return producto;
  }

  /**
   * ✅ FIX: obtenerTodos ahora incluye el stock de cada producto.
   * Antes devolvía los productos sin el campo `stock`, lo que causaba
   * que la tabla de ProductosPage mostrara "—" en la columna Stock.
   */
  static async obtenerTodos() {
    console.log('📋 Servicio: Obteniendo todos los productos con stock...');
    const productos = await ProductoModel.obtenerTodos();

    // Para cada producto, buscamos su registro de stock en paralelo
    const productosConStock = await Promise.all(
      productos.map(async (producto) => {
        const stock = await StockModel.obtenerPorProducto(producto.id);
        return { ...producto, stock: stock?.cantidad ?? 0 };
      })
    );

    console.log(`✅ ${productosConStock.length} productos encontrados con stock`);
    return productosConStock;
  }

  static async obtenerPorId(id) {
    console.log(`🔍 Servicio: Buscando producto ${id}...`);
    const producto = await ProductoModel.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    const stock = await StockModel.obtenerPorProducto(id);
    console.log(`✅ Producto encontrado: ${producto.nombre}`);
    return { ...producto, stock: stock?.cantidad || 0 };
  }

  static async obtenerPorCategoria(categoriaId) {
    console.log(`🔍 Servicio: Obteniendo productos de categoría ${categoriaId}...`);
    const productos = await ProductoModel.obtenerPorCategoria(categoriaId);
    console.log(`✅ ${productos.length} productos encontrados`);
    return productos;
  }

  static async actualizar(id, datosActualizados) {
    console.log(`📝 Servicio: Actualizando producto ${id}...`);
    if (datosActualizados.categoriaId) {
      const categoria = await CategoriaModel.obtenerPorId(datosActualizados.categoriaId);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
    }
    const producto = await ProductoModel.actualizar(id, datosActualizados);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    console.log(`✅ Producto actualizado: ${producto.nombre}`);
    return producto;
  }

  static async eliminar(id) {
    console.log(`🗑️ Servicio: Eliminando producto ${id}...`);
    const resultado = await ProductoModel.eliminar(id);
    if (!resultado) {
      throw new Error('Producto no encontrado');
    }
    console.log(`✅ Producto eliminado: ${id}`);
    return resultado;
  }
}

module.exports = ProductoService;