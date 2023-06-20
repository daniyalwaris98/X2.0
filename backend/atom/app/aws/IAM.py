from app.aws import AWS
from datetime import datetime, timedelta
import os
from app import client, db
from influxdb_client.client.write_api import SYNCHRONOUS, ASYNCHRONOUS
import sys
import traceback


class IAM(AWS.AWS):
    def __init__(self, access_key, secret_key, account_label):
        super().__init__(access_key, secret_key, account_label)

    def GetUsers(self):
        if self.session is None:
            return None

        user_list = []

        try:
            iam = self.session.client('iam')
            users = iam.list_users()['Users']

            # Loop through each user and extract their details
            for user in users:
                try:

                    # Get the user's last activity
                    last_activity = 'Never'
                    last_activity_type = 'None'
                    access_keys = iam.list_access_keys(UserName=user['UserName'])[
                        'AccessKeyMetadata']

                    key_age = None
                    key_login = None
                    for key in access_keys:

                        if key['Status'] == 'Active':

                            key_last_used = iam.get_access_key_last_used(
                                AccessKeyId=key['AccessKeyId'])
                            key_last_date = key_last_used.get(
                                'AccessKeyLastUsed', {}).get('LastUsedDate')
                            key_create_date = key_last_used.get(
                                'AccessKeyCreateDate', {}).get('CreateDate')

                            if key_age is None:
                                if key_create_date:
                                    key_age = datetime.utcnow() - key_last_used.replace(tzinfo=None)
                                else:
                                    key_age = datetime.utcnow() - \
                                        key['CreateDate'].replace(tzinfo=None)

                                if key_age.total_seconds() < 60:
                                    key_age = "Now"
                                elif key_age.total_seconds() < 3600:
                                    key_age = int(key_age.total_seconds()/60)
                                    key_age = str(key_age)+" minutes"
                                elif key_age.total_seconds() < 86400:
                                    key_age = int(key_age.total_seconds()/3600)
                                    key_age = str(key_age)+" hours"
                                elif key_age.total_seconds() >= 86400:
                                    key_age = key_age.days
                                    key_age = str(key_age)+" days"

                            if key_login is None:
                                key_login = key_last_date

                    try:
                        console_login = (iam.get_user(UserName=user['UserName'])
                                         ['User']['PasswordLastUsed'])
                    except Exception as e:
                        console_login = None

                    if console_login is not None and key_login is not None:
                        if console_login > key_login:
                            last_activity = console_login
                            last_activity_type = "Console Login"
                        else:
                            last_activity = key_login
                            last_activity_type = "Key Login"
                    elif console_login is None and key_login is not None:
                        last_activity = key_login
                        last_activity_type = "Key Login"
                    elif key_login is None and console_login is not None:
                        last_activity = console_login
                        last_activity_type = "Console Login"

                    if last_activity != "Never":
                        last_activity = datetime.utcnow() - last_activity.replace(tzinfo=None)

                        if last_activity.total_seconds() < 60:
                            last_activity = "Now"
                        elif last_activity.total_seconds() < 3600:
                            last_activity = int(
                                last_activity.total_seconds()/60)
                            last_activity = str(last_activity)+" minutes"
                        elif last_activity.total_seconds() < 86400:
                            last_activity = int(
                                last_activity.total_seconds()/3600)
                            last_activity = str(last_activity)+" hours"
                        elif last_activity.total_seconds() >= 86400:
                            last_activity = last_activity.days
                            last_activity = str(last_activity)+" days"

                    # Get the age of the user's password
                    try:
                        password_last_changed = iam.get_login_profile(
                            UserName=user['UserName']).get('LoginProfile', {}).get('CreateDate')
                        password_age = (datetime.now() -
                                        password_last_changed.replace(tzinfo=None)).days
                    except Exception as e:
                        password_age = 'None'

                    if key_age is None:
                        key_age = "None"

                    userObj = {}
                    userObj['username'] = user['UserName']
                    userObj['status'] = key['Status']
                    userObj['last_login'] = last_activity
                    userObj['login_type'] = last_activity_type
                    userObj['password_age'] = password_age
                    userObj['key_age'] = key_age

                    # Print the user's details
                    print("\n")
                    print(
                        f"Username: {userObj['username']:<40}\nLast Login: {last_activity:<10}, Login Type: {last_activity_type:<15}, Password Age: {password_age:<5}, Active Key Age: {key_age:<5}")

                    user_list.append(userObj)

                except Exception as e:
                    traceback.print_exc()
        except Exception as e:
            traceback.print_exc()

        return user_list

    # Method to get all the roles from AWS Account
    def GetRoles(self):
        if self.session is None:
            return None

        rolesList = []

        try:
            iam = self.session.client('iam')
            roles = iam.list_roles()['Roles']
            # Loop through each role and extract the relevant information
            for role in roles:
                # Get the role name
                role_name = role['RoleName']

                # Get the trusted entities for the role
                trusted_entities = []
                for policy in role['AssumeRolePolicyDocument']['Statement']:
                    # trusted_entities.extend(policy['Principal'].keys())
                    for key in policy['Principal'].keys():
                        trusted_entities.append(
                            key+" : "+policy['Principal'][key])

                rolesList.append({'role_name': role_name,
                                  'entity': ', '.join(trusted_entities)})

                print(f"Role name: {role_name}")
                print(f"Trusted entities: {', '.join(trusted_entities)}")
                print("=" * 50)

            return rolesList
        except Exception as e:
            traceback.print_exc()
            return None

    def GetGroups(self):
        if self.session is None:
            return None
        
        groupList = []

        try:
            iam = self.session.client('iam')

            # Get a list of all groups
            groups = iam.list_groups()['Groups']

            # Loop through each group and print the group name
            for group in groups:
                group_name = group['GroupName']
                create_date = group['CreateDate'].strftime('%Y-%m-%d %H:%M:%S')
                
                group_info = iam.get_group(GroupName=group_name)
                group_users = group_info['Users']

                userList =[]
                for user in group_users:
                    userDict = {'username':user['UserName'],
                                'creation_date':user['CreateDate'].strftime('%Y-%m-%d %H:%M:%S'),
                                'last_login':user['PasswordLastUsed'].strftime('%Y-%m-%d %H:%M:%S')}
                    userList.append(userDict)

                # Retrieve the group's policies
                attached_policies = iam.list_attached_group_policies(GroupName=group_name)['AttachedPolicies']
                inline_policies = iam.list_group_policies(GroupName=group_name)['PolicyNames']

                policyList =[]
                for policy in attached_policies:
                    policy_arn = policy['PolicyArn']
                    policy_description = iam.get_policy(PolicyArn=policy_arn)['Policy']['Description']
                    policy_type = 'AWS Managed' if policy_arn.startswith('arn:aws:iam::aws:policy/') else 'Custom'
                    
                    policyDict = {'policy_name':policy['PolicyName'],
                                    'policy_type':policy_type,
                                    'policy_description':policy_description
                                    }
                    policyList.append(policyDict)

                print(f"\nGroup: {group_name}")
                print(f"\nCreation Time: {create_date}")
                print(f"\nUsers: {userList}")
                print(f"\nPolicy: {policyList}")
                print("=" * 50)

                groupDict = {
                    'group_name':group_name,
                    'creation_date':create_date,
                    'utilities' : userList,
                    'policis': policyList
                }

                groupList.append(groupDict)

            return groupList
        except Exception as e:
            traceback.print_exc()
            return None
        
    