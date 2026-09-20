"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { AlertCircle, Clock, MapPin } from "lucide-react";

export default function HazardFeed() {
  const [hazards, setHazards] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "hazards"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHazards(docs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 md:p-6 font-sans">
      <h2 className="text-2xl md:text-3xl font-black uppercase border-b-8 border-black pb-2 mb-6 flex items-center gap-2">
        <AlertCircle className="h-8 w-8 text-red-600" />
        THE BUGLE BROADSHEET
      </h2>

      {hazards.length === 0 ? (
        <p className="font-bold text-slate-500 uppercase text-center py-8">The city is quiet... too quiet.</p>
      ) : (
        /* CSS Columns create the masonry (Pinterest) layout! */
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          
          {hazards.map((h, i) => {
            // Alternate rotation and background color for a messy, chaotic desk look
            const isEven = i % 2 === 0;
            
            return (
              <div 
                key={h.id} 
                className={`break-inside-avoid border-4 border-black p-4 relative shadow-[4px_4px_0px_0px_#000] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] ${isEven ? "bg-white rotate-1" : "bg-yellow-100 -rotate-1"}`}
              >
                {/* Faux Tape at the top of the clipping */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-gray-200 border border-gray-400 rotate-[-4deg] shadow-sm z-10 opacity-80"></div>
                
                {/* Header: Category & Time */}
                <div className="flex justify-between items-start mb-2 pt-2">
                  <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 border-2 border-black uppercase">
                    {h.category}
                  </span>
                  <span className="text-[10px] font-bold text-red-600 flex items-center gap-1 bg-white px-1 border border-black shadow-[2px_2px_0px_0px_#000]">
                    <Clock className="h-3 w-3" /> 
                    {h.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "JUST IN"}
                  </span>
                </div>

                {/* Photo: Black & white until hovered */}
                {h.imageUrl && (
                  <img 
                    src={h.imageUrl} 
                    alt="Hazard" 
                    className="w-full h-32 object-cover border-2 border-black mb-3 grayscale hover:grayscale-0 transition-all duration-300" 
                  />
                )}
                
                {/* Headline: We use whitespace-pre-line so the \n from the Spin Engine breaks lines perfectly! */}
                <h3 className="font-black text-lg md:text-xl leading-none uppercase mb-3 whitespace-pre-line">
                  {h.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs font-bold text-slate-700 mb-3 border-l-4 border-red-600 pl-2 leading-snug">
                  {h.description || "No eyewitness description provided to the press."}
                </p>
                
                {/* Footer: Location */}
                <div className="text-[10px] font-black text-black flex items-center gap-1 border-t-2 border-black pt-2 uppercase">
                  <MapPin className="h-3 w-3 text-red-600" />
                  GPS: {h.lat?.toFixed(3)}, {h.lng?.toFixed(3)}
                </div>
                
                {/* Huge Admin Status Stamp (Only shows if marked as resolved in the admin panel) */}
                {h.status === "RESOLVED" && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-green-600 text-green-600 font-black text-4xl uppercase px-2 py-1 rotate-[-15deg] opacity-90 pointer-events-none drop-shadow-md bg-white/70">
                    FIXED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}