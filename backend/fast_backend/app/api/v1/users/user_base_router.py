import traceback
from fastapi import APIRouter
from app.api.v1.users.routes.license_routes import router as license_router
from app.api.v1.users.routes.user_routes import router as user_router
import sys



routers = APIRouter(
    prefix="/users",
    tags=["users"]
)

router_list = [
    user_router,
    license_router
]
print("router list for user is:::", router_list, file=sys.stderr)
for router in router_list:
    print("router in router list is::::::::", router, file=sys.stderr)
    routers.include_router(router)




