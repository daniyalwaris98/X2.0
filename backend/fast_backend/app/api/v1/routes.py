from fastapi import APIRouter

from app.api.v1.atom.atom_routes import router as atom_router
from app.api.v1.atom.password_group_routes import router as password_group_router
# from app.api.v1.uam.uam_base_routes import router as uam_router
from app.api.v1.uam.site_routes import router as site_router
from app.api.v1.uam.rack_routes import router as rack_router


routers = APIRouter()
router_list = [atom_router, password_group_router, site_router, rack_router]

for router in router_list:
    router.tags = routers.tags.append("v1")
    routers.include_router(router)
