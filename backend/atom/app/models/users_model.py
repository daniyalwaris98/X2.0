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
    license_id = db.Column(db.Integer, primary_key=True)
    license_verification_key = db.Column(db.String(2500))
    company_name = db.Column(db.String(500))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class End_User_Table(db.Model):
    __tablename__ = "end_user_table"
    end_user_id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(500))
    po_box = db.Column(db.String(50))
    address = db.Column(db.String(2500))
    street_name = db.Column(db.String(500))
    city = db.Column(db.String(500))
    country = db.Column(db.String(500))
    contact_person = db.Column(db.String(500))
    contact_number = db.Column(db.String(500))
    email = db.Column(db.String(500))
    domain_name = db.Column(db.String(500))
    industry_type = db.Column(db.String(500))
    license_id = db.Column(
        db.Integer, ForeignKey("license_verification_table.license_id")
    )

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User_Roles_Table(db.Model):
    __tablename__ = "user_roles"
    role_id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50))
    configuration = db.Column(db.String(1500))

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class User_Table(db.Model):
    __tablename__ = "user_table"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))
    email = db.Column(db.String(50))
    name = db.Column(db.String(50))
    role_id = db.Column(db.Integer, ForeignKey("user_roles.role_id"))
    status = db.Column(db.String(10))
    account_type = db.Column(db.String(15))
    password = db.Column(db.String(512))
    last_login = db.Column(db.DateTime, default=datetime.now())
    team = db.Column(db.String(20))
    end_user_id = db.Column(db.Integer, ForeignKey("end_user_table.end_user_id"))
    super_user = db.Column(db.String(15), default="False")

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now()
    )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Login_Activity_Table(db.Model):
    __tablename__ = "login_activity_table"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))
    operation = db.Column(db.String(50))
    status = db.Column(db.String(50))
    description = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
