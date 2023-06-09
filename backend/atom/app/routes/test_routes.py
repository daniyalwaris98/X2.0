from flask import jsonify


import sys
import app
@app.route('/test',methods=['GET'])
def Test():
    print("Hello World",file=sys.stderr)
    return '123456789'