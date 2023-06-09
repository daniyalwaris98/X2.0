
import traceback
from app import app, db, firebase_app
from app.middleware import token_required
from flask import request, make_response, Response, session

from firebase_admin import messaging


def subscribe(tokens):  # tokens is a list of registration tokens
    try:
        topic = 'monitoring_alerts'
        response = messaging.subscribe_to_topic(tokens, topic)
        if response.failure_count > 0:
            print(
                f'Failed to subscribe to topic {topic} due to {list(map(lambda e: e.reason,response.errors))}')
            return False
    except:
        traceback.print_exc()
        return False
    return True


@app.route('/saveFirebaseToken', methods=['POST'])
@token_required
def saveFirebaseToken(user_data):
    try:
        dictObj = request.get_json()
        if not 'token' in dictObj.keys():
            return "Token is missing", 500
        else:
            tokenList = [dictObj['token']]
            if subscribe(tokenList):
                try:
                    query = f"insert into fcm_token_table (`TOKEN`,`STATUS`) VALUES ('{dictObj['token']}','Active');"
                    db.session.execute(query)
                    db.session.commit()
                    return "Push Notification Enabled", 200
                except:
                    traceback.print_exc()
                    return "Error While Saving Token", 500

            else:
                return "Error While Enabling Push Notification", 500
    except:
        traceback.print_exc()
        return "Error While Enabling Push Notification", 500


@app.route('/sendTopicPush', methods=['GET'])
def send_topic_push():
    topic = 'monitoring_alerts'
    message = messaging.Message(
        notification=messaging.Notification(
            title='Test Notification',
            body="Push Notification Test"
        ),
        topic=topic
    )
    messaging.send(message)
    return "Notification Sent", 200


@app.route('/sendSegmentPush', methods=['GET'])
def send_segment_push():
    topic = 'monitoring_alerts'
    message = messaging.Message(
        notification=messaging.Notification(
            title='Test Notification',
            body="Push Notification Test"
        ),
        topic=topic
    )
    messaging.send(message)
    return "Notification Sent", 200

@app.route('/sendTokenPush', methods=['GET'])
def send_token_push():

    try:
        query = "select * from fcm_token_table;"
        results = db.session.execute(query)
        tokens = []
        for result in results:
            tokens.append(result[1])
    except:
        traceback.print_exc()

    if len(tokens) > 0:
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title='Test Notification',
                body="Push Notification Test"
            ),
            tokens=tokens
        )
        messaging.send_multicast(message)
        return "Notification Sent", 200
    return "No Token Found", 200
    
