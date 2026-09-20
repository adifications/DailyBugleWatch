"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import ReportForm from "@/components/ReportForm";
import HazardFeed from "@/components/HazardFeed";
import BugleRadio from "@/components/BugleRadio";
import { Zap } from "lucide-react";

// Load map dynamically to prevent server-rendering errors
const HazardMap = dynamic(() => import("@/components/HazardMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_0px_#000] flex items-center justify-center font-black text-xl text-black animate-pulse">
      LOADING BUGLE RADAR MAP...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-halftone text-black p-4 md:p-8 font-sans overflow-x-hidden relative">
      
      {/* Floating Radio */}
      <BugleRadio />

      {/* Daily Bugle Header */}
      <header className="max-w-6xl mx-auto mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] relative z-10">
        <div className="flex justify-between items-center border-b-2 border-black pb-2 text-xs font-black uppercase tracking-wider">
          <span>VOL. 104 NO. 42</span>
          <span className="bg-red-600 text-white px-2 py-0.5 border border-black animate-spider-pulse">
            EXTRA! EXTRA!
          </span>
          <Link href="/admin" className="hover:text-red-600 hover:underline cursor-pointer">
            CITY DESK LOGIN
          </Link>
        </div>

        <div className="text-center my-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase border-y-4 border-black py-2 my-2 bg-yellow-300 shadow-[4px_4px_0px_0px_#000] inline-block px-4 rotate-[-1deg]">
            THE DAILY BUGLE
          </h1>
          <p className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-800 mt-2">
            CIVIC HAZARD WATCH • SPOTTED BY YOUR FRIENDLY NEIGHBORHOOD
          </p>
        </div>

        {/* Floating Badge */}
        <div className="absolute -bottom-5 -right-4 bg-red-600 text-white font-black px-4 py-2 text-sm uppercase tracking-widest border-2 border-black rotate-[-5deg] shadow-[4px_4px_0px_0px_#000] animate-float hidden md:block">
          🕸️ THWIP! REPORT IT LIVE
        </div>
      </header>

      {/* Ticker */}
      <div className="max-w-6xl mx-auto mb-8 bg-black text-white p-2.5 border-4 border-black font-black text-xs uppercase flex items-center gap-3 shadow-[6px_6px_0px_0px_#ef4444]">
        <span className="bg-yellow-400 text-black px-2 py-0.5 flex items-center gap-1 font-black shrink-0 animate-pulse">
          <Zap className="h-3 w-3 fill-black" /> BREAKING WIRE
        </span>
        <p className="truncate">
          UNSYNCHRONIZED LIGHTS, WATER LEAKS & ROAD HAZARDS LOGGED IN REAL-TIME BY CITIZENS!
        </p>
      </div>

      {/* TOP ROW: Form and Map */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <ReportForm />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white border-4 border-black p-2 px-4 shadow-[4px_4px_0px_0px_#000]">
            <h2 className="text-base font-black uppercase flex items-center gap-2">
              📍 HAZARD MAP RADAR
            </h2>
            <span className="text-xs font-bold bg-green-400 px-2 py-0.5 border-2 border-black animate-spider-pulse">
              LIVE SYNC
            </span>
          </div>
          <HazardMap />
        </div>
      </div>

      {/* BOTTOM ROW: Broadsheet Feed */}
      <div className="max-w-6xl mx-auto">
        <HazardFeed />
      </div>

    </main>
  );
}