# Epidemic Simulator

> **An interactive global epidemic simulation and outbreak strategy platform built with React, Vite, Three.js and a browser-executed SEIR model.**
>
> **Development environment:** The project was developed and tested on **Linux Mint running inside a virtual machine (VM)**. **Docker and Docker Compose** were used for containerized builds and deployment, with Nginx serving the production build.

Epidemic Simulator is a visual, interactive epidemic modelling application that simulates disease spread across a connected world of countries. It combines a compartmental **SEIR-style epidemiological model**, international mobility, land-border propagation, mutation events, vaccination dynamics, country-level metadata, historical disease profiles, live epidemic curves, event/news generation, and several lightweight machine-learning models.

The project is designed as an educational and simulation-oriented experience rather than a clinical, public-health, forecasting, or operational decision-support system.

---

## Table of Contents

- [Overview](#overview)
- [Project Goals](#project-goals)
- [Core Features](#core-features)
- [How the Simulation Works](#how-the-simulation-works)
  - [SEIR Compartment Model](#seir-compartment-model)
  - [Transmission Dynamics](#transmission-dynamics)
  - [International Mobility](#international-mobility)
  - [Land-Border Spread](#land-border-spread)
  - [Mutations and Variants](#mutations-and-variants)
  - [Vaccination System](#vaccination-system)
  - [Government Defenses](#government-defenses)
  - [Dynamic Events and News](#dynamic-events-and-news)
  - [AEGIS and Doomsday Modes](#aegis-and-doomsday-modes)
- [Machine Learning Models](#machine-learning-models)
  - [AI Epidemic Predictor](#ai-epidemic-predictor)
  - [Optimizer Model](#optimizer-model)
  - [VENOM Model](#venom-model)
  - [AEGIS Model](#aegis-model)
  - [Model Training Pipeline](#model-training-pipeline)
- [Data Architecture](#data-architecture)
- [Application Architecture](#application-architecture)
- [Frontend and Visualization](#frontend-and-visualization)
- [User Workflow](#user-workflow)
- [Project Structure](#project-structure)
- [Key Parameters](#key-parameters)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [Building for Production](#building-for-production)
- [Technical Details](#technical-details)
- [Design Decisions](#design-decisions)
- [Limitations and Assumptions](#limitations-and-assumptions)
- [Model and Data Caveats](#model-and-data-caveats)
- [Future Improvements](#future-improvements)
- [Troubleshooting](#troubleshooting)
- [Credits and Data Sources](#credits-and-data-sources)

---

# Overview

Epidemic Simulator models a hypothetical infectious disease outbreak beginning in one country and evolving over simulated time.

The simulation maintains a separate epidemiological state for each country:

- **S — Susceptible**
- **E — Exposed**
- **I — Infectious**
- **R — Recovered**
- **D — Deceased**

The local disease model is then combined with global connectivity. Infection can move between countries through:

1. The underlying compartment model
2. Air/flight connectivity
3. Maritime connectivity
4. Land-border propagation
5. Additional isolated-country spillover events at very large global outbreak sizes

The result is a world-scale simulation in which the same pathogen can behave differently depending on:

- Reproduction number
- Incubation period
- Infectious period
- Case fatality rate
- Intervention strength
- Border controls
- International connectivity
- Water and air transmission parameters
- Population
- Vaccine research progress
- Random stochastic events
- Emergence of variants

The application presents this simulation through an interactive map, live charts, country intelligence panels, an event/news log, disease controls and historical pathogen profiles.

---

# Project Goals

The project was developed around several goals.

## 1. Demonstrate Epidemiological Modelling

The core objective is to implement a computational epidemic model based on the SEIR family of compartmental models.

Rather than treating the world as a single population, the application maintains independent epidemiological states for individual countries.

## 2. Model Global Connectivity

A disease does not remain geographically isolated once international travel is introduced.

The simulator therefore adds a mobility layer on top of the compartment model so that infected populations can create spillover into connected countries.

## 3. Visualize an Epidemic in Real Time

The application is intentionally highly visual.

Users can observe:

- Global disease progression
- Country-level spread
- Population compartments
- Live epidemic curves
- Infection milestones
- Death milestones
- New variants
- Vaccine progress
- Country intelligence
- Simulation time

## 4. Explore Intervention Scenarios

Users can change biological and policy parameters and observe how the resulting epidemic changes.

This turns the application into an interactive scenario-testing environment rather than a static epidemiology calculator.

## 5. Demonstrate Machine Learning Integration

The project also demonstrates how small neural-network models can be trained offline and exported into JSON so they can be executed directly inside a browser without requiring a Python backend or model-serving API.

---

# Core Features

### Global Simulation

- Country-by-country epidemiological states
- SEIR-style disease progression
- Recovery and mortality
- Real-time simulation clock
- 1×, 3× and 10× simulation speeds
- Pause/resume/reset controls

### Disease Configuration

Users can configure:

- R0
- Case fatality rate
- Incubation period
- Infectious period
- Air transmission
- Water transmission
- Mutation rate
- Travel volume
- Intervention stringency
- Border strictness
- Hygiene compliance
- Quarantine efficiency
- Vaccine research funding

### Global Mobility

The simulator includes:

- Flight route data
- Airport metadata
- Seaport metadata
- Country adjacency/neighbor information
- Mobility-weighted infection spillover

### Variants

The simulation can generate new variants probabilistically.

Each variant receives:

- A generated identifier
- A Greek-letter style name
- An R0 modifier
- An immune-escape value
- An emergence day

### Vaccine System

The simulation includes a research/deployment system where:

1. Vaccine progress increases according to funding.
2. Progress is affected by global stability.
3. At 100%, initial vaccine availability is assigned to major countries.
4. Vaccine availability can propagate through neighboring countries.
5. Vaccinated susceptible individuals are moved into the recovered/immune compartment.

### Historical Disease Database

The application contains a separate historical pathogen database with approximately 50 disease records.

Profiles contain information such as:

- Disease name
- Type
- Origin
- Year
- Source/origin description
- Historical infected count
- Historical deaths
- R0
- Incubation
- Infectious period
- Case fatality information
- Historical progression chart data

### Country Intelligence

Countries have associated metadata including:

- Population
- Continent/region
- Baseline defense values
- Climate
- Density
- Healthcare characteristics
- Connectivity
- Recommendations
- Pathogen-related intelligence

### Live Visualization

The interface includes:

- Cinematic 3D Earth landing screen
- Interactive country selection
- Flat world simulation map
- Live epidemic charts
- Event/news ticker
- Population compartment bar
- Country intelligence panel
- Disease profile charts
- HUD-style simulation interface

---

# How the Simulation Works

## SEIR Compartment Model

The core epidemiological engine is implemented in:

```text
src/simulation/seir.js
```

Each country begins with:

```text
S = population
E = 0
I = 0
R = 0
D = 0
```

The outbreak seed changes this state by moving a small number of people from susceptible into exposed and infectious compartments.

The model then progresses one simulation day at a time.

---

## SEIR Compartment Definitions

### Susceptible — S

People who have not yet been infected and can potentially contract the disease.

### Exposed — E

People who have been infected but are still in the incubation phase.

### Infectious — I

People currently capable of transmitting the disease.

### Recovered — R

People who have recovered and are treated by the model as immune.

### Deceased — D

People who died as a result of the simulated disease.

The deceased compartment is cumulative and is not included in the active population used for transmission calculations.

---

# SEIR Equations

The implementation calculates several epidemiological rates.

### Effective reproduction number

The model first modifies the configured R0:

```text
effectiveR0 =
    R0
    × (1 - interventionStringency × 0.8)
    × livestockMultiplier
```

The livestock multiplier is:

```text
livestockMultiplier =
    1 + livestockAffection × 1.5
```

This allows the simulation to represent an additional amplification factor associated with livestock/animal interaction.

### Transmission rate

```text
beta = effectiveR0 / infectiousPeriod
```

### Incubation transition

```text
sigma = 1 / incubationPeriod
```

### Recovery rate

```text
gamma =
    (1 / infectiousPeriod)
    × (1 - caseFatalityRate)
```

### Mortality rate

```text
mu =
    (1 / infectiousPeriod)
    × caseFatalityRate
```

### Population used for transmission

```text
N = S + E + I + R
```

The number of new exposed individuals is calculated as:

```text
newExposed =
    beta × S × I / N × dt
```

The exposed-to-infectious transition is:

```text
newInfectious =
    sigma × E × dt
```

Recovery is:

```text
newRecovered =
    gamma × I × dt
```

Deaths are:

```text
newDeaths =
    mu × I × dt
```

The implementation clamps transitions to prevent negative compartment values and proportionally scales recovery/death flows if the amount leaving the infectious compartment would exceed the available infectious population.

---

# Transmission Dynamics

The simulator does not rely on the SEIR equations alone.

A second layer handles movement between countries.

The architecture can therefore be thought of as:

```text
                  ┌──────────────────────┐
                  │  Disease Parameters  │
                  └──────────┬───────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   SEIR Engine   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        Land Borders      Flights        Shipping
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    Country Spillover
                             │
                             ▼
                    Global Epidemic State
```

This separation makes the simulation easier to reason about and allows mobility to be changed independently from the underlying compartment model.

---

# International Mobility

Mobility logic is implemented in:

```text
src/simulation/mobility.js
```

The application also contains:

```text
src/data/flightRoutes.js
src/data/transit.js
```

## Flight Routes

Flight routes contain connections such as:

```text
from → to → volume
```

The route volume represents relative connectivity.

The mobility engine converts these routes into an adjacency map.

For each country:

```text
country → neighboring countries
```

Each connection retains a travel volume.

## Travel Infection Formula

The travel layer calculates:

```text
travelRate =
    routeVolume × travelVolume × 0.001
```

The spillover contribution is based on the infectious population and the infected fraction:

```text
travelInfections =
    travelRate × I × infectedFraction
```

The resulting infections are accumulated for the destination country.

---

# Air and Maritime Connectivity

The application includes a large transit dataset containing airport and seaport metadata.

The data is used in the AI scenario generation system to estimate how globally connected a country is.

For example:

```text
air connectivity =
    number of airports / 15
```

with the value capped at:

```text
1.0
```

Similarly:

```text
maritime connectivity =
    number of seaports / 5
```

also capped at:

```text
1.0
```

These normalized values become inputs to the VENOM neural network.

---

# Land-Border Spread

Countries also contain neighboring-country information.

When infection inside a country becomes sufficiently large, the simulator can attempt to seed one of its neighbors.

The probability is influenced by R0:

```text
borderSpreadChance =
    0.01 × R0
```

Border strictness can reduce the chance that this transmission succeeds.

Long incubation periods also interact with border controls through a stealth factor:

```text
stealthFactor =
    min(0.8, incubationPeriod / 20)
```

Effective border strictness becomes:

```text
effectiveStrictness =
    max(0, borderStrictness - stealthFactor)
```

This means that the simulation treats longer incubation as making border screening less effective.

---

# Additional Spillover

When the global infected population becomes extremely large, the simulation can also create stochastic spillover into otherwise unaffected locations.

This is intended as a gameplay/simulation mechanism for representing unexpected introduction pathways.

It is not a scientifically calibrated ecological model.

---

# Mutations and Variants

Mutation logic is implemented in:

```text
src/simulation/mutations.js
```

The mutation probability depends on:

- Configured mutation rate
- Current global infection count

The basic probability is:

```text
p =
    mutationRate
    × (globalInfected / 100,000,000)
    × 0.01
```

The result is capped at:

```text
0.3
```

per simulation step.

If a mutation occurs, the simulator creates a variant containing:

```text
id
name
r0Modifier
immuneEscape
emergenceDay
```

The variant receives an R0 multiplier between approximately:

```text
0.8 and 1.4
```

It also receives an immune-escape value between:

```text
0 and 0.3
```

---

## Variant Immune Escape

When a new variant appears, a fraction of recovered/immune individuals can be returned to the susceptible compartment:

```text
escaped =
    R × immuneEscape
```

The state becomes:

```text
S = S + escaped
R = R - escaped
```

The variant also modifies the global R0:

```text
newR0 =
    currentR0 × r0Modifier
```

This allows a new variant to change the future trajectory of the simulation.

---

# Vaccination System

Vaccination is integrated into the main simulation loop.

## Research Progress

Vaccine progress increases based on:

- Vaccine funding
- Global stability

The stability multiplier is approximately:

```text
globalHealthy / globalAlive
```

where:

```text
globalHealthy = S + R
globalAlive = S + E + I + R
```

The progress increment is:

```text
vaccineProgress +=
    vaccineFunding
    × 0.33
    × stabilityMultiplier
```

Progress is capped at:

```text
100%
```

## Deployment

Once progress reaches 100%:

1. The vaccine becomes available in an initial set of prominent countries.
2. Vaccination begins locally.
3. Vaccine availability can spread through land neighbors.
4. A fraction of susceptible individuals is moved into the recovered compartment.

The vaccination mechanism is intentionally simplified for simulation purposes.

---

# Government Defenses

The simulator supports several defense parameters:

| Parameter | Meaning |
|---|---|
| Intervention Stringency | Reduces effective transmission |
| Border Strictness | Blocks some cross-border infection events |
| Hygiene Compliance | Represents population-level protective behavior |
| Quarantine Efficiency | Represents isolation effectiveness |
| Vaccine Funding | Controls vaccine research progress |

Not every parameter is directly applied in the same mathematical location. Some are part of the AI scenario layer and game-mode logic.

This distinction is important: a displayed control should not automatically be interpreted as a calibrated epidemiological coefficient.

---

# Dynamic Events and News

The simulation generates an event feed during execution.

The event engine tracks:

- Infection milestones
- Death milestones
- Recovery milestones
- Countries becoming infected
- Epidemic epicenters
- Healthcare pressure
- Travel disruption
- Vaccine research
- Mutation events
- Recovery waves

Examples of milestone thresholds include:

```text
100 infections
1,000 infections
10,000 infections
100,000 infections
1 million infections
5 million infections
10 million infections
50 million infections
100 million infections
500 million infections
1 billion infections
```

Death milestones are tracked separately.

The system also attempts to prevent duplicate messages by maintaining a milestone set and checking whether a message has already been emitted.

---

# AEGIS and Doomsday Modes

The application contains two major scenario modes.

## Project AEGIS

AEGIS is the defensive scenario.

The user:

1. Selects an outbreak country.
2. Selects a disease profile.
3. Adjusts biological characteristics.
4. Runs the AEGIS AI defense model.
5. Receives recommended defense parameters.
6. Starts the simulation.
7. Attempts to contain the outbreak.

The AEGIS system models an automated defense response.

Its output includes:

- Intervention stringency
- Border strictness
- Hygiene compliance
- Quarantine efficiency
- Vaccine funding

It also produces an estimated target eradication day.

### AEGIS prediction

The application calculates a prediction using the selected disease parameters and a simplified timing heuristic involving:

- Effective R0
- Vaccine funding
- Vaccine deployment timing
- Natural decay/containment timing
- Herd-immunity timing

The prediction is a simulation/gameplay estimate rather than a validated epidemic forecast.

---

# Project Doomsday

Doomsday is the adversarial scenario.

The application automatically:

1. Selects a country.
2. Selects a base disease profile.
3. Reads the country's population.
4. Counts associated airports and seaports.
5. Normalizes those connectivity values.
6. Passes the resulting values through the VENOM neural network.
7. Generates a simulated pathogen configuration.
8. Estimates an outbreak endpoint.
9. Presents the generated scenario before deployment.

The implementation is designed as a fictional simulation mechanic and should not be interpreted as a real-world pathogen engineering system.

---

# AEGIS Emergency Protocol

The AEGIS simulation also contains a threshold-based emergency mechanism.

If the proportion of exposed + infected individuals exceeds approximately:

```text
40% of global population
```

the simulation triggers the emergency sanitization event.

The current implementation then moves exposed and infected populations into the deceased compartment.

This is deliberately fictional and represents an extreme game-state mechanic rather than a public-health recommendation.

The UI labels this as a nuclear sanitization protocol.

---

# Machine Learning Models

The project includes four JSON neural-network model artifacts:

```text
src/data/ai_model.json
src/data/optimizer_model.json
src/data/venom_model.json
src/data/aegis_model.json
```

The models were trained offline with Python/scikit-learn and exported as:

- Input scaler means
- Input scaler scales
- Output scaler means
- Output scaler scales
- Neural-network weights
- Neural-network biases

The browser performs the forward pass manually.

No Python model server is required at runtime.

---

# AI Epidemic Predictor

File:

```text
src/data/ai_model.json
```

Runtime integration:

```text
src/components/ParameterSliders.jsx
```

The model accepts four inputs:

```text
[R0, incubationPeriod, infectiousPeriod, caseFatalityRate]
```

It predicts three outputs:

```text
peakDay
peakInfections
totalDeaths
```

Architecture:

```text
4 inputs
   ↓
12-neuron hidden layer
   ↓
3 outputs
```

The model uses:

- StandardScaler-style input normalization
- ReLU activation in the hidden layer
- Linear output layer
- Output inverse scaling

The resulting predictions are rounded and constrained to non-negative values.

### Important implementation note

The predictor is implemented in the parameter component but is not currently the primary driver of the simulation engine. The actual simulation still runs from the SEIR engine.

---

# Optimizer Model

File:

```text
src/data/optimizer_model.json
```

The model has:

```text
4 inputs
16-neuron hidden layer
8-neuron hidden layer
1 output
```

Its training artifact is retained in the repository as part of the project's machine-learning experimentation.

The current frontend does not directly import or execute this model.

It should therefore be considered an auxiliary/experimental model artifact rather than a required runtime dependency.

---

# VENOM Model

File:

```text
src/data/venom_model.json
```

Training inputs:

```text
Population in millions
Flight connectivity
Maritime connectivity
```

The model produces five simulated pathogen characteristics:

```text
R0
Incubation period
Lethality
Air transmission
Water transmission
```

Architecture:

```text
3 inputs
   ↓
16-neuron hidden layer
   ↓
16-neuron hidden layer
   ↓
5 outputs
```

The model is executed manually in:

```text
src/components/Controls.jsx
```

The model output is then constrained into usable simulation ranges.

---

# AEGIS Model

File:

```text
src/data/aegis_model.json
```

Training inputs:

```text
R0
Incubation period
Lethality
Air transmission
Water transmission
```

The model produces five defense parameters:

```text
Intervention stringency
Border strictness
Hygiene compliance
Quarantine efficiency
Vaccine funding
```

Architecture:

```text
5 inputs
   ↓
16-neuron hidden layer
   ↓
16-neuron hidden layer
   ↓
5 outputs
```

The model is used by the AEGIS controls to generate an automated defense configuration.

---

# Model Training Pipeline

Training is performed by:

```text
train_duel_models.py
```

Dependencies:

```python
json
numpy
scikit-learn
```

The training script uses:

```python
MLPRegressor
StandardScaler
```

The models are generated from synthetic data.

## VENOM Dataset Generation

The script generates 5,000 synthetic examples.

Inputs are randomly generated population and connectivity values.

Outputs are generated using deterministic heuristic relationships plus random variation.

The trained neural network learns these synthetic relationships.

## AEGIS Dataset Generation

The script generates 5,000 synthetic examples using:

```text
R0
Incubation
Lethality
Air transmission
Water transmission
```

Defense outputs are generated using heuristic formulas.

The neural network then learns to approximate those formulas.

## Important

These models are therefore demonstrations of machine-learning integration.

They are **not trained on a validated clinical or epidemiological dataset** and should not be treated as scientific forecasting models.

---

# Data Architecture

The major datasets are located in:

```text
src/data/
```

## countries.js

Contains country-level data including:

- Country ID
- Country name
- Population
- Baseline defense values
- Region
- Neighbor relationships

The current dataset contains approximately **194 country records**.

---

## flightRoutes.js

Contains predefined country-to-country mobility connections.

Each route contains:

```text
from
to
volume
```

The route volume is used by the mobility simulation.

---

## transit.js

Contains airport and seaport metadata.

The data includes fields such as:

```text
id
name
latitude
longitude
country
```

This dataset is also used when estimating a country's transport connectivity for the VENOM scenario generator.

---

## diseaseProfiles.js

Contains the configurable disease presets used by the simulation interface.

The database currently includes approximately 33 selectable profiles, including historical diseases and fictional scenario profiles.

Each profile can define:

```text
name
R0
caseFatalityRate
incubationPeriod
infectiousPeriod
airImmunity
waterImmunity
```

---

## historical_diseases.js

Contains approximately 50 historical disease records.

These are displayed in the Pathogen Database UI.

Each record can include historical progression data that is rendered as a custom SVG chart.

---

## historical_playback.json

This is a large historical simulation/playback dataset included in the repository.

It contains precomputed historical progression information.

It is retained as part of the project's data layer, although the current main simulation flow does not depend on it.

---

## intelligence.js

Contains country-specific intelligence used by the simulation start screen.

The intelligence system provides information such as:

- Climate
- Density
- Healthcare
- Connectivity
- Recommendations
- Suggested pathogen metadata

This data is used for UI intelligence rather than as a direct replacement for the SEIR equations.

---

# Application Architecture

The project follows a component-based React architecture.

```text
React Application
│
├── Home / Landing
│   └── Cinematic Earth
│
├── Simulation
│   ├── SimulationTab
│   ├── Controls
│   ├── ParameterSliders
│   ├── LiveChart
│   ├── EventLog
│   └── FlatWorldMap
│
├── Disease Profiles
│   └── DiseaseProfilesTab
│
├── Simulation Engine
│   ├── useSimulation
│   ├── seir.js
│   ├── mobility.js
│   └── mutations.js
│
└── Data / Models
    ├── Countries
    ├── Diseases
    ├── Transit
    ├── Intelligence
    └── Neural-network JSON artifacts
```

---

# React State Management

The main simulation state is centralized in:

```text
src/hooks/useSimulation.js
```

This hook manages:

- Current day
- Running/stopped state
- Staging state
- Country states
- Seed country
- Event log
- Chart data
- Variants
- Simulation speed
- Game mode
- Vaccine progress
- Prediction results
- Emergency protocol state

React state is combined with `useRef` objects for values that need to remain immediately accessible inside the simulation interval.

This avoids stale closure problems when the simulation runs continuously.

---

# Simulation Tick Loop

The simulation runs through a timer.

At normal speed:

```text
1 tick ≈ 1 simulated day
```

The interval is adjusted according to the selected speed:

```text
1x  → 1000 ms/tick
3x  → ~333 ms/tick
10x → 100 ms/tick
```

Every tick approximately performs:

```text
1. Update vaccine research
2. Process inbound infections
3. Process inbound vaccine availability
4. Check vaccine deployment
5. Advance SEIR states
6. Apply vaccination
7. Apply land-border spread
8. Calculate global totals
9. Apply rare spillover
10. Evaluate emergency protocol
11. Generate news
12. Check mutation
13. Update chart data
14. Update React state
```

---

# Frontend Visualization

## Cinematic Earth

Implemented in:

```text
src/components/CinematicEarth.jsx
```

The landing page uses a Three.js-based visual experience.

It provides:

- Rotating/glowing Earth
- Country interaction
- Cinematic lighting
- Transition into the simulation interface
- Seed-country selection

---

## Flat World Map

Implemented in:

```text
src/components/FlatWorldMap.jsx
```

Once the simulation starts, the interface transitions into a flat world visualization.

The map receives live:

```text
countryStates
params
isRunning
inboundInfectionsRef
inboundVaccinesRef
seedCountry
vaccineProgress
```

This allows the visual layer to reflect the simulation engine in real time.

---

## Live Chart

Implemented in:

```text
src/components/LiveChart.jsx
```

The chart receives the time series generated by the simulation.

Each data point contains:

```text
day
E
I
R
D
```

This produces an evolving epidemic curve.

---

## Event Log

Implemented in:

```text
src/components/EventLog.jsx
```

The event log displays simulation-generated news and milestones.

---

# Pathogen Database

The Pathogen Database is accessible through the second main navigation tab.

Users can:

1. Search for a disease.
2. Select a pathogen.
3. View its metadata.
4. Inspect its historical progression chart.
5. Load its epidemiological parameters into the simulation.

The database uses:

```text
src/data/historical_diseases.js
```

while the simulation preset system uses:

```text
src/data/diseaseProfiles.js
```

These are intentionally separate datasets:

- `historical_diseases.js` → historical reference/profile interface
- `diseaseProfiles.js` → simulation-ready presets

---

# User Workflow

## Step 1 — Launch

Open the application and enter the simulation from the cinematic Earth interface.

## Step 2 — Choose a Mode

Choose:

```text
PROJECT AEGIS
```

or:

```text
PROJECT DOOMSDAY
```

## Step 3 — Configure

Depending on the mode, select:

- Outbreak country
- Disease profile
- Biological parameters
- Defense configuration

## Step 4 — Review AI Output

AI-assisted scenario generation can provide:

- Disease parameters
- Defense parameters
- Estimated endpoint day
- Country intelligence

## Step 5 — Stage the Simulation

The simulation is prepared before execution.

## Step 6 — Start

The outbreak begins with a small seeded population in the selected country.

## Step 7 — Observe

Watch:

- World spread
- Active cases
- Exposed population
- Recoveries
- Deaths
- Variants
- Vaccine progress
- News events

## Step 8 — Analyze

Use:

- Epidemic curves
- Country intelligence
- Event log
- Variant list
- Global population breakdown

## Step 9 — Reset

Reset the simulation and create another scenario.

---

# Project Structure

```text
epidemic_simulator/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
├── train_duel_models.py
│
└── src/
    │
    ├── App.jsx
    ├── App.css
    ├── ErrorBoundary.jsx
    ├── index.css
    ├── main.jsx
    │
    ├── components/
    │   ├── CinematicEarth.jsx
    │   ├── Controls.jsx
    │   ├── DiseaseCard.jsx
    │   ├── DiseaseProfilesTab.jsx
    │   ├── EventLog.jsx
    │   ├── FlatWorldMap.jsx
    │   ├── InteractiveGlobe.jsx
    │   ├── LiveChart.jsx
    │   ├── ParameterSliders.jsx
    │   ├── SimulationTab.jsx
    │   └── WorldMap.jsx
    │
    ├── data/
    │   ├── aegis_model.json
    │   ├── ai_model.json
    │   ├── countries.js
    │   ├── diseaseProfiles.js
    │   ├── flightRoutes.js
    │   ├── historical_diseases.js
    │   ├── historical_playback.json
    │   ├── intelligence.js
    │   ├── optimizer_model.json
    │   ├── transit.js
    │   └── venom_model.json
    │
    ├── hooks/
    │   └── useSimulation.js
    │
    ├── pages/
    │   ├── HomePage.jsx
    │   └── HomePage.css
    │
    └── simulation/
        ├── mobility.js
        ├── mutations.js
        └── seir.js
```

---

# Key Parameters

| Parameter | Default | Role |
|---|---:|---|
| R0 | 2.5 | Baseline reproduction number |
| Incubation Period | 5.1 days | E → I transition |
| Infectious Period | 8 days | Duration of infectious progression |
| Case Fatality Rate | 0.66% | Fraction of infectious exits assigned to deaths |
| Mutation Rate | 0.15 | Controls probability of variant emergence |
| Travel Volume | 0.5 | Scales international spillover |
| Intervention Stringency | 0.0 | Reduces effective transmission |
| Population Scale | 1.0 | Available parameter for scenario scaling |
| Air Transmission | 0.5 | Scenario characteristic |
| Water Transmission | 0.5 | Scenario characteristic |
| Livestock Affection | 0.5 | Additional transmission multiplier |
| Border Strictness | 0.0 | Reduces border infection events |
| Hygiene Compliance | 0.0 | Defense parameter |
| Quarantine Efficiency | 0.0 | Defense parameter |
| Vaccine Funding | 0.0 | Controls vaccine research progress |

---

# Development Environment

The project was developed in a **Linux Mint virtual machine** rather than directly on the host operating system.

The development environment was used for:

- Installing Node.js and npm
- Installing project dependencies
- Running the Vite development server
- Testing the React application
- Running the Python machine-learning training workflow
- Managing the project with Git
- Testing the production Docker image
- Running Docker Compose locally

The development workflow can be summarized as:

```text
Windows Host
     │
     ▼
Virtual Machine
     │
     ▼
Linux Mint
     │
     ├── Node.js / npm
     ├── React / Vite
     ├── Python / scikit-learn
     ├── Git
     │
     ▼
Epidemic Simulator
     │
     ▼
Docker / Docker Compose
     │
     ▼
Nginx
     │
     ▼
Production Web Application
```

## Linux Mint Virtual Machine

Linux Mint was used as the primary development operating system inside a VM.

This provided an isolated Linux development environment for:

- Frontend development
- Python/ML experimentation
- Shell-based development workflows
- Docker testing
- Production-build verification

The application itself remains a browser-based web application, so the Linux VM is a **development and testing environment**, not a runtime requirement for end users.

In other words, users do not need Linux Mint or a virtual machine to run the compiled application.

## Docker-Based Deployment

Docker was used to verify that the project could be packaged and served independently of the development environment.

The Docker workflow uses a multi-stage build:

```text
Linux Mint Development Environment
              │
              ▼
       Docker Build
              │
              ├── Node.js build stage
              │       │
              │       └── npm install
              │           npm run build
              │
              ▼
        Production Stage
              │
              └── Nginx
                    │
                    ▼
              Static React App
```

This separation ensures that development dependencies such as Node.js tooling do not need to remain in the final production image.

Docker Compose was also used to simplify local container execution and expose the application through a host port.

# Installation

## Requirements

Recommended:

- Node.js 20+
- npm 10+
- Modern Chromium/Firefox/Safari browser

For Docker deployment:

- Docker
- Docker Compose

---

## Clone the Repository

```bash
git clone <repository-url>
cd epidemic_simulator
```

---

## Install Dependencies

```bash
npm install
```

---

# Running the Application

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL.

Typically:

```text
http://localhost:5173
```

The development server provides hot module replacement, so changes to React components are reflected immediately.

---

# Production Build

Create a production build:

```bash
npm run build
```

The compiled application is generated in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# Docker Deployment

Docker was used as part of the project's development and deployment workflow.

The application was first developed and tested inside the Linux Mint VM, after which the production build was containerized and tested using Docker.

The repository includes a multi-stage Dockerfile.

## Development-to-Deployment Workflow

```text
Linux Mint VM
     │
     ▼
Develop React application
     │
     ▼
Test with Vite
     │
     ▼
npm run build
     │
     ▼
Docker multi-stage build
     │
     ├── Node.js builder
     │       └── Vite production build
     │
     └── Nginx production image
             │
             ▼
        Docker Compose
             │
             ▼
       Local browser testing
```

## Build Process

### Stage 1 — Node Builder

The first image:

```text
node:20-alpine
```

is used to:

1. Copy package files
2. Install dependencies
3. Copy application source
4. Run the Vite production build

### Stage 2 — Nginx Server

The final image:

```text
nginx:alpine
```

serves the generated static files.

This keeps the production image smaller and removes the need to run Node as the application server.

---

# Docker Compose

The included `docker-compose.yml` exposes the application on:

```text
localhost:8080
```

Start it with:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:8080
```

To run in the background:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

---

# Technical Stack

## Frontend

- React 19
- React DOM
- Vite

## Visualization

- Three.js
- React Three Fiber
- React Three Drei
- React Three Postprocessing
- D3
- D3 Geo
- D3 Zoom
- D3 Drag
- D3 Timer
- TopoJSON
- World Atlas

## Machine Learning

- Python
- NumPy
- scikit-learn
- `MLPRegressor`
- `StandardScaler`

## Deployment

- Docker
- Nginx
- Docker Compose

---

# Why the ML Models Run in the Browser

The application does not require a backend API for inference.

Instead, the trained models are exported into JSON:

```text
weights
biases
scaler_X_mean
scaler_X_scale
scaler_y_mean
scaler_y_scale
```

The React application performs the mathematical forward pass itself.

Conceptually:

```text
Input
  ↓
Standardization
  ↓
Dense Layer
  ↓
ReLU
  ↓
Dense Layer
  ↓
ReLU
  ↓
Output Layer
  ↓
Inverse Scaling
  ↓
Prediction
```

Advantages:

- No model server
- No Python runtime required for the frontend
- No API latency
- Easy deployment as a static site
- Fully self-contained browser inference

---

# Design Decisions

## Why SEIR?

SEIR provides an additional exposed state compared with a simple SIR model.

That makes it useful for demonstrating the difference between:

```text
infection
```

and:

```text
becoming infectious
```

which is particularly important for diseases with non-zero incubation periods.

---

## Why Per-Country State?

A single global SEIR population cannot represent geographic spread.

By maintaining:

```text
country → {S,E,I,R,D}
```

the application can model:

- Different population sizes
- Local outbreaks
- Cross-border spread
- Geographic containment
- Country-specific visualization

---

## Why a Separate Mobility Layer?

Separating mobility from epidemiology allows the project to distinguish:

```text
Disease dynamics
```

from:

```text
Human movement
```

This also makes the code easier to extend with alternative transportation models.

---

# Limitations and Assumptions

This project is intentionally simplified.

## 1. It is not a clinical model

The simulation is designed for educational and interactive purposes.

It should not be used for:

- Medical decisions
- Public-health policy
- Clinical predictions
- Real outbreak forecasting
- Emergency planning

## 2. Parameters are simplified

Real epidemic modelling often requires:

- Age structure
- Contact matrices
- Vaccination status
- Waning immunity
- Hospitalization
- ICU capacity
- Healthcare-seeking behavior
- Spatial population density
- Stochastic individual-level contacts
- Seasonality
- Testing behavior
- Reporting delays
- Underdiagnosis
- Birth/death demographics
- Pathogen-specific biological mechanisms

The current model abstracts many of these away.

## 3. Mobility is not a complete transportation model

Flight and shipping data are represented through predefined routes and normalized volumes.

They are not a live global transportation feed.

## 4. AI models use synthetic training data

The machine-learning models are trained on synthetic examples generated by heuristic formulas.

Consequently, the networks primarily demonstrate:

```text
learning + serialization + browser inference
```

rather than discovering validated epidemiological relationships from observational data.

## 5. Historical data is informational

Historical disease records are presented for comparison and visualization.

They should not be interpreted as perfectly standardized epidemiological datasets.

## 6. Randomness affects outcomes

Several parts of the simulation use JavaScript's random number generator.

Therefore, two runs with identical settings can produce different outcomes.

---

# Model and Data Caveats

A major architectural distinction is:

```text
Simulation Engine ≠ AI Prediction Models
```

The SEIR engine directly determines the live simulated state.

The ML models are auxiliary scenario/prediction systems.

For example:

```text
AEGIS Model
    ↓
Defense Recommendation
    ↓
Simulation Parameters
    ↓
SEIR Simulation
```

rather than:

```text
AEGIS Model
    ↓
Complete Epidemic Simulation
```

Similarly:

```text
VENOM Model
    ↓
Scenario Parameters
    ↓
SEIR Simulation
```

This separation is important when interpreting the project technically.

---

# Future Improvements

The project can be extended substantially.

## Epidemiological Improvements

- Add age-structured SEIR
- Add hospitalization and ICU compartments
- Add asymptomatic infections
- Add reinfection
- Add waning immunity
- Add vaccination compartments
- Add birth/death demographics
- Add seasonality
- Add regional climate effects
- Add stochastic contact networks

## Mobility Improvements

- Replace static routes with real transportation datasets
- Add passenger counts
- Add airport hub centrality
- Add dynamic travel restrictions
- Add separate commuter and international mobility

## Machine Learning Improvements

- Train models on validated epidemiological datasets
- Add model evaluation metrics
- Add train/validation/test splits
- Add cross-validation
- Save model metadata
- Compare ML predictions against SEIR simulations
- Add uncertainty intervals
- Add explainability

## Simulation Improvements

- Deterministic seed support
- Monte Carlo simulation mode
- Scenario comparison
- Save/load simulations
- Export CSV
- Export simulation reports
- Compare interventions
- Rewind/pause simulation state

## UI Improvements

- More detailed country dashboards
- Timeline scrubbing
- Heatmaps
- Regional charts
- Mobile-responsive HUD
- Accessibility improvements
- Custom scenario saving
- Shareable simulation URLs

---

# Troubleshooting

## `npm install` fails

Check Node.js:

```bash
node --version
```

The project is intended for modern Node versions, with Node 20 used by the production Docker build.

Then retry:

```bash
npm install
```

---

## Port already in use

For Vite, start on another port:

```bash
npm run dev -- --port 5174
```

For Docker, change the host-side port in:

```text
docker-compose.yml
```

For example:

```yaml
ports:
  - "8081:80"
```

---

## Docker changes are not appearing

Rebuild the image:

```bash
docker compose down
docker compose up --build
```

---

## Simulation becomes very fast

Check the simulation speed control.

Available speeds are:

```text
1x
3x
10x
```

---

## Simulation does not start

Confirm that a seed country has been selected.

The simulation requires an outbreak origin before initialization.

---

# Credits and Data Sources

The project incorporates several categories of data:

- Country population and metadata
- Airport and seaport information
- Predefined flight connectivity
- Historical disease profiles
- Historical progression data
- Country intelligence metadata
- Synthetic ML training data

The transit dataset contains a comment identifying its generation from OpenFlights-derived data:

```text
Automatically generated from devansh-singh-7/SEIRD-Model OpenFlights data
```

Before deploying the project publicly, verify the licensing and attribution requirements for every third-party dataset used by the repository.

---

# Safety and Intended Use

Epidemic Simulator is a fictional/educational modelling application.

Its disease and scenario-generation features are intended to demonstrate:

- Epidemiological modelling
- Simulation programming
- Visualization
- Machine-learning integration
- Interactive systems design

The application's fictional adversarial scenarios should not be interpreted as real-world biological engineering guidance.

The project should be used for software engineering, modelling, visualization and educational experimentation.

---

# Summary

Epidemic Simulator combines multiple technical disciplines into one interactive application:

```text
                    EPIDEMIC SIMULATOR
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   Epidemiology          Mobility              AI
        │                   │                   │
       SEIR           Flights / Ships      Neural Networks
        │              Land Borders              │
        │                   │                    │
        └───────────────────┼────────────────────┘
                            ▼
                     Global Simulation
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Maps           Charts         Events
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                  Interactive Analysis
```

At its core, the project is a browser-based, country-level SEIR simulation enhanced with a mobility network, stochastic variants, vaccination mechanics, historical disease data, country intelligence, and offline-trained neural-network models.

It demonstrates how epidemiological mathematics, graph-based mobility, machine learning and modern web visualization can be integrated into a single interactive simulation platform.
