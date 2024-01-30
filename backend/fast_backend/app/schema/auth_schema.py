from datetime import datetime
from pydantic import BaseModel
from app.schema.users_schema import *


class SignInNew(BaseModel):
    user_name: str
    password: str


class SignIn(BaseModel):
    email__eq: str
    password: str


class SignUp(BaseModel):
    email: str
    password: str
    name: str
    role: str


class Payload(BaseModel):
    user_id: int
    email_address: str
    name: str
    is_superuser: bool

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "email_address": self.email_address,
            "name": self.name,
            "is_superuser": self.is_superuser,
            # Convert other complex types to basic types if necessary
        }


class SignInResponse(BaseModel):
    data:dict
    messgae:str
