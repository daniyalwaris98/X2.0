from datetime import datetime
import base64
import json
import sys


def DecodeLicense(license_key):
    try:
        decoded_data = base64.b64decode(license_key)
        res = decoded_data.decode()

        res = f"{res}".replace("\'", "\"")
        print(res, file=sys.stderr)

        objDict = json.loads(res)

        company_name = objDict['company_name']
        start_date = datetime.strptime(objDict['start_date'], "%Y-%m-%d %H:%M:%S")
        end_date = datetime.strptime(objDict['end_date'], "%Y-%m-%d %H:%M:%S")

        return {
            "company_name": company_name,
            "start_date": start_date,
            "end_date": end_date
        }

    except Exception:
        return None
