from netmiko import Netmiko, ConnectHandler

from app.api.v1.ncm.utils.ncm_alarm_utils import *
from app.models.atom_models import *
from app.utils.db_utils import *
from app.utils.static_list import *


class NCMPuller(object):
    def __init__(self):
        self.response = ""
        self.status = 200

        self.atom = None
        self.credential = None
        self.ncm = None
        self.connection = None

    def setup_puller(self, ncm_obj):

        # Check NCM
        ncm = configs.db.query(NcmDeviceTable).filter(
            NcmDeviceTable.ncm_device_id == ncm_obj["ncm_device_id"]
        ).first()

        if ncm is None:
            self.response = (
                f"{ncm_obj['ncm_device_id']} : No Device Found In NCM With Device ID"
            )
            self.status = 400
            return

        elif ncm.status == "Inactive":
            self.response = f"{ncm_obj['ncm_device_id']} : Device Is InActive"
            self.status = 500
            return

        # Check Atom
        atom = configs.db.query(AtomTable).filter(
            AtomTable.atom_id == ncm.atom_id
        ).first()

        password = configs.db.query(PasswordGroupTable).filter(
            PasswordGroupTable.password_group_id == atom.password_group_id
        ).first()

        self.atom = atom
        self.credential = password
        self.ncm = ncm
        self.create_connection()

    def create_connection(self):
        print(f"\n\n{self.atom.ip_address} : Connecting...", file=sys.stderr)

        total_tries = 3
        telnet_tries = 0
        ssh_tries = 0
        login = False
        connection = None

        # Telnet Connect
        if self.credential.password_group_type == "Telnet":
            if self.atom.device_type not in device_type_telnet_dictionary.keys():
                self.response = (f"{self.atom.ip_address} : Telnet Support Not Available For "
                                 f"{self.atom.device_type}")
                self.status = 500
                return

            device_type = device_type_telnet_dictionary[self.atom.device_type]
            while telnet_tries < total_tries:
                try:
                    device = {
                        "device_type": device_type,
                        "ip": self.atom.ip_address,
                        "password": self.credential.password,
                        "secret": self.credential.secret_password,
                        "port": 23,
                        "timeout": 300,
                    }

                    connection = ConnectHandler(**device)
                    print(
                        f"NCM - {self.atom.ip_address} : Telnet - Logged In Successfully",
                        file=sys.stderr,
                    )

                    login = True
                    break
                except Exception:
                    telnet_tries += 1
                    print(
                        f"NCM - {self.atom.ip_address} : Telnet - Failed to login",
                        file=sys.stderr,
                    )
                    traceback.print_exc()
        # SSH Connect
        else:
            if self.atom.device_type not in device_type_ssh_dictionary.keys():
                self.response = (f"{self.atom.ip_address} : SSH Support Not Available For "
                                 f"{self.atom.device_type}")
                self.status = 500
                return

            device_type = device_type_ssh_dictionary[self.atom.device_type]
            while ssh_tries < total_tries:
                try:
                    connection = Netmiko(
                        host=self.atom.ip_address,
                        username=self.credential.username,
                        password=self.credential.password,
                        device_type=device_type,
                        timeout=600,
                        global_delay_factor=2,
                        banner_timeout=300,
                    )

                    print(
                        f"NCM - {self.atom.ip_address} : SSH - Logged In Successfully",
                        file=sys.stderr,
                    )
                    login = True
                    break
                except Exception:
                    ssh_tries += 1
                    print(
                        f"NCM - {self.atom.ip_address} : SSH - Failed to login",
                        file=sys.stderr,
                    )
                    traceback.print_exc()

        if not login:
            self.status = 500
            self.response = f"{self.atom.ip_address} : Failed To Login"
            login_alarm(self.atom, self.ncm, login=False)
            return

            # addFailedDevice(
            #     host["ip_address"],
            #     current_time,
            #     host["device_type"],
            #     login_exception,
            #     "NCM")

        else:
            self.connection = connection
            login_alarm(self.atom, self.ncm, login=True)

    #
    # Method for NCM Remote Command Send
    #
    def send_remote_command(self, command):
        command_set = [command]
        self.run_puller(command_set)

    #
    # Method for NCM Config Backup
    #
    def backup_config(self):
        if self.atom.device_type not in ncm_command_list.keys():
            self.response = (f"{self.atom.ip_address} : NCM Commands Not Found For "
                             f"{self.atom.device_type}")
            self.status = 500
            return

        command_set = ncm_command_list[self.atom.device_type]
        self.run_puller(command_set)

        if self.status == 200:
            self.save_configuration()

        self.update_status()

    #
    # Method for getting command set output
    #
    def run_puller(self, command_set):
        successful_commands = []  # List to store successful commands
        failed_commands = []  # List to store failed commands and their associated errors
        command_output = ""  # Store the combined output of all commands

        try:
            self.connection.enable()

            for command in command_set:
                try:
                    output = self.connection.send_command(command)
                    successful_commands.append(command)
                    command_output += f"Command '{command}' executed successfully:\n\n"
                except Exception as e:
                    failed_commands.append((command, str(e)))
                    command_output += f"Command '{command}' failed to execute: {str(e)}\n\n"

            # try:
            #
            # except Exception as e:
            #     print(f"Error during disconnection: {str(e)}", file=sys.stderr)
            #     traceback.print_exc()

            self.status = 200
            self.response = command_output

        except Exception:
            traceback.print_exc()
            self.status = 500
            self.response = f"{self.atom.ip_address} : Failed To Send Command"

        # Log successful and failed commands for debugging
        print("Successful commands:", successful_commands, file=sys.stderr)
        print("Failed commands:", failed_commands, file=sys.stderr)
        self.status = 200
        self.response = command_output

    #
    # Method to save configuration backup
    #
    def save_configuration(self):

        query_string = (f"SELECT file_name FROM ncm_history_table WHERE "
                        f"configuration_date=(SELECT MAX(configuration_date) FROM "
                        f"ncm_history_table WHERE ncm_device_id={self.ncm.ncm_device_id}) "
                        f"and ncm_device_id={self.ncm.ncm_device_id};")
        result = configs.db.execute(query_string)

        previous_file_name = None
        for row in result:
            previous_file_name = row[0]

        cwd = os.getcwd()
        if self.response is not None:
            previous_lines = None
            if previous_file_name is not None:
                try:

                    path = f"{cwd}/app/configuration_backups/{previous_file_name}"
                    existing_path = os.path.exists(path)
                    if existing_path:
                        f = open(path, "r")
                        previous_lines = f.readlines()
                    else:
                        query = (f"DELETE FROM ncm_history_table WHERE file_name = "
                                 f"{previous_file_name};")
                        configs.db.execute(query)
                        configs.db.commit()
                except Exception:
                    pass

                previous_output = ""

                if previous_lines is not None:
                    length = len(previous_lines)
                    count = 0
                    for line in previous_lines:
                        previous_output += line
                        count += 1
                        if count < length:
                            previous_output += "\n"

                if previous_output == self.response:
                    msg = f"{self.atom.ip_address} : Configuration Already Exists"
                    print(msg, file=sys.stderr)
                    self.response = msg
                    self.status = 500
                    return
                else:
                    config_change_alarm(self.atom, self.ncm)

            print(
                f"{self.atom.ip_address} : Configuration Change Found",
                file=sys.stderr,
            )

            current_time = str(datetime.now())
            string_time = current_time.replace(":", ".")

            file_name = (
                f"{self.atom.ip_address}_{self.atom.device_name}_{string_time}.cfg"
            )
            directory = f"{cwd}/app/configuration_backups/"
            if not os.path.exists(directory):
                os.makedirs(directory)
            print("directoy is::::::::::",directory,file=sys.stderr)

            path = f"{cwd}/app/configuration_backups/{file_name}"
            f = open(path, "w")
            f.write(self.response)
            f.close()

            print(
                f"{self.atom.ip_address} : BACKUP GENERATED FOR DEVICE {self.atom.device_name} "
                f"at {current_time}",
                file=sys.stderr,
            )

            ncm_history = NCM_History_Table()
            ncm_history.ncm_device_id = self.ncm.ncm_device_id
            ncm_history.configuration_date = current_time
            ncm_history.file_name = file_name

            InsertDBData(ncm_history)

            print(
                f"{file_name} INSERTED SUCCESSFULLY TO THE NCM HISTORY TABLE AT {current_time}",
                file=sys.stderr,
            )

            self.ncm.config_change_date = current_time
            UpdateDBData(self.ncm)

            self.response = "Configuration Backup Successful"
            self.connection.disconnect()
    def update_status(self):
        try:
            if self.status == 200:
                self.ncm.backup_status = True
            else:
                self.ncm.backup_status = False

            UpdateDBData(self.ncm)
        except Exception:
            traceback.print_exc()


print("values in ncm ")
print("changint the file ")