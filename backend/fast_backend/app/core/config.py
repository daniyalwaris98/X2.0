import traceback

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager
import os
from dotenv import load_dotenv
from typing import List
from starlette.templating import Jinja2Templates
from influxdb_client import InfluxDBClient

# Load environment variables
load_dotenv()
ENV: str = ""
class Configs:
    # Base configuration
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

    # Date format configuration
    DATETIME_FORMAT: str = "%Y-%m-%dT%H:%M:%S"
    DATE_FORMAT: str = "%Y-%m-%d"

    # Authentication configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    # CORS configuration
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Database configuration
    DB: str = os.getenv("DB", "mysql")
    DB_USER: str = os.getenv("DB_USER")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD")
    DB_HOST: str = os.getenv("DB_HOST")
    DB_PORT: str = os.getenv("DB_PORT", "3306")
    DB_ENGINE: str = DB_ENGINE_MAPPER.get(DB, "mysql")

    DATABASE_URL = "mysql+pymysql://root:As123456?@updated_atom_db:3306/AtomDB"

    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = scoped_session(SessionLocal)
    metadata = MetaData()

    # Pagination configuration
    PAGE = 1
    PAGE_SIZE = 20
    ORDERING = "-id"

    # InfluxDB configuration
    IN_TOKEN: str = "nItzto4Hc22kXuLsawB76lhKPM-wbK1DAQc7uBiFpYUCntoHDE6TC-uGeezzx7S89fyClKv2YXLfDi15Ujhn5A=="
    IN_ORG: str = "monetx"
    IN_BUCKET: str = "monitoring"
    IN_URL: str = "http://updated_influx_db:8086"
    client: InfluxDBClient = InfluxDBClient(url=IN_URL, token=IN_TOKEN)

    templates = Jinja2Templates(directory="/app/templates")

    @staticmethod
    def get_db_session():
        """Retrieve the database session."""
        return Configs.db

    @contextmanager
    def session_scope(self, refresh_all: bool = False, instances: list = None):
        """
        Provide a transactional scope around a series of operations.

        Parameters:
        - refresh_all: If True, refreshes all persistent instances in the session.
        - instances: Optional list of specific instances to refresh. This is ignored if refresh_all is True.
        """
        session = Configs.db()  # Assuming Configs.db is a scoped_session
        try:
            yield session
            if refresh_all:
                # Assuming `session` is an actual Session instance here
                for instance in session:
                    session.refresh(instance)
            elif instances:
                for instance in instances:
                    session.refresh(instance)
            session.commit()
        except Exception as e:
            session.rollback()
            traceback.print_exc()
            raise e
        finally:
            # Scoped_session's remove() method is intended to clear the session
            # for the current scope/thread, not necessarily to close it immediately.
            # Use it if you're done with the session in this context.
            # session.close()  # Typically, you don't close a scoped session here
            Configs.db.remove()

    @staticmethod
    def init_app(app):
            """
            Initialize the application with configurations for SQLAlchemy.
            This method should be called with your Flask or other framework's app instance.
            """

            @app.teardown_appcontext
            def cleanup_context(exception=None):
                Configs.db.remove()  # Clean up the session at the end of each request


class Config:
    case_sensitive = True

# Additional Configurations for Testing
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


