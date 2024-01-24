from fastapi import FastAPI,APIRouter,Query
from starlette.responses import Response
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix = '/ipam_dashboard',
    tags = ['ipam_dashboard']
)
