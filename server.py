from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from io import StringIO
from datetime import datetime, timedelta

app = Flask(__name__)
# Povolíme CORS pro všechny routy
CORS(app, resources={r"/*": {"origins": "*"}})

# Přidáme health check endpoint
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"}), 200

@app.route('/post_data', methods=['POST', 'OPTIONS'])
def post_data():
    if request.method == 'OPTIONS':
        # Přidáme CORS hlavičky
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response, 204
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        result_dict = {
            "basal": [],
            "bolus": [],
            "insulin": [],
            "alarms": [],
            "bg": [],
            "cgm": []
        }

        for key in result_dict.keys():
            if key in data and data[key]:
                try:
                    for csv_content in data[key]:
                        if not csv_content:
                            continue
                            
                        # Zpracování CSV dat
                        df = pd.read_csv(
                            StringIO(csv_content),
                            skiprows=1,
                            skipinitialspace=True,
                            on_bad_lines='skip'
                        )
                        
                        # Čištění dat
                        df = clean_data(df)
                        
                        # Konverze na seznam slovníků s ošetřením NaN hodnot
                        records = []
                        for _, row in df.iterrows():
                            record = {}
                            for column in df.columns:
                                value = row[column]
                                if pd.isna(value):
                                    record[column] = None
                                elif isinstance(value, (np.int64, np.float64)):
                                    record[column] = float(value)
                                elif isinstance(value, pd.Timestamp):
                                    record[column] = value.isoformat()
                                else:
                                    record[column] = str(value)
                            records.append(record)
                        
                        result_dict[key].extend(records)
                        print(f"Successfully processed {key} data with {len(records)} records")
                except Exception as e:
                    print(f"Error processing {key} data: {str(e)}")
                    return jsonify({"error": f"Error processing {key} data: {str(e)}"}), 500

        return jsonify({
            "message": "Data successfully processed",
            "processed_data": result_dict
        })

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True, host='0.0.0.0')
