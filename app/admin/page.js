"use client";
import { useEffect, useState, useRef } from 'react';
import { 
  Package, Save, BarChart3, ShoppingBag, Edit3, Globe, 
  Plus, Trash2, Image as ImageIcon, List, ChevronRight, 
  TrendingUp, MousePointer, Users, UploadCloud, Loader2,
  Truck, X
} from 'lucide-react';

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stores, setStores] = useState([]); 
  const [selectedStore, setSelectedStore] = useState(''); 
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);

  // --- NEW: Fulfillment State ---
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ courier: '', trackingNumber: '', trackingUrl: '' });
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Product Config State
  const [productConfig, setProductConfig] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    description: '',
    images: [],
    features: [],
    theme: {
      headline: '',
      subHeadline: '',
      primaryColor: '#000000',
    },
  });
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchStoreData(selectedStore);
    }
  }, [selectedStore]);

  const fetchInitialData = async () => {
    try {
      const res = await fetch('/api/admin/init-data'); 
      const data = await res.json();
      setStores(data.stores);
      setSelectedStore(data.stores[0] || process.env.NEXT_PUBLIC_STORE_ID || 'chopper');
      setLoading(false);
    } catch (e) {
      console.error("Init Error", e);
    }
  };

  const fetchStoreData = async (storeId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/store-data?storeId=${storeId}`);
      const data = await res.json();
      
      setOrders(data.orders);
      setAnalytics(data.analytics);
      
      // Merge with defaults
      setProductConfig(prev => ({
        ...prev,
        ...data.product,
        name: data.product?.name ?? '',
        price: data.product?.price ?? 0,
        originalPrice: data.product?.originalPrice ?? 0,
        description: data.product?.description ?? '',
        images: data.product?.images || [],
        features: data.product?.features || [],
        theme: {
          ...prev.theme,
          headline: data.product?.theme?.headline ?? '',
          subHeadline: data.product?.theme?.subHeadline ?? '',
          primaryColor: data.product?.theme?.primaryColor ?? '#000000',
        },
      }));
    } catch(e) {
      console.error("Fetch Error", e);
    }
    setLoading(false);
  };

  const handleSaveProduct = async () => {
    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productConfig, storeId: selectedStore }),
      });

      if (res.ok) {
        alert("Website Updated Successfully!");
      } else {
        alert("Save failed.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving changes.");
    }
  };

  // --- NEW: Order Fulfillment Logic ---
  const openShipModal = (order) => {
    setSelectedOrder(order);
    setTrackingForm({ courier: 'BlueDart', trackingNumber: '', trackingUrl: '' });
    setIsShipModalOpen(true);
  };

  const handleMarkShipped = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);

    try {
        const res = await fetch('/api/admin/orders/actions', {
            method: 'POST',
            body: JSON.stringify({
                action: 'ADD_TRACKING',
                orderId: selectedOrder._id,
                data: trackingForm
            })
        });

        if (res.ok) {
            alert("Order Shipped! Customer has been emailed.");
            setIsShipModalOpen(false);
            fetchStoreData(selectedStore); // Refresh list
        } else {
            alert("Failed to update order.");
        }
    } catch (error) {
        console.error(error);
        alert("Error updating order.");
    } finally {
        setIsUpdatingOrder(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const response = await fetch(
        `/api/upload?filename=${file.name}`,
        { method: 'POST', body: file },
      );
      const newBlob = await response.json();
      setProductConfig(prev => ({
        ...prev,
        images: [...prev.images, newBlob.url],
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setProductConfig(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (!newFeature) return;
    setProductConfig(prev => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
    setNewFeature('');
  };

  const removeFeature = (index) => {
    setProductConfig(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  if (loading && !selectedStore) {
    return <div className="h-screen flex items-center justify-center bg-gray-50 font-medium">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <h1 className="font-black text-xl tracking-tight flex items-center gap-2">
            SnapNShop <span className="text-brand-pink text-xs bg-white/10 px-2 py-1 rounded">ADMIN</span>
          </h1>
        </div>
        
        <div className="p-6">
          <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">Active Website</label>
          <div className="relative group">
            <Globe className="absolute left-3 top-2.5 text-gray-400 group-hover:text-white transition-colors" size={16} />
            <select 
              value={selectedStore} 
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-sm font-bold focus:ring-2 ring-brand-pink focus:border-transparent cursor-pointer hover:bg-gray-750 transition-colors appearance-none"
            >
              {stores.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
            <div className="absolute right-3 top-3 pointer-events-none"><ChevronRight size={14} className="rotate-90 text-gray-500"/></div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <TabButton icon={<BarChart3 size={18}/>} label="Overview" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
          <TabButton icon={<ShoppingBag size={18}/>} label="Orders" active={activeTab === 'ORDERS'} onClick={() => setActiveTab('ORDERS')} />
          <TabButton icon={<Edit3 size={18}/>} label="Website Editor" active={activeTab === 'CMS'} onClick={() => setActiveTab('CMS')} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 md:p-12 max-w-7xl">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {activeTab === 'DASHBOARD' && 'Dashboard'}
              {activeTab === 'ORDERS' && 'Orders'}
              {activeTab === 'CMS' && 'Editor'}
            </h2>
            <p className="text-gray-500 mt-1">Manage your {selectedStore} store</p>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'DASHBOARD' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Total Visits" value={analytics.pageViews} icon={<Users size={20} className="text-blue-600"/>} color="bg-blue-50" />
              <StatCard label="Checkout Clicks" value={analytics.checkoutInitiated} icon={<MousePointer size={20} className="text-purple-600"/>} color="bg-purple-50" />
              <StatCard label="Total Orders" value={analytics.purchases} icon={<ShoppingBag size={20} className="text-green-600"/>} color="bg-green-50" />
              <StatCard label="Conversion Rate" value={`${((analytics.purchases / (analytics.pageViews || 1)) * 100).toFixed(1)}%`} icon={<TrendingUp size={20} className="text-orange-600"/>} color="bg-orange-50" />
            </div>
          </div>
        )}

        {/* CMS TAB */}
        {activeTab === 'CMS' && productConfig && (
          <div className="space-y-8 max-w-5xl">
            {/* 1. Basic Info */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
               {/* Same Editor Code as before... */}
               <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Package size={20}/></div>
                <h3 className="font-bold text-lg text-gray-900">Product Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <InputGroup label="Product Name" value={productConfig.name} onChange={v => setProductConfig({ ...productConfig, name: v })} />
                <InputGroup label="SKU" value={productConfig.sku} disabled onChange={() => {}} />
              </div>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <InputGroup label="Price (₹)" type="number" value={productConfig.price} onChange={v => setProductConfig({ ...productConfig, price: v })} />
                <InputGroup label="Original Price (₹)" type="number" value={productConfig.originalPrice} onChange={v => setProductConfig({ ...productConfig, originalPrice: v })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Description</label>
                <textarea rows="4" value={productConfig.description || ''} onChange={(e) => setProductConfig({ ...productConfig, description: e.target.value })} className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 ring-brand-pink outline-none resize-none bg-white" />
              </div>
            </div>

            {/* 2. Visuals */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              {/* Same Gallery Code ... */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><ImageIcon size={20}/></div>
                <h3 className="font-bold text-lg text-gray-900">Gallery</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {productConfig.images.map((img, i) => (
                  <div key={i} className="relative group border-2 border-gray-100 rounded-xl overflow-hidden aspect-square bg-gray-50 hover:border-brand-pink transition-colors">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => removeImage(i)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isUploading ? 'bg-gray-50 border-gray-300' : 'hover:bg-blue-50 hover:border-blue-300 border-gray-200'}`} onClick={() => fileInputRef.current?.click()}>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
                <div className="flex flex-col items-center gap-2">
                  {isUploading ? <Loader2 className="animate-spin text-brand-dark" size={32} /> : <UploadCloud className="text-gray-400" size={32} />}
                  <span className="text-sm font-bold text-gray-600">{isUploading ? "Uploading..." : "Click to Upload Image"}</span>
                </div>
              </div>
            </div>

            {/* 3. Features & Theme */}
            <div className="grid md:grid-cols-2 gap-8">
               {/* Same Features Code ... */}
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><List size={20}/></div>
                  <h3 className="font-bold text-lg text-gray-900">Features List</h3>
                </div>
                <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                  {productConfig.features.map((feat, i) => (
                    <li key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 group">
                      <span className="text-sm font-medium text-gray-700">{feat}</span>
                      <button onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input placeholder="Add feature..." className="flex-1 border border-gray-300 p-2 rounded-lg text-sm" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} />
                  <button onClick={addFeature} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black"><Plus size={18}/></button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                 {/* Same Theme Code ... */}
                 <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <div className="bg-pink-50 p-2 rounded-lg text-pink-600"><Globe size={20}/></div>
                  <h3 className="font-bold text-lg text-gray-900">Theme Config</h3>
                </div>
                <div className="space-y-6">
                  <InputGroup label="Headline" value={productConfig.theme?.headline} onChange={v => setProductConfig({ ...productConfig, theme: { ...productConfig.theme, headline: v } })} />
                  <InputGroup label="Sub-Headline" value={productConfig.theme?.subHeadline} onChange={v => setProductConfig({ ...productConfig, theme: { ...productConfig.theme, subHeadline: v } })} />
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-1" value={productConfig.theme?.primaryColor} onChange={e => setProductConfig({ ...productConfig, theme: { ...productConfig.theme, primaryColor: e.target.value } })} />
                      <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg text-gray-600">{productConfig.theme?.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-4 z-20">
              <button onClick={handleSaveProduct} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <Save size={20} /> Publish All Changes
              </button>
            </div>
          </div>
        )}

        {/* ORDERS TAB (UPDATED WITH ACTIONS) */}
        {activeTab === 'ORDERS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b">
                <tr><th className="p-5">Order ID</th><th className="p-5">Customer</th><th className="p-5">Address</th><th className="p-5">Status</th><th className="p-5">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50/50">
                    <td className="p-5 font-mono font-bold text-gray-600 align-top">{o.orderId}</td>
                    <td className="p-5 align-top">
                        <div className="font-bold text-gray-900">{o.customer.name}</div>
                        <div className="text-xs text-gray-500">{o.customer.phone}</div>
                    </td>
                    <td className="p-5 align-top max-w-xs">
                        <div className="text-sm font-bold text-gray-800">{o.customer.houseNumber ? `#${o.customer.houseNumber}, ` : ''}{o.customer.address}</div>
                        <div className="text-xs text-gray-600">{o.customer.city}, {o.customer.state} - {o.customer.zip}</div>
                    </td>
                    <td className="p-5 align-top"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${o.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{o.status}</span></td>
                    
                    {/* ACTION COLUMN */}
                    <td className="p-5 align-top">
                        {o.status === 'Paid' && o.supplierStatus !== 'Shipped' && (
                            <button onClick={() => openShipModal(o)} className="bg-brand-dark text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-pink transition-colors flex items-center gap-1">
                                <Truck size={14} /> Ship
                            </button>
                        )}
                        {o.supplierStatus === 'Shipped' && (
                             <div className="text-xs text-blue-600 font-bold">Shipped<br/><span className="font-mono font-normal text-gray-500">{o.trackingNumber}</span></div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* --- FULFILLMENT MODAL --- */}
      {isShipModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Fulfill Order #{selectedOrder.orderId}</h3>
                    <button onClick={() => setIsShipModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleMarkShipped} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Courier Service</label>
                        <select 
                            className="w-full border p-3 rounded-xl bg-gray-50 font-bold text-sm"
                            value={trackingForm.courier}
                            onChange={e => setTrackingForm({...trackingForm, courier: e.target.value})}
                        >
                            <option value="BlueDart">BlueDart</option>
                            <option value="Delhivery">Delhivery</option>
                            <option value="DTDC">DTDC</option>
                            <option value="Ecom Express">Ecom Express</option>
                            <option value="XpressBees">XpressBees</option>
                            <option value="India Post">India Post</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Tracking Number (AWB)</label>
                        <input 
                            required
                            placeholder="e.g. 123456789"
                            className="w-full border p-3 rounded-xl font-mono text-sm"
                            value={trackingForm.trackingNumber}
                            onChange={e => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Tracking Link (Optional)</label>
                        <input 
                            placeholder="https://..."
                            className="w-full border p-3 rounded-xl text-sm"
                            value={trackingForm.trackingUrl}
                            onChange={e => setTrackingForm({...trackingForm, trackingUrl: e.target.value})}
                        />
                    </div>

                    <button disabled={isUpdatingOrder} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors mt-2">
                        {isUpdatingOrder ? "Updating..." : "Mark as Shipped"}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents
const TabButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium mb-1 ${active ? 'bg-brand-pink text-white font-bold shadow-lg shadow-brand-pink/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
    {icon} <span>{label}</span>
  </button>
);
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:border-blue-100 transition-colors">
    <div><p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">{label}</p><p className="text-3xl font-black text-gray-900">{value}</p></div>
    <div className={`p-3 rounded-xl ${color} opacity-80 group-hover:opacity-100 transition-opacity`}>{icon}</div>
  </div>
);
const InputGroup = ({ label, value, onChange, type = "text", disabled }) => (
  <div className="group">
    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider group-focus-within:text-brand-pink">{label}</label>
    <input type={type} disabled={disabled} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 p-3.5 rounded-xl font-bold focus:ring-2 ring-brand-pink outline-none disabled:bg-gray-100 transition-all" placeholder={`Enter ${label}...`} />
  </div>
);