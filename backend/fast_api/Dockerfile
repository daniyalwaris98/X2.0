
FROM python:3.9.4


COPY . /app
WORKDIR /app
RUN apt-get update
RUN apt-get -y install libsasl2-dev python-dev libldap2-dev libssl-dev
RUN pip install --no-cache-dir -r requirements.txt
# RUN pip install firebase-admin
# RUN export NET_TEXTFSM=/app/pullers/ntc-templates/ntc_templates/templates/
# RUN apt-get -y install nmap
EXPOSE 8080
ENTRYPOINT ["python"]
CMD ["main.py"]
