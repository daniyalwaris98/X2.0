from flask import Flask, request, make_response, Response, session, jsonify
from app import app
from app.models.dbm_models import *
from sqlalchemy import func
from datetime import datetime
from app.middleware import token_required
from app import client


# influx db -> data insertion into influx db -> data retrieval from influx db -> send data to frontend

app.route('/getCPUusage', methods=['GET'])
# @token_required
def getCPUusage():
    try:
        print("hello world")
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': 'Something went wrong'}), 500)
    