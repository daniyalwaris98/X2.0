from app import app, db
import traceback


@app.route("/clearSetup", methods=['GET'])
def clearSetup():
    try:
        
        query = "delete from user_table;"
        db.session.execute(query)
        db.session.commit()
        
        
        query = "delete from end_user_table;"
        db.session.execute(query)
        db.session.commit()
        
        query = "delete from license_verification_table;"
        db.session.execute(query)
        db.session.commit()
        
        return "Setup Cleared Successfully", 200
        
    except Exception:
        traceback.print_exc()
        return "Server Error", 500