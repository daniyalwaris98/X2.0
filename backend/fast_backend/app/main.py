import time
import sys
import traceback
import uvicorn
import asyncio
from fastapi import FastAPI,Request,HTTPException
from starlette.middleware.cors import CORSMiddleware
import uuid
# Import Routes
from app.api.v1.routes import routers as v1_routers
# from app.api.v2.routes import routers as v2_routers
from fastapi.staticfiles import StaticFiles
# Import Database and Models
from app.models.atom_models import *
from app.models.site_rack_models import *
from app.utils.db_utils import *

# Import Container and Configs
from app.core.container import Container
from app.core.config import configs
from app.utils.class_object import singleton


#Middleware
from app.middleware import AuthMiddleware
from fastapi.openapi.docs import get_swagger_ui_oauth2_redirect_html




# Initialize FastAPI app
app = FastAPI(title="MonetX_2.0", openapi_url=f"{configs.API}/openapi.json", version="0.0.1")



# app.middleware("http")(AuthMiddleware())
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Set CORS middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize and wire the dependency injection container
container = Container()
container.init_resources()
container.wire(modules=[
    # "app.api.v1.endpoints",
    # "app.api.v2.endpoints",
    "app.api.v1.routes",
    "app.api.v1.users.routes",
    "app.core.dependencies",
    "app.core.database",
    "app.repository",
    "app.services",
    "app.utils",
    "app.models",
    "app.core.config",
    "app.core.container",
])

# Include routes
app.include_router(v1_routers, prefix=configs.API_V1_STR)
#app.include_router(v2_routers, prefix=configs.API_V2_STR)

# Initialize tables
Base.metadata.create_all(bind=configs.engine)

@app.get("/docs/oauth2-redirect")
async def get_swagger_ui_oauth2_redirect_html():
    return get_swagger_ui_oauth2_redirect_html()



# Default Units Creation Function
def create_default_units():
    site = configs.db.query(SiteTable).filter(SiteTable.site_name == "default_site").first()
    if site is None:
        site = SiteTable()
        site.site_name = "default_site"
        site.status = "Production"
        if InsertDBData(site) == 200:
            print("   Default Site Added", file=sys.stderr)

    else:
        print("   Default Site Found", file=sys.stderr)

    rack = configs.db.query(RackTable).filter(RackTable.rack_name == "default_rack").first()
    if rack is None:
        rack = RackTable()
        rack.rack_name = "default_rack"
        rack.site_id = site.site_id
        rack.status = "Production"
        if InsertDBData(rack) == 200:
            print("   Default rack Added", file=sys.stderr)
    else:
        print("   Default Rack Found", file=sys.stderr)

    password = configs.db.query(PasswordGroupTable).filter(
        PasswordGroupTable.password_group == "default_password").first()
    if password is None:
        password = PasswordGroupTable()
        password.password_group = "default_password"
        password.password_group_type = "SSH"
        password.username = "NA"
        password.password = "NA"
        if InsertDBData(password) == 200:
            print("   Default Password Group Added", file=sys.stderr)
    else:
        print("   Default Password Found", file=sys.stderr)

# Run default units creation
while True:
    try:
        print("\n** Setting Up Default Units...\n", file=sys.stderr)
        create_default_units()
        print("\n** Default Setup Complete...\n", file=sys.stderr)
        break
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print("Trying again in 10 seconds...", file=sys.stderr)
        time.sleep(10)








# Run the application with uvicorn
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8080, reload=True, debug=True, loop="asyncio")











