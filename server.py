from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS
import pandas as pd
from io import StringIO

app = Flask(__name__)
CORS(app)


def ProcessData(csv_dict):
    df = pd.DataFrame(np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
                      columns=['a', 'b', 'c'])
    return df


def PlotImage(df):
    img = df.plot("a", use_index=True)
    pass


# @app.route('/process-data', methods=['POST', 'OPTIONS'])
# def post_data():
#     df = ProcessData(None)  # Adjust this based on your needs
#     return jsonify(df.to_dict(orient='records'))
#

@app.route('/post_data', methods=['POST', 'OPTIONS'])
def post_data():
    # Define the expected keys for the uploaded files
    expected_keys = ['basal', 'bolus', 'insulin', 'alarms', 'bg', 'cgm']
    csv_dict = {key: [] for key in expected_keys}  # Initialize dict with empty lists

    # Check for uploaded files
    print(f'file_contensssss{request.files}')

    for key in expected_keys:
        if key in request.files:
            file_list = request.files.getlist(key)  # Use getlist to handle multiple files

            for file in file_list:
                # Check if the file is not empty
                if file.filename == '':
                    return jsonify({'error': f'No file selected for {key}'}), 400

                # Read the file content into a DataFrame
                try:
                    file_content = file.stream.read().decode("utf-8")
                    print(f'file_content {file_content}')
                    df = pd.read_csv(StringIO(file_content), skiprows=1)
                    csv_dict[key].append(df.to_dict(orient='records'))  # Append the DataFrame's dictionary to the list

                except Exception as e:
                    return jsonify({'error': f'Error processing file {key}: {str(e)}'}), 500

    data = jsonify(csv_dict)
    # process_csv(data)
    return jsonify(csv_dict)  # Return the dictionary of DataFrames

    # Return the dictionary with DataFrames converted to JSON
    # return jsonify({key: df.to_dict(orient='records') for key, df in csv_dict.items()})


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
