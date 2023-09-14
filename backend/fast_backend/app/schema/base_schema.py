from enum import Enum
from pydantic import BaseModel, Field


class SummeryResponseSchema(BaseModel):
    def __getitem__(self, key):
        return getattr(self, key, None)

    def __setitem__(self, key, value):
        return setattr(self, key, value)

    success: int
    error: int
    success_list: list[str]
    error_list: list[str]
