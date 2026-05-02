"use client"

import { useState } from "react"
import { useProducts } from "@/lib/products-context"
import { Plus, Trash2, Edit2, X } from "lucide-react"
import type { Product } from "@/lib/products-context"
import { cn } from "@/lib/utils"

export function MenuAdmin() {
  const { products, updateProduct, addProduct, deleteProduct } = useProducts()
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    if (editingProduct.id) {
      // update
      await updateProduct(editingProduct.id, editingProduct)
    } else {
      // add
      await addProduct(editingProduct as Omit<Product, "id">)
    }
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const openAddModal = () => {
    setEditingProduct({
      name: "",
      price: 0,
      description: "",
      category: "burger",
      available: true,
      image_url: ""
    })
    setIsModalOpen(true)
  }

  const openEditModal = (p: Product) => {
    setEditingProduct(p)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Gestión de Productos</h2>
          <p className="text-sm text-muted-foreground">Agrega, edita y elimina productos de tu menú.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-[#1a1a1a] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-black tracking-widest">Producto</th>
                <th className="px-6 py-4 font-black tracking-widest">Categoría</th>
                <th className="px-6 py-4 font-black tracking-widest">Precio</th>
                <th className="px-6 py-4 font-black tracking-widest">Estado</th>
                <th className="px-6 py-4 font-black tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-black border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground text-[10px] font-bold border border-white/10 text-center leading-tight">
                          Sin img
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-foreground text-base">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground capitalize font-medium">{product.category}</td>
                  <td className="px-6 py-4 text-primary font-black text-base">${product.price.toLocaleString("es-AR")}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => updateProduct(product.id, { available: !product.available })}
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-full transition-colors",
                        product.available ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      )}
                    >
                      {product.available ? "Activo" : "Pausado"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(confirm("¿Seguro que quieres eliminar este producto?")) deleteProduct(product.id) }} className="p-2.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No hay productos en el menú. Empieza agregando uno.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#111111]">
              <h3 className="font-black tracking-tight text-xl">{editingProduct.id ? "Editar Producto" : "Nuevo Producto"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-muted-foreground mb-1.5 uppercase tracking-widest">Nombre del Producto</label>
                <input
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  placeholder="Ej. Doble Cuarto Smash"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground mb-1.5 uppercase tracking-widest">Precio ($)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-black text-primary"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground mb-1.5 uppercase tracking-widest">Categoría</label>
                  <select
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium appearance-none"
                    value={editingProduct.category || "burger"}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value as any})}
                  >
                    <option value="burger">Burger</option>
                    <option value="milanesa">Milanesa</option>
                    <option value="papa">Papa</option>
                    <option value="extra">Extra</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-muted-foreground mb-1.5 uppercase tracking-widest">Descripción</label>
                <textarea
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none font-medium"
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  placeholder="Ingredientes y detalles..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-muted-foreground mb-1.5 uppercase tracking-widest">URL de Imagen</label>
                <input
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
                  placeholder="https://ejemplo.com/imagen.jpg (Opcional)"
                  value={editingProduct.image_url || ""}
                  onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                />
                {editingProduct.image_url && (
                  <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-white/10 bg-black">
                    <img src={editingProduct.image_url} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <input
                  type="checkbox"
                  id="available-checkbox"
                  className="w-5 h-5 rounded accent-primary bg-black border-white/20"
                  checked={editingProduct.available !== false}
                  onChange={(e) => setEditingProduct({...editingProduct, available: e.target.checked})}
                />
                <label htmlFor="available-checkbox" className="text-sm font-bold cursor-pointer">Disponible para la venta</label>
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-black text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  {editingProduct.id ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
