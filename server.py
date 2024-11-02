import base64

from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
import pandas as pd
from io import StringIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/post_data', methods=['POST', 'OPTIONS'])
def post_data():
    csv_dict = {
        "basal": [],
        "bolus": [],
        "insulin": [],
        "alarms": [],
        "bg": [],
        "cgm": []
    }

    if request.method == 'OPTIONS':
        # Respond to the preflight request with 200 OK
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response, 200

    # Your POST logic here
    data = request.json

    print(data)
    # Convert each CSV string in the list to a DataFrame and store as CSV in csv_dict

    # dataframes = {}
    # for key, value in data.items():
    #     if value:  # Check if there are any entries for the key
    #         # Create a list to hold individual DataFrames
    #         df_list = []
    #         for csv_content in value:
    #             df = pd.read_csv(StringIO(csv_content))
    #             df_list.append(df)
    #         # Concatenate all DataFrames for the current key into a single DataFrame
    #         dataframes[key] = pd.concat(df_list, ignore_index=True) if df_list else pd.DataFrame()
    #     else:
    #         dataframes[key] = pd.DataFrame()  # Create an empty DataFrame for keys with no data
    # return dataframes
    #
    # # Convert all csvData into DataFrames
    # csv_data = data['csvData']
    # dataframes = convert_to_dataframes(csv_data)
    #
    # print(csv_dict)
    return jsonify({"message": "Data processed and stored in csv_dict"}), 200


# def post_data():
#     # Define the expected keys for the uploaded files
#     expected_keys = ['basal', 'bolus', 'insulin', 'alarms', 'bg', 'cgm']
#     csv_dict = {}
#
#     # Ensure the request contains JSON data
#     if not request.is_json:
#         return jsonify({'error': 'Invalid content type; expecting JSON'}), 400
#
#     try:
#         # Get the csvData payload from the JSON request
#         data = request.json.get('csvData', {})
#
#         for key in expected_keys:
#             # Initialize an empty list in csv_dict for each key
#             csv_dict[key] = []
#
#             # Check if the key exists in the payload data
#             if key in data:
#                 for file_data in data[key]:
#                     file_name = file_data['name']
#                     file_content_base64 = file_data['content']
#
#                     # Decode the base64-encoded content
#                     file_content = base64.b64decode(file_content_base64).decode("utf-8")
#
#                     # Convert to DataFrame and store in csv_dict
#                     df = pd.read_csv(StringIO(file_content), skiprows=1)
#                     csv_dict[key].append(df.to_dict(orient='records'))  # Store as a list of dictionaries
#
#         data = jsonify(csv_dict)
#         # process_csv(data)
#         return jsonify(data)  # Return the dictionary of DataFrames
#
#     except Exception as e:
#         return jsonify({'error': f'Error processing files: {str(e)}'}), 500


def process_csv(csv_dict):
    max_dt = pd.to_datetime("1900-01-01 12:00:00")
    min_dt = pd.to_datetime("2099-01-01 12:00:00")

    for key, value in csv_dict.items():
        value["Timestamp"] = pd.to_datetime(value["Timestamp"])
        value = value.set_index("Timestamp").drop("Serial Number", axis=1)
        value = value.add_prefix(f"{key}_")
        if max_dt < value.index.max():
            max_dt = value.index.max()
        if min_dt > value.index.min():
            min_dt = value.index.min()
        csv_dict[key] = value

    df = pd.DataFrame({'DateTime': pd.date_range(start=min_dt, end=max_dt, freq='1min')})
    df = df.set_index('DateTime')

    for key, value in csv_dict.items():
        df = df.join(value)

    df["basal_Insulin Delivered (U)"] = df["basal_Rate"] / 60  # df["basal_Duration (minutes)"] *
    df["basal_Insulin Delivered (U)"] = df["basal_Insulin Delivered (U)"].ffill()
    df['bolus_Trigger'] = np.where(df['bolus_Carbs Input (g)'] == 0, 'Automatic', 'Manual')
    df["bolus_Insulin Delivered (U)"] = df["bolus_Insulin Delivered (U)"].fillna(0)
    df["cgm_CGM Glucose Value (mmol/l)"] = df["cgm_CGM Glucose Value (mmol/l)"].interpolate(method='time')
    df["Time"] = (df.index).time

    return df


def main():
    df = ProcessData([])
    return jsonify(df.to_dict(orient='records'))


if __name__ == "__main__":
    app.run(debug=True)
