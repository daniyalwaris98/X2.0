from fastapi import APIRouter

from app.api.v1.monitoring.device.monitoring_dashboard_routes import router as dashboard_routes
from app.api.v1.monitoring.device.monitoring_device_dashboard_routes import \
    router as device_dashboard_routes
from app.api.v1.monitoring.device.monitoring_device_routes import router as monitoring_device_routes
from app.api.v1.monitoring.device.monitoring_alert_routes import router as monitoring_alert_routes
from app.api.v1.monitoring.device.monitoring_credentials_routes import router as monitoring_credentials_routes


routers = APIRouter(
    prefix="/monitoring",
    tags=["monitoring"]
)
router_list = [dashboard_routes, monitoring_device_routes, device_dashboard_routes,
               monitoring_alert_routes, monitoring_credentials_routes]

for router in router_list:
    routers.include_router(router)
