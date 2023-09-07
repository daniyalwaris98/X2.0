import sys

from fastapi import APIRouter, Depends
from dependency_injector.wiring import Provide, inject

from app.schema.atom_schema import *
from app.models.atom_models import *
from app.core.config import configs

router = APIRouter(
    prefix="/atom",
    tags=["atom"],
)


# class Atom_Request(BaseModel):
#     name: str
#     number:int
#
#
# class atom_response(BaseModel):
#     name: str
#     number: int = None


@router.post("/addAtom")
async def add_atom(atom: AddAtomSchema):
    return atom


@router.get("/getAtoms")
@inject
async def get_atoms():
    results = configs.db.query(AtomTable).all()
    print(results, file=sys.stderr)
    return "Get Atom Successful"

# async def sign_in(user_info: SignIn, service: AuthService = Depends(Provide[Container.auth_service])):
#     return service.sign_in(user_info)
