from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from io import StringIO
from datetime import datetime, timedelta
import logging

# Nastavení logování
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def process_csv_file(file, file_type):
    """Zpracuje CSV soubor s přeskočením metadat"""
    try:
        content = file.read().decode('utf-8')
        lines = content.split('\n')
        
        # Přeskočení prvního řádku s metadaty
        if len(lines) > 1:
            # Použití druhého řádku jako hlavičky
            header = lines[1]
            # Data od třetího řádku
            data = '\n'.join(lines[2:])
            
            if data.strip():
                df = pd.read_csv(
                    StringIO(header + '\n' + data),
                    skipinitialspace=True,
                    on_bad_lines='skip'
                )
                logger.info(f"Columns found in {file_type}: {df.columns.tolist()}")
                return df
            
        logger.warning(f"No data found in {file_type} file")
        return None
        
    except Exception as e:
        logger.error(f"Error processing {file_type} file: {str(e)}")
        return None

@app.route('/post_data', methods=['POST', 'OPTIONS'])
def post_data():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response, 204
    
    try:
        logger.info("Received POST request")
        files = request.files.getlist('file')
        logger.info(f"Received {len(files)} files")

        result_dict = {
            "basal": [],
            "bolus": [],
            "insulin": [],
            "alarms": [],
            "bg": [],
            "cgm": []
        }

        for file in files:
            try:
                logger.info(f"Processing file: {file.filename}")
                
                # Detekce typu souboru
                file_type = None
                filename = file.filename.lower()
                if 'basal' in filename:
                    file_type = 'basal'
                elif 'bolus' in filename:
                    file_type = 'bolus'
                elif 'cgm' in filename:
                    file_type = 'cgm'
                elif 'insulin' in filename:
                    file_type = 'insulin'
                elif 'bg' in filename:
                    file_type = 'bg'
                elif 'alarm' in filename:
                    file_type = 'alarms'

                if file_type:
                    # Zpracování CSV
                    df = process_csv_file(file, file_type)
                    if df is not None and not df.empty:
                        # Konverze na seznam slovníků
                        records = []
                        for _, row in df.iterrows():
                            record = {}
                            for column in df.columns:
                                value = row[column]
                                if pd.isna(value):
                                    record[column] = None
                                elif isinstance(value, (np.int64, np.float64)):
                                    record[column] = float(value)
                                else:
                                    record[column] = str(value)
                            records.append(record)
                        
                        result_dict[file_type].extend(records)
                        logger.info(f"Successfully processed {len(records)} records for {file_type}")
                    else:
                        logger.warning(f"No valid data found in {file.filename}")

            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {str(e)}")
                return jsonify({"error": f"Error processing file {file.filename}: {str(e)}"}), 500

        # Log počtu záznamů
        for key, records in result_dict.items():
            logger.info(f"{key}: {len(records)} records")

        return jsonify({
            "message": "Data successfully processed",
            "processed_data": result_dict
        })

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True)
