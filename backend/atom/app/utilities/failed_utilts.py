
def addFailedDevice(ip, date, device_type, failure_reason, module):
    pass
    # failed = FAILED_DEVICES_TABLE()
    # failed.ip_address = ip
    # failed.date = date
    # failed.device_type = device_type
    # failed.failure_reason = failure_reason
    # failed.module = module
    # if FAILED_DEVICES_TABLE.query.with_entities(FAILED_DEVICES_TABLE.ip_address).filter_by(ip_address=ip) is not None:

    #     print("Updated "+ip, file=sys.stderr)
    #     UpdateData(failed)
    # else:
    #     print("Inserted ", ip, file=sys.stderr)
    #     InsertData(failed)