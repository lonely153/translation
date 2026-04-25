import React, { useState, useEffect } from 'react';
import ProductDetail from '../ProductDetail'; 
import { db } from '../firebase'; 
import { collection, query, where, getDocs, doc, updateDoc, or } from 'firebase/firestore';
import { useLanguage } from "../LanguageContext";

const DEFAULT_COVER = "https://placehold.co/1200x400/e9d5ff/9333ea?text=No+Cover+Image";
const DEFAULT_PROFILE = "https://placehold.co/700x700/f3f4f6/a855f7?text=Logo";
const DEFAULT_PRODUCT = "https://placehold.co/400x400/f3f4f6/9ca3af?text=Product";

function SellerStorePage({ user }) {
  const { t } = useLanguage();
  const [myBooth, setMyBooth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState("ทั้งหมด");

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ coverImage: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMyBooth = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "booths"),
          or(
              where("mainCreator", "==", user.username),
              where("coCreators", "array-contains", user.username)
            )
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const data = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          setMyBooth(data);
          setEditData({
            coverImage: data.coverImage || '',
            description: data.description || ''
          });
        }
      } catch (error) {
        console.error("Error fetching my booth:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username) fetchMyBooth();
  }, [user]);

  const handleSaveBooth = async () => {
    if (!myBooth) return;
    setSaving(true);
    try {
      const boothRef = doc(db, "booths", myBooth.id);
      await updateDoc(boothRef, {
        coverImage: editData.coverImage,
        description: editData.description
      });
      
      setMyBooth(prev => ({ 
        ...prev, 
        coverImage: editData.coverImage, 
        description: editData.description 
      }));
      
      setIsEditing(false);
      alert(t('save_booth_success'));
    } catch (error) {
      console.error("Error updating booth:", error);
      alert(t('save_error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
      <p className="text-purple-500 font-bold">{t('loading_booth')}</p>
    </div>
  );

  if (!myBooth) return (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-gray-200">
      <span className="text-5xl mb-4">🏪</span>
      <h2 className="text-xl font-bold text-gray-500">{t('booth_not_found')}</h2>
      <p className="text-gray-400 mt-2">{t('booth_not_found_desc')} "{user.username}"</p>
    </div>
  );

  const allCreators = ["ทั้งหมด", myBooth.mainCreator, ...(myBooth.coCreators || [])];
  const filteredProducts = myBooth.products?.filter(p =>
    selectedCreator === "ทั้งหมด" ? true : (p.creator || myBooth.mainCreator) === selectedCreator
  ) || [];

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        user={user}
        isSellerView={true}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl animate-fade-in w-full min-h-[800px] shadow-sm border border-purple-100 overflow-hidden relative">
      
      <div className="bg-white pb-6 shadow-sm mb-4 relative">
        {myBooth.mainCreator === user.username && (
          <div className="absolute top-4 right-4 z-10">
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition shadow-sm">
                  {t('cancel_button')}
                </button>
                <button onClick={handleSaveBooth} disabled={saving} className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold hover:bg-purple-700 transition shadow-md disabled:bg-purple-300">
                  {saving ? t('saving') : t('save_button')}
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-white/90 backdrop-blur-sm text-purple-600 border border-purple-200 px-4 py-2 rounded-full font-bold hover:bg-purple-50 transition shadow-md flex items-center gap-2">
                <span>✏️</span> {t('edit_booth_info')}
              </button>
            )}
          </div>
        )}

        <div className="h-72 md:h-96 bg-gray-200 w-full relative group">
          <img 
            src={isEditing ? (editData.coverImage || DEFAULT_COVER) : (myBooth.coverImage || DEFAULT_COVER)} 
            alt="Cover" 
            className={`w-full h-full object-cover transition ${isEditing ? 'opacity-50' : ''}`}
            onError={(e) => { e.target.src = DEFAULT_COVER }}
          />
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <input 
                type="text"
                value={editData.coverImage}
                onChange={(e) => setEditData({...editData, coverImage: e.target.value})}
                placeholder={t('placeholder_cover_url')}
                className="w-full max-w-2xl p-4 rounded-xl border-2 border-purple-500 shadow-2xl focus:outline-none"
              />
            </div>
          )}
          <div className="absolute -bottom-12 left-8 w-32 h-32 bg-white rounded-2xl p-1 shadow-md border-2 border-purple-500">
            <img src={myBooth.profileImage || DEFAULT_PROFILE} alt="Profile" className="w-full h-full object-cover rounded-xl" onError={(e) => { e.target.src = DEFAULT_PROFILE }} />
          </div>
        </div>

        <div className="pt-16 px-8 flex flex-col items-start gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">{myBooth.boothName || myBooth.mainCreator}</h1>
            <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">{t('your_booth_badge')}</span>
          </div>
          {isEditing ? (
            <textarea 
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              placeholder={t('placeholder_description')}
              rows="3"
              className="w-full max-w-2xl mt-4 p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
            />
          ) : (
            <p className="text-gray-600 mt-1 max-w-2xl">{myBooth.description || t('no_description')}</p>
          )}
          <div className="mt-2 flex gap-2">
             <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-md border border-purple-100">
                {t('booth_number_label')}: {myBooth.boothNumbers?.join(', ') || 'N/A'}
             </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="flex flex-col mb-8 gap-4 sticky top-0 bg-white z-10 py-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center shrink-0">
            <span className="bg-purple-500 w-2 h-6 rounded-full mr-3"></span> 
            {t('products_in_booth')} ({myBooth.products?.length || 0} {t('items_unit')})
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
            {allCreators.map(creator => (
              <button
                key={creator}
                onClick={() => setSelectedCreator(creator)}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition border-2 ${
                  selectedCreator === creator ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600'
                }`}
              >
                {creator === "ทั้งหมด" ? `🌟 ${t('creator_all')}` : `🎨 ${creator}`}
              </button>
            ))}
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((item, index) => {
              const stockFromVariations = item.variations?.reduce((acc, v) => {
                const optionSum = v.options?.reduce((sum, opt) => {
                  const s = Number(opt.stock);
                  return sum + (isNaN(s) ? 0 : s);
                }, 0) || 0;
                return acc + optionSum;
              }, 0);
              const rawStock = stockFromVariations > 0 ? stockFromVariations : Number(item.stock);
              const itemTotalStock = isNaN(rawStock) ? 0 : rawStock;

              return (
                <div key={item.id || index} onClick={() => setSelectedProduct(item)} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group flex flex-col">
                  <div className="aspect-square bg-white relative overflow-hidden">
                    <img src={item.product_images?.cover_image || item.images?.[0] || DEFAULT_PRODUCT} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    {item.classification?.preorder && <div className="absolute top-3 right-3 bg-orange-500/90 px-2 py-1 rounded-md text-[10px] font-black text-white">PRE-ORDER</div>}
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1.5 font-medium">🎨 {item.creator || myBooth.mainCreator}</p>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <p className="text-purple-600 font-black text-lg">฿{isNaN(Number(item.price)) ? "0" : item.price}</p>
                      <p className={`text-xs font-bold ${itemTotalStock === 0 ? 'text-red-500' : 'text-black'}`}>{t('remaining')} {itemTotalStock} {t('items_unit')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-2xl border-2 border-dashed border-gray-200">
            {t('no_products_by')} {selectedCreator} {t('in_this_booth')}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerStorePage;