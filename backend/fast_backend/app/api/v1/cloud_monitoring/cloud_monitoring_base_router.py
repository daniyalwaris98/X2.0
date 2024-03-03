
from app.api.v1.cloud_monitoring.routes.cloud_aws_services_routes import router as cloud_services_routes
from app.api.v1.cloud_monitoring.routes.cloud_credentials_routes import router as cloud_credential
from app.api.v1.cloud_monitoring.routes.static_routes import router as static_list_router
import sys
from fastapi import APIRouter

routers =APIRouter(
    prefix = "/cloud_monitoring",
    tags = ["cloud_monitoring"]
)

router_list = [
    cloud_services_routes,
    cloud_credential,
    static_list_router
]

for router in router_list:
    routers.include_router(router)

