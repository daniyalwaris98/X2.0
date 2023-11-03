from fastapi import APIRouter

from app.api.v1.atom.atom_routes import router as atom_router
from app.api.v1.atom.password_group_routes import router as password_group_router
from app.api.v1.auto_discovery.auto_discovery_dashboard_routes import \
    router as auto_discovery_dashboard_router
from app.api.v1.auto_discovery.auto_discovery_routes import router as auto_discovery_router
from app.api.v1.uam.aps_routes import router as aps_router
from app.api.v1.uam.device_routes import router as device_router
from app.api.v1.uam.module_routes import router as module_router
from app.api.v1.uam.rack_routes import router as rack_router
from app.api.v1.uam.sfp_routes import router as sfp_router
from app.api.v1.uam.site_routes import router as site_router

from app.api.v1.monitoring.monitoring_routes import routers as monitoring_routers

routers = APIRouter()
router_list = [atom_router, password_group_router, site_router, rack_router, device_router,
               module_router, sfp_router, aps_router, auto_discovery_router,
               auto_discovery_dashboard_router, monitoring_routers]

for router in router_list:
    routers.include_router(router)
