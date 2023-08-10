from app.uam.uam_utils import *


def FormatDate(date):
    result = datetime(2000, 1, 1)
    try:
        result = date.strftime("%d-%m-%Y")
    except Exception:
        traceback.print_exc()
    return result

def GetAllRacks():
	rackObjList = []
	results = db.session.query(Rack_Table, Site_Table) \
		.join(Site_Table, Rack_Table.site_id == Site_Table.site_id).all()
	for result in results:
		rackObj, siteObj = result
		rackDataDict = {'rack_id': rackObj.rack_id, 'rack_name': rackObj.rack_name,
						'site_name': siteObj.site_name, 'serial_number': rackObj.serial_number,
						'manufacturer_date': FormatDate(rackObj.manufacturer_date),
						'unit_position': rackObj.unit_position,
						'creation_date': FormatDate(rackObj.creation_date),
						'modification_date': FormatDate(rackObj.modification_date), 'status': rackObj.status,
						'ru': rackObj.ru, 'rfs_date': FormatDate(rackObj.rfs_date), 'height': rackObj.height,
						'width': rackObj.width, 'pn_code': rackObj.pn_code, 'rack_model': rackObj.rack_model,
						'brand': rackObj.floor}
		rackObjList.append(rackDataDict)
	
	return rackObjList


def GetRackDetailsByRackName(rackName):
	rackObjList = []
	try:
		results = db.session.query(Rack_Table, Site_Table) \
			.join(Site_Table, Rack_Table.site_id == Site_Table.site_id).filter(Rack_Table.rack_name==rackName).all()
		for result in results:
			try:

				rackObj, siteObj = result
				rackDataDict = {'rack_id': rackObj.rack_id, 'rack_name': rackObj.rack_name,
								'site_name': siteObj.site_name, 'serial_number': rackObj.serial_number,
								'manufacturer_date': FormatDate(rackObj.manufacturer_date),
								'unit_position': rackObj.unit_position,
								'creation_date': FormatDate(rackObj.creation_date),
								'modification_date': FormatDate(rackObj.modification_date), 'status': rackObj.status,
								'ru': rackObj.ru, 'rfs_date': FormatDate(rackObj.rfs_date), 'height': rackObj.height,
								'width': rackObj.width, 'pn_code': rackObj.pn_code, 'rack_model': rackObj.rack_model,
								'brand': rackObj.floor}
				rackObjList.append(rackDataDict)

			except Exception:
				traceback.print_exc()
	except Exception:
		traceback.print_exc()
	
	return rackObjList




def AddRack(rackObj, update):
	try:
		if "rack_name" not in rackObj.keys():
			return "Rack Name Can Not Be Empty", 500
		
		if rackObj["rack_name"] is None:
			return "Rack Name Can Not Be Empty", 500
		
		rackObj["rack_name"] = rackObj["rack_name"].strip()

		if rackObj["rack_name"] == "":
			return "Rack Name Can Not Be Empty", 500
		
		rack_exist = Rack_Table.query.filter_by(rack_name=rackObj["rack_name"]).first()
		if update:
			if rack_exist is None:
				return "Rack Does Not Exist", 500
		else:
			if rack_exist is not None:
				return "Rack Already Exists", 500
			
			rack_exist = Rack_Table()
			rack_exist.rack_name = rackObj["rack_name"]

		if "site_name" not in rackObj.keys():
			return "Site Name Can Not Be Empty", 500
		
		if rackObj["site_name"] is None:
			return "Site Name Can Not Be Empty", 500
		
		rackObj["site_name"] = rackObj["site_name"].strip()

		if rackObj["site_name"] == "":
			return "Site Name Can Not Be Empty", 500

		site_exist = Site_Table.query.filter_by(site_name=rackObj["site_name"]).first()
		if site_exist is None:
			return "Site Does Not Exist", 500
		
		rack_exist.site_id = site_exist.site_id
		
		if 'status' not in rackObj.keys():
			return "Status Must Be Defined", 500
		
		if rackObj["status"] is None:
			return "Status Must Be Defined", 500
		
		rackObj["status"] = rackObj["status"].strip()

		if rackObj["status"] == "":
			return "Status Must Be Defined (Production / Not Production)", 500
		
		if rackObj["status"].title() != "Production" and rackObj["status"].title() != "Not Production":
			return "Status Must Be Defined (Production / Not Production)", 500
		
		rack_exist.status = rackObj['status']

		if "ru" in rackObj.keys():
			if rackObj["ru"] is not None:
				try:
					rack_exist.ru = int(rackObj["ru"])
				except Exception:
					rack_exist.ru = None
		
		if "height" in rackObj.keys():
			if rackObj["height"] is not None:
				try:
					rack_exist.height = int(rackObj["height"])
				except Exception:
					rack_exist.height = None
		
		if "width" in rackObj.keys():
			if rackObj["width"] is not None:
				try:
					rack_exist.width = int(rackObj["width"])
				except Exception:
					rack_exist.width = None

		if "serial_number" in rackObj.keys():
			if rackObj["serial_number"] is not None:
				rack_exist.serial_number = rackObj["serial_number"]
		
		if "rack_model" in rackObj.keys():
			if rackObj["rack_model"] is not None:
				rack_exist.rack_model = rackObj["rack_model"]

		if "floor" in rackObj.keys():
			if rackObj["floor"] is not None:
				rack_exist.floor = rackObj["floor"]

				
		msg = ""
		status = 500
		if update:
			status = UpdateDBData(rack_exist)
			if status == 200:
				msg = "Rack Updated Successfully"
			else:
				msg = "Error While Updating Rack"
		else:
			status = InsertDBData(rack_exist)
			if status == 200:
				msg = "Rack Inserted Successfully"
			else:
				msg = "Error While Inserting Rack"
		
		return msg, status
	
	except Exception:
		traceback.print_exc()
		return "Server Error", 500
	


def DeleteRack(rackNames):
	try:
		successList = []
		errorList = []
		for rackName in rackNames:
			try:
				rack = Rack_Table.query.filter_by(rack_name=rackName).first()
				if rack is None:
					errorList.append(f"{rackName} : Rack Does Not Exist")
					continue
				
				device = Atom_Table.query.filter_by(rack_id=rack.rack_id).first()
				if device is not None:
					errorList.append(f"{rackName} : Rack Is Assigned In Atom")
					continue

				status = DeleteDBData(rack)
				if status == 200:
					successList.append(f"{rackName} : Rack Deleted Successfully")
				else:
					errorList.append(f"{rackName} : Error While Deleting Rack")
				
			except Exception:
				traceback.print_exc()
				errorList.append(f"{rackName} : Error While Deleting Rack")
		
		responseDict = {
            "success": len(successList),
            "error": len(errorList),
            "error_list": errorList,
            "success_list": successList
        }

		return responseDict, 200
	except Exception:
		traceback.print_exc()
		return "Server Error", 500