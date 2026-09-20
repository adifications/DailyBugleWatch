# 🕷️📰 Daily Bugle Watch | Civic Hazard Reporting

[![Live Demo](https://img.shields.io/badge/status-live-brightgreen.svg?style=for-the-badge)](https://dailybuglewatch.vercel.app)
**Live App URL:** [dailybuglewatch.vercel.app](https://dailybuglewatch.vercel.app)

**Daily Bugle Watch** is a full-stack, real-time civic hazard reporting and municipal dispatch application. Built as an MVP for urban management and campus infrastructure tracking, it bridges the communication gap between citizens reporting local hazards (such as potholes, water leaks, and broken streetlights) and authorities responsible for resolving them.

Developed for **Bit N Build 2026**.
---

## Core Architecture & Real-World Use Case

Traditional municipal reporting tools suffer from high friction: clunky interfaces, tedious forms, and a lack of transparency cause citizens to abandon reports, leaving cities with incomplete data. Daily Bugle Watch solves this through an end-to-end operational loop:

1. **Frictionless Citizen Intake:** Users can capture precise location data via automated browser geolocation and document hazards instantly using either file uploads or an in-app WebRTC camera viewfinder.
2. **Community Triage & Deduplication:** Instead of flooding municipal databases with duplicate entries for the same issue, citizens can view existing pins on an interactive map and "Upvote" them, automatically prioritizing high-severity hazards.
3. **Real-Time Database Synchronization:** Powered by Firebase Firestore, submissions instantly update across the public feed and map without requiring page reloads.
4. **Municipal Dispatch Control (`/admin`):** A secure, PIN-protected dashboard allowing administrators to manage a master incident log, alter dispatch statuses (`REPORTED` $\rightarrow$ `IN PROGRESS` $\rightarrow$ `RESOLVED`), and scrub resolved records to prevent database clutter.

---

## Key Technical Features

* **Geospatial Radar:** Built with Leaflet.js and React-Leaflet, utilizing custom dynamic markers (`L.divIcon`) that visually reflect real-time urgency and resolution states.
* **Asynchronous Media Handling:** Direct-to-cloud image hosting via Cloudinary integration with base64 preview management.
* **Secure Administrative Controls:** Protected route architecture requiring a 4-digit override PIN (`0000`) for data mutation (status updates and deletions).
* **Responsive Broadsheet Layout:** Optimized CSS masonry grid organizing incoming incident reports into a clear, scannable data feed.

---

## Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React.
* **Backend & Database:** Firebase Firestore (Real-time snapshot listeners).
* **Mapping API:** Leaflet.js & Carto Voyager tiles.
* **Media Storage:** Cloudinary API.

---

## Getting Started Locally

Follow these steps to run the application locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/daily-bugle-watch.git](https://github.com/YOUR_USERNAME/daily-bugle-watch.git)
cd daily-bugle-watch
