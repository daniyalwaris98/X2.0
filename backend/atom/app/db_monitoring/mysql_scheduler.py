import psutil   
import mysql.connector
import datetime
from app.db_monitoring.db_monitoring_utils import *
from influxdb_client import InfluxDBClient, Point, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS
from dateutil import parser
import multiprocessing
import time

from app import client
# connect to relevant db -> call kpi function -> insert into influx db -> close connection
# scheduler
# make process -> run function -> insert into influxdb -> sleep -> repeat (except for making a process)
def DatabaseIterator():
    # try: 
        db_server_list = GetDatabaseServers()
        password_list = GetPasswordGroupDBM()
        connectionList = []
        for db_server in db_server_list:
            host = db_server["ip_address"]
            password_group = db_server["password_group"]

            for password in password_list:
                if password["password_group"] == password_group:
                    username = password["username"]
                    passcode = password["password"]

            connectionDic = {"host": host, "username": username, "password": passcode}
            connectionList.append(connectionDic)
            
            processList = []

            while True:
                for connection in connectionList:
                    process = multiprocessing.Process(target=insertInfluxDB, args=(connection,))
                    process.start()
                    processList.append(process)

                for p in processList:
                    p.join()
                
                time.sleep(30)

            # if response is True:
        return "Written" , 200

        return "Server Error" , 500

def connect_to_mysql(ConnectionObj):
    
    mydb = mysql.connector.connect(
        host=ConnectionObj["host"],
        user=ConnectionObj["username"],
        password=ConnectionObj["password"],
        # pool_name = "mypool",
        # pool_size = 10
    )
    return mydb

def insertInfluxDB(ConnectionObj):
    mydb = connect_to_mysql(ConnectionObj)
    response = insert_server_stats(mydb)
    mydb.close()

def get_cpu_percent(process_name=None, process_id=None):
    """Get cpu percent of a process by name or pid
    :param process_name: name of the process
    :param process_id: pid of the process
    :return: cpu percent of the process
    """
    cpu_percent = 0
    processes = psutil.process_iter()
    for process in processes:
        if process_name in process.name() or process.pid == process_id:
            cpu_percent = process.cpu_percent(interval=0.5) + cpu_percent
    return(cpu_percent / psutil.cpu_count())

def get_memory_usage(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("select * from sys.`x$memory_global_total`")
    myresult = mycursor.fetchall()
    result_dic = {"Memory Usage": myresult[0][0]}
    return((result_dic))

def get_network_usage(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SHOW GLOBAL STATUS like \"Bytes_%\"")
    myresult = mycursor.fetchall()
    my_dict = {key: value for key, value in myresult}
    return(my_dict)

def get_disk_stats(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SHOW GLOBAL STATUS like \"innodb_data_read\"")
    myresult = mycursor.fetchall()
    mycursor.execute("SHOW GLOBAL STATUS like \"innodb_data_written\"")
    myresult += mycursor.fetchall()
    mycursor.execute("SHOW GLOBAL STATUS like \"innodb_buffer_pool_bytes_data\"")
    myresult += mycursor.fetchall()
    mycursor.execute("select 'SIZEDB.TOTAL', sum(data_length+index_length) from information_schema.tables")
    myresult += mycursor.fetchall()
    my_dict = {key: value for key, value in myresult}
    return(my_dict)

def get_db_conns(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SHOW GLOBAL STATUS like \"threads_connected\"")
    myresult = mycursor.fetchall()    
    mycursor.execute("SHOW GLOBAL STATUS like \"aborted_connects\"")
    myresult += mycursor.fetchall()
    mycursor.execute("SHOW GLOBAL STATUS like \"aborted_clients\"")
    myresult += mycursor.fetchall()        
    my_dict = {key: value for key, value in myresult}
    return(my_dict)

def get_uptime(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SHOW GLOBAL STATUS like \"uptime\"")
    myresult = mycursor.fetchall()    
    my_dict = {key: value for key, value in myresult}
    return(my_dict)

def queries_per_min(mydb):
    mycursor = mydb.cursor()
    mycursor.execute("SHOW GLOBAL STATUS like \"questions\"")
    myresult = mycursor.fetchall()    
    my_dict = {key: value for key, value in myresult}
    return(my_dict)
    
def query_performance_per_schema(mydb, queue):
    con = mysql.connector.connect(pool_name = "mypool")
    mycursor = con.cursor()    
    mycursor.execute("SELECT schema_name , SUM(count_star) count , ROUND(   (SUM(sum_timer_wait) / SUM(count_star)) / 1000000) AS avg_microsec, SUM(sum_errors) err_count FROM performance_schema.events_statements_summary_by_digest WHERE schema_name IS NOT NULL GROUP BY schema_name;")
    myresult = mycursor.fetchall()  
    columns = [desc[0] for desc in mycursor.description]
    result_list = []
    for row in myresult:
        result_dict = {columns[i]: value for i, value in enumerate(row)}
        result_list.append(result_dict)
    queue.put(result_list)
    
    

# def query_analytics(mydb):
#     mycursor = mydb.cursor()
#     mycursor.execute("select query, db, exec_count as query_count, err_count, Round(avg_latency/ 1000000) as avg_query_runtime, (Round(lock_latency / 1000000) / exec_count) as avg_lock_time, rows_sent_avg ,rows_examined_avg, rows_affected_avg from sys.`x$statement_analysis` where db is not NULL;")
#     myresult = mycursor.fetchall()  
#     columns = [desc[0] for desc in mycursor.description] # get column names
#     result_list = []
#     for row in myresult:
#         result_dict = {columns[i]: value for i, value in enumerate(row)}
#         result_list.append(result_dict)
#     print(len(result_list))
#     with open("qan.txt", 'w') as file:
#         pprint.pprint(result_list, stream=file)


def insert_server_stats(mydb):

    cpu_usage_perc = get_cpu_percent("MySQLWorkbench.exe")
    memory_usage = get_memory_usage(mydb)
    network_usage = get_network_usage(mydb)
    disk_stats = get_disk_stats(mydb)
    db_conns = get_db_conns(mydb)
    uptime = get_uptime(mydb)
    queries_per_minute = queries_per_min(mydb)

    cpu_usage_perc = (cpu_usage_perc)
    memory_used = (memory_usage["Memory Usage"])
    bytes_recieved = (network_usage["Bytes_received"])
    bytes_sent = (network_usage["Bytes_sent"])
    disk_read = (disk_stats["Innodb_data_read"])
    disk_write = (disk_stats["Innodb_data_written"])
    innodb_buffer_pool_bytes_data = (disk_stats["Innodb_buffer_pool_bytes_data"])
    db_size = (disk_stats["SIZEDB.TOTAL"])
    threads_connected = (db_conns["Threads_connected"])
    aborted_connects = (db_conns["Aborted_connects"])
    aborted_clients = (db_conns["Aborted_clients"])
    uptime_val = (uptime["Uptime"])
    questions = (queries_per_minute["Questions"])


    data_point = {
            "measurement": "mysql_monitoring",
            "tags": {"host": mydb.server_host },
            "fields": {
                "cpu_usage_perc": cpu_usage_perc,
                "memory_used": memory_used,
                "bytes_received": bytes_recieved,
                "bytes_sent": bytes_sent,
                "disk_read": disk_read,
                "disk_write": disk_write,
                "Innodb_buffer_pool_bytes_data": innodb_buffer_pool_bytes_data,
                "db_size": db_size,
                "Threads_connected": threads_connected,
                "Aborted_connects": aborted_connects,
                "Aborted_clients": aborted_clients,
                "Uptime": uptime_val,
                "Questions": questions
            },
            "time": datetime.now() 
        }
        
    point = Point("mysql_monitoring").tag("host", mydb.server_host)
    point.time(datetime.now())
    point_data = {}
    for key, value in data_point["fields"].items():
        point_data.update({key: value})
        point.field(key, value)
    
    writer = client.write_api(write_options=SYNCHRONOUS)
    with open("test.txt", "a") as file:
        file.write(str(point.to_line_protocol()) + "\n")
    
    writer.write(bucket="database", record=[point])
    return True
    


def insert_db_stats(mydb):
    #used for inserting schema performance data
    mycursor = mydb.cursor()
    mycursor.execute("use DBMonitoring;")
    insert_string = "INSERT INTO database_stats (timestamp, schema_name, count, avg_microsec, err_count) VALUES (%s, %s, %s, %s, %s)"
    schema_performance = query_performance_per_schema(mydb)
    for schema in schema_performance:
        data = (datetime.datetime.now(), schema["schema_name"], int(schema["count"]), int(schema["avg_microsec"]), int(schema["err_count"]))
        mycursor.execute(insert_string, data)
    

# if __name__ == '__main__':
#     DatabaseIterator()
