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
    r0 = np.random.uniform(5.0, 15.0) + (pop / 1500.0) * 5.0
    
    # High flights -> maximize air to exploit it. Baseline 0.4 to ensure it can escape
    air = 0.4 + (flights * 0.6) + np.random.uniform(-0.1, 0.1)
    
    # High ships -> maximize water to exploit it. Baseline 0.4
    water = 0.4 + (ships * 0.6) + np.random.uniform(-0.1, 0.1)
    
    # Incubation: longer for harder countries
    incubation = np.random.uniform(5, 14)
    
    # Lethality: keep it reasonable
    lethality = np.random.uniform(0.01, 0.1)
    
    X_venom.append([pop, flights, ships])
    y_venom.append([r0, incubation, lethality, max(0, min(1, air)), max(0, min(1, water))])

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
    
    # AEGIS Logic: Calculate appropriate (but not perfectly maxed) defense levels
    intervention = min(1.0, (r0 / 20.0) * 0.8 + np.random.uniform(0, 0.2))
    
    # If air/water transmission is high, close borders
    border = min(1.0, ((air + water) / 2.0) * 0.8 + np.random.uniform(0, 0.2))
    
    # Hygiene based on general danger
    hygiene = min(1.0, (lethality * 0.5 + (r0/20.0) * 0.5) + np.random.uniform(0, 0.2))
    
    # Quarantine based on incubation
    quarantine = min(1.0, (incubation / 30.0) * 0.8 + np.random.uniform(0, 0.2))
    
    # Vaccine based on lethality
    vaccine = min(1.0, lethality * 0.9 + np.random.uniform(0, 0.1))
    
    X_aegis.append([r0, incubation, lethality, air, water])
    y_aegis.append([intervention, border, hygiene, quarantine, vaccine])

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
