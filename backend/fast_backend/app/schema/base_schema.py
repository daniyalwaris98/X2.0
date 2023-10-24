from enum import Enum
from pydantic import BaseModel, Field


class BaseSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)


class SummeryResponseSchema(BaseSchema):
    success: int
    error: int
    success_list: list[str]
    error_list: list[str]


class NameValueListOfDictResponseSchema(BaseSchema):
    name: str
    value: int


class NameValueDictResponseSchema(BaseSchema):
    name: list[str | int | None]
    value: list[str | int | None]


class IpAddressRequestSchema(BaseSchema):
    ip_address: str
