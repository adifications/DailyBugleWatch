"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { ShieldAlert, Home, Lock } from "lucide-react";

export default function AdminDashboard() {
  const [hazards, setHazards] = useState([]);
  
  // --- NEW SECURITY STATE ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // We only want to fetch data if they are actually authorized to see it
    if (!isAuthorized) return;

    const q = query(collection(db, "hazards"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHazards(docs);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const hazardRef = doc(db, "hazards", id);
      await updateDoc(hazardRef, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === "0000") {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  // --- SECURITY OVERLAY (Shows if not authorized) ---
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-halftone text-black flex items-center justify-center p-4">
        <form 
          onSubmit={handleLogin} 
          className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_#000] max-w-md w-full relative overflow-hidden"
        >
          {/* Danger Striping */}
          <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#facc15_10px,#facc15_20px)]"></div>
          
          <div className="text-center mt-6 mb-8">
            <Lock className="h-16 w-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-3xl font-black uppercase leading-none">Restricted Area</h1>
            <p className="text-xs font-bold text-slate-500 uppercase mt-2">
              City Desk Dispatch Authentication Required
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1">Enter Override PIN</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                className={`w-full p-4 text-center text-4xl tracking-[1em] font-black border-4 border-black shadow-[4px_4px_0px_0px_#000] focus:outline-none ${error ? 'bg-red-100 placeholder-red-300' : 'bg-yellow-50'}`}
              />
              {error && <p className="text-red-600 text-xs font-black uppercase mt-2">ACCESS DENIED. Invalid Credentials.</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_#000] active:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition"
            >
              Authenticate
            </button>
            
            <Link href="/" className="block text-center text-xs font-bold uppercase underline mt-4 hover:text-red-600">
              Return to Public Terminal
            </Link>
          </div>
        </form>
      </main>
    );
  }

  // --- MAIN DASHBOARD (Shows if authorized) ---
  return (
    <main className="min-h-screen bg-halftone text-black p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b-8 border-black pb-4 gap-4">
          <div>
            <span className="bg-black text-white px-3 py-1 font-black text-sm uppercase tracking-widest border-2 border-black">
              SECURE CONNECTION ESTABLISHED
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-2 uppercase flex items-center gap-3">
              <ShieldAlert className="h-10 w-10 text-red-600" />
              CITY DESK EDITOR
            </h1>
            <p className="font-bold text-slate-700 uppercase mt-1">Master Incident Log & Dispatch Control</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAuthorized(false)} 
              className="bg-black text-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#ef4444] hover:bg-slate-800 transition active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Lock Terminal
            </button>
            <Link href="/">
              <button className="bg-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-100 flex items-center gap-2 transition active:translate-x-1 active:translate-y-1 active:shadow-none">
                <Home className="h-4 w-4" /> Exit
              </button>
            </Link>
          </div>
        </header>

        {/* Master Log Table */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-yellow-300 border-b-4 border-black text-sm uppercase">
                <th className="p-4 border-r-4 border-black font-black">Photo</th>
                <th className="p-4 border-r-4 border-black font-black">Incident Details</th>
                <th className="p-4 border-r-4 border-black font-black">Location (GPS)</th>
                <th className="p-4 border-r-4 border-black font-black text-center">Severity / Upvotes</th>
                <th className="p-4 font-black">Dispatch Status</th>
              </tr>
            </thead>
            <tbody>
              {hazards.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center font-bold text-slate-500 uppercase">
                    No incidents logged in the database.
                  </td>
                </tr>
              ) : (
                hazards.map((h) => (
                  <tr key={h.id} className="border-b-4 border-black hover:bg-gray-50 transition">
                    <td className="p-4 border-r-4 border-black w-40">
                      {h.imageUrl ? (
                        <img src={h.imageUrl} alt="Hazard" className="w-32 h-32 object-cover border-4 border-black" />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 border-4 border-black flex items-center justify-center text-[10px] font-bold text-center p-2">
                          NO PHOTO
                        </div>
                      )}
                    </td>
                    <td className="p-4 border-r-4 border-black max-w-sm">
                      <div className="bg-black text-white text-[10px] font-black px-2 py-0.5 inline-block uppercase mb-1">
                        {h.category}
                      </div>
                      <h3 className="font-black text-xl uppercase leading-none whitespace-pre-line my-2">
                        {h.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-2 border-l-2 border-red-600 pl-2">
                        {h.description}
                      </p>
                    </td>
                    <td className="p-4 border-r-4 border-black font-bold text-xs uppercase text-slate-600">
                      LAT: {h.lat?.toFixed(5)} <br/>
                      LNG: {h.lng?.toFixed(5)}
                    </td>
                    <td className="p-4 border-r-4 border-black text-center font-black text-4xl text-red-600">
                      {h.upvotes || 0}
                    </td>
                    <td className="p-4">
                      <select
                        value={h.status || "REPORTED"}
                        onChange={(e) => handleStatusChange(h.id, e.target.value)}
                        className={`w-full p-3 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] focus:outline-none cursor-pointer ${
                          h.status === "RESOLVED" ? "bg-green-400 text-black" : 
                          h.status === "IN PROGRESS" ? "bg-yellow-400 text-black" : 
                          "bg-red-600 text-white"
                        }`}
                      >
                        <option value="REPORTED" className="bg-white text-black">🚨 REPORTED</option>
                        <option value="IN PROGRESS" className="bg-white text-black">🚧 IN PROGRESS</option>
                        <option value="RESOLVED" className="bg-white text-black">✅ RESOLVED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}