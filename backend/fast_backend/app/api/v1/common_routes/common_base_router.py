from fastapi import APIRouter,FastAPI


from app.api.v1.common_routes.routes.common_route import router as common_router



routers =  APIRouter(
    prefix="/common",
    tags=['common']
)
router_list = [
    common_router
]
for routes in router_list:
    routers.include_router(routes)