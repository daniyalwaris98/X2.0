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
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from base64 import urlsafe_b64encode, urlsafe_b64decode



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




def encrypt_data(data, key):
    # Convert Payload to a JSON string if it's not already a string
    if not isinstance(data, str):
        data = json.dumps(data.to_dict())

    block_size = 16
    # Pad the data to be a multiple of 16 bytes
    padded_data = data + (block_size - len(data) % block_size) * chr(block_size - len(data) % block_size)
    # Generate a random IV
    iv = os.urandom(block_size)
    # Create an AES cipher object
    cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
    # Encrypt the data
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data.encode('utf-8')) + encryptor.finalize()
    # Combine IV and encrypted data, and encode as URL-safe base64
    result = urlsafe_b64encode(iv + encrypted_data).decode('utf-8')
    return result

encryption_key = b'Sixteen byte key'
# def encrypt_data(data):
#     try:
#         # Convert Payload to a dictionary using to_dict method
#         if isinstance(data, Payload):
#             data = data.to_dict()
#
#         # Serialize the data to JSON
#         data_json = json.dumps(data)
#
#         # Encode the JSON string to bytes
#         data_bytes = data_json.encode()
#         encrypted_text = cipher_suite.encrypt(data_bytes)
#         return encrypted_text.decode()
#     except Exception as e:
#         traceback.print_exc()
#         print(f"Error occurred while encrypting data: {e}", file=sys.stderr)
#         return None

# def decrypt_data(encrypted_data):
#     if isinstance(encrypted_data, str):
#         encrypted_data = encrypted_data.encode()
#     decrypted_text = cipher_suite.decrypt(encrypted_data)
#     return decrypted_text.decode()


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
        print("sign in info is::::::::",sign_in_info,file=sys.stderr)
        print("found user is::::::::::::::::",found_user,file=sys.stderr)
        if not found_user.is_active:
            raise AuthError(detail="Account is not active")
        if not verify_password(sign_in_info.password, found_user.password):
            raise AuthError(detail="Incorrect username or password")
        delattr(found_user, "password")

        user_role_id = None
        configuration = None
        user_id = None
        role = None
        user_exsist = configs.db.query(UserTableModel).filter_by(user_name = sign_in_info.user_name).first()
        if user_exsist:
            print("user exesist sis:::",user_exsist,file=sys.stderr)
            user_id = user_exsist.id
            print("user id is::::::::::::::::::",user_id,file=sys.stderr)
        user_role = configs.db.query(UserRoleTableModel).filter_by(role = user_exsist.role).first()
        print("user role is:::",user_role)
        if user_role:
            role =user_role.role
            user_role_id = user_role.role_id
            configuration = user_role.configuration
            print("user role id :::::::::::::::::::",user_role_id,file=sys.stderr)
            print("confguration is :::::::::::::::::::", configuration, file=sys.stderr)

        else:
            user_role_id = None
        end_user_exsists = configs.db.query(EndUserTable).filter_by(end_user_id = user_exsist.end_user_id).first()
        if end_user_exsists:
            end_user_id = end_user_exsists.end_user_id
        else:
            return "No end user found"
        print("user role id is",user_role_id,file=sys.stderr)
        print("end user id is::::::::",end_user_id,file=sys.stderr)
        print("configuration is",configuration,file=sys.stderr)

        payload = Payload(
            user_id=found_user.id,
            email_address=found_user.email,
            name=found_user.name,
            is_superuser=found_user.is_superuser,
            user_role_id=user_role_id,
            end_user_id = end_user_id,
            configuration = configuration,
            role = role
        )
        print("payload is::::::::::::::",payload,file=sys.stderr)
        # encrypted_result = encrypt_data(payload)
        encrypted_data = encrypt_data(payload, encryption_key)
        print("encrypted result is:::::::::::::::::::::",encrypted_data,file=sys.stderr)
        print("encrypted result type is:::::::::::::",type(encrypted_data),file=sys.stderr)
        # decrypted = decrypt_data(encrypted_data)
        # print("Decrypted::::::::::::::::::;", decrypted,file=sys.stderr)
        subject_data = {"encrypted_data": encrypted_data}
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
        sign_in_data['message'] = message
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

        # Access attributes using dot notation
        print("user_info company name is:::",user_info.company_name,file=sys.stderr)
        end_user_id = None
        end_user_exist = configs.db.query(EndUserTable).filter_by(company_name=user_info.company_name).first()
        if end_user_exist:
            end_user_id = end_user_exist.end_user_id
            print("end user id is:::::::::::::::",end_user_id,file=sys.stderr)


        role_id= None
        role_exsists = configs.db.query(UserRoleTableModel).filter_by(role = user_info.role).first()
        if role_exsists:
            role_id = role_exsists.role_id

        # Remove fields from user_data if they are being set explicitly
        # For example, if 'team', 'account_type', and 'status' are set explicitly, pop them from user_data
        team = user_data.pop('team', None)
        account_type = user_data.pop('account_type', None)
        status = user_data.pop('status', None)
        name = user_info.name
        user_name = user_info.name

        # Ensure all required fields are set correctly
        user = UserTableModel(
            is_active=True,
            is_superuser=False,
            user_token=user_token,
            role=role,
            teams=team,  # Set explicitly here
            account_type=account_type,
            status=status,
            end_user_id = end_user_id,
            name = name,
            user_name = user_name

        )

        user.password = get_password_hash(user_info.password)
        created_user = self.user_repository.create(user)
        delattr(created_user, "password")
        return created_user

    def blacklist_token(self, email: str, token: str):
        blacklisted_token = BlacklistedToken(email=email, token=token)
        self.blacklisted_token_repository.create(blacklisted_token)
