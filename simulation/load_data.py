import pandas as pd
import numpy as np


def load_data(filepath):
    print(f"Loading data from {filepath}...")
    try:
        df = pd.read_csv(filepath, header=None)
        all_data = df.values

        # Separate normal and sick data
        data_normal = all_data[all_data[:, -1] == 0]
        data_sick = all_data[all_data[:, -1] > 0]

        print("Database Loaded Successfully!")
        return data_normal, data_sick

    except FileNotFoundError:
        print("File not found! Generating dummy data.")
        # Generate dummy data if file not found
        dummy = [np.random.rand(188)]
        return dummy, dummy
