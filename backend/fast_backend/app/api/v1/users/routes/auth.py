import traceback
import sys
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Response, status, HTTPException
from fastapi.responses import JSONResponse
from app.core.container import Container
from app.core.dependencies import get_current_active_user
from app.models.users_models import UserTableModel as User
from app.schema.auth_schema import SignIn, SignUp, SignInResponse, SignInNew
from app.schema.users_schema import User as UserSchema
from app.services.auth_service import AuthService
# from fastapi.status import HTTP_204_NO_CONTENT

from app.core.security import JWTBearer

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/sign_in", response_model=SignInResponse)
@inject
async def sign_in(user_info: SignInNew, service: AuthService = Depends(Provide[Container.auth_service])):
    return service.sign_in(user_info)


@router.post("/sign_up", response_model=UserSchema)
@inject
async def sign_up(user_info: SignUp, service: AuthService = Depends(Provide[Container.auth_service])):
    try:
        #print("provider is::::",Provide,file=sys.stderr)
        return service.sign_up(user_info)
    except Exception as e :
        traceback.print_exc()

@router.get("/me", response_model=UserSchema)
@inject
async def get_me(current_user: User = Depends(get_current_active_user)):
    user = UserSchema()
    user.name = current_user.name
    user.email = current_user.email
    user.created_at = current_user.created_at
    user.updated_at = current_user.updated_at
    user.is_active = current_user.is_active
    user.is_superuser = current_user.is_superuser
    user.id = current_user.id
    return user


@router.post("/sign_out")
@inject
async def sign_out(
        current_user: User = Depends(get_current_active_user),
        service: AuthService = Depends(Provide[Container.auth_service]),
        token: str = Depends(JWTBearer())):
    try:
        service.blacklist_token(current_user.email, token)

        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Logout successfully"})
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
