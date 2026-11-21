
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FaultLens API",
    description="Distributed System Reliability Monitoring Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Simulated microservices
services = {
    "login": {
        "name": "Login Service",
        "status": "healthy",
        "latency": 120,
        "error_rate": 0.1
    },
    "product": {
        "name": "Product Service",
        "status": "healthy",
        "latency": 180,
        "error_rate": 0.2
    },
    "payment": {
        "name": "Payment Service",
        "status": "healthy",
        "latency": 200,
        "error_rate": 0.1
    },
    "order": {
        "name": "Order Service",
        "status": "healthy",
        "latency": 150,
        "error_rate": 0.1
    }
}

incidents = []

# Service dependency relationships
dependencies = {
    "login": [],
    "product": ["login"],
    "order": ["product"],
    "payment": ["order"]
}



@app.get("/")
def home():
    return {
        "message": "Welcome to FaultLens API",
        "status": "running",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/api/health")
def health_check():
    return {
        "platform": "FaultLens",
        "status": "operational",
        "services_monitored": len(services)
    }


@app.get("/api/services")
def get_services():
    return {
        "total": len(services),
        "services": services
    }


@app.post("/api/services/{service_id}/simulate-failure")
def simulate_failure(service_id: str):

    if service_id not in services:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    services[service_id]["status"] = "critical"
    services[service_id]["latency"] = 5000
    services[service_id]["error_rate"] = 25.0

    incident = {
        "service": services[service_id]["name"],
        "severity": "critical",
        "message": "Abnormal service behaviour detected",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    incidents.append(incident)

    return {
        "message": "Failure simulated successfully",
        "incident": incident
    }


@app.post("/api/services/{service_id}/recover")
def recover_service(service_id: str):

    if service_id not in services:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    services[service_id]["status"] = "healthy"
    services[service_id]["latency"] = 150
    services[service_id]["error_rate"] = 0.1

    return {
        "message": "Service recovered successfully",
        "service": services[service_id]
    }


@app.get("/api/incidents")
def get_incidents():
    return {
        "total": len(incidents),
        "incidents": incidents
    }

@app.get("/api/dependencies")
def get_dependencies():
    return {
        "total_services": len(dependencies),
        "dependencies": dependencies
    }

@app.get("/api/analysis")
def root_cause_analysis():
    critical_services = [
        service_id
        for service_id, data in services.items()
        if data["status"] == "critical"
    ]

    results = []

    for failed_service in critical_services:
        affected = set()
        changed = True

        while changed:
            changed = False

            for service_id, required_services in dependencies.items():
                if (
                    service_id not in affected
                    and service_id != failed_service
                    and (
                        failed_service in required_services
                        or any(dep in affected for dep in required_services)
                    )
                ):
                    affected.add(service_id)
                    changed = True

        results.append({
            "suspected_root_cause": services[failed_service]["name"],
            "severity": "critical",
            "potentially_affected_services": [
                services[item]["name"] for item in sorted(affected)
            ],
            "affected_count": len(affected)
        })

    return {
        "analysis_status": "completed",
        "critical_services": len(critical_services),
        "results": results
    }


@app.get("/api/analytics")
def reliability_analytics():
    total = len(services)

    healthy = sum(
        1 for service in services.values()
        if service["status"] == "healthy"
    )

    average_latency = round(
        sum(s["latency"] for s in services.values()) / total, 2
    ) if total else 0

    average_error_rate = round(
        sum(s["error_rate"] for s in services.values()) / total, 2
    ) if total else 0

    return {
        "total_services": total,
        "healthy_services": healthy,
        "critical_services": total - healthy,
        "health_percentage": round(healthy / total * 100, 2) if total else 0,
        "average_latency_ms": average_latency,
        "average_error_rate": average_error_rate,
        "recorded_incidents": len(incidents)
    }

