import pandas as pd
import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler

# 1. Load Data
df = pd.read_csv('pandemic_dataset.csv')
X = df[['r0', 'incubation', 'infectious', 'cfr']].values
y = df[['peak_day', 'peak_infections', 'total_deaths']].values

# 2. Scale Features (MLPs are sensitive to unscaled data)
scaler_X = StandardScaler()
X_scaled = scaler_X.fit_transform(X)

scaler_y = StandardScaler()
y_scaled = scaler_y.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_scaled, test_size=0.1, random_state=42)

# 3. Train Model (Small 1-hidden-layer network for easy JS export)
print("Training Neural Network...")
model = MLPRegressor(hidden_layer_sizes=(12,), activation='relu', solver='adam', max_iter=1000, random_state=42)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Model R^2 Score: {score:.4f}")

# 4. Export Model Weights and Scaler Params
model_data = {
    'scaler_X_mean': scaler_X.mean_.tolist(),
    'scaler_X_scale': scaler_X.scale_.tolist(),
    'scaler_y_mean': scaler_y.mean_.tolist(),
    'scaler_y_scale': scaler_y.scale_.tolist(),
    'weights': [w.tolist() for w in model.coefs_],
    'biases': [b.tolist() for b in model.intercepts_]
}

with open('src/data/ai_model.json', 'w') as f:
    json.dump(model_data, f)
print("Exported model to src/data/ai_model.json")
