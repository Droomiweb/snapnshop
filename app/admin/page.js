"use client";
import { useEffect, useState } from 'react';
import { Download, Truck, Package, Save, ExternalLink, Mail, Copy } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Pending, Placed, Shipped
  
  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'PLACE', 'TRACKING'
  const [currentOrder, setCurrentOrder] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  };

  // --- Actions ---

  const handleExportCSV = () => {
    // 1. Filter orders (use selected or all visible)
    const ordersToExport = selectedOrders.length > 0 
      ? orders.filter(o => selectedOrders.includes(o._id))
      : orders;

    // 2. Define CSV Headers (IndiaMART friendly)
    const headers = [
      "Order ID", "Customer Name", "Phone", "Address Line 1", "City", "State", "Zip", "Product SKU", "Qty", "Notes"
    ];

    // 3. Map Data
    const rows = ordersToExport.map(o => [
      o.orderId,
      o.customer.name,
      o.customer.phone || "",
      `"${o.customer.address}"`, // Quote to handle commas
      o.customer.city,
      o.customer.state || "",
      o.customer.zip,
      "SNS-MINI-PK01", // Hardcoded SKU for now
      1, // Hardcoded Qty for now unless you added items array
      o.supplierNotes || ""
    ]);

    // 4. Generate Content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // 5. Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `indiamart_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Log action (optional)
    console.log("Exported CSV");
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!currentOrder) return;

    let actionType = '';
    let payload = {};

    if (activeModal === 'PLACE') {
        actionType = 'MARK_PLACED';
        payload = {
            supplierOrderId: formData.supplierOrderId,
            supplierName: formData.supplierName,
            notes: formData.notes
        };
    } else if (activeModal === 'TRACKING') {
        actionType = 'ADD_TRACKING';
        payload = {
            courier: formData.courier,
            trackingNumber: formData.trackingNumber,
            trackingUrl: `https://google.com/search?q=${formData.trackingNumber}` // Simplistic
        };
    }

    const res = await fetch('/api/admin/orders/actions', {
        method: 'POST',
        body: JSON.stringify({
            action: actionType,
            orderId: currentOrder._id,
            data: payload
        })
    });

    if (res.ok) {
        alert("Success!");
        setActiveModal(null);
        setCurrentOrder(null);
        setFormData({});
        fetchOrders(); // Refresh list
    } else {
        alert("Failed to update");
    }
  };

  const openModal = (type, order) => {
    setActiveModal(type);
    setCurrentOrder(order);
    setFormData({}); // Reset form
  };

  // --- Filtering ---
  const filteredOrders = orders.filter(o => {
     if (filter === 'All') return true;
     if (filter === 'Pending') return o.supplierStatus === 'Pending' || !o.supplierStatus;
     return o.supplierStatus === filter;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
                <p className="text-gray-500">Manage fulfillment and IndiaMART suppliers</p>
            </div>
            <div className="flex gap-2">
                <button onClick={handleExportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                    <Download size={18} /> Export CSV
                </button>
            </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-1">
            {['All', 'Pending', 'Placed', 'Shipped'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-t-lg font-bold text-sm ${filter === f ? 'bg-white text-brand-dark border-b-2 border-brand-dark' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {f}
                </button>
            ))}
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-4"><input type="checkbox" /></th>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Supplier Status</th>
                <th className="p-4">Supplier Info</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-4">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                            if(e.target.checked) setSelectedOrders([...selectedOrders, order._id]);
                            else setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                        }}
                      />
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-mono font-bold text-brand-dark">{order.orderId}</div>
                    <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="mt-1 font-bold">₹{order.amount}</div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-bold">{order.customer.name}</div>
                    <div className="text-xs text-gray-500">{order.customer.email}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={order.customer.address}>
                        {order.customer.address}, {order.customer.zip}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.supplierStatus === 'Placed' ? 'bg-blue-100 text-blue-700' : 
                      order.supplierStatus === 'Shipped' ? 'bg-green-100 text-green-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.supplierStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 align-top text-xs">
                     {order.supplierStatus === 'Pending' ? (
                        <span className="text-gray-400 italic">Not placed yet</span>
                     ) : (
                        <div>
                            <p><span className="text-gray-400">ID:</span> {order.supplierOrderId || 'N/A'}</p>
                            <p><span className="text-gray-400">Via:</span> {order.supplierName}</p>
                            {order.courier && <p className="mt-1 text-green-600 font-bold">{order.courier}: {order.trackingNumber}</p>}
                        </div>
                     )}
                  </td>
                  <td className="p-4 align-top text-right space-y-2">
                    {/* Action Buttons based on Status */}
                    {(order.supplierStatus === 'Pending' || !order.supplierStatus) && (
                        <>
                            <a 
                                href={`mailto:?subject=Order ${order.orderId}&body=Please ship to: ${order.customer.name}, ${order.customer.address}`}
                                className="block w-full text-center border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 text-gray-600"
                            >
                                <Mail size={14} className="inline mr-1"/> Email Order
                            </a>
                            <button 
                                onClick={() => openModal('PLACE', order)}
                                className="block w-full bg-brand-dark text-white px-3 py-1 rounded hover:bg-brand-pink"
                            >
                                Mark Placed
                            </button>
                        </>
                    )}
                    
                    {order.supplierStatus === 'Placed' && (
                         <button 
                            onClick={() => openModal('TRACKING', order)}
                            className="block w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            <Truck size={14} className="inline mr-1"/> Add Tracking
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modals --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                        {activeModal === 'PLACE' ? 'Confirm Supplier Order' : 'Enter Tracking Info'}
                    </h3>
                    <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-black">✕</button>
                </div>
                
                <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
                    {activeModal === 'PLACE' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier Name</label>
                                <input 
                                    className="w-full border rounded p-2" 
                                    defaultValue="IndiaMART Supplier"
                                    onChange={e => setFormData({...formData, supplierName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier Order ID / Receipt #</label>
                                <input 
                                    className="w-full border rounded p-2" 
                                    placeholder="e.g. INV-2024-001"
                                    required
                                    onChange={e => setFormData({...formData, supplierOrderId: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Internal Notes</label>
                                <textarea 
                                    className="w-full border rounded p-2" 
                                    placeholder="Cost price, contact person..."
                                    onChange={e => setFormData({...formData, notes: e.target.value})}
                                ></textarea>
                            </div>
                        </>
                    )}

                    {activeModal === 'TRACKING' && (
                        <>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Courier Name</label>
                                <select 
                                    className="w-full border rounded p-2"
                                    onChange={e => setFormData({...formData, courier: e.target.value})}
                                >
                                    <option value="">Select Courier</option>
                                    <option value="Delhivery">Delhivery</option>
                                    <option value="BlueDart">BlueDart</option>
                                    <option value="DTDC">DTDC</option>
                                    <option value="IndiaPost">IndiaPost</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tracking Number</label>
                                <input 
                                    className="w-full border rounded p-2" 
                                    placeholder="AWB123456789"
                                    required
                                    onChange={e => setFormData({...formData, trackingNumber: e.target.value})}
                                />
                            </div>
                        </>
                    )}

                    <button className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-brand-pink transition-colors">
                        Save & Update Order
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}