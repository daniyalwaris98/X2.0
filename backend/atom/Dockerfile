# # # FROM python:3.9.4
# # FROM ubuntu:latest


# # COPY . /app
# # WORKDIR /app
# # RUN apt-get update
# # RUN apt-get update && apt-get install -y \
# #     python3-pip \
# #     python3-dev \
# #     build-essential
# # # RUN apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev
# # COPY requirements.txt .
# # RUN pip3 install --no-cache-dir -r requirements.txt
# # RUN export NET_TEXTFSM=/app/pullers/ntc-templates/ntc_templates/templates/
# # RUN apt-get -y install nmap 
# # # RUN apt-get update && apt-get install -y nmap

# # EXPOSE 5000
# # ENTRYPOINT ["python"]
# # CMD ["main.py"]


# # FROM ubuntu:latest
# # FROM python:3.9
# # COPY . /app
# # WORKDIR /app
# # RUN apt-get update
# # # RUN apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev
# # RUN pip3 install --no-cache-dir -r requirements.txt
# # RUN export NET_TEXTFSM=/app/pullers/ntc-templates/ntc_templates/templates/
# # RUN apt-get -y install nmap 
# # # RUN apt-get update && apt-get install -y nmap

# # EXPOSE 5000

# # FROM ubuntu:

# # RUN apt-get update 
# # RUN apt-get upgrade -y  
# # RUN apt-get install python3 -y 
# # RUN apt-get install python3-pip -y 
# # RUN apt-get install -y \
# #     default-libmysqlclient-dev \
# #     libstdc++6 \
# #     && rm -rf /var/lib/apt/lists/*

# # WORKDIR /app
# # COPY requirements.txt .
# # RUN pip install --no-cache-dir -r requirements.txt
# # RUN export NET_TEXTFSM=/app/pullers/ntc-templates/ntc_templates/templates/
# # RUN apt-get update
# # RUN apt-get install -y nmap 

# # EXPOSE 5000

# # # ENTRYPOINT ["python"]
# # # CMD ["main.py"]
# # CMD ["python3", "main.py"]



# FROM ubuntu 
# RUN apt-get update 
# RUN apt-get upgrade -y
# RUN apt-get install python3 -y 
# RUN apt-get install python3-pip -y 
# RUN apt-get install -y \
#     default-libmysqlclient-dev \
#     libstdc++6 \
#     && rm -rf /var/lib/apt/lists/*
# # Add this line to install python-nmap 
# RUN pip install python-nmap
# RUN apt-get update  
# RUN apt-get install -y nmap 
# RUN apt-get install -y libcap2-bin 
# # Add these lines to give the container necessary privileges to run nmap 
# RUN setcap cap_net_raw+ep /usr/bin/nmap 

# WORKDIR /app 
# COPY requirements.txt . 
# RUN pip install --no-cache-dir -r requirements.txt 
# # Add this line to set the environment variable NET_TEXTFSM 
# ENV NET_TEXTFSM=/app/pullers/ntc-templates/ntc_templates/templates/ 
# EXPOSE 5000
# CMD ["python3", "main.py"]

##ORIGINAL DOCKER FILE
FROM python:3.9.4


COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install firebase-admin
RUN export NET_TEXTFSM=/app/pullers/ntc-templates/ntc_templates/templates/
RUN apt-get -y install nmap
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["main.py"]
