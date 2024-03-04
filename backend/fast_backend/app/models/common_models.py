from datetime import datetime

from sqlalchemy import ForeignKey, Column, Boolean, Integer, String, DateTime, Date

from app.core.config import Base


class FailedDevicesTable(Base):
    __tablename__ = 'failed_devices_table'
    failure_id = Column(Integer, primary_key=True)
    ip_address = Column(String(50), nullable=False)
    device_type = Column(String(50), nullable=False)
    date = Column(DateTime, default=datetime.now(), nullable=False)
    failure_reason = Column(String(2000), nullable=False)
    module = Column(String(50), nullable=False)



class FucntionStateTable(Base):
    __tablename__ = 'function_state_table'

    function_state_id = Column(Integer, primary_key=True, autoincrement=True)
    function_name = Column(String(255))
    running = Column(Boolean)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    def as_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = str(value)
        return data