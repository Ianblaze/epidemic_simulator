import json
import numpy as np
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler

# Generate Venom dataset
# Input: [pop (M), flights, ships]
# Output: [r0, incubation, lethality, air, water]
X_venom = []
y_venom = []

for _ in range(5000):
    pop = np.random.uniform(0.1, 1500)
    flights = np.random.uniform(0, 1)
    ships = np.random.uniform(0, 1)
    
    # AI logic:
    # High pop -> need high R0
    r0 = np.random.uniform(5.0, 12.0) + (pop / 1500.0) * 6.0
    
    # High flights -> maximize air to exploit it
    air = 0.5 + (flights * 0.4) + np.random.uniform(-0.1, 0.1)
    
    # High ships -> maximize water to exploit it
    water = 0.5 + (ships * 0.4) + np.random.uniform(-0.1, 0.1)
    
    # Incubation: 5-14 days
    incubation = np.random.uniform(5, 14)
    
    # Lethality: keep it reasonable (1% to 5%)
    lethality = np.random.uniform(0.01, 0.05)
    
    X_venom.append([pop, flights, ships])
    y_venom.append([r0, incubation, lethality, max(0.0, min(1.0, air)), max(0.0, min(1.0, water))])

X_v = np.array(X_venom)
y_v = np.array(y_venom)

scaler_X_v = StandardScaler()
X_v_scaled = scaler_X_v.fit_transform(X_v)

scaler_y_v = StandardScaler()
y_v_scaled = scaler_y_v.fit_transform(y_v)

print("Training Venom...")
model_v = MLPRegressor(hidden_layer_sizes=(16, 16), activation='relu', max_iter=1000)
model_v.fit(X_v_scaled, y_v_scaled)

venom_data = {
    'scaler_X_mean': scaler_X_v.mean_.tolist(),
    'scaler_X_scale': scaler_X_v.scale_.tolist(),
    'scaler_y_mean': scaler_y_v.mean_.tolist(),
    'scaler_y_scale': scaler_y_v.scale_.tolist(),
    'weights': [w.tolist() for w in model_v.coefs_],
    'biases': [b.tolist() for b in model_v.intercepts_]
}

with open('src/data/venom_model.json', 'w') as f:
    json.dump(venom_data, f)
print("Venom saved.")

print('Training Aegis...')
X_aegis = []
y_aegis = []

for _ in range(5000):
    r0 = np.random.uniform(1.0, 20.0)
    incubation = np.random.uniform(1, 30)
    lethality = np.random.uniform(0.0, 1.0)
    air = np.random.uniform(0, 1)
    water = np.random.uniform(0, 1)
    
    # AEGIS Logic: Calculate appropriate initial defense levels (lower baseline to allow spread)
    intervention = min(1.0, (r0 / 20.0) * 0.3 + 0.05 + np.random.uniform(0, 0.1))
    
    # If air/water transmission is high, close borders
    border = min(1.0, ((air + water) / 2.0) * 0.3 + 0.05 + np.random.uniform(0, 0.1))
    
    # Hygiene based on general danger
    hygiene = min(1.0, (lethality * 0.3 + (r0/20.0) * 0.3) + 0.05 + np.random.uniform(0, 0.1))
    
    # Quarantine based on incubation
    quarantine = min(1.0, (incubation / 30.0) * 0.3 + 0.05 + np.random.uniform(0, 0.1))
    
    # Vaccine based on lethality
    vaccine = min(1.0, lethality * 0.5 + 0.1 + np.random.uniform(0, 0.1))
    
    X_aegis.append([r0, incubation, lethality, air, water])
    y_aegis.append([max(0.0, intervention), max(0.0, border), max(0.0, hygiene), max(0.0, quarantine), max(0.0, vaccine)])

X_a = np.array(X_aegis)
y_a = np.array(y_aegis)

scaler_X_a = StandardScaler()
X_a_scaled = scaler_X_a.fit_transform(X_a)

scaler_y_a = StandardScaler()
y_a_scaled = scaler_y_a.fit_transform(y_a)

model_a = MLPRegressor(hidden_layer_sizes=(16, 16), activation='relu', max_iter=1000)
model_a.fit(X_a_scaled, y_a_scaled)

aegis_data = {
    'scaler_X_mean': scaler_X_a.mean_.tolist(),
    'scaler_X_scale': scaler_X_a.scale_.tolist(),
    'scaler_y_mean': scaler_y_a.mean_.tolist(),
    'scaler_y_scale': scaler_y_a.scale_.tolist(),
    'weights': [w.tolist() for w in model_a.coefs_],
    'biases': [b.tolist() for b in model_a.intercepts_]
}

with open('src/data/aegis_model.json', 'w') as f:
    json.dump(aegis_data, f)
print('Aegis saved.')
