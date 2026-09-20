"use client";
import { useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { MapPin, Upload, Loader2, AlertTriangle, PenTool, Camera, X, Check } from "lucide-react";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pothole");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingGps, setFetchingGps] = useState(false);

  // --- NEW CAMERA STATES ---
  const [imageFile, setImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const spinHeadline = () => {
    const prefixes = ["MENACE!", "OUTRAGE!", "CITY IN RUINS!", "DISASTER!", "INCOMPETENCE!", "SCANDAL!"];
    const suffixes = [
      "...AND SPIDER-MAN MIGHT BE INVOLVED!", 
      "...TAXPAYERS FOOT THE BILL!", 
      "...WHERE IS THE MAYOR?!", 
      "...CITIZENS LEFT TO SUFFER!",
      "...ANOTHER PUBLIC FAILURE!"
    ];
    
    const categoryNouns = {
      "Pothole": "MASSIVE STREET CRATER",
      "Broken Light": "TERRIFYING BLACKOUT",
      "Water Leak": "DANGEROUS STREET FLOODING",
      "Road Hazard": "DEADLY OBSTACLE",
      "Other": "UNIDENTIFIED THREAT" 
    };

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    let coreText = title.trim();
    
    prefixes.forEach(p => coreText = coreText.replace(p, "").trim());
    suffixes.forEach(s => coreText = coreText.replace(s, "").trim());
    
    if (coreText === "") coreText = categoryNouns[category] || "PUBLIC THREAT";
    setTitle(`${prefix}\n${coreText.toUpperCase()}\n${suffix}`);
  };

  const getLocation = () => {
    setFetchingGps(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setFetchingGps(false);
        },
        () => {
          alert("GPS permission denied.");
          setFetchingGps(false);
        }
      );
    } else {
      alert("Geolocation is not supported.");
      setFetchingGps(false);
    }
  };

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    setIsCameraActive(true);
    setPreviewUrl(null);
    setImageFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or unavailable.");
      setIsCameraActive(false);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPreviewUrl(dataUrl);
    setImageFile(dataUrl); // Cloudinary accepts base64 strings directly!
    
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearPhoto = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cl_default"); 
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/utooekjk/image/upload", 
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("You must capture GPS coordinates!");
    if (!imageFile) return alert("You must provide photo evidence!");
    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(imageFile);

      await addDoc(collection(db, "hazards"), {
        title, category, description, imageUrl,
        lat: location.lat, lng: location.lng,
        upvotes: 1, status: "REPORTED",
        createdAt: serverTimestamp(),
      });

      setTitle(""); setDescription(""); clearPhoto(); setLocation(null);
      alert("💥 HAZARD LOGGED TO DAILY BUGLE DESK!");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#fef08a] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] text-black space-y-4 relative">
      <div className="absolute -top-4 -right-3 bg-red-600 text-white font-black px-3 py-1 text-xs uppercase border-2 border-black rotate-3 shadow-[2px_2px_0px_0px_#000]">
        CLASSIFIED WIRE
      </div>
      <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-red-600" /> REPORT HAZARD
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 bg-white border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_#000] focus:outline-none cursor-pointer">
            <option>Pothole</option>
            <option>Broken Light</option>
            <option>Water Leak</option>
            <option>Road Hazard</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black uppercase mb-1">GPS Radar</label>
          <button type="button" onClick={getLocation} className={`w-full p-2.5 border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#000] transition active:translate-x-0.5 active:translate-y-0.5 ${location ? "bg-green-400 hover:bg-green-500" : "bg-sky-400 hover:bg-sky-500"}`}>
            {fetchingGps ? <Loader2 className="animate-spin h-4 w-4" /> : (location ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />)}
            {location ? "GPS LOCKED" : "GET GPS"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-1 flex justify-between items-end">
          <span>Headline</span>
          <span className="text-[9px] text-red-600">EDITOR'S DESK ONLY</span>
        </label>
        <button type="button" onClick={spinHeadline} className="mb-2 w-full bg-black text-white hover:bg-slate-800 p-2 border-2 border-black font-black text-xs uppercase flex justify-center items-center gap-1 shadow-[2px_2px_0px_0px_#ef4444] active:translate-x-0.5 active:translate-y-0.5">
          <PenTool className="h-4 w-4" /> SPIN IT!
        </button>
        <textarea required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Broken Lamp Posts" rows="3" className="w-full p-3 bg-white border-4 border-black font-black text-lg md:text-xl leading-tight shadow-[4px_4px_0px_0px_#000] focus:outline-none uppercase resize-none" />
      </div>

      {/* --- PHOTO EVIDENCE SECTION --- */}
      <div>
        <label className="block text-xs font-black uppercase mb-1">Photo Evidence</label>
        
        {!previewUrl && !isCameraActive && (
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={startCamera} className="w-full py-3 bg-white hover:bg-gray-100 border-4 border-black font-black text-xs uppercase flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 transition">
              <Camera className="h-6 w-6 text-red-600" />
              LIVE CAMERA
            </button>
            
            <label className="w-full py-3 bg-white hover:bg-gray-100 border-4 border-black font-black text-xs uppercase flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0px_0px_#000] active:translate-x-1 active:translate-y-1 transition cursor-pointer">
              <Upload className="h-6 w-6 text-blue-600" />
              UPLOAD FILE
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Live Camera Viewfinder */}
        {isCameraActive && (
          <div className="border-4 border-black bg-black p-2 relative shadow-[4px_4px_0px_0px_#000]">
            <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover bg-gray-900 border-2 border-white" />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute top-4 right-4 flex gap-2">
              <button type="button" onClick={stopCamera} className="bg-red-600 p-1 border-2 border-black hover:bg-red-700">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <button type="button" onClick={takePhoto} className="w-full mt-2 py-2 bg-red-600 hover:bg-red-700 text-white border-2 border-black font-black uppercase text-sm flex items-center justify-center gap-2">
              <Camera className="h-4 w-4" /> SNAP PHOTO
            </button>
          </div>
        )}

        {/* Captured / Uploaded Preview */}
        {previewUrl && (
          <div className="border-4 border-black relative shadow-[4px_4px_0px_0px_#000] group">
            <img src={previewUrl} alt="Evidence Preview" className="w-full h-48 object-cover" />
            <button type="button" onClick={clearPhoto} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 border-2 border-black font-black uppercase text-[10px] opacity-100 hover:bg-red-700 shadow-sm">
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-[10px] font-black p-1 text-center uppercase tracking-widest">
              EVIDENCE SECURED
            </div>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-red-600 hover:bg-red-700 text-white border-4 border-black font-black text-lg uppercase flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_#000] active:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition">
        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        FILE INCIDENT REPORT
      </button>
    </form>
  );
}