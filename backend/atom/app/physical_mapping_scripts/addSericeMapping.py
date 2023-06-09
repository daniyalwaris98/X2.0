import sys
from app.models.phy_mapping_models import EDN_SERVICE_MAPPING, IGW_SERVICE_MAPPING, EDN_MAC_LEGACY, EDN_LLDP_ACI, IGW_LLDP_ACI
from app import db, phy_engine

class AddServiceMapping():
    def UpdateData(self, obj):
        #add data to db
        #print(obj, file=sys.stderr)
        try:
            db.session.flush()
            db.session.merge(obj)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            print(f"Something else went wrong during Database Update {e}", file=sys.stderr)
        
        return True


    def addEdnMacLegacyServiceMapping(self, current_time):
        try:
            ednMacLegacyObjs = EDN_MAC_LEGACY.query.filter_by(creation_date=current_time).all()
            
            if ednMacLegacyObjs:

                for ednMacLegacyObj in ednMacLegacyObjs: 
                    #ednServiceMappingObjectLongest = EDN_SERVICE_MAPPING.query.filter(EDN_SERVICE_MAPPING.device_a_name==ednMacLegacyObj.device_a_name).filter(EDN_SERVICE_MAPPING.device_a_interface==ednMacLegacyObj.device_a_interface).filter(EDN_SERVICE_MAPPING.device_b_ip==ednMacLegacyObj.device_b_ip).filter(EDN_SERVICE_MAPPING.device_b_mac==ednMacLegacyObj.device_b_mac).first()
                    ednServiceMappingObjectLongest = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='')  and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);")                    
                    next=0
                    if ednServiceMappingObjectLongest:
                        #print(f"SELECT * FROM edn_service_mapping WHERE device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}'  and device_b_mac= '{ednMacLegacyObj.device_b_mac}'" , file=sys.stderr)

                        for row in ednServiceMappingObjectLongest:
                            #print(f"1111111111  {row}", file=sys.stderr)
                            ednMacLegacyObj.device_b_system_name= row[4]
                            ednMacLegacyObj.device_b_type= row[5]
                            ednMacLegacyObj.server_name= row[0]
                            ednMacLegacyObj.owner_name= row[1]
                            ednMacLegacyObj.owner_contact= row[2]
                            ednMacLegacyObj.owner_email= row[3]
                            ednMacLegacyObj.server_os= row[6]
                            ednMacLegacyObj.app_name= row[7]
                            print("Updating Service Mapping Data")
                            next=1
                            print(f"L {ednMacLegacyObj}  SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='')  and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);", file=sys.stderr)
                            self.UpdateData(ednMacLegacyObj)
                            #self.addServiceDatatoDB(ednMacLegacyObj, ednServiceMappingObjectLongest)
                            break
                        if next==1:
                            continue
                    
                    
                    ednServiceMappingObjectMedium = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac!='{ednMacLegacyObj.device_b_mac}')  or (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='' and  device_b_ip!= '{ednMacLegacyObj.device_b_ip}') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac !='' and device_a_name!= '{ednMacLegacyObj.device_a_name}' and device_a_interface!= '{ednMacLegacyObj.device_a_interface}')) and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);")
                    #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}')  or (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac= '{ednMacLegacyObj.device_b_mac}') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}');")
                    #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='')  or (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac !='')) and creation_date = (SELECT max(creation_date) FROM edn_service_mapping) ;", file=sys.stderr)
                    if ednServiceMappingObjectMedium:
                        #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}')  or (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac= '{ednMacLegacyObj.device_b_mac}') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}') ;")

                        for row in ednServiceMappingObjectMedium:
                            #(f"222222  {row}", file=sys.stderr)
                            ednMacLegacyObj.device_b_system_name= row[4]
                            ednMacLegacyObj.device_b_type= row[5]
                            ednMacLegacyObj.server_name= row[0]
                            ednMacLegacyObj.owner_name= row[1]
                            ednMacLegacyObj.owner_contact= row[2]
                            ednMacLegacyObj.owner_email= row[3]
                            ednMacLegacyObj.server_os= row[6]
                            ednMacLegacyObj.app_name= row[7]
                            print("Updating Service Mapping Data")
                            next=1
                            print(f"M {ednMacLegacyObj} SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac!='{ednMacLegacyObj.device_b_mac}')  or (device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='' and  device_b_ip!= '{ednMacLegacyObj.device_b_ip}') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and  device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac !='' and device_a_name!= '{ednMacLegacyObj.device_a_name}' and device_a_interface!= '{ednMacLegacyObj.device_a_interface}')) and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);", file=sys.stderr)  
                            self.UpdateData(ednMacLegacyObj)
                            #self.addServiceDatatoDB(ednMacLegacyObj, ednServiceMappingObjectLongest)
                            break
                        if next==1:
                            continue
                    
                    #ednServiceMappingObjectShortest = EDN_SERVICE_MAPPING.query.filter(EDN_SERVICE_MAPPING.device_a_name==ednMacLegacyObj.device_a_name).filter(EDN_SERVICE_MAPPING.device_a_interface==ednMacLegacyObj.device_a_interface).first()
                    ednServiceMappingObjectShortest = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac!='{ednMacLegacyObj.device_b_mac}' and device_b_ip!= '{ednMacLegacyObj.device_b_ip}' )  or (device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac!='{ednMacLegacyObj.device_b_mac}' and  device_a_name!= '{ednMacLegacyObj.device_a_name}' and device_a_interface!= '{ednMacLegacyObj.device_a_interface}') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='' and  device_a_name!= '{ednMacLegacyObj.device_a_name}' and device_a_interface!= '{ednMacLegacyObj.device_a_interface}' and device_b_ip!= '{ednMacLegacyObj.device_b_ip}')) and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);")                    #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' )  or device_b_ip= '{ednMacLegacyObj.device_b_ip}' or device_b_mac= '{ednMacLegacyObj.device_b_mac}') and creation_date = (SELECT max(creation_date) FROM edn_service_mapping;", file=sys.stderr)

                    if ednServiceMappingObjectShortest:
                        for row in ednServiceMappingObjectShortest:
                            #print(f"3333  {row}", file=sys.stderr)
                            ednMacLegacyObj.device_b_system_name= row[4]
                            ednMacLegacyObj.device_b_type= row[5]
                            ednMacLegacyObj.server_name= row[0]
                            ednMacLegacyObj.owner_name= row[1]
                            ednMacLegacyObj.owner_contact= row[2]
                            ednMacLegacyObj.owner_email= row[3]
                            ednMacLegacyObj.server_os= row[6]
                            ednMacLegacyObj.app_name= row[7]
                            print("Updating Service Mapping Data")
                            next=1
                            print(f"S {ednMacLegacyObj} SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednMacLegacyObj.device_a_name}' and device_a_interface= '{ednMacLegacyObj.device_a_interface}' and  device_b_mac!='{ednMacLegacyObj.device_b_mac}' and device_b_ip!= '{ednMacLegacyObj.device_b_ip}' )  or (device_b_ip= '{ednMacLegacyObj.device_b_ip}' and device_b_ip!='' and device_b_mac!='{ednMacLegacyObj.device_b_mac}' and  device_a_name!= '{ednMacLegacyObj.device_a_name}' and device_a_interface!= '{ednMacLegacyObj.device_a_interface}') or (device_b_mac= '{ednMacLegacyObj.device_b_mac}' and device_b_mac!='' and  device_a_name!= '{ednMacLegacyObj.device_a_name}' and device_a_interface!= '{ednMacLegacyObj.device_a_interface}' and device_b_ip!= '{ednMacLegacyObj.device_b_ip}')) and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);", file=sys.stderr)
                            self.UpdateData(ednMacLegacyObj)
                            #self.addServiceDatatoDB(ednMacLegacyObj, ednServiceMappingObjectLongest)
                            break
                        if next==1:
                            continue
                    

        except Exception as e:
            print(f"Failed to update Service Mapping for EDN Mac Legacy {e}", file=sys.stderr)   
        print("Populated Service Mapping in Edn Mac Legacy", file=sys.stderr)        


    def addEdnLldpACIServiceMapping(self, current_time):
        try:
            ednLldpACIObjs = EDN_LLDP_ACI.query.filter_by(creation_date=current_time).all()
            
            if ednLldpACIObjs:

                for ednLldpACIObj in ednLldpACIObjs: 
                    #ednServiceMappingObjectLongest = EDN_SERVICE_MAPPING.query.filter(EDN_SERVICE_MAPPING.device_a_name==ednLldpACIObj.device_a_name).filter(EDN_SERVICE_MAPPING.device_a_interface==ednLldpACIObj.device_a_interface).filter(EDN_SERVICE_MAPPING.device_b_ip==ednLldpACIObj.device_b_ip).filter(EDN_SERVICE_MAPPING.device_b_mac==ednLldpACIObj.device_b_mac).first()
                    ednServiceMappingObjectLongest = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}'  and device_b_mac= '{ednLldpACIObj.device_b_mac}')  and creation_date = (SELECT max(creation_date) FROM edn_service_mapping) ;")
                    
                    next=0
                    if ednServiceMappingObjectLongest:
                        #print(f"SELECT * FROM edn_service_mapping WHERE device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}'  and device_b_mac= '{ednLldpACIObj.device_b_mac}'" , file=sys.stderr)

                        for row in ednServiceMappingObjectLongest:
                            ednLldpACIObj.device_b_system_name= row[4]
                            ednLldpACIObj.device_b_type= row[5]
                            ednLldpACIObj.server_name= row[0]
                            ednLldpACIObj.owner_name= row[1]
                            ednLldpACIObj.owner_contact= row[2]
                            ednLldpACIObj.owner_email= row[3]
                            ednLldpACIObj.server_os= row[6]
                            ednLldpACIObj.app_name= row[7]
                            print("Updating Service Mapping Data")
                            next=1
                            self.UpdateData(ednLldpACIObj)
                            #self.addServiceDatatoDB(ednLldpACIObj, ednServiceMappingObjectLongest)
                            break
                        if next==1:
                            continue
                    
                    
                    ednServiceMappingObjectMedium = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}')  or (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_mac= '{ednLldpACIObj.device_b_mac}') or (device_b_mac= '{ednLldpACIObj.device_b_mac}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}')) and creation_date = (SELECT max(creation_date) FROM edn_service_mapping) ;")
                    #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}')  or (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_mac= '{ednLldpACIObj.device_b_mac}') or (device_b_mac= '{ednLldpACIObj.device_b_mac}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}');")

                    if ednServiceMappingObjectMedium:
                        #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}')  or (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' and  device_b_mac= '{ednLldpACIObj.device_b_mac}') or (device_b_mac= '{ednLldpACIObj.device_b_mac}' and  device_b_ip= '{ednLldpACIObj.device_b_ip}') ;")

                        for row in ednServiceMappingObjectMedium:
                            ednLldpACIObj.device_b_system_name= row[4]
                            ednLldpACIObj.device_b_type= row[5]
                            ednLldpACIObj.server_name= row[0]
                            ednLldpACIObj.owner_name= row[1]
                            ednLldpACIObj.owner_contact= row[2]
                            ednLldpACIObj.owner_email= row[3]
                            ednLldpACIObj.server_os= row[6]
                            ednLldpACIObj.app_name= row[7]
                            print("Updating Service Mapping Data")
                            next=1
                            self.UpdateData(ednLldpACIObj)
                            #self.addServiceDatatoDB(ednLldpACIObj, ednServiceMappingObjectLongest)
                            break
                        if next==1:
                            continue
                    
                    #ednServiceMappingObjectShortest = EDN_SERVICE_MAPPING.query.filter(EDN_SERVICE_MAPPING.device_a_name==ednLldpACIObj.device_a_name).filter(EDN_SERVICE_MAPPING.device_a_interface==ednLldpACIObj.device_a_interface).first()
                    ednServiceMappingObjectShortest =  phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' )  or device_b_ip= '{ednLldpACIObj.device_b_ip}' or device_b_mac= '{ednLldpACIObj.device_b_mac}') and creation_date = (SELECT max(creation_date) FROM edn_service_mapping);")

                    if ednServiceMappingObjectShortest:
                        #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{ednLldpACIObj.device_a_name}' and device_a_interface= '{ednLldpACIObj.device_a_interface}' )  or device_b_ip= '{ednLldpACIObj.device_b_ip}' or device_b_ip= '{ednLldpACIObj.device_b_ip}' ;")
                        for row in ednServiceMappingObjectShortest:
                            #print(f"3333  {row}", file=sys.stderr)
                            ednLldpACIObj.device_b_system_name= row[4]
                            ednLldpACIObj.device_b_type= row[5]
                            ednLldpACIObj.server_name= row[0]
                            ednLldpACIObj.owner_name= row[1]
                            ednLldpACIObj.owner_contact= row[2]
                            ednLldpACIObj.owner_email= row[3]
                            ednLldpACIObj.server_os= row[6]
                            ednLldpACIObj.app_name= row[7]
                            print("Updating Service Mapping Data")
                            next=1
                            self.UpdateData(ednLldpACIObj)
                            #self.addServiceDatatoDB(ednLldpACIObj, ednServiceMappingObjectLongest)
                            break
                        if next==1:
                            continue
                    

        except Exception as e:
            print(f"Failed to update Service Mapping for EDN Lldp Aci {e}", file=sys.stderr)   
        print("Populated Service Mapping in Edn Lldp Aci", file=sys.stderr)        

    def addIgwLldpACIServiceMapping(self, current_time):
            try:
                IgwLldpACIObjs = IGW_LLDP_ACI.query.filter_by(creation_date=current_time).all()
                
                if IgwLldpACIObjs:

                    for IgwLldpACIObj in IgwLldpACIObjs: 
                        #IgwServiceMappingObjectLongest = IGW_SERVICE_MAPPING.query.filter(IGW_SERVICE_MAPPING.device_a_name==IgwLldpACIObj.device_a_name).filter(IGW_SERVICE_MAPPING.device_a_interface==IgwLldpACIObj.device_a_interface).filter(IGW_SERVICE_MAPPING.device_b_ip==IgwLldpACIObj.device_b_ip).filter(IGW_SERVICE_MAPPING.device_b_mac==IgwLldpACIObj.device_b_mac).first()
                        IgwServiceMappingObjectLongest = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE (device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}'  and device_b_mac= '{IgwLldpACIObj.device_b_mac}')  and creation_date = (SELECT max(creation_date) FROM igw_service_mapping) ;")
                        
                        next=0
                        if IgwServiceMappingObjectLongest:
                            #print(f"SELECT * FROM Igw_service_mapping WHERE device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}'  and device_b_mac= '{IgwLldpACIObj.device_b_mac}'" , file=sys.stderr)
                            if IgwLldpACIObj.device_a_name == "ADAM-WLEF-CI-311":
                                print("333", file=sys.stderr)
                            for row in IgwServiceMappingObjectLongest:
                                #print(f"1111111111  {row}", file=sys.stderr)
                                IgwLldpACIObj.device_b_system_name= row[4]
                                IgwLldpACIObj.device_b_type= row[5]
                                IgwLldpACIObj.server_name= row[0]
                                IgwLldpACIObj.owner_name= row[1]
                                IgwLldpACIObj.owner_contact= row[2]
                                IgwLldpACIObj.owner_email= row[3]
                                IgwLldpACIObj.server_os= row[6]
                                IgwLldpACIObj.app_name= row[7]
                                print("Updating Service Mapping Data")
                                next=1
                                self.UpdateData(IgwLldpACIObj)
                                #self.addServiceDatatoDB(IgwLldpACIObj, IgwServiceMappingObjectLongest)
                                break
                            if next==1:
                                continue
                        
                        
                        IgwServiceMappingObjectMedium = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}')  or (device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_mac= '{IgwLldpACIObj.device_b_mac}') or (device_b_mac= '{IgwLldpACIObj.device_b_mac}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}')) and creation_date = (SELECT max(creation_date) FROM igw_service_mapping) ;")

                        #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM Igw_service_mapping WHERE (device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}')  or (device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_mac= '{IgwLldpACIObj.device_b_mac}') or (device_b_mac= '{IgwLldpACIObj.device_b_mac}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}');")

                        if IgwServiceMappingObjectMedium:
                            #print(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM Igw_service_mapping WHERE (device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}')  or (device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' and  device_b_mac= '{IgwLldpACIObj.device_b_mac}') or (device_b_mac= '{IgwLldpACIObj.device_b_mac}' and  device_b_ip= '{IgwLldpACIObj.device_b_ip}') ;")
                            if IgwLldpACIObj.device_a_name == "ADAM-WLEF-CI-311":
                                print("444", file=sys.stderr)
                            for row in IgwServiceMappingObjectMedium:
                                #(f"222222  {row}", file=sys.stderr)
                                IgwLldpACIObj.device_b_system_name= row[4]
                                IgwLldpACIObj.device_b_type= row[5]
                                IgwLldpACIObj.server_name= row[0]
                                IgwLldpACIObj.owner_name= row[1]
                                IgwLldpACIObj.owner_contact= row[2]
                                IgwLldpACIObj.owner_email= row[3]
                                IgwLldpACIObj.server_os= row[6]
                                IgwLldpACIObj.app_name= row[7]
                                print("Updating Service Mapping Data")
                                next=1
                                self.UpdateData(IgwLldpACIObj)
                                #self.addServiceDatatoDB(IgwLldpACIObj, IgwServiceMappingObjectLongest)
                                break
                            if next==1:
                                continue
                        
                        #IgwServiceMappingObjectShortest = IGW_SERVICE_MAPPING.query.filter(IGW_SERVICE_MAPPING.device_a_name==IgwLldpACIObj.device_a_name).filter(IGW_SERVICE_MAPPING.device_a_interface==IgwLldpACIObj.device_a_interface).first()
                        IgwServiceMappingObjectShortest = phy_engine.execute(f"SELECT SERVER_NAME, OWNER_NAME, OWNER_CONTACT, OWNER_EMAIL, DEVICE_B_SYSTEM_NAME, DEVICE_B_TYPE, SERVER_OS, APP_NAME FROM edn_service_mapping WHERE ((device_a_name= '{IgwLldpACIObj.device_a_name}' and device_a_interface= '{IgwLldpACIObj.device_a_interface}' )  or device_b_ip= '{IgwLldpACIObj.device_b_ip}' or device_b_mac= '{IgwLldpACIObj.device_b_mac}') and creation_date = (SELECT max(creation_date) FROM igw_service_mapping);")

                        if IgwServiceMappingObjectShortest:
                            if IgwLldpACIObj.device_a_name == "ADAM-WLEF-CI-311":
                                print("55555", file=sys.stderr)
                            for row in IgwServiceMappingObjectShortest:
                                #print(f"3333  {row}", file=sys.stderr)
                                IgwLldpACIObj.device_b_system_name= row[4]
                                IgwLldpACIObj.device_b_type= row[5]
                                IgwLldpACIObj.server_name= row[0]
                                IgwLldpACIObj.owner_name= row[1]
                                IgwLldpACIObj.owner_contact= row[2]
                                IgwLldpACIObj.owner_email= row[3]
                                IgwLldpACIObj.server_os= row[6]
                                IgwLldpACIObj.app_name= row[7]
                                print("Updating Service Mapping Data")
                                next=1
                                self.UpdateData(IgwLldpACIObj)
                                #self.addServiceDatatoDB(IgwLldpACIObj, IgwServiceMappingObjectLongest)
                                break
                            if next==1:
                                continue    

            except Exception as e:
                print(f"Failed to update Service Mapping for IGW Lldp Aci {e}", file=sys.stderr)   
            print("Populated Service Mapping in Igw Lldp Aci", file=sys.stderr)        




