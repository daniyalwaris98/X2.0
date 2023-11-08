from fastapi import APIRouter

from app.api.v1.atom.routes.atom_routes import router as atom_router
from app.api.v1.atom.routes.password_group_routes import router as password_group_router

routers = APIRouter(
    prefix="/atom",
    tags=["atom"],
)

router_list = [
    atom_router,
    password_group_router
]

for router in router_list:
    routers.include_router(router)
