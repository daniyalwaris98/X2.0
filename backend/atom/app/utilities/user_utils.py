from app.utilities.db_utils import *
from app.license.license_decoder import *
import traceback


def addEndUserDetails(endUserObj, user_data, license_key):
    try:

        licenseObj = decodeLicense(license_key)

        if licenseObj is None:
            return "Invalid License Key", 500

        end_user = EndUserTable.query.first()

        update = True

        if end_user is None:
            end_user = EndUserTable()
            update = False
        else:
            if user_data['user_role'] != "Super_Admin":
                return "End User Details Can Only Be Updated By Super Admin", 500

        if 'company_name' in endUserObj.keys():
            if endUserObj['company_name'].strip() == "":
                return "Company Name Can Not Be Null", 500
            else:
                if update:
                    end_user_exist = EndUserTable.query.filter_by(company_name=endUserObj['company_name'].strip()).first()
                    if end_user_exist is None:
                        return "Company Name Can Not Be Updated", 500
                else:
                    end_user.company_name = endUserObj['company_name'].strip()
        else:
            return "Company Name Can Not Be Null", 500

        if 'po_box' in endUserObj.keys():
            if endUserObj['po_box'].strip() == "":
                return "PO Box Can Not Be Null", 500
            else:
                end_user.po_box = endUserObj['po_box'].strip()
        else:
            return "PO Box Can Not Be Null", 500

        if 'contact_person' in endUserObj.keys():
            if endUserObj['contact_person'].strip() == "":
                return "Contact Person Can Not Be Null", 500
            else:
                end_user.contact_person = endUserObj['contact_person'].strip()
        else:
            return "Contact Person Can Not Be Null", 500

        if 'contact_number' in endUserObj.keys():
            if endUserObj['contact_person'].strip() == "":
                return "Contact Number Can Not Be Null", 500
            else:
                end_user.contact_number = endUserObj['contact_number'].strip()
        else:
            return "Contact Number Can Not Be Null", 500

        if 'address' in endUserObj.keys():
            end_user.address = endUserObj['address']

        if 'country' in endUserObj.keys():
            end_user.country = endUserObj['country']

        if 'email' in endUserObj.keys():
            end_user.email = endUserObj['email']

        if 'domain_name' in endUserObj.keys():
            end_user.domain_name = endUserObj['domain_name']

        if 'industry_type' in endUserObj.keys():
            end_user.industry_type = endUserObj['industry_type']

        if update:
            status = UpdateDBData(end_user)
            if status == 200:
                return "End User Details Updated Successfully", status
            else:
                return "Error While Updating End User Details", status
        else:

            if end_user.company_name != licenseObj['company_name']:
                return "License Key Does Not Match With End-User", 500

            license_row = LicenseVerificationTable.query.first()
            if license_row is None:
                license_row = LicenseVerificationTable()
                license_row.company_name = licenseObj['company_name']
                license_row.license_verification_key = license_key
                license_row.start_date = licenseObj['start_date']
                license_row.end_date = licenseObj['end_date']

                UpdateDBData(license_row)

            end_user.license_id = license_row.license_id

            status = InsertDBData(end_user)
            if status == 200:
                return "End User Details Inserted Successfully", status
            else:
                return "Error While Inserting End User Details", status
    except Exception:
        traceback.print_exc()
        return "Server Error", 500


def addUserInDatabase(userObj, super_user):
    try:
        user = UserTable()

        #
        # user id can not be null or duplicate
        if 'user_id' in userObj.keys():
            user_id = userObj['user_id'].strip()

            if user_id != "":

                user_exists = UserTable.query.filter_by(user_id=user_id).first()
                if user_exists is None:
                    user.user_id = user_id
                else:
                    return "User Name Already Exists", 500

            else:
                return "User ID Can Not Be Null", 500

        else:
            return "User ID Can Not Be Null", 500

        #
        # email can be empty
        if 'email' in userObj.keys():
            email = userObj['email'].strip()
            user.email = email

        #
        # name can not be null
        if 'name' in userObj.keys():
            name = userObj['name'].strip()
            if name != "":
                user.name = name
            else:
                return "Name Can Not Be Null", 500
        else:
            return "Name Can Not Be Null", 500

        #
        # role can not be null and must exist in user roles
        if 'role' in userObj.keys():
            role = userObj['role'].strip()
            if role != "":

                role_exist = UserRolesTable.query.filter_by(role=role).first()
                if role_exist is not None:

                    if super_user:
                        if role_exist.role == 'Super_Admin':
                            user.role_id = role_exist.role_id
                        else:
                            return "Super Admin User Can Only Be Assigned With Super_Admin Role", 500
                    else:
                        if role_exist.role == 'Super_Admin':
                            return "Super_Admin Role Can Only Be Assigned To Super Admin User", 500
                        else:
                            user.role_id = role_exist.role_id
                else:
                    return "User Role Does Not Exist", 500

            else:
                return "User Role Can Not Be Null", 500
        elif super_user:
            role_exist = UserRolesTable.query.filter_by(role='Super_Admin').first()
            if role_exist is not None:
                user.role_id = role_exist.role_id
            else:
                return "Super User Role Does Not Exist", 500

        else:
            return "User Role Can Not Be Null", 500

        #
        # status can not be null and must be Active or InActive
        if 'status' in userObj.keys():
            status = userObj['status'].strip()
            if status != "":
                if status == "Active" or status == "InActive":

                    if super_user:
                        if status == "Active":
                            user.status = "Active"
                        else:
                            return "Super User Must Be Active", 500
                    else:
                        user.status = status
                else:
                    return "Status Must Be Active / InActive", 500
            else:
                return "Status Can Not Be Null", 500
        elif super_user:
            user.status = "Active"
        else:
            return "Status Can Not Be Null", 500

        #
        # account type can be empty
        if 'account_type' in userObj.keys():
            account_type = userObj['account_type'].strip()
            user.account_type = account_type

        #
        # password can not be null
        if 'password' in userObj.keys():
            password = userObj['password'].strip()
            if password != "":
                user.password = password
            else:
                return "Password Can Not Be Null", 500
        else:
            return "Password Can Not Be Null", 500

        #
        # team can be empty
        if 'team' in userObj.keys():
            team = userObj['team'].strip()
            user.team = team

        #
        # end user can not be null and must exist in end user table
        end_user = EndUserTable.query.first()

        if end_user is not None:
            user.end_user_id = end_user.end_user_id
        else:
            return "End User Does Not Exist", 500

        # check if super user
        if super_user:
            user.super_user = "True"

        # insert record
        status = InsertDBData(user)
        if status == 200:
            return "User Data Inserted Successfully", 200
        else:
            return "Error While Inserting User Data", 500
    except Exception:
        traceback.print_exc()
        return "Error While Inserting User Data", 500


#
#
#
#
# Edit User
def EditUserInDatabase(userObj, user_data):
    try:

        user = None

        #
        # user id can not be null or duplicate
        if 'user_id' in userObj.keys():
            user_id = userObj['user_id'].strip()

            if user_id != "":

                user = UserTable.query.filter_by(user_id=user_id).first()

            else:
                return "User ID Can Not Be Null", 500

        else:
            return "User ID Can Not Be Null", 500

        if user is None:
            return "User Does Not Exist", 500

        super_user = False
        if user.super_user == "True":
            super_user = True
            if user_data['user_role'] != "Super_Admin":
                return "Super Admin Data Can Only Be Updated By Super Admin", 500

        #
        # email can be empty
        if 'email' in userObj.keys():
            email = userObj['email'].strip()
            user.email = email

        #
        # name can not be null
        if 'name' in userObj.keys():
            name = userObj['name'].strip()
            if name != "":
                user.name = name
            else:
                return "Name Can Not Be Null", 500

        #
        # role can not be null and must exist in user roles
        if 'role' in userObj.keys():
            role = userObj['role'].strip()
            if role != "":

                role_exist = UserRolesTable.query.filter_by(role=role).first()
                if role_exist is not None:

                    if super_user:
                        if role_exist.role == 'Super_Admin':
                            user.role_id = role_exist.role_id
                        else:
                            return "Super Admin User Can Only Be Assigned With Super_Admin Role", 500
                    else:
                        if role_exist.role == 'Super_Admin':
                            return "Super_Admin Role Can Only Be Assigned To Super Admin User", 500
                        else:
                            user.role_id = role_exist.role_id
                else:
                    return "User Role Does Not Exist", 500

            else:
                return "User Role Can Not Be Null", 500

        #
        # status can not be null and must be Active or InActive
        if 'status' in userObj.keys():
            status = userObj['status'].strip()
            if status != "":
                if status == "Active" or status == "InActive":

                    if super_user:
                        if status == "Active":
                            user.status = "Active"
                        else:
                            return "Super User Must Be Active", 500
                    else:
                        user.status = status
                else:
                    return "Status Must Be Active / InActive", 500
            else:
                return "Status Can Not Be Null", 500

        #
        # account type can be empty
        if 'account_type' in userObj.keys():
            account_type = userObj['account_type'].strip()
            user.account_type = account_type

        #
        # password can not be null
        if 'password' in userObj.keys():
            password = userObj['password'].strip()
            if password != "":
                user.password = password
            else:
                return "Password Can Not Be Null", 500
        else:
            return "Password Can Not Be Null", 500

        #
        # team can be empty
        if 'team' in userObj.keys():
            team = userObj['team'].strip()
            user.team = team

        #
        # end user can not be null and must exist in end user table
        end_user = EndUserTable.query.first()

        if end_user is not None:
            user.end_user_id = end_user.end_user_id
        else:
            return "End User Does Not Exist", 500

        # update record
        status = UpdateDBData(user)
        if status == 200:
            return "User Data Updated Successfully", 200
        else:
            return "Error While Updating User Data", 500
    except Exception:
        traceback.print_exc()
        return "Error While Updating User Data", 500


def addUserRoleInDatabase(roleObj):
    try:
        role = UserRolesTable()

        #
        # role can not be null or duplicate
        if 'role' in roleObj.keys():
            role_id = roleObj['role'].strip()

            if role_id != "":

                role_exists = UserRolesTable.query.filter_by(role_id=role_id).first()
                if role_exists is None:
                    role.role_id = role_id
                else:
                    return "User Role Already Exists", 500

            else:
                return "User Role Can Not Be Null", 500

        else:
            return "User Role Can Not Be Null", 500

        #
        if 'configuration' in roleObj.keys():
            configuration = roleObj['configuration'].strip()
            if configuration != "":
                role.configuration = configuration
            else:
                return "User Configuration Can Not Be Null", 500
        else:
            return "User Configuration Can Not Be Null", 500

        #
        # insert record
        status = InsertDBData(role)
        if status == 200:
            return "User Role Inserted Successfully", 200
        else:
            return "Error While Inserting User Role", 500
    except Exception:
        traceback.print_exc()
        return "Error While Inserting User Role", 500


def EditUserRoleInDatabase(roleObj):
    try:

        user_role = None

        #
        # user id can not be null or duplicate
        if 'role' in roleObj.keys():
            role = roleObj['role'].strip()

            if role != "":

                user_role = UserRolesTable.query.filter_by(role=role).first()

            else:
                return "User Role Can Not Be Null", 500

        else:
            return "User Role Can Not Be Null", 500

        if user_role is None:
            return "User Role Does Not Exist", 500

        if user_role.role == "Super_Admin":
            return "Super_Admin Role Can Not Be Updated", 500

        #
        if 'configuration' in roleObj.keys():
            configuration = roleObj['configuration'].strip()
            if configuration != "":
                role.configuration = configuration
            else:
                return "User Configuration Can Not Be Null", 500
        else:
            return "User Configuration Can Not Be Null", 500

        #
        # insert record
        status = UpdateDBData(user_role)
        if status == 200:
            return "User Role Updated Successfully", 200
        else:
            return "Error While Updating User Role", 500
    except Exception:
        traceback.print_exc()
        return "Error While Updating User Role", 500
