# app/main.py
from fastapi import FastAPI, Depends, HTTPException
# import pdb;pdb.set_trace()

from app.core.config import configs
from app.models.atom_models import *

from app.api.v1.routes import routers as v1_routers

app = FastAPI(title="MonetX_2.0", openapi_url=f"{configs.API}/openapi.json",
              version="0.0.1")

app.include_router(v1_routers, prefix=configs.API_V1_STR)

# Initialize tables
Base.metadata.create_all(bind=configs.engine)

