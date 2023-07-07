from app import db
from sqlalchemy import ForeignKey
from datetime import datetime

class Atom_Transition_Table(db.Model):
    __tablename__ = 'atom_transition_table'
    atom_id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(50))
    rack_name = db.Column(db.String(50))
    device_name = db.Column(db.String(50))
    ip_address = db.Column(db.String(50))
    vendor = db.Column(db.String(50))
    device_ru = db.Column(db.String(50))
    department = db.Column(db.String(50))
    section = db.Column(db.String(50))
    criticality = db.Column(db.String(20))
    function = db.Column(db.String(50))
    domain = db.Column(db.String(50))
    virtual = db.Column(db.String(20))
    device_type = db.Column(db.String(50))
    password_group = db.Column(db.String(50))
    onboard_status = db.Column(db.String(50))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class LicenseVerificationTable(db.Model):
    __tablename__ = 'license_verification_table'
    license_id = db.Column(db.Integer, primary_key=True)
    license_verification_key = db.Column(db.String(2500))
    company_name = db.Column(db.String(500))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(db.DateTime, default=datetime.now())

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class EndUserTable(db.Model):
    __tablename__ = 'end_user_table'
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
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now())
    license_id = db.Column(db.Integer, ForeignKey(
        'license_verification_table.license_id'))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class UserRolesTable(db.Model):
    __tablename__ = 'user_roles'
    role_id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50))
    configuration = db.Column(db.String(1500))
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now())

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class UserTable(db.Model):
    __tablename__ = 'user_table'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))
    email = db.Column(db.String(50))
    name = db.Column(db.String(50))
    role_id = db.Column(db.Integer, ForeignKey('user_roles.role_id'))
    status = db.Column(db.String(10))
    account_type = db.Column(db.String(15))
    password = db.Column(db.String(512))
    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(
        db.DateTime, default=datetime.now(), onupdate=datetime.now())
    last_login = db.Column(db.DateTime, default=datetime.now())
    team = db.Column(db.String(20))
    end_user_id = db.Column(
        db.Integer, ForeignKey('end_user_table.end_user_id'))
    super_user = db.Column(db.String(15), default="False")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class LoginActivityTable(db.Model):
    __tablename__ = 'login_activity_table'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50))
    operation = db.Column(db.String(50))
    status = db.Column(db.String(50))
    description = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class PasswordGroupTable(db.Model):
    __tablename__ = 'password_group_table'
    password_group = db.Column(db.String(50), primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    secret_password = db.Column(db.String(50))
    password_group_type = db.Column(db.String(50))


class SiteTable(db.Model):
    __tablename__ = 'site_table'
    site_id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(50))
    region_name = db.Column(db.String(50))
    latitude = db.Column(db.String(70))
    longitude = db.Column(db.String(70))
    city = db.Column(db.String(50))
    status = db.Column(db.String(50))
    total_count = db.Column(db.Integer)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class RackTable(db.Model):
    __tablename__ = 'rack_table'
    rack_id = db.Column(db.Integer, primary_key=True)
    rack_name = db.Column(db.String(50))
    site_id = db.Column(db.Integer, ForeignKey('site_table.site_id'))
    serial_number = db.Column(db.String(50))
    manufacturer_date = db.Column(db.Date, default=datetime(2000, 1, 1))
    unit_position = db.Column(db.String(20))
    status = db.Column(db.String(50))
    ru = db.Column(db.String(50))
    rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
    height = db.Column(db.Integer)
    width = db.Column(db.Integer)
    depth = db.Column(db.Integer)
    pn_code = db.Column(db.String(50))
    rack_model = db.Column(db.String(50))
    floor = db.Column(db.String(50))
    total_count = db.Column(db.Integer)

    creation_date = db.Column(db.DateTime, default=datetime.now())
    modification_date = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class AtomTable(db.Model):
    __tablename__ = 'atom_table'
    atom_id = db.Column(db.Integer, primary_key=True)
    rack_id = db.Column(db.String(50), ForeignKey('rack_table.rack_id'))
    device_name = db.Column(db.String(50))
    ip_address = db.Column(db.String(50))
    device_ru = db.Column(db.String(50))
    department = db.Column(db.String(50))
    section = db.Column(db.String(50))
    criticality = db.Column(db.String(20))
    function = db.Column(db.String(50))
    domain = db.Column(db.String(50))
    virtual = db.Column(db.String(20))
    device_type = db.Column(db.String(50))
    password_group = db.Column(db.String(50), ForeignKey('password_group_table.password_group'))
    onboard_status = db.Column(db.String(50))
    inserted = db.Column(db.Integer)
    updated = db.Column(db.Integer)
    exception = db.Column(db.Integer)
    scop = db.Column(db.String(50), default='Atom')

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



# class Device_Table(db.Model):
#     __tablename__ = 'device_table'
#     device_name = db.Column(db.String(150), primary_key=True)
#     site_name = db.Column(db.String(50))
#     rack_name = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     software_type = db.Column(db.String(50))
#     software_version = db.Column(db.String(50))
#     patch_version = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     status = db.Column(db.String(50))
#     ru = db.Column(db.String(50))
#     department = db.Column(db.String(50))
#     section = db.Column(db.String(50))
#     criticality = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     domain = db.Column(db.String(50))
#     manufacturer = db.Column(db.String(50))
#     hw_eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     hw_eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     sw_eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     sw_eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     virtual = db.Column(db.String(20))
#     rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     authentication = db.Column(db.String(10))
#     serial_number = db.Column(db.String(50))
#     pn_code = db.Column(db.String(50))
#     subrack_id_number = db.Column(db.String(50))
#     manufacturer_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     hardware_version = db.Column(db.String(50))
#     max_power = db.Column(db.String(50))
#     site_type = db.Column(db.String(50))
#     source = db.Column(db.String(50))
#     stack = db.Column(db.String(50))
#     contract_number = db.Column(db.String(50))
#     contract_expiry = db.Column(db.Date, default=datetime(2022, 12, 31))
#     uptime = db.Column(db.Date, default=datetime(2000, 1, 1, 1, 1, 1))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class Board_Table(db.Model):
#     __tablename__ = 'board_table'
#     board_id = db.Column(db.Integer, primary_key=True)
#     board_name = db.Column(db.String(250))
#     device_name = db.Column(
#         db.String(150))
#     hardware_version = db.Column(db.String(50))
#     device_slot_id = db.Column(db.String(50))
#     software_version = db.Column(db.String(50))
#     serial_number = db.Column(db.String(50))
#     manufacturer_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     status = db.Column(db.String(50))
#     eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     pn_code = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class Subboard_Table(db.Model):
#     __tablename__ = 'subboard_table'
#     subboard_id = db.Column(db.Integer, primary_key=True)
#     subboard_name = db.Column(db.String(250))
#     device_name = db.Column(
#         db.String(150))
#     subboard_type = db.Column(db.String(150))
#     subrack_id = db.Column(db.String(250))
#     slot_number = db.Column(db.String(250))
#     subslot_number = db.Column(db.String(250))
#     hardware_version = db.Column(db.String(50))
#     software_version = db.Column(db.String(50))
#     serial_number = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     status = db.Column(db.String(50))
#     eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     pn_code = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class Sfps_Table(db.Model):
#     __tablename__ = 'sfp_table'
#     sfp_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(
#         db.String(150))
#     media_type = db.Column(db.String(50))
#     port_name = db.Column(db.String(250))
#     port_type = db.Column(db.String(50))
#     connector = db.Column(db.String(50))
#     mode = db.Column(db.String(50))
#     speed = db.Column(db.String(50))
#     wavelength = db.Column(db.String(50))
#     manufacturer = db.Column(db.String(250))
#     optical_direction_type = db.Column(db.String(50))
#     pn_code = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     status = db.Column(db.String(50))
#     eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     serial_number = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class License_Table(db.Model):
#     __tablename__ = 'license_table'
#     license_name = db.Column(db.String(250), primary_key=True)
#     license_description = db.Column(db.String(250))
#     device_name = db.Column(
#         db.String(150))
#     rfs_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     activation_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     expiry_date = db.Column(db.Date, default=datetime(2000, 1, 1))
#     grace_period = db.Column(db.String(10))
#     serial_number = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     status = db.Column(db.String(50))
#     capacity = db.Column(db.String(50))
#     usage = db.Column(db.String(50))
#     pn_code = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class IPAM_TABLE(db.Model):
#     __tablename__ = 'ipam_table'
#     id = db.Column(db.Integer, primary_key=True)
#     region_name = db.Column(db.String(50))
#     site_name = db.Column(db.String(50))
#     site_type = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     subnet_mask = db.Column(db.String(50))
#     subnet = db.Column(db.String(50))
#     interface_name = db.Column(db.String(50))
#     protocol_status = db.Column(db.String(50))
#     admin_status = db.Column(db.String(50))
#     vlan = db.Column(db.String(50))
#     description = db.Column(db.String(1000))
#     vlan_name = db.Column(db.String(50))
#     virtual_ip = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     management_ip = db.Column(db.String(50))


# class DC_CAPACITY(db.Model):
#     __tablename__ = 'dc_capacity'
#     dc_capacity_id = db.Column(db.Integer, primary_key=True)
#     device_ip = db.Column(db.String(50))
#     site_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     os_version = db.Column(db.String(50))
#     total_1g_ports = db.Column(db.Integer)
#     total_10g_ports = db.Column(db.Integer)
#     total_25g_ports = db.Column(db.Integer)
#     total_40g_ports = db.Column(db.Integer)
#     total_100g_ports = db.Column(db.Integer)
#     total_fast_ethernet_ports = db.Column(db.Integer)
#     connected_1g = db.Column(db.Integer)
#     connected_10g = db.Column(db.Integer)
#     connected_25g = db.Column(db.Integer)
#     connected_40g = db.Column(db.Integer)
#     connected_100g = db.Column(db.Integer)
#     connected_fast_ethernet = db.Column(db.Integer)
#     not_connected_1g = db.Column(db.Integer)
#     not_connected_10g = db.Column(db.Integer)
#     not_connected_25g = db.Column(db.Integer)
#     not_connected_40g = db.Column(db.Integer)
#     not_connected_100g = db.Column(db.Integer)
#     not_connected_fast_ethernet = db.Column(db.Integer)
#     unused_sfps_1g = db.Column(db.Integer)
#     unused_sfps_10g = db.Column(db.Integer)
#     unused_sfps_25g = db.Column(db.Integer)
#     unused_sfps_40g = db.Column(db.Integer)
#     unused_sfps_100g = db.Column(db.Integer)
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())


# class SNTC_TABLE(db.Model):
#     __tablename__ = 'sntc_table'
#     sntc_id = db.Column(db.Integer, primary_key=True)
#     pn_code = db.Column(db.String(50))
#     hw_eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     hw_eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     sw_eos_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     sw_eol_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     manufacturer_date = db.Column(db.Date, default=datetime(2030, 1, 1))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())


# class FAILED_DEVICES_TABLE(db.Model):
#     __tablename__ = 'failed_devices_table'
#     failure_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     failure_reason = db.Column(db.String(2000))
#     module = db.Column(db.String(50))


# class IPAM_DEVICES_TABLE(db.Model):
#     __tablename__ = 'ipam_devices_table'
#     ipam_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     password_group = db.Column(db.String(50))
#     source = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))


# class IPAM_DEVICES_FETCH_TABLE(db.Model):
#     __tablename__ = 'ipam_devices_fetch_table'
#     ipam_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     interface = db.Column(db.String(50))
#     interface_ip = db.Column(db.String(50))
#     subnet = db.Column(db.String(50))
#     subnet_mask = db.Column(db.String(50))
#     interface_description = db.Column(db.String(1000))
#     virtual_ip = db.Column(db.String(50))
#     vlan = db.Column(db.String(50))
#     vlan_number = db.Column(db.String(50))
#     interface_status = db.Column(db.String(50))
#     fetch_date = db.Column(db.DateTime, default=datetime.now())
#     size = db.Column(db.String(50))
#     subnet_name = db.Column(db.String(50))
#     discovered = db.Column(db.String(50))


# class SUBNET_DATA_TABLE(db.Model):
#     __tablename__ = 'subnet_data_table'
#     subnet_id = db.Column(db.Integer, primary_key=True)
#     subnet = db.Column(db.String(50))
#     subnet_mask = db.Column(db.String(50))
#     subnet_name = db.Column(db.String(50))
#     location = db.Column(db.String(50))


# class SUBNET_DISPLAY_TABLE(db.Model):
#     __tablename__ = 'subnet_display_table'
#     subnet_id = db.Column(db.Integer, primary_key=True)
#     subnet_address = db.Column(db.String(50))
#     subnet_name = db.Column(db.String(50))
#     subnet_mask = db.Column(db.String(50))
#     size = db.Column(db.String(50))
#     usage = db.Column(db.String(50))
#     location = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     discover_from = db.Column(db.String(50))
#     scan_date = db.Column(db.String(50))


# class IP_TABLE(db.Model):
#     __tablename__ = 'ip_table'
#     ip_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     subnet = db.Column(db.String(50))
#     mac_address = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     asset_tag = db.Column(db.String(50))
#     configuration_switch = db.Column(db.String(50))
#     configuration_interface = db.Column(db.String(50))
#     open_ports = db.Column(db.String(500))
#     ip_to_dns = db.Column(db.String(50))
#     dns_to_ip = db.Column(db.String(50))
#     vip = db.Column(db.String(500))


# class IP_HISTORY_TABLE(db.Model):
#     __tablename__ = 'ip_history_table'
#     ip_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     mac_address = db.Column(db.String(50))
#     asset_tag = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now(),
#                      onupdate=datetime.now())


# class IP_DETAILS_HISTORY_TABLE(db.Model):
#     __tablename__ = 'ip_details_history_table'
#     ip_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now(),
#                      onupdate=datetime.now())


# class ADD_DNS_TABLE(db.Model):
#     __tablename__ = 'add_dns_table'
#     dns_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     server_name = db.Column(db.String(50))
#     username = db.Column(db.String(50))
#     password = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class DNS_SERVERS(db.Model):
#     __tablename__ = 'dns_servers'
#     dns_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     server_name = db.Column(db.String(50))
#     type = db.Column(db.String(50))
#     number_of_zones = db.Column(db.Integer)

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class DNS_ZONES(db.Model):
#     __tablename__ = 'dns_zones'
#     dns_id = db.Column(db.Integer, primary_key=True)
#     zone_name = db.Column(db.String(50))
#     zone_status = db.Column(db.String(50))
#     zone_type = db.Column(db.String(50))
#     lookup_type = db.Column(db.String(50))
#     server_name = db.Column(db.String(50))
#     server_type = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class DNS_SERVERS_RECORD(db.Model):
#     __tablename__ = 'dns_servers_record'
#     dns_id = db.Column(db.Integer, primary_key=True)
#     zone_name = db.Column(db.String(50))
#     name = db.Column(db.String(200))
#     type = db.Column(db.String(50))
#     data = db.Column(db.String(200))
#     server_name = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class INVENTORY_SCRIPTS_STATUS(db.Model):
#     __tablename__ = 'inventory_scripts_status'
#     id = db.Column(db.Integer, primary_key=True)
#     script = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_CREDENTIALS_TABLE(db.Model):
#     __tablename__ = 'monitoring_credentials_table'
#     credentials_id = db.Column(db.Integer, primary_key=True)
#     category = db.Column(db.String(100))
#     credentials = db.Column(db.String(100))
#     profile_name = db.Column(db.String(250))
#     description = db.Column(db.String(250))
#     ip_address = db.Column(db.String(50))
#     snmp_read_community = db.Column(db.String(50))
#     snmp_port = db.Column(db.String(100))
#     username = db.Column(db.String(100))
#     password = db.Column(db.String(100))
#     encryption_password = db.Column(db.String(100))
#     authentication_method = db.Column(db.String(50))
#     encryption_method = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_devices_table'
#     monitoring_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     source = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     active = db.Column(db.String(50))
#     status = db.Column(db.String(40))
#     active_id = db.Column(db.String(80))
#     credentials = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_heatmap = db.Column(db.String(40))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_NETWORK_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_network_devices_table'
#     device_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_NETWORK_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_network_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_ROUTERS_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_routers_devices_table'
#     device_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_ROUTERS_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_routers_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_SWITCHES_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_switches_devices_table'
#     device_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_SWITCHES_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_switches_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_FIREWALLS_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_firewalls_devices_table'
#     device_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_FIREWALLS_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_firewalls_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_WIRELESS_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_wireless_devices_table'
#     device_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     total_joined_aps = db.Column(db.String(50))
#     total_clients = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_WIRELESS_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_wireless_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_SERVERS_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_servers_devices_table'
#     server_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_SERVERS_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_servers_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_WINDOWS_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_windows_devices_table'
#     server_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_WINDOWS_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_windows_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_LINUX_DEVICES_TABLE(db.Model):
#     __tablename__ = 'monitoring_linux_devices_table'
#     server_id = db.Column(db.Integer, primary_key=True)
#     device_name = db.Column(db.String(50))
#     status = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))
#     interfaces = db.Column(db.String(50))
#     discovered_time = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     device_description = db.Column(db.String(2000))
#     cpu = db.Column(db.String(50))
#     memory = db.Column(db.String(50))
#     packets_loss = db.Column(db.String(50))
#     response_time = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class MONITORING_LINUX_INTERFACES_TABLE(db.Model):
#     __tablename__ = 'monitoring_linux_interfaces_table'
#     interface_id = db.Column(db.Integer, primary_key=True)
#     interface_name = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     upload_speed = db.Column(db.String(50))
#     download_speed = db.Column(db.String(50))
#     ip_address = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     interface_status = db.Column(db.String(50))
#     interface_description = db.Column(db.String(2000))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class ALERTS_TABLE(db.Model):
#     __tablename__ = 'alerts_table'
#     alert_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     description = db.Column(db.String(2000))
#     alert_type = db.Column(db.String(50))
#     category = db.Column(db.String(50))
#     alert_status = db.Column(db.String(50))
#     mail_status = db.Column(db.String(50))
#     start_date = db.Column(db.DateTime, default=datetime.now())
#     date = db.Column(db.DateTime, default=datetime.now())
#     function = db.Column(db.String(50))

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class ALERTS_HISTORY_TABLE(db.Model):
#     __tablename__ = 'alerts_history_table'
#     alert_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     description = db.Column(db.String(2000))
#     alert_type = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     mail_status = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# class APS_TABLE(db.Model):
#     __tablename__ = 'aps_table'
#     ap_id = db.Column(db.Integer, primary_key=True)
#     controller_name = db.Column(db.String(50))
#     ap_ip = db.Column(db.String(50))
#     ap_name = db.Column(db.String(50))
#     serial_number = db.Column(db.String(50))
#     ap_model = db.Column(db.String(50))
#     hardware_version = db.Column(db.String(50))
#     software_version = db.Column(db.String(50))
#     description = db.Column(db.String(200))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())


# class F5(db.Model):
#     __tablename__ = 'f5'
#     f5_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     vserver_name = db.Column(db.String(500))
#     vip = db.Column(db.String(50))
#     pool_name = db.Column(db.String(500))
#     pool_member = db.Column(db.String(500))
#     node = db.Column(db.String(500))
#     service_port = db.Column(db.String(500))
#     monitor_value = db.Column(db.String(500))
#     monitor_status = db.Column(db.String(500))
#     lb_method = db.Column(db.String(500))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     created_by = db.Column(db.String(50))
#     modified_by = db.Column(db.String(50))


# class FIREWALL_VIP(db.Model):
#     __tablename__ = 'firewall_vip'
#     firewall_vip_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     internal_ip = db.Column(db.String(500))
#     vip = db.Column(db.String(50))
#     sport = db.Column(db.String(500))
#     dport = db.Column(db.String(500))
#     extintf = db.Column(db.String(500))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())


# class NCM_TABLE(db.Model):
#     __tablename__ = 'ncm_table'
#     ncm_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     password_group = db.Column(db.String(50))
#     source = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(
#         db.DateTime, default=datetime.now(), onupdate=datetime.now())
#     status = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))


# class NCM_HISTORY_TABLE(db.Model):
#     __tablename__ = 'ncm_history_table'
#     ncm_id = db.Column(db.Integer, primary_key=True)
#     file_name = db.Column(db.String(50))
#     configuration_date = db.Column(db.DateTime, default=datetime.now())
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))
#     function = db.Column(db.String(50))
#     vendor = db.Column(db.String(50))


# class NCM_CONFIGURATION_STATUS_TABLE(db.Model):
#     __tablename__ = 'ncm_configuration_status_table'
#     ncm_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     success = db.Column(db.Integer)
#     failure = db.Column(db.Integer)
#     creation_date = db.Column(db.DateTime, default=datetime.now())


# class DC_CAPACITY_DEVICES_TABLE(db.Model):
#     __tablename__ = 'dc_capacity_devices_table'
#     dccm_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     password_group = db.Column(db.String(50))
#     source = db.Column(db.String(50))
#     device_name = db.Column(db.String(50))


# class AWS_CREDENTIALS(db.Model):
#     __tablename__ = 'aws_credentials_table'
#     access_key = db.Column(db.String(150), primary_key=True)
#     secrete_access_key = db.Column(db.String(150))
#     account_label = db.Column(db.String(100))


# class AWS_EC2(db.Model):
#     __tablename__ = 'aws_ec2_table'
#     id = db.Column(db.Integer, primary_key=True)
#     instance_id = db.Column(db.String(100))
#     instance_name = db.Column(db.String(100))
#     region_id = db.Column(db.String(100))
#     monitoring_status = db.Column(db.String(150), default='Disabled')
#     access_key = db.Column(db.String(150), ForeignKey(
#         'aws_credentials_table.access_key'))


# class AWS_S3(db.Model):
#     __tablename__ = 'aws_s3_table'
#     id = db.Column(db.Integer, primary_key=True)
#     bucket_name = db.Column(db.String(100))
#     region_id = db.Column(db.String(100))
#     monitoring_status = db.Column(db.String(150), default='Disabled')
#     access_key = db.Column(db.String(150), ForeignKey(
#         'aws_credentials_table.access_key'))


# class AWS_ELB(db.Model):
#     __tablename__ = 'aws_elb_table'
#     id = db.Column(db.Integer, primary_key=True)
#     lb_name = db.Column(db.String(100))
#     lb_type = db.Column(db.String(100))
#     lb_scheme = db.Column(db.String(100))
#     lb_arn = db.Column(db.String(300))
#     region_id = db.Column(db.String(100))
#     monitoring_status = db.Column(db.String(150), default='Disabled')
#     access_key = db.Column(db.String(150), ForeignKey(
#         'aws_credentials_table.access_key'))


# class AUTO_DISCOVERY_TABLE(db.Model):
#     __tablename__ = 'auto_discovery_table'
#     discovery_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     subnet = db.Column(db.String(50))
#     os_type = db.Column(db.String(500))
#     make_model = db.Column(db.String(500))
#     function = db.Column(db.String(500))
#     vendor = db.Column(db.String(500))
#     snmp_status = db.Column(db.String(50))
#     snmp_version = db.Column(db.String(50))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(db.DateTime, default=datetime.now())
#     ssh_status = db.Column(db.String(50))
#     snmp_status = db.Column(db.String(50))


# class AUTO_DISCOVERY_NETWORK_TABLE(db.Model):
#     __tablename__ = 'auto_discovery_network_table'
#     network_id = db.Column(db.Integer, primary_key=True)
#     network_name = db.Column(db.String(50))
#     subnet = db.Column(db.String(50))
#     no_of_devices = db.Column(db.Integer)
#     scan_status = db.Column(db.String(50))
#     excluded_ip_range = db.Column(db.String(200))
#     creation_date = db.Column(db.DateTime, default=datetime.now())
#     modification_date = db.Column(db.DateTime, default=datetime.now())


# class SNMP_CREDENTIALS_TABLE(db.Model):
#     __tablename__ = 'snmp_credentials_table'
#     credentials_id = db.Column(db.Integer, primary_key=True)
#     category = db.Column(db.String(100))
#     credentials = db.Column(db.String(100))
#     profile_name = db.Column(db.String(250))
#     description = db.Column(db.String(250))
#     ip_address = db.Column(db.String(50))
#     snmp_read_community = db.Column(db.String(50))
#     snmp_port = db.Column(db.String(100))
#     username = db.Column(db.String(100))
#     password = db.Column(db.String(100))
#     encryption_password = db.Column(db.String(100))
#     authentication_method = db.Column(db.String(50))
#     encryption_method = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())

#     def as_dict(self):
#         return {c.name: getattr(self, c.name) for c in self.__table__.columns}
