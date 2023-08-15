from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

#
#
#

# ** License, End User, User, User Role Models **

#
#
#


class License_Verification_Table(db.Model):
    __tablename__ = "license_verification_table"
    license_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    license_verification_key = db.Column(db.String(2500), nullable=False)
    company_name = db.Column(db.String(500), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class End_User_Table(db.Model):
    __tablename__ = "end_user_table"
    end_user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_name = db.Column(db.String(500), nullable=False)
    po_box = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(2500), nullable=True)
    street_name = db.Column(db.String(500), nullable=True)
    city = db.Column(db.String(500), nullable=True)
    country = db.Column(db.String(500), nullable=True)
    contact_person = db.Column(db.String(500), nullable=False)
    contact_number = db.Column(db.String(500), nullable=False)
    email = db.Column(db.String(500), nullable=True)
    domain_name = db.Column(db.String(500), nullable=True)
    industry_type = db.Column(db.String(500), nullable=True)
    license_id = db.Column(
        db.Integer, ForeignKey("license_verification_table.license_id", ondelete='SET NULL', onupdate='CASCADE'), nullable=True
    )

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User_Roles_Table(db.Model):
    __tablename__ = "user_roles"
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role = db.Column(db.String(50), nullable=False)
    configuration = db.Column(db.String(5000), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User_Table(db.Model):
    __tablename__ = "user_table"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, ForeignKey("user_roles.role_id", ondelete='SET NULL', onupdate='CASCADE'), nullable=True)
    end_user_id = db.Column(
        db.Integer, ForeignKey("end_user_table.end_user_id", ondelete='SET NULL', onupdate='CASCADE'), nullable=True
    )

    user_id = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(512), nullable=False)
    super_user = db.Column(db.String(15), default="False", nullable=False)

    email = db.Column(db.String(50), nullable=True)
    account_type = db.Column(db.String(15), nullable=True)
    last_login = db.Column(db.DateTime, default=datetime.now(), nullable=True)
    team = db.Column(db.String(20), nullable=True)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Login_Activity_Table(db.Model):
    __tablename__ = "login_activity_table"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(50), nullable=False)
    operation = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now(), nullable=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
