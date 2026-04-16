import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Training Script for AIDRO Disaster Prediction
def train_model():
    print("Initializing AIDRO ML Training Engine...")
    
    # In a real scenario, this data would come from historical weather/seismic CSVs
    # Features: [temperature, seismic_activity, water_level, wind_speed, humidity]
    data = {
        'temp': [30, 25, 35, 20, 40, 15, 32, 28],
        'seismic': [0.1, 0.5, 0.2, 0.8, 0.1, 0.9, 0.3, 0.4],
        'water': [10, 50, 20, 80, 15, 90, 30, 40],
        'wind': [5, 50, 10, 100, 8, 120, 15, 20],
        'disaster_occurred': [0, 1, 0, 1, 0, 1, 0, 0] # 1 = Yes, 0 = No
    }
    
    df = pd.DataFrame(data)
    X = df.drop('disaster_occurred', axis=1)
    y = df['disaster_occurred']
    
    # Train a Random Forest model
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    
    # Save the model artifact
    joblib.dump(model, 'disaster_model.pkl')
    print("Model saved to disaster_model.pkl")

if __name__ == "__main__":
    train_model()
