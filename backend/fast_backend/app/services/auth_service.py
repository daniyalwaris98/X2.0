import traceback
from datetime import timedelta
from typing import List
import json
from app.core.config import configs
from app.core.exceptions import AuthError
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.users_models import UserTableModel
from app.repository.user_repository import UserRepository
from app.schema.auth_schema import Payload, SignIn, SignUp
from app.schema.users_schema import FindUser
from app.services.base_service import BaseService
from app.utils.hash import get_rand_hash
from app.models.users_models import *

from app.models.blacklisted_token import BlacklistedToken

from app.repository import blacklisted_token_repository

from app.repository.blacklisted_token_repository import BlacklistedTokenRepository

from app.schema.auth_schema import SignInNew
from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
key = os.getenv("KEY")
print("key loaded from the env is:::::::::::",key,file=sys.stderr)
if key is None:
    raise ValueError("No FERNET_KEY found in .env file")


# key = Fernet.generate_key()
# print("key generated is:::::::::::::::",key,file=sys.stderr)
cipher_suite = Fernet(key)
print("cypher suite is::::::::::::::::::::",cipher_suite,file=sys.stderr)

def encrypt_data(data):
    try:
        # Convert Payload to a dictionary using to_dict method
        if isinstance(data, Payload):
            data = data.to_dict()

        # Serialize the data to JSON
        data_json = json.dumps(data)

        # Encode the JSON string to bytes
        data_bytes = data_json.encode()
        encrypted_text = cipher_suite.encrypt(data_bytes)
        return encrypted_text.decode()
    except Exception as e:
        traceback.print_exc()
        print(f"Error occurred while encrypting data: {e}", file=sys.stderr)
        return None

def decrypt_data(encrypted_data):
    if isinstance(encrypted_data, str):
        encrypted_data = encrypted_data.encode()
    decrypted_text = cipher_suite.decrypt(encrypted_data)
    return decrypted_text.decode()


class AuthService(BaseService):
    def __init__(self, user_repository: UserRepository, blacklisted_token_repository: BlacklistedTokenRepository):
        self.user_repository = user_repository
        super().__init__(user_repository)
        self.blacklisted_token_repository = blacklisted_token_repository

    def sign_in(self, sign_in_info: SignInNew):
        sign_in_data ={}
        find_user = FindUser()
        find_user.user_name = sign_in_info.user_name
        user: List[UserTableModel] = self.user_repository.read_by_options(find_user)["founds"]
        if len(user) < 1:
            raise AuthError(detail="Incorrect username or password")
        found_user = user[0]
        if not found_user.is_active:
            raise AuthError(detail="Account is not active")
        if not verify_password(sign_in_info.password, found_user.password):
            raise AuthError(detail="Incorrect username or password")
        delattr(found_user, "password")

        # user_role_id,end_user_id = None
        # user_role = configs.db.query(UserRoleTableModel).filter_by(role_id = found_user.role).first()
        # if user_role:
        #     user_role_id = user_role.role_id
        # else:
        #     return "No user role found"
        # end_user_exsists = configs.db.query(EndUserTable).filter_by(end_user_id = found_user.end_user_id).first()
        # if end_user_exsists:
        #     end_user_id = end_user_exsists.end_user_id
        # else:
        #     return "No end user found"

        payload = Payload(
            user_id=found_user.id,
            email_address=found_user.email,
            name=found_user.name,
            is_superuser=found_user.is_superuser,
            # user_role_id=user_role_id,
            # end_user_id = end_user_id
        )
        encrypted_result = encrypt_data(payload)
        print("encrypted result is:::::::::::::::::::::",encrypted_result,file=sys.stderr)
        print("encrypted result type is:::::::::::::",type(encrypted_result),file=sys.stderr)
        # decrypted = decrypt_data(encrypted_result)
        # print("Decrypted::::::::::::::::::;", decrypted,file=sys.stderr)
        subject_data = {"encrypted_data": encrypted_result}
        token_lifespan = timedelta(minutes=configs.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token, expiration_datetime = create_access_token(subject_data, token_lifespan)
        print("access token is:::::::::::::::::::",file=sys.stderr)
        print("expiration token is:::::::::::::::",expiration_datetime,file=sys.stderr)
        data = {
            "access_token": access_token,
            "expiration_datetime":expiration_datetime
        }
        message = f"Successfully logged in as {found_user.name}"
        sign_in_data['data'] = data
        sign_in_data['messgae'] = message
        # sign_in_result = {
        #     "access_token": access_token,
        #     "expiration": expiration_datetime,
        #     "user_info": found_user,
        print("sign in data::::::::::::;",sign_in_data,file=sys.stderr)
        # }
        return sign_in_data

    def sign_up(self, user_info: SignUp):
        user_token = get_rand_hash()
        user_data = user_info.dict(exclude_none=True)
        role = user_data.pop('role', 'user')
        user = UserTableModel(
            **user_data,
            is_active=True,
            is_superuser=False,
            user_token=user_token,
            role=role
        )
        print("USERRRRRR", user)
        user.password = get_password_hash(user_info.password)

        created_user = self.user_repository.create(user)

        delattr(created_user, "password")

        return created_user

    def blacklist_token(self, email: str, token: str):
        blacklisted_token = BlacklistedToken(email=email, token=token)
        self.blacklisted_token_repository.create(blacklisted_token)
