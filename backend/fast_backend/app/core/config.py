from influxdb_client import InfluxDBClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from typing import List

from dotenv import load_dotenv
# from pydantic import BaseSettings


load_dotenv()

ENV: str = ""


class Configs:
    # base
    ENV: str = os.getenv("ENV", "dev")
    API: str = "/api"
    API_V1_STR: str = "/api/v1"
    API_V2_STR: str = "/api/v2"
    PROJECT_NAME: str = "MonetX 2.0"
    ENV_DATABASE_MAPPER: dict = {
        "prod": "fca",
        "stage": "stage-fca",
        "dev": "dev-fca",
        "test": "test-fca",
    }
    DB_ENGINE_MAPPER: dict = {
        "postgresql": "postgresql",
        "mysql": "mysql+pymysql",
    }

    PROJECT_ROOT: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # date
    DATETIME_FORMAT: str = "%Y-%m-%dT%H:%M:%S"
    DATE_FORMAT: str = "%Y-%m-%d"

    # auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 60 minutes * 24 hours * 30 days = 30 days

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # database
    DB: str = os.getenv("DB", "mysql")
    DB_USER: str = os.getenv("DB_USER")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: str = os.getenv("DB_PORT", "3306")
    DB_ENGINE: str = DB_ENGINE_MAPPER.get(DB, "mysql")

    # DATABASE_URI_FORMAT: str = "{db_engine}://{user}:{password}@{host}:{port}/{database}"

    DATABASE_URL = "mysql+pymysql://root:As123456?@updated_atom_db:3306/AtomDB"
    # DATABASE_URL = "mysql+pymysql://root:As123456?@localhost:3306/AtomDB"

    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    # find query
    PAGE = 1
    PAGE_SIZE = 20
    ORDERING = "-id"

    IN_TOKEN: str = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
    IN_ORG: str = "monetx"
    IN_BUCKET: str = "monitoring"
    IN_URL: str = "http://localhost:8086"
    client: str = InfluxDBClient(url=IN_URL, token=IN_TOKEN)

    class Config:
        case_sensitive = True


class TestConfigs(Configs):
    ENV: str = "test"


configs = Configs()
Base = declarative_base()

if ENV == "prod":
    pass
elif ENV == "stage":
    pass
elif ENV == "test":
    setting = TestConfigs()
