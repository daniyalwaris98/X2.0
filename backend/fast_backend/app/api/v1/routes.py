from fastapi import APIRouter

from app.api.v1.atom.atom_routes import router as atom_router

routers = APIRouter()
router_list = [atom_router]

for router in router_list:
    router.tags = routers.tags.append("v1")
    routers.include_router(router)
