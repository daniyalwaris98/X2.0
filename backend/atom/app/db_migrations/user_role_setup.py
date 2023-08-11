from app.models.users_model import *
from app.utilities.db_utils import *


def setup_user_role():
    try:
        configuration = (
            '"{\\"dashboard\\":{\\"view\\":true,\\"pages\\":{\\"dashboard\\":{'
            '\\"view\\":true,\\"read_only\\":false}}},\\"atom\\":{\\"view\\":true,'
            '\\"pages\\":{\\"atom\\":{\\"view\\":true,\\"read_only\\":false},'
            '\\"password_group\\":{\\"view\\":true,\\"read_only\\":false}}},\\"ncm\\":{'
            '\\"view\\":true,\\"pages\\":{\\"dashboard\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"config_data\\":{\\"view\\":true,'
            '\\"read_only\\":false}}},\\"uam\\":{\\"view\\":true,\\"pages\\":{'
            '\\"sites\\":{\\"view\\":true,\\"read_only\\":false},\\"racks\\":{'
            '\\"view\\":true,\\"read_only\\":false},\\"devices\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"modules\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"sfps\\":{\\"view\\":true,\\"read_only\\":false},'
            '\\"hwlifecycle\\":{\\"view\\":true,\\"read_only\\":false},\\"aps\\":{'
            '\\"view\\":true,\\"read_only\\":false},\\"license\\":{\\"view\\":true,'
            '\\"read_only\\":false}}},\\"ipam\\":{\\"view\\":true,\\"pages\\":{'
            '\\"dashboard\\":{\\"view\\":true,\\"read_only\\":false},\\"devices\\":{'
            '\\"view\\":true,\\"read_only\\":false},\\"devices_subnet\\":{'
            '\\"view\\":true,\\"read_only\\":false},\\"subnet\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"ip_detail\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"discover_subnet\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"ip_history\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"dns_server\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"dns_zones\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"dns_records\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"vpi\\":{\\"view\\":true,\\"read_only\\":false},'
            '\\"loadbalancer\\":{\\"view\\":true,\\"read_only\\":false},'
            '\\"firewall\\":{\\"view\\":true,\\"read_only\\":false}}},'
            '\\"monitering\\":{\\"view\\":true,\\"pages\\":{\\"monitering\\":{'
            '\\"view\\":true,\\"read_only\\":false},\\"device\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"network\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"router\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"switches\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"firewall\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"wireless\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"server\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"windows\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"linux\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"alerts\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"cloud\\":{\\"view\\":true,'
            '\\"read_only\\":false},\\"credentials\\":{\\"view\\":true,'
            '\\"read_only\\":false}}},\\"dcm\\":{\\"view\\":true,\\"pages\\":{'
            '\\"dashboard\\":{\\"view\\":true,\\"read_only\\":false},\\"devices\\":{'
            '\\"view\\":true,\\"read_only\\":false}}},\\"admin\\":{\\"view\\":true,'
            '\\"pages\\":{\\"admin\\":{\\"view\\":true,\\"read_only\\":false},'
            '\\"show_member\\":{\\"view\\":true,\\"read_only\\":false},\\"role\\":{'
            '\\"view\\":true,\\"read_only\\":false},\\"failed_devices\\":{'
            '\\"view\\":true,\\"read_only\\":false}}}}"'
        )

        user_role = User_Roles_Table.query.filter_by(role="Super_Admin").first()

        if user_role is None:
            user_role = User_Roles_Table()
            user_role.role = "Super_Admin"
            user_role.configuration

            if InsertDBData(user_role) == 200:
                print("** Super Admin Role Inserted **", file=sys.stderr)
            else:
                print("** Error : Can Not Insert Super Admin Role **", file=sys.stderr)

        else:
            print("** Super Admin Role Already Exists **", file=sys.stderr)

            user_role.configuration = configuration

            if UpdateDBData(user_role) == 200:
                print("** Super Admin Role Updated **", file=sys.stderr)
            else:
                print("** Error : Can Not Update Super Admin Role **", file=sys.stderr)

        return False
    except Exception:
        traceback.print_exc()
        return True
