# 🕷️📰 Daily Bugle Watch | Civic Hazard Reporting

> *"Spotted by your friendly neighborhood civic reporting desk!"*

**Daily Bugle Watch** is a real-time, crowdsourced civic hazard reporting web application wrapped in an engaging, comic-book "Neo-Brutalist" aesthetic. Built to gamify municipal maintenance and infrastructure reporting, it transforms a boring bureaucratic chore into an entertaining, high-energy experience. 

Developed for the **Bit N Build 2026**.

[![Live Demo](https://img.shields.io/badge/status-live-brightgreen.svg?style=for-the-badge)](https://dailybuglewatch.vercel.app)
**Live App URL:** [dailybuglewatch.vercel.app](https://dailybuglewatch.vercel.app)

---

## Key Features

* **The "Spin Engine" (JJJ Headline Generator):** Bypasses boring text entries by letting users click a chunky **`SPIN IT!`** pen button to instantly wrap reports in sensationalist, J. Jonah Jameson-style headlines (*"MENACE! ... WHERE IS THE MAYOR?!"*).
* **The Bugle Broadsheet Feed:** Displays submitted hazards like a chaotic bulletin board of torn newspaper clippings using a CSS masonry layout, featuring grayscale-to-color photo hovers and live status stamps.
* **Interactive Radar Map:** Powered by Leaflet.js with custom HTML/CSS **"Spider-Tracer"** and resolution-aware map markers (`REPORTED`, `IN PROGRESS`, `RESOLVED`) that sync dynamically with database updates.
* **In-App Live Camera Viewfinder:** Allows citizens to toggle between a live WebRTC camera feed to snap photos directly on the streets or upload files seamlessly.
* **Secure Municipal Dispatch Desk (`/admin`):** A PIN-protected (`0000`) secret control room where city or campus administrators can track master incident logs, alter status flows, and scrub outdated records.
* **Bugle Radio:** An integrated retro audio player that toggles a newsroom soundtrack for live presentations.

---

## Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS (Custom Neo-Brutalist design system with halftone patterns and hard black drop-shadows).
* **Backend & Database:** Firebase Firestore (Real-time snapshot listeners for instant multi-user synchronization).
* **Geospatial Mapping:** Leaflet.js & React-Leaflet with Carto Voyager map tiles.
* **Media Storage:** Cloudinary API for instant image hosting and base64 preview handling.
* **Icons & UI:** Lucide React.

---

## Getting Started Locally

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/daily-bugle-watch.git](https://github.com/YOUR_USERNAME/daily-bugle-watch.git)
cd daily-bugle-watch
