from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

class DBM_Password_Group_Table(db.Model):
    __tablename__ = "dbm_password_group_table"
    password_group = db.Column(db.String(50), primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    

class Server_Table(db.Model):
    __tablename__ = "server_table"
    server_id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(50))
    server_name = db.Column(db.String(50))
    password_group = db.Column(db.String(50), ForeignKey("dbm_password_group_table.password_group"))
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns} 
        
