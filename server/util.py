import pickle
import json
import numpy as np

__locations = None
__data_columns = None
__model = None


def load_saved_artifacts():
    global __data_columns
    global __locations
    global __model

    print("loading saved artifacts...start")

    # Loading data columns
    with open("./artifacts/columns1.json", "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # first 3 columns are sqft, bath, bhk

    # Loading the model
    with open('./artifacts/banglore_home_prices_model.pickle1', 'rb') as f:
        __model = pickle.load(f)

    print("loading saved artifacts...done")


def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)


def get_location_names():
    return __locations


def get_data_columns():
    return __data_columns
