# FaultLens
### Distributed System Reliability & Failure Analysis Platform

FaultLens is a web-based reliability monitoring platform designed to simulate microservice failures, monitor service health, identify potential system impact, and provide rule-based root cause analysis.

## Key Features

- **Real-Time Monitoring:** Automatically refreshes service metrics every 5 seconds.
- **Failure Simulation:** Simulate service failures and recovery.
- **Incident Management:** Track recorded service incidents.
- **Dependency Intelligence:** Visualize relationships between microservices.
- **Root Cause Analysis:** Identify critical services and potentially affected downstream services.
- **Reliability Analytics:** Monitor service health, latency, and error rates.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| Frontend | HTML, CSS, JavaScript |
| API | REST API |
| Version Control | Git, GitHub |

## Architecture

```text
Frontend Dashboard
       |
       | REST API
       |
   FastAPI Backend
       |
  Service Simulation
       |
  Reliability Analysis
       |
  Incident & Analytics Data
```

## Simulated Microservices

- Login Service
- Product Service
- Order Service
- Payment Service

## Project Structure

```text
FaultLens/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   └── app.js
├── docs/
│   └── PROJECT_OVERVIEW.md
└── .gitignore
```

## Getting Started

### 1. Install dependencies

```bash
cd backend
python -m pip install -r requirements.txt
```

### 2. Start the backend

```bash
python -m uvicorn main:app --reload
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
python -m http.server 5500
```

Open `http://127.0.0.1:5500` in your browser.

## Project Scope

FaultLens is an educational prototype using simulated service metrics and in-memory data. It demonstrates core concepts of microservice reliability monitoring and failure analysis. It is not yet a production observability platform.

## Author

**M. Mullaivarman**  
First-Year Computer Science and Engineering Student  
Rajalakshmi Engineering College

GitHub: https://github.com/Mullaivarman29

---

*Built to explore software engineering, distributed systems, and reliability engineering.*
## 🚀 Live Demo

**Explore FaultLens:** https://faultlens-frontend.onrender.com

**Backend API:** https://faultlens-api-ugzo.onrender.com

**Source Code:** https://github.com/Mullaivarman29/FaultLens
