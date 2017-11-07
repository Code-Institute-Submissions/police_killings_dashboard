from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.environ.get('MONGODB_URI')
DBS_NAME = os.environ.get('MONGO_DB_NAME','police-killings-dashboard')
COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME','police_killings_data')

# Modify the following for your fields
FIELDS = {'name': True, 'age': True, 'gender': True, 'raceethnicity': True,
          'state': True, 'cause': True,'pov': True,'_id': False}

@app.route("/")
def index():
    return render_template("dashboard.html")
    
@app.route("/dashboard.html")
def reset():
    return render_template("dashboard.html")


@app.route("/data")
def get_data():
    with MongoClient(MONGODB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        results = collection.find(projection=FIELDS)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(results))


if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))