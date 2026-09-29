# Epidemic Simulator: Project Aegis & Doomsday

A highly advanced, real-time global epidemic simulator built with React, Three.js, and Python-powered Neural Networks. The simulator utilizes a meticulously designed mathematical SEIR (Susceptible, Exposed, Infectious, Recovered) engine intertwined with real-world global transit data to accurately model the spread of infectious diseases across the globe.

## 📖 Table of Contents
- [Game Modes](#-game-modes)
- [Simulation Engine & Mechanics](#-simulation-engine--mechanics)
- [Neural Network AI](#-neural-network-ai)
- [Technologies Used](#-technologies-used)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Retraining the AI Models](#-retraining-the-ai-models)
- [Contributing](#-contributing)

---

## 🎮 Game Modes

### 1. Project Aegis (Defense Mode)
You act as the architect of a deadly pathogen. Your goal is to design a disease (manipulating its R0, incubation period, lethality, and environmental resilience) capable of destroying humanity. The AI acts as Earth's defense mechanism (Project Aegis), dynamically calculating and deploying countermeasures (lockdowns, border closures, vaccine funding) based on the specific threat your pathogen poses.

### 2. Project Doomsday (Attack Mode)
You act as the Director of Global Defense. You must manage global policies, lockdowns, and vaccine research funding to protect humanity. The AI acts as the attacker, analyzing global population density and transit hubs to genetically engineer the perfect "Doomsday Pathogen" designed specifically to exploit Earth's vulnerabilities.

---

## ⚙️ Simulation Engine & Mechanics

The core of the simulation relies on a modified **SEIR** mathematical model that ticks continuously at 60 frames per second (translating to 60 in-game days per second).

- **The SEIR Math:** Individuals move strictly through `S -> E -> I -> R` pipelines based on differential equations driven by the pathogen's infectiousness (Beta) and incubation (Sigma). 
- **Global Transit Network:** The engine parses thousands of real-world airports and seaports. Infected individuals hop on flights and ships, carrying the disease across continents.
- **Land Borders & Stealth:** Diseases can spread physically across connected land borders. Pathogens with long incubation periods benefit from a "Stealth Factor" that allows them to bypass closed borders undetected.
- **Rogue Island Spread:** Completely isolated island nations (e.g., Vanuatu, Fiji) that lack airports and land borders can still be infected via rare "rogue" events (migratory birds, smuggling boats) if global infection reaches critical mass.
- **Vaccine Mechanics:** Vaccine progress is directly tied to funding. Once 100% is reached, the vaccine is rolled out globally and distributed via local clinics and land borders, aggressively shifting populations from Susceptible (S) directly to Recovered (R).
- **Herd Immunity:** If humanity fails to develop a vaccine but the pathogen's lethality is low, the disease will eventually run out of susceptible victims and burn out naturally via Herd Immunity.

---

## 🧠 Neural Network AI

The game features dual AI models built with `scikit-learn` Multi-Layer Perceptrons (MLPs). The neural weights are serialized into JSON and executed entirely client-side in the browser.

- **`venom_model.json` (Doomsday AI):** Analyzes target country population, airport density, and seaport metrics to output 5 genetically optimized pathogen traits (R0, Incubation, Lethality, Air Immunity, Water Immunity).
- **`aegis_model.json` (Aegis AI):** Analyzes the incoming pathogen's traits to output the precise required defense parameters (Intervention Stringency, Border Strictness, Hygiene, Quarantine, Vaccine Funding) without completely maxing out, ensuring a fair but challenging game.

---

## 💻 Technologies Used

- **Frontend:** React, Vite
- **3D Rendering:** Three.js, react-globe.gl, custom WebGL shaders
- **2D Mapping & Visualization:** D3.js (GeoJSON parsing, projections), Canvas API
- **AI & Data Science:** Python, numpy, scikit-learn
- **Styling:** CSS3 (Glassmorphism, custom animations)

---

## 📁 Project Architecture

```text
epidemic_simulator/
├── src/
│   ├── components/      # React UI, 3D Globe (CinematicEarth), 2D Map (FlatWorldMap)
│   ├── data/            # GeoJSON, transit data, pre-trained neural network weights
│   ├── hooks/           # useSimulation.js (The core React game loop and engine)
│   ├── simulation/      # Pure math functions (seir.js)
│   └── ...
├── scripts/             # Internal development scripts and data parsers
├── train_duel_models.py # Python script used to train the Aegis & Doomsday AI
└── vite.config.js       # Vite configuration
```

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/epidemic_simulator.git
   cd epidemic_simulator
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed.
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔬 Retraining the AI Models

If you wish to rebalance the difficulty or alter the AI's logic, you can easily retrain the models locally using Python.

1. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

2. **Install the required Python libraries:**
   ```bash
   pip install numpy scikit-learn
   ```

3. **Run the training script:**
   ```bash
   python train_duel_models.py
   ```
   This script will generate 10,000 synthetic combat scenarios, train the Multi-Layer Perceptrons, and export the new neural weights directly to `src/data/venom_model.json` and `src/data/aegis_model.json`. The React app will automatically hot-reload the new AI brains!

---

## 🤝 Contributing

Contributions are welcome! If you want to add new transit data, improve the WebGL shaders, or introduce new pathogen mutations, feel free to fork the repository and submit a pull request.
