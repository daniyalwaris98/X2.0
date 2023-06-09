from  app import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
    #app.run(host='0.0.0.0', debug=False)
    # app.run(host='0.0.0.0', debug=True, ssl_context=('cert.pem', 'key.pem'))  #HTTPS Local
    # app.run(host='0.0.0.0', debug=True, ssl_context='adhoc')
    # app.run(host='0.0.0.0', debug=True, ssl_context=('cert.pem', 'key.pem'))
    # app.run(host='192.168.10.242', debug=True, ssl_context=('cert.pem', 'key.pem'), use_reloader=False)  #HTTPS Production
