from fastapi import FastAPI,APIRouter
import sys


from app.api.v1.users.license_routes import router as license_router
from app.api.v1.users.user_routes import router as admin_router

routers = APIRouter(
    prefix="/users",
    tags=["users"]
)

router_list = [
    admin_router,
    license_router
]
print("router list for user is:::",router_list,file=sys.stderr)
for router in router_list:
    print("router in router list is::::::::",router,file=sys.stderr)
    routers.include_router(router)