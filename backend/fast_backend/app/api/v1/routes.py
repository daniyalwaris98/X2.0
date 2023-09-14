from fastapi import APIRouter

from app.api.v1.atom.atom_routes import router as atom_router
from app.api.v1.atom.password_group_routes import router as password_group_router

routers = APIRouter()
router_list = [atom_router, password_group_router]

for router in router_list:
    router.tags = routers.tags.append("v1")
    routers.include_router(router)
