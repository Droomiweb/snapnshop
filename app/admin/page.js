"use client";
import { useEffect, useState } from 'react';
import { Package, Save, RefreshCw, FileText, X, Plus, Image as ImageIcon, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ORDERS');
  const [orders, setOrders] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Image Management State
  const [newImageUrl, setNewImageUrl] = useState('');

  // Order Management State
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filter, setFilter] = useState('All'); 
  const [activeModal, setActiveModal] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [modalFormData, setModalFormData] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchProduct();
  }, []);

  const fetchOrders = () => {
    fetch('/api/admin/orders').then(res => res.json()).then(data => {
        setOrders(data);
        setLoading(false);
    });
  };

  const fetchProduct = () => {
    fetch('/api/product').then(res => res.json()).then(data => {
        if(!data.images) data.images = [];
        setProduct(data);
    });
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/product', {
        method: 'POST',
        body: JSON.stringify(product)
    });
    setSaving(false);
    alert("Product updated successfully!");
  };

  const addImage = () => {
    if (!newImageUrl) return;
    setProduct({ ...product, images: [...product.images, newImageUrl] });
    setNewImageUrl('');
  };

  const removeImage = (indexToRemove) => {
    setProduct({ ...product, images: product.images.filter((_, i) => i !== indexToRemove) });
  };

  const handleExportCSV = () => {
    const ordersToExport = selectedOrders.length > 0 ? orders.filter(o => selectedOrders.includes(o._id)) : orders;
    const headers = ["Order ID", "Customer Name", "Phone", "Full Address", "City", "State", "Zip", "Notes"];
    const rows = ordersToExport.map(o => [
      o.orderId, o.customer.name, o.customer.phone || "", `"${o.customer.address}"`, 
      o.customer.city, o.customer.state || "", o.customer.zip, o.supplierNotes || ""
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!currentOrder) return;
    let actionType = activeModal === 'PLACE' ? 'MARK_PLACED' : 'ADD_TRACKING';
    let payload = activeModal === 'PLACE' 
        ? { supplierOrderId: modalFormData.supplierOrderId, supplierName: modalFormData.supplierName, notes: modalFormData.notes }
        : { courier: modalFormData.courier, trackingNumber: modalFormData.trackingNumber };

    const res = await fetch('/api/admin/orders/actions', {
        method: 'POST',
        body: JSON.stringify({ action: actionType, orderId: currentOrder._id, data: payload })
    });

    if (res.ok) {
        alert("Success!");
        setActiveModal(null);
        setCurrentOrder(null);
        setModalFormData({});
        fetchOrders(); 
    } else alert("Failed");
  };

  const openModal = (type, order) => {
    setActiveModal(type);
    setCurrentOrder(order);
    setModalFormData({});
  };

  const filteredOrders = orders.filter(o => {
     if (filter === 'All') return true;
     if (filter === 'Pending') return o.supplierStatus === 'Pending' || !o.supplierStatus;
     return o.supplierStatus === filter;
  });

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div><h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1><p className="text-gray-500">Manage India Operations</p></div>
            <div className="bg-white p-1 rounded-lg border flex gap-1">
                <button onClick={() => setActiveTab('ORDERS')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'ORDERS' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Orders</button>
                <button onClick={() => setActiveTab('PRODUCT')} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'PRODUCT' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Product & Pricing</button>
            </div>
        </div>

        {activeTab === 'PRODUCT' && product && (
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Package size={20} /> Product Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label><input type="number" className="w-full border p-3 rounded-lg bg-gray-50 font-bold text-lg" value={product.price} onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price (₹)</label><input type="number" className="w-full border p-3 rounded-lg bg-gray-50 font-bold text-lg text-gray-400" value={product.originalPrice} onChange={(e) => setProduct({...product, originalPrice: parseFloat(e.target.value)})} /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label><input type="text" className="w-full border p-3 rounded-lg bg-gray-50" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} /></div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
                     <h2 className="text-xl font-bold flex items-center gap-2"><ImageIcon size={20} /> Images</h2>
                     <div className="space-y-3">{product.images.map((img, i) => (<div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border"><img src={img} className="w-10 h-10 object-cover rounded bg-white" /><input disabled value={img} className="flex-1 bg-transparent text-xs text-gray-500 truncate" /><button onClick={() => removeImage(i)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={16} /></button></div>))}</div>
                     <div className="flex gap-2"><input placeholder="Paste Image URL..." className="flex-1 border p-2 rounded text-sm" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} /><button onClick={addImage} type="button" className="bg-gray-900 text-white p-2 rounded hover:bg-black"><Plus size={16} /></button></div>
                     <div className="pt-4 border-t"><button onClick={handleProductUpdate} disabled={saving} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex justify-center gap-2">{saving ? <RefreshCw className="animate-spin" /> : <Save />} {saving ? "Save All Changes" : "Save Changes"}</button></div>
                </div>
            </div>
        )}

        {activeTab === 'ORDERS' && (
             <div className="bg-white rounded-xl shadow border overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div className="flex gap-2">{['All', 'Pending', 'Placed', 'Shipped'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === f ? 'bg-brand-dark text-white' : 'bg-white border text-gray-600'}`}>{f}</button>))}</div>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700"><FileText size={16} /> Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="p-4">Date / ID</th>
                                <th className="p-4">Customer</th>
                                {/* NEW: ADDRESS COLUMN */}
                                <th className="p-4 w-1/4">Shipping Address</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-800 text-xs">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        <div className="font-mono text-xs text-gray-400 mt-1">{order.orderId}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-bold">{order.customer.name}</div>
                                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                                        <div className="text-xs text-gray-400">{order.customer.email}</div>
                                    </td>
                                    {/* NEW: ADDRESS DATA */}
                                    <td className="p-4 align-top">
                                        <div className="flex gap-2 text-gray-700">
                                            <MapPin size={14} className="shrink-0 mt-1" />
                                            <div>
                                                <p>{order.customer.address}</p>
                                                <p>{order.customer.city}, {order.customer.zip}</p>
                                                <p className="text-xs font-bold uppercase text-gray-400">{order.customer.state}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="space-y-1">
                                            <span className={`block w-fit px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>Pay: {order.status}</span>
                                            <span className={`block w-fit px-2 py-1 rounded-full text-xs font-bold ${order.supplierStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' : order.supplierStatus === 'Placed' ? 'bg-purple-100 text-purple-700' : 'bg-red-50 text-red-600'}`}>Sup: {order.supplierStatus || 'Pending'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        {(!order.supplierStatus || order.supplierStatus === 'Pending') && (
                                            <button onClick={() => openModal('PLACE', order)} className="bg-brand-dark text-white px-3 py-1 rounded text-xs font-bold hover:bg-black w-full mb-1">Mark Placed</button>
                                        )}
                                        {order.supplierStatus === 'Placed' && (
                                            <button onClick={() => openModal('TRACKING', order)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 w-full">Add Tracking</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        )}

        {/* Modal (Same as before) */}
        {activeModal && currentOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Update Order #{currentOrder.orderId}</h3><button onClick={() => setActiveModal(null)}><X /></button></div>
                    <form onSubmit={handleActionSubmit} className="space-y-4">
                        {activeModal === 'PLACE' && ( <> <div><label className="block text-xs font-bold mb-1">Supplier Order ID</label><input required className="w-full border p-2 rounded" onChange={e => setModalFormData({...modalFormData, supplierOrderId: e.target.value})} /></div> <div><label className="block text-xs font-bold mb-1">Supplier Name</label><input required className="w-full border p-2 rounded" placeholder="e.g. Raj Traders" onChange={e => setModalFormData({...modalFormData, supplierName: e.target.value})} /></div> <div><label className="block text-xs font-bold mb-1">Notes</label><textarea className="w-full border p-2 rounded" onChange={e => setModalFormData({...modalFormData, notes: e.target.value})} /></div> </> )}
                        {activeModal === 'TRACKING' && ( <> <div><label className="block text-xs font-bold mb-1">Courier Name</label><input required className="w-full border p-2 rounded" placeholder="e.g. BlueDart" onChange={e => setModalFormData({...modalFormData, courier: e.target.value})} /></div> <div><label className="block text-xs font-bold mb-1">Tracking Number</label><input required className="w-full border p-2 rounded" onChange={e => setModalFormData({...modalFormData, trackingNumber: e.target.value})} /></div> </> )}
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">Save & Notify Customer</button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}