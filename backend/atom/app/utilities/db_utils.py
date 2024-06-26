from app import db
import sys
import traceback



def InsertDBData(obj):
    try:
        db.session.add(obj)
        db.session.commit()
        return 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        print(
            f"Something else went wrong in Database Insertion: {e}", file=sys.stderr)
        return 500


def UpdateDBData(obj):
    try:
        db.session.flush()

        db.session.merge(obj)
        db.session.commit()
        return 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        print(
            f"Something else went wrong during Database Update: {e}", file=sys.stderr)
        return 500

def DeleteDBData(obj):
    try:
        db.session.delete(obj)
        db.session.commit()
        return 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        print(
            f"Something else went wrong during Database Delete: {e}", file=sys.stderr)
        return 500


# def login_activity(user_id, operation, status, timestamp, description):
#     try:
#         activity = Login_Activity_Table()
#         activity.user_id = user_id
#         activity.operation = operation
#         activity.description = description
#         activity.status = status
#         activity.timestamp = timestamp

#         db.session.add(activity)
#         db.session.commit()
#     except Exception:
#         print("Error While Saving Login Activity")
