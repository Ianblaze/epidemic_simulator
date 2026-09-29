# PROJECT DOCUMENTATION: EPIDEMIC SIMULATOR

## 1. Abstract
The Epidemic Simulator is an advanced, real-time epidemiological modeling tool and interactive application designed to visualize and simulate the global spread of infectious diseases. Utilizing a robust SEIR (Susceptible, Exposed, Infectious, Recovered) mathematical engine and real-world global transit data (airports and seaports), the system accurately replicates the nonlinear dynamics of pathogen transmission. Furthermore, the project incorporates Artificial Intelligence via Multi-Layer Perceptrons (MLPs) to drive dual simulation modes—Project Aegis (Defensive AI) and Project Doomsday (Offensive AI)—creating a highly dynamic environment. The entire ecosystem was developed and tested within a dedicated Linux Mint Virtual Machine environment and containerized using Docker for scalable, cross-platform deployment.

---

## 2. Introduction
In an increasingly interconnected world, understanding the mechanisms of global pandemics is critical. This project was developed to provide an interactive, visual, and mathematically rigorous platform for modeling epidemics. Unlike static models, this simulator operates at 60 frames per second (translating to 60 in-game days per second), allowing users to observe exponential spread, herd immunity burnout, and the efficacy of containment protocols in real-time on both 3D globe and 2D map projections.

---

## 3. Project Objectives
1. **Mathematical Accuracy:** Implement a high-performance SEIR epidemiological model that scales to global populations (8+ billion) without performance degradation.
2. **Transit Integration:** Map real-world transit networks (flights and maritime routes) and land borders to accurately simulate cross-border contamination.
3. **Artificial Intelligence:** Train and deploy neural networks capable of intelligently responding to user inputs—either by engineering a custom pathogen or by enacting defensive government policies.
4. **Platform Independence & Deployment:** Ensure the application is strictly environment-agnostic via Docker containerization, built and tested rigorously within a Linux Mint environment.

---

## 4. System Architecture
The software architecture is bifurcated into a high-performance frontend visualization layer and an embedded AI logic layer.

### 4.1 Frontend Technologies
- **React.js & Vite:** Powers the core UI, state management, and real-time data binding. Vite provides an ultra-fast build pipeline.
- **Three.js & react-globe.gl:** Renders the "Cinematic Earth," a 3D WebGL globe utilizing custom shader materials for atmospheric glow, dynamic clouds, and precise geospatial D3 mappings.
- **D3.js & Canvas API:** Drives the 2D `FlatWorldMap` projection, parsing GeoJSON topologies and rendering hundreds of thousands of dynamic Canvas dots (representing localized infection densities) at 60 FPS.

### 4.2 Artificial Intelligence & Data Layer
- **Python (scikit-learn):** Utilized exclusively in the development pipeline to train the dual Multi-Layer Perceptron (MLP) neural networks.
- **Data Export:** The trained neural weights and biases are exported as flat JSON files (`venom_model.json` and `aegis_model.json`). This eliminates the need for a heavy Python backend in production, allowing the React frontend to mathematically execute the neural networks directly in the browser.

---

## 5. Mathematical Models
The core of the simulation relies on a custom continuous-time SEIR model, discretized for a game-loop tick engine.

### 5.1 The SEIR Pipeline
Populations are divided into distinct compartments:
*   **S (Susceptible):** The baseline healthy population.
*   **E (Exposed):** Individuals who have contracted the pathogen but are in the incubation phase.
*   **I (Infectious):** Active carriers capable of spreading the disease.
*   **R (Recovered):** Individuals who have survived the infectious period and gained immunity.
*   **D (Dead):** Fatalities based on the Case Fatality Rate (CFR).

The transmission rate ($\beta$) and incubation rate ($\sigma$) dictate the speed at which populations flow through these compartments, dynamically adjusted by active Intervention Stringencies (lockdowns).

### 5.2 Transit & Stealth Mechanics
*   **Global Grid:** Infection jumps between continents via a weighted probability algorithm tied to real-world flight and shipping lanes.
*   **Border Strictness:** Governments can close borders, drastically reducing cross-border spread.
*   **Stealth Factor:** Pathogens engineered with excessively long incubation periods possess a "Stealth Factor," allowing asymptomatic carriers to bypass border closures.
*   **Land Borders & Rogue Spread:** The engine calculates shared land borders for physical disease creep. To simulate the extreme outliers of epidemiological spread (e.g., migratory birds, unregulated smuggling boats), isolated island nations can be compromised via rare "rogue events" when global infection reaches critical mass.

---

## 6. Artificial Intelligence

The simulator operates in two distinct modes, governed by two separately trained neural networks.

### 6.1 Project Doomsday (Offensive AI)
In this mode, the user attempts to defend Earth via policies and vaccine funding. The AI (`venom_model`) acts as the pathogen architect. The neural network analyzes the target country's population density and transit hub volume to output optimized genetic traits. For example, if aimed at a highly connected nation, the AI will prioritize transmission vectors over lethality to maximize global spread before detection.

### 6.2 Project Aegis (Defensive AI)
In this mode, the user engineers a pathogen, and the AI (`aegis_model`) takes control of global governments. The AI mathematically analyzes the threat profile (R0, Incubation, CFR) and outputs necessary defense protocols. The AI is specifically trained to balance its response—deploying aggressive lockdowns for highly lethal strains, while ignoring low-lethality strains to allow for natural Herd Immunity burnout, effectively simulating realistic government economic balancing.

---

## 7. Environment & Deployment

To ensure maximum stability, reproducibility, and robust performance, the entire project was architected, developed, and tested within a dedicated Linux environment before being containerized for production.

### 7.1 Linux Mint Development Environment
The primary development ecosystem was established by deploying a **Linux Mint Virtual Machine**. Linux Mint was chosen for its unparalleled stability, robust package management (APT), and seamless integration with Node.js and Python data-science pipelines.
- The Python virtual environments (`venv`) used to train the neural networks were isolated and executed within the Mint OS.
- File system permissions, dependency linking, and bash scripting for deployment routines were strictly standardized to POSIX compliance.

### 7.2 Docker Containerization
For the final production build, the application is packaged using Docker, utilizing a multi-stage build process.
1. **Builder Stage:** Uses `node:alpine` to execute `npm run build`, compiling the React components, minifying the CSS/JS, and optimizing the WebGL assets into static files.
2. **Production Stage:** The static output is copied into a highly lightweight `nginx:alpine` container. Nginx serves the static files efficiently over port 80.
This containerized approach guarantees that the simulator will run flawlessly on any host operating system or cloud provider without complex dependency configuration.

---

## 8. Conclusion
The Epidemic Simulator successfully bridges the gap between mathematically rigorous epidemiological modeling and interactive, AI-driven software architecture. By offloading complex neural network execution to the client browser and leveraging a highly optimized WebGL/Canvas rendering pipeline, the project demonstrates advanced proficiency in full-stack engineering, continuous simulation loops, and scalable Docker deployment strategies.
