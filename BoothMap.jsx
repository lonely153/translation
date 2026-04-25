import { useState, useEffect, useRef } from 'react';
import StorePage from './StorePage';
import { db } from './firebase'; 
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function BoothMap({ onRequireAuth, user }) {
  const [selectedDate, setSelectedDate] = useState("30/5/2026");
  const [activeBooth, setActiveBooth] = useState(null);
  const [boothsData, setBoothsData] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);

  // 1. ดึงข้อมูลจาก Firestore
  useEffect(() => {
    const fetchBooths = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "booths"),
          where("event_date", "==", selectedDate),
          orderBy("id", "asc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBoothsData(data);
      } catch (error) {
        console.error("Error fetching booths: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooths();
  }, [selectedDate]);

  // 2. ฟังก์ชันเช็คสไตล์บูธ (กรอบเทาอ่อน สลับตัวอักษร ชมพู/ดำ)
  const getBoothStyle = (booth_id) => {
    const docIndex = boothsData.findIndex(booth => booth.boothNumbers?.includes(booth_id));

    // กรณีบูธว่าง
    if (docIndex === -1) {
      return { 
        data: null, 
        classes: 'bg-white hover:bg-gray-50 text-gray-300 border-gray-200' 
      };
    }

    // กรณีบูธมีคนจอง (สลับสีตัวอักษร ชมพู / ดำ)
    const isEvenGroup = docIndex % 2 === 0;
    const data = boothsData[docIndex];
    
    // ใช้กรอบสีเทาอ่อน border-gray-300 ตามที่ต้องการ
    const textClass = isEvenGroup ? 'text-pink-600' : 'text-black';
    
    return { 
      data: data, 
      classes: `bg-white font-black shadow-sm border-black hover:bg-gray-100 ${textClass}` 
    };
  };

  const handleBoothClick = (booth_id) => {
    const { data } = getBoothStyle(booth_id);
    if (data) {
      setActiveBooth(data);
    } else {
      alert(`บูธ ${booth_id} ยังว่างอยู่`);
    }
  };

  // --- ฟังก์ชัน Zoom และ Render ---
  useEffect(() => {
    const fitToScreen = () => {
      if (!activeBooth && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const mapIdealWidth = 1300; 
        if (containerWidth < mapIdealWidth) setZoomLevel(containerWidth / mapIdealWidth);
        else setZoomLevel(1);
      }
    };
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [activeBooth]);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  const resetZoom = () => setZoomLevel(1);

  const renderRowHorizontal = (letter, start, end) => {
    let booths = [];
    for (let i = start; i <= end; i++) {
      const numStr = i.toString().padStart(2, '0');
      const booth_id = `${letter}${numStr}`;
      const { classes } = getBoothStyle(booth_id);
      
      booths.push(
        <button
          key={booth_id}
          onClick={() => handleBoothClick(booth_id)}
          className={`w-8 h-8 text-[10px] border rounded flex items-center justify-center transition-all shrink-0 ${classes}`}
        >
          {numStr}
        </button>
      );
      if (i === 16) booths.push(<div key={`gap-${i}`} className="w-20 shrink-0" />);
      else if ([4, 8, 12, 20, 24, 28].includes(i)) booths.push(<div key={`gap-${i}`} className="w-4 shrink-0" />);
    }
    return (
      <div className="flex items-center justify-between bg-cyan-50 p-4 rounded-xl border border-cyan-200 mb-6 shadow-sm w-full">
        <span className="text-3xl font-black text-cyan-800 w-10 shrink-0 text-left">{letter}</span>
        <div className="flex gap-1 flex-nowrap justify-center flex-1">{booths}</div>
        <span className="text-3xl font-black text-cyan-800 w-10 shrink-0 text-right">{letter}</span>
      </div>
    );
  };

  const renderColumnVertical = (letter, start, end, type = 'center') => {
    let booths = [];
    for (let i = end; i >= start; i--) { 
      const numStr = i.toString().padStart(2, '0');
      const booth_id = `${letter}${numStr}`;
      const { classes } = getBoothStyle(booth_id);
      
      booths.push(
        <button
          key={booth_id}
          onClick={() => handleBoothClick(booth_id)}
          className={`w-10 h-7 text-[10px] border rounded flex items-center justify-center transition-all shrink-0 ${classes}`}
        >
          {numStr}
        </button>
      );
      if (type === 'side') {
        if (i === 17) booths.push(<div key={`gap-${i}`} className="h-20 shrink-0" />);
        else if ([29, 25, 21, 13, 9, 5].includes(i)) booths.push(<div key={`gap-${i}`} className="h-4 shrink-0" />);
      } 
      else if (type === 'center') {
        if ([31, 27, 21, 15, 9, 5].includes(i)) booths.push(<div key={`gap-${i}`} className="h-4 shrink-0" />);
      }
    }
    return (
      <div className="flex flex-col gap-1 items-center bg-cyan-50 px-2 py-3 rounded-xl border border-cyan-200 shadow-sm shrink-0">
        <span className="text-xl font-black text-cyan-800 mb-2">{letter}</span>
        {booths}
        <span className="text-xl font-black text-cyan-800 mt-2">{letter}</span>
      </div>
    );
  };

  if (activeBooth) {
    return <StorePage activeBooth={activeBooth} onBack={() => setActiveBooth(null)} onRequireAuth={onRequireAuth} user={user}/>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
      <div className="flex justify-center gap-4 mb-6">
        {["30/5/2026", "31/5/2026"].map((date, idx) => {
          const displayDate = date === "30/5/2026" ? "30 May 2026" : "31 May 2026";
          return (
            <button 
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-6 py-2 rounded-full font-bold transition ${selectedDate === date ? "bg-pink-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              Day {idx + 1}: {displayDate}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 mb-2">
        <button onClick={zoomOut} className="w-10 h-10 bg-gray-200 rounded-lg font-bold text-xl hover:bg-gray-300">-</button>
        <button className="px-4 h-10 bg-gray-200 rounded-lg text-sm font-bold">{Math.round(zoomLevel * 100)}%</button>
        <button onClick={zoomIn} className="w-10 h-10 bg-gray-200 rounded-lg font-bold text-xl hover:bg-gray-300">+</button>
      </div>

      <div ref={containerRef} className="relative bg-cyan-100 rounded-2xl shadow-inner border border-cyan-300 overflow-auto h-[600px] sm:h-[750px] w-full">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 animate-pulse font-bold text-pink-500">
             โหลดข้อมูลผังงาน...
          </div>
        ) : (
          <div className="p-4 md:p-8 transition-transform duration-300 origin-top-left" style={{ transform: `scale(${zoomLevel})`, width: '1550px' }}> 
            {renderRowHorizontal('A', 1, 32)}
            <div className="flex justify-between items-start mt-2 w-full px-1">
               {renderColumnVertical('B', 1, 32, 'side')}
               <div className="flex flex-1 justify-evenly px-4 lg:px-8">
                 {['C','E','G','I','K','M'].map(L => (
                   <div key={L} className="flex gap-2">
                     {renderColumnVertical(L, 1, 34, 'center')}
                     {renderColumnVertical(String.fromCharCode(L.charCodeAt(0)+1), 1, 34, 'center')}
                   </div>
                 ))}
               </div>
               {renderColumnVertical('O', 1, 32, 'side')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}