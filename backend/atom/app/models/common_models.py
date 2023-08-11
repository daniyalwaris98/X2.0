# from app import db
# from sqlalchemy import ForeignKey
# from datetime import datetime



# class FAILED_DEVICES_TABLE(db.Model):
#     __tablename__ = 'failed_devices_table'
#     failure_id = db.Column(db.Integer, primary_key=True)
#     ip_address = db.Column(db.String(50))
#     device_type = db.Column(db.String(50))
#     date = db.Column(db.DateTime, default=datetime.now())
#     failure_reason = db.Column(db.String(2000))
#     module = db.Column(db.String(50))
