"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { ThumbsUp } from "lucide-react";

// --- DYNAMIC SPIDER-VERSE MAP PINS ---
// Instead of a boring blue image, we generate Neo-Brutalist HTML elements
const getComicPin = (status) => {
  let bgColor = "#ef4444"; // Red for REPORTED
  let emoji = "🕷️";
  
  if (status === "IN PROGRESS") {
    bgColor = "#facc15"; // Yellow
    emoji = "🚧";
  } else if (status === "RESOLVED") {
    bgColor = "#4ade80"; // Green
    emoji = "✅";
  }

  return L.divIcon({
    className: "bg-transparent", // Clears default Leaflet styles
    html: `
      <div style="
        background-color: ${bgColor}; 
        border: 3px solid #000; 
        border-radius: 50%; 
        width: 38px; 
        height: 38px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px; 
        box-shadow: 4px 4px 0px #000;
        transition: transform 0.2s;
      " class="hover:-translate-y-1">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

export default function HazardMap() {
  const [hazards, setHazards] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "hazards"), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHazards(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleUpvote = async (id) => {
    try {
      const hazardRef = doc(db, "hazards", id);
      await updateDoc(hazardRef, { upvotes: increment(1) });
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  const defaultCenter = hazards.length > 0 ? [hazards[0].lat, hazards[0].lng] : [9.9312, 76.2673];

  return (
    <div className="w-full h-[540px] border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden bg-white z-0 relative">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Switched to a cleaner, slightly more stylized base map
        />
        {hazards.map((h) => (
          <Marker 
            key={h.id} 
            position={[h.lat, h.lng]} 
            icon={getComicPin(h.status)} // Dynamically grab the right pin!
          >
            <Popup>
              <div className="font-sans p-1 max-w-[220px] text-black">
                {h.imageUrl && (
                  <img src={h.imageUrl} alt={h.title} className="w-full h-28 object-cover border-2 border-black mb-2" />
                )}
                <div className="flex justify-between items-center mb-1">
                  <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 border border-black uppercase inline-block">
                    {h.category}
                  </span>
                  <span className="text-[9px] font-black uppercase text-slate-500">
                    STATUS: {h.status || "REPORTED"}
                  </span>
                </div>
                
                <h3 className="font-black text-sm uppercase leading-tight mb-1">{h.title}</h3>
                <p className="text-xs font-bold text-slate-700 mb-2">{h.description}</p>
                <button
                  onClick={() => handleUpvote(h.id)}
                  className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <ThumbsUp className="h-3 w-3" /> UPVOTE ({h.upvotes || 0})
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}