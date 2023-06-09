import smtplib
from pathlib import Path
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
from email import encoders
import traceback
import sys
from app import db






def send_mail(send_from, send_to, subject, message, files=[],
              server="smtp.office365.com", port=587, username='', password='',
              use_tls=True):
    """Compose and send email with provided info and attachments.

    Args:
        send_from (str): from name
        send_to (list[str]): to name(s)
        subject (str): message title
        message (str): message body
        files (list[str]): list of file paths to be attached to email
        server (str): mail server host name
        port (int): port number
        username (str): server auth username
        password (str): server auth password
        use_tls (bool): use TLS mode
    """


    msg = MIMEMultipart()
    msg['From'] = send_from
    msg['To'] = COMMASPACE.join(send_to)
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject

    msg.attach(MIMEText(message))

    for path in files:
        part = MIMEBase('application', "octet-stream")
        with open(path, 'rb') as file:
            part.set_payload(file.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition',
                        'attachment; filename={}'.format(Path(path).name))
        msg.attach(part)

    smtp = smtplib.SMTP(server, port)
    if use_tls:
        smtp.starttls()
    smtp.login(username, password)
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.quit()





def GenerateMailForCloudAlert(alert):
    print("\n### Generating Mails For Cloud Alerts ###\n", file=sys.stderr)
    try:

        mailQuery = "select * from mail_credentials where status = 'active'"
        mail_cred = db.session.execute(mailQuery).fetchone()
        if mail_cred is None:
            return
        mail_cred = dict(mail_cred)
        print("\n---> Active Mail Credentials <---\n", file=sys.stderr)
        print(mail_cred, file=sys.stderr)

        msg = f"""
        SERVEICE NAME  : {alert['service_name']}
        SERVICE KEY    : {alert['service_key']}
        ACCOUNT LABEL  : {alert['account_label']}

        Alert Level    : {alert['level']}
        Alert Type     : {alert['type']}
        Description    : {alert['description']}
        Date/Time      : {alert['time']}
        """

        try:
            query = "select * from alert_recipents_table where `CATEGORY`='Cloud' and `STATUS`='Active';"
            recipents = []

            try:
                results = db.session.execute(query)
                for row in results:
                    recipents.append(row[1])
            except Exception as e:
                traceback.print_exc()
                print(e,file=sys.stderr)
                # recipents = [
                #     'hamza.zahid@nets-international.com',
                #     'muhammad.naseem@nets-international.com',
                # ]

            subject = f"MonetX - NEW Cloud Alert | {alert['service_name']} | {alert['level']}"
            if alert['status'] == 'Clear':
                subject = f"MonetX - Cloud Alert CLEARED | {alert['service_name']} | {alert['level']}"

            send_mail(
                send_from=mail_cred['MAIL'],
                send_to=recipents,
                subject=subject,
                message=msg,
                username=mail_cred['MAIL'],
                password=mail_cred['PASSWORD'],
                server=mail_cred['SERVER']
            )
        except Exception as e:
            print("\n*** ERROR In Mail Generation ***\n")
            traceback.print_exc()
            print(f"\n{e}\n", file=sys.stderr)

    except Exception as e:
        print("\n*** ERROR In Mail Generation ***\n")
        traceback.print_exc()
        print(f"\n{e}\n", file=sys.stderr)