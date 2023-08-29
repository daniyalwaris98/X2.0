from flask import Flask, request, json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import  Column, VARCHAR


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:12345**@localhost:3306/database'

db = SQLAlchemy(app)


class database(db.Model):
        __table_name = "data"
        Hostname = Column(VARCHAR(20), nullable= False)
        Ports = Column(int(10), nullable=False)
        Username = Column(VARCHAR(20), nullable=False)
        UserPassword = Column(VARCHAR(20), nullable= False)
        DatabaseName = Column(VARCHAR(10), nullable=False)

        def __init__(self, Hostname, Ports, Username, UserPassword, DatabaseName):
                self.Hostname = Hostname,
                self.Ports = Ports,
                self.Username = Username,
                self.UserPassword = UserPassword,
                self.DatabaseName = DatabaseName

@app.route("/addDatabase", methods=['POST'])
def addData():
       info = request.json()
       console.log(info)
       return 'working'


if __name__ == '__main__':
  
   app.run()