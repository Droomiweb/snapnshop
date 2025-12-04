"use client";
import { useEffect, useState, useRef } from 'react';
import { 
  Package, Save, BarChart3, ShoppingBag, Edit3, Globe, 
  Plus, Trash2, Image as ImageIcon, List, ChevronRight, 
  TrendingUp, MousePointer, Users, UploadCloud, Loader2
} from 'lucide-react';

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stores, setStores] = useState([]); 
  const [selectedStore, setSelectedStore] = useState(''); 
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productConfig, setProductConfig] = useState(null);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if(selectedStore) {
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
        
        setProductConfig({
            ...data.product,
            name: data.product?.name || '',
            price: data.product?.price || 0,
            originalPrice: data.product?.originalPrice || 0,
            description: data.product?.description || '',
            images: data.product?.images || [],
            features: data.product?.features || [],
            theme: {
                headline: data.product?.theme?.headline || '',
                subHeadline: data.product?.theme?.subHeadline || '',
                primaryColor: data.product?.theme?.primaryColor || '#000000'
            }
        });
    } catch(e) {
        console.error("Fetch Error", e);
    }
    setLoading(false);
  };

  const handleSaveProduct = async () => {
    await fetch('/api/product', {
        method: 'POST',
        body: JSON.stringify({ ...productConfig, storeId: selectedStore })
    });
    alert("Website Updated Successfully!");
  };

  // --- Real File Upload ---
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. Upload to Vercel Blob via our API
      const response = await fetch(
        `/api/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );

      const newBlob = await response.json();

      // 2. Add the returned URL to our product images
      setProductConfig(prev => ({
        ...prev,
        images: [...prev.images, newBlob.url]
      }));
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
      // Reset input so you can upload the same file again if needed
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setProductConfig({ ...productConfig, images: productConfig.images.filter((_, i) => i !== index) });
  };

  const addFeature = () => {
    if(!newFeature) return;
    setProductConfig({ ...productConfig, features: [...productConfig.features, newFeature] });
    setNewFeature('');
  };
  const removeFeature = (index) => {
    setProductConfig({ ...productConfig, features: productConfig.features.filter((_, i) => i !== index) });
  };


  if (loading && !selectedStore) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-6 border-b border-gray-800">
            <h1 className="font-black text-xl tracking-tight flex items-center gap-2">
                SnapNShop<span className="text-brand-pink text-xs bg-white/10 px-2 py-1 rounded">ADMIN</span>
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
                    {stores.map(s => s ? <option key={s} value={s}>{s.toUpperCase()}</option> : null)}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                    <ChevronRight size={14} className="rotate-90 text-gray-500"/>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
            <TabButton icon={<BarChart3 size={18}/>} label="Overview" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
            <TabButton icon={<ShoppingBag size={18}/>} label="Orders" active={activeTab === 'ORDERS'} onClick={() => setActiveTab('ORDERS')} />
            <TabButton icon={<Edit3 size={18}/>} label="Website Editor" active={activeTab === 'CMS'} onClick={() => setActiveTab('CMS')} />
        </nav>
        
        <div className="p-4 border-t border-gray-800 text-xs text-gray-600 text-center">
            v2.1.0 • Pro Panel
        </div>
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
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Live: {selectedStore}</span>
            </div>
        </header>

        {activeTab === 'DASHBOARD' && analytics && (
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard label="Total Visits" value={analytics.pageViews} icon={<Users size={20} className="text-blue-600"/>} color="bg-blue-50"/>
                    <StatCard label="Checkout Clicks" value={analytics.checkoutInitiated} icon={<MousePointer size={20} className="text-purple-600"/>} color="bg-purple-50"/>
                    <StatCard label="Total Orders" value={analytics.purchases} icon={<ShoppingBag size={20} className="text-green-600"/>} color="bg-green-50"/>
                    <StatCard label="Conversion Rate" value={`${((analytics.purchases / (analytics.pageViews || 1)) * 100).toFixed(1)}%`} icon={<TrendingUp size={20} className="text-orange-600"/>} color="bg-orange-50"/>
                </div>
                
                {/* Funnel Graph */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="mb-8">
                        <h3 className="font-bold text-lg text-gray-900">Sales Funnel</h3>
                        <p className="text-sm text-gray-400">Visitor to Customer journey</p>
                    </div>
                    <div className="flex items-end justify-center h-64 gap-16 border-b border-gray-100 pb-4">
                         <Bar height={100} label="Home Visits" value={analytics.pageViews} color="bg-blue-500" subColor="bg-blue-100"/>
                         <Bar height={(analytics.checkoutInitiated / (analytics.pageViews || 1)) * 100} label="Checkout" value={analytics.checkoutInitiated} color="bg-purple-500" subColor="bg-purple-100"/>
                         <Bar height={(analytics.purchases / (analytics.pageViews || 1)) * 100} label="Paid Orders" value={analytics.purchases} color="bg-green-500" subColor="bg-green-100"/>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'CMS' && productConfig && (
             <div className="space-y-8 max-w-5xl">
                 
                 {/* 1. Basic Info Card */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Package size={20}/></div>
                        <h3 className="font-bold text-lg text-gray-900">Product Details</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <InputGroup label="Product Name" value={productConfig.name} onChange={v => setProductConfig({...productConfig, name: v})} />
                        <InputGroup label="SKU (Read Only)" value={productConfig.sku} disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <InputGroup label="Selling Price (₹)" type="number" value={productConfig.price} onChange={v => setProductConfig({...productConfig, price: v})} />
                        <InputGroup label="Original Price (₹)" type="number" value={productConfig.originalPrice} onChange={v => setProductConfig({...productConfig, originalPrice: v})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Marketing Description</label>
                        <textarea rows="4" value={productConfig.description || ''} onChange={(e) => setProductConfig({...productConfig, description: e.target.value})} className="w-full border border-gray-300 p-4 rounded-xl text-gray-900 font-medium focus:ring-2 ring-brand-pink outline-none resize-none bg-white" />
                    </div>
                 </div>

                 {/* 2. Visuals Card */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                        <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><ImageIcon size={20}/></div>
                        <h3 className="font-bold text-lg text-gray-900">Gallery</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        {productConfig.images.map((img, i) => (
                            <div key={i} className="relative group border-2 border-gray-100 rounded-xl overflow-hidden aspect-square bg-gray-50 hover:border-brand-pink transition-colors">
                                <img src={img} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => removeImage(i)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* UPLOAD AREA */}
                    <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isUploading ? 'bg-gray-50 border-gray-300' : 'hover:bg-blue-50 hover:border-blue-300 border-gray-200'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            hidden 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            accept="image/*"
                        />
                        <div className="flex flex-col items-center gap-2">
                            {isUploading ? (
                                <>
                                    <Loader2 className="animate-spin text-brand-dark" size={32} />
                                    <span className="text-sm font-bold text-gray-500">Uploading to Cloud...</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="text-gray-400" size={32} />
                                    <span className="text-sm font-bold text-gray-600">Click to Upload Image</span>
                                    <span className="text-xs text-gray-400">Supports JPG, PNG, WEBP</span>
                                </>
                            )}
                        </div>
                    </div>
                 </div>

                 {/* 3. Features & Theme */}
                 <div className="grid md:grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                            <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><List size={20}/></div>
                            <h3 className="font-bold text-lg text-gray-900">Features List</h3>
                        </div>
                        <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                            {productConfig.features.map((feat, i) => (
                                <li key={i} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 group">
                                    <span className="text-sm font-medium text-gray-700">{feat}</span>
                                    <button onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-2">
                            <input placeholder="Add feature..." className="flex-1 border border-gray-300 p-2 rounded-lg text-sm" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} />
                            <button onClick={addFeature} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black"><Plus size={18}/></button>
                        </div>
                     </div>

                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                            <div className="bg-pink-50 p-2 rounded-lg text-pink-600"><Globe size={20}/></div>
                            <h3 className="font-bold text-lg text-gray-900">Theme Config</h3>
                        </div>
                        <div className="space-y-6">
                            <InputGroup label="Headline (Hero)" value={productConfig.theme?.headline} onChange={v => setProductConfig({...productConfig, theme: {...productConfig.theme, headline: v}})} />
                            <InputGroup label="Sub-Headline (Badge)" value={productConfig.theme?.subHeadline} onChange={v => setProductConfig({...productConfig, theme: {...productConfig.theme, subHeadline: v}})} />
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-1" value={productConfig.theme?.primaryColor} onChange={e => setProductConfig({...productConfig, theme: {...productConfig.theme, primaryColor: e.target.value}})} />
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

        {activeTab === 'ORDERS' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b">
                        <tr><th className="p-5">Order ID</th><th className="p-5">Customer</th><th className="p-5">Details</th><th className="p-5">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(o => (
                            <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-5 align-top font-mono font-bold text-gray-600">{o.orderId}<div className="text-[10px] font-normal text-gray-400 mt-1">{new Date(o.createdAt).toLocaleDateString()}</div></td>
                                <td className="p-5 align-top"><div className="font-bold text-gray-900">{o.customer.name}</div><div className="text-xs text-gray-500">{o.customer.phone}</div></td>
                                <td className="p-5 align-top"><div className="font-bold text-gray-900">₹{o.amount}</div><div className="text-xs text-gray-500">{o.items?.length || 1} Item(s)</div></td>
                                <td className="p-5 align-top"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${o.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{o.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>
    </div>
  );
}

// UI Components
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

const Bar = ({ height, label, value, color, subColor }) => {
    const visualHeight = Math.max(height || 0, 5);
    return (
        <div className="flex flex-col items-center justify-end h-full w-full max-w-[100px] group relative">
            <div className="mb-2 font-bold text-lg text-gray-900 opacity-0 group-hover:opacity-100 transition-all absolute -top-8 bg-white shadow-sm border px-2 py-1 rounded text-xs">{value}</div>
            <div className={`w-full rounded-t-lg ${subColor} h-full relative overflow-hidden`}><div style={{ height: `${visualHeight}%` }} className={`absolute bottom-0 w-full rounded-t-lg ${color} transition-all duration-1000 ease-out shadow-inner`}></div></div>
            <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{label}</div>
        </div>
    );
};

const InputGroup = ({ label, value, onChange, type="text", disabled }) => (
    <div className="group">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider group-focus-within:text-brand-pink transition-colors">{label}</label>
        <input type={type} disabled={disabled} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 p-3.5 rounded-xl bg-white text-gray-900 font-bold focus:ring-2 ring-brand-pink focus:border-brand-pink outline-none disabled:bg-gray-100 disabled:text-gray-500 transition-all placeholder-gray-300" placeholder={`Enter ${label.toLowerCase()}...`}/>
    </div>
);