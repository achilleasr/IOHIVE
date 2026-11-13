# IOHIVE Web App

A web application that adds **two-step beehive inspections** to the [IoHive](https://iohive.aegean.gr/) beekeeping ecosystem, built on top of the [BEEP](https://api.beep.nl/) API.

Live demo: [iohive.netlify.app](https://iohive.netlify.app)

Developed as part of my diploma thesis "Development of a web application for inspections and monitoring of beehive data" at the Department of Product and Systems Design Engineering, University of the Aegean. Grounded in Goodwin's Goal-Directed Design methodology and secondary research into the IoHive literature (Alifieris et al. 2023; Chamaidi et al. 2022).

<img width="1920" height="1080" alt="overview_screen" src="https://github.com/user-attachments/assets/758e031f-bdd2-498e-81ef-4ed9bc42f9ee" />
<img width="1920" height="1080" alt="two_step1" src="https://github.com/user-attachments/assets/dba3b3fb-ec00-4f9b-be84-6746e4177a97" />
<img width="1456" height="1024" alt="hives_view" src="https://github.com/user-attachments/assets/354bc687-ecfd-450b-9fc1-6bad4cf4d44a" />
<img width="1436" height="1048" alt="hive_expanded_inspections_detailed_view" src="https://github.com/user-attachments/assets/e72bb63a-c650-4de0-9753-9f625361a472" />
<img width="1920" height="1080" alt="devices_view" src="https://github.com/user-attachments/assets/b883607a-0423-41f9-a251-ab472723d4d6" />
<img width="1531" height="1074" alt="device_expanded_view_draft" src="https://github.com/user-attachments/assets/810ad175-7f29-4ce7-ab42-bb82ee8100fc" />

## About

IoHive gives beekeepers a way to log hive inspections, but its existing "Standard Inspection Scenario" never shipped a UI for recording an **intervention** alongside the observed state of a hive. This gap is documented in the IoHive literature but was left unimplemented.

IOHIVE fills that gap with a **two-step inspection model**:

1. **Observed state**: the hive's condition when the inspection starts (pre-filled from the previous inspection's resulting state)
2. **Intervention** (optional): any action the beekeeper takes during the visit
3. **Resulting state**: the hive's condition after the intervention

The full three-part record is stored in the app's own database so nothing is lost, while only the resulting state is sent back to BEEP, keeping the app compatible with the rest of the IoHive ecosystem.

## Features

- Two-step inspection form (observed state → intervention → resulting state)
- Inspection history per hive
- Hive state visualization (charts via ECharts)
- Hive location mapping (Leaflet)
- Syncs with the BEEP REST API (`api.beep.nl/api`)

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3, Vuex 4, Vue Router 4, Axios |
| Visualization | ECharts, Leaflet |
| Backend | Netlify Functions (serverless) |
| Database | MongoDB Atlas |
| Hosting | Netlify |
| Prototyping | Figma |

### Serverless functions

- `saveInspection` — persists a full inspection record (observed state, intervention, resulting state) to MongoDB, and forwards the resulting state to BEEP
- `getHistory` — retrieves a hive's inspection history

## Project structure

```
IOHIVE/
├── netlify/functions/   # Serverless functions (saveInspection, getHistory)
├── public/               # Static assets
├── src/                  # Vue application source
├── notes and tools/       # Dev notes / tooling
├── vue.config.js
└── package.json
```

## Getting started

### Prerequisites

- Node.js
- A MongoDB Atlas connection string
- A BEEP API account/token

### Installation

```bash
git clone https://github.com/achilleasr/IOHIVE.git
cd IOHIVE
npm install
```

### Environment variables

Create a `.env` file (or set these as Netlify environment variables) with:

```
MONGODB_URI=your-mongodb-atlas-connection-string
```

<!-- Add any BEEP API credentials env vars here if/when applicable -->

### Development

```bash
npm run serve
```

### Build

```bash
npm run build
```

### Deployment

The app is deployed on Netlify, with `netlify/functions` providing the backend API and `MONGODB_URI` stored as a Netlify secret.
