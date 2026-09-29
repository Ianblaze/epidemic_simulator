import { useState, useRef, useCallback, useEffect } from "react";
import { stepSEIR } from "../simulation/seir.js";
import { checkMutation, applyVariantEffects } from "../simulation/mutations.js";
import { setGlobalSeed, random } from "../simulation/rng.js";

// Lookup for readable country names
const countryNameCache = {};
let countriesDataCache = null;

function getCountryName(id) {
  if (countryNameCache[id]) return countryNameCache[id];
  if (!countriesDataCache) return id;
  const c = countriesDataCache.find((c) => c.id === id);
  const name = c ? c.name : id;
  countryNameCache[id] = name;
  return name;
}

function formatBig(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " billion";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " million";
  if (n >= 1e3) return Math.round(n / 1e3) + ",000";
  return Math.round(n).toLocaleString();
}

export default function useSimulation() {
  const [day, setDay] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const nukeFiredRef = useRef(false);
  const [nukeFired, setNukeFiredState] = useState(false);
  const setNukeFired = (val) => {
    nukeFiredRef.current = val;
    setNukeFiredState(val);
  };
  const [isRunning, setIsRunning] = useState(false);
  const [isStaging, setIsStaging] = useState(false);
  const [countryStates, setCountryStates] = useState(null);
  const [seedCountry, setSeedCountryState] = useState("");
  const [eventLog, setEventLog] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [variants, setVariants] = useState([]);
  const [simSpeed, setSimSpeedState] = useState(1);

  const gameModeRef = useRef("AEGIS");
  const [gameMode, setGameModeState] = useState("AEGIS");
  const setGameMode = (v) => {
    gameModeRef.current = v;
    setGameModeState(v);
  }; // 'VENOM' or 'AEGIS'
  const [vaccineProgress, setVaccineProgress] = useState(0);
  const [params, setParamsState] = useState({
    r0: 2.5,
    incubationPeriod: 5.1,
    infectiousPeriod: 8.0,
    caseFatalityRate: 0.0066,
    mutationRate: 0.15,
    travelVolume: 0.5,
    interventionStringency: 0.0,
    populationScale: 1.0,
    airImmunity: 0.5,
    waterImmunity: 0.5,
    livestockAffection: 0.5,
    borderStrictness: 0.0,
    hygieneCompliance: 0.0,
    quarantineEfficiency: 0.0,
    vaccineFunding: 0.0,
  });

  const intervalRef = useRef(null);
  const statesRef = useRef(new Map());
  const logRef = useRef([]);
  const paramsRef = useRef(params);
  const variantsRef = useRef([]);
  const speedRef = useRef(simSpeed);
  const inboundInfectionsRef = useRef([]);
  const inboundVaccinesRef = useRef([]);
  const vaccineStartedRef = useRef(false);
  const infectedCountriesRef = useRef(new Set());
  const milestonesRef = useRef(new Set());
  const lastNewsRef = useRef(0);
  const vaccineProgressRef = useRef(0); // day of last dynamic news

  paramsRef.current = params;
  variantsRef.current = variants;
  speedRef.current = simSpeed;

  const addNews = (day, message, type = "info") => {
    // Prevent duplicate messages
    if (logRef.current.find((l) => l.message === message)) return;
    logRef.current.push({ day, message, type });
  };

  const initSimulation = useCallback(() => {
    statesRef.current.clear();
    setDay(0);
    setGameResult(null);
    setNukeFired(false);
    setNukeFired(false);
    setVaccineProgress(0);
    vaccineProgressRef.current = 0;
    vaccineStartedRef.current = false;
    inboundVaccinesRef.current = [];
    setCountryStates(new Map());
    setEventLog([]);
    setChartData([]);
    setVariants([]);
    logRef.current = [];
    infectedCountriesRef.current = new Set();
    milestonesRef.current = new Set();
    lastNewsRef.current = 0;
  }, []);

  const setParams = (newParams) => {
    setParamsState((prev) => {
      const resolved =
        typeof newParams === "function"
          ? newParams(prev)
          : { ...prev, ...newParams };
      paramsRef.current = resolved;
      return resolved;
    });
  };

  const setSeedCountry = (countryId) => {
    setSeedCountryState(countryId);
  };

  const prepare = () => {
    if (!seedCountry) return;
    setIsStaging(true);
  };

  const setSimSpeed = (mult) => {
    setSimSpeedState(mult);
    speedRef.current = mult;
    if (isRunning || intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 1000 / mult);
    }
  };

  const start = () => {
    if (params.seed) setGlobalSeed(params.seed);
    const current = statesRef.current;
    if (!seedCountry) {
      setEventLog((prev) => [
        ...prev,
        { day: day, message: "Error: No seed country selected", type: "info" },
      ]);
      return;
    }

    if (current.size === 0) {
      import("../data/countries.js").then((module) => {
        countriesDataCache = module.default;
        const countriesData = module.default;
        countriesData.forEach((c) => {
          current.set(c.id, { S: c.population, E: 0, I: 0, R: 0, D: 0 });
        });
        const seedState = current.get(seedCountry);
        if (seedState) {
          seedState.S -= 10;
          seedState.E += 5;
          seedState.I += 5;
          infectedCountriesRef.current.add(seedCountry);
          const realName = getCountryName(seedCountry);
          addNews(
            0,
            `BREAKING: Patient Zero identified in ${realName}. Health authorities are investigating.`,
            "alert",
          );
        }
        setCountryStates(new Map(current));
        setEventLog([...logRef.current]);
      });
    }

    setIsRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000 / speedRef.current);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    stop();
    setIsStaging(false);
    initSimulation();
  };

  const generateDynamicNews = (
    nextDay,
    newStates,
    globalI,
    globalD,
    globalR,
  ) => {
    const ms = milestonesRef.current;

    // ---- INFECTION MILESTONES ----
    const iMilestones = [
      [
        100,
        "WHO monitoring reports of a novel pathogen spreading in local communities.",
      ],
      [
        1000,
        "ALERT: Over 1,000 confirmed cases worldwide. CDC initiates contact tracing protocols.",
      ],
      [
        10000,
        "Global cases surpass 10,000. Multiple nations report community transmission.",
      ],
      [
        100000,
        "PANDEMIC WATCH: 100,000 cases confirmed. WHO considers pandemic declaration.",
      ],
      [
        500000,
        "Half a million infected. Hospitals report overcrowding in affected regions.",
      ],
      [
        1000000,
        "CRISIS: 1 Million cases worldwide. WHO officially declares a global pandemic.",
      ],
      [
        5000000,
        "5 Million infected globally. Nations scramble for medical supplies and ventilators.",
      ],
      [
        10000000,
        "10 Million cases. Economic impact estimated at hundreds of billions of dollars.",
      ],
      [
        50000000,
        "50 Million infected. Global supply chains severely disrupted.",
      ],
      [
        100000000,
        "CATASTROPHIC: 100 Million cases. Scientists warn of healthcare system collapse.",
      ],
      [
        500000000,
        "500 Million infected — unprecedented in modern history. Martial law in several nations.",
      ],
      [
        1000000000,
        "1 BILLION cases. Humanity faces its greatest challenge since the Black Death.",
      ],
    ];

    for (const [threshold, msg] of iMilestones) {
      const key = `i_${threshold}`;
      if (globalI >= threshold && !ms.has(key)) {
        ms.add(key);
        addNews(nextDay, msg, threshold >= 1000000 ? "alert" : "warning");
      }
    }

    // ---- DEATH MILESTONES ----
    const dMilestones = [
      [100, "First 100 deaths reported. Health officials urge caution."],
      [
        1000,
        "Death toll reaches 1,000. Families mourn as morgues reach capacity.",
      ],
      [
        10000,
        `${formatBig(globalD)} dead. Mass graves reported in worst-hit regions.`,
      ],
      [
        100000,
        "GRIM: 100,000 lives lost. International day of mourning proposed.",
      ],
      [
        500000,
        "500,000 dead. Funeral industry overwhelmed across multiple continents.",
      ],
      [
        1000000,
        "DEVASTATING: 1 Million dead worldwide. UN General Assembly holds emergency session.",
      ],
      [5000000, "5 Million deaths. Global life expectancy drops measurably."],
      [
        10000000,
        "10 Million dead. Historians compare to the deadliest pandemics in human history.",
      ],
    ];

    for (const [threshold, msg] of dMilestones) {
      const key = `d_${threshold}`;
      if (globalD >= threshold && !ms.has(key)) {
        ms.add(key);
        addNews(nextDay, msg, "alert");
      }
    }

    // ---- RECOVERY MILESTONES ----
    if (globalR > 1000000 && !ms.has("r_1m")) {
      ms.add("r_1m");
      addNews(
        nextDay,
        "Over 1 Million people have recovered. Scientists study immunity patterns.",
        "info",
      );
    }
    if (globalR > 100000000 && !ms.has("r_100m")) {
      ms.add("r_100m");
      addNews(
        nextDay,
        "Recovery wave: 100 Million recovered. Herd immunity may be building in some regions.",
        "info",
      );
    }

    // ---- COUNTRY-SPECIFIC NEWS (every 5-10 days) ----
    if (nextDay - lastNewsRef.current >= 5 && random() < 0.6) {
      lastNewsRef.current = nextDay;

      // Find the country with the highest current infection rate
      let worstCountry = null;
      let worstRatio = 0;
      let newlyInfected = [];

      newStates.forEach((state, cid) => {
        const N = state.S + state.E + state.I + state.R + state.D;
        if (N <= 0) return;
        const ratio = state.I / N;

        // Track newly infected countries
        if (state.I > 10 && !infectedCountriesRef.current.has(cid)) {
          infectedCountriesRef.current.add(cid);
          newlyInfected.push(cid);
        }

        if (ratio > worstRatio && state.I > 100) {
          worstRatio = ratio;
          worstCountry = cid;
        }
      });

      // Report new countries getting infected
      if (newlyInfected.length > 0) {
        const names = newlyInfected.slice(0, 3).map((id) => getCountryName(id));
        const count = infectedCountriesRef.current.size;
        if (newlyInfected.length === 1) {
          addNews(
            nextDay,
            `${names[0]} confirms first cases. ${count} countries now affected.`,
            "warning",
          );
        } else {
          addNews(
            nextDay,
            `Disease spreads to ${names.join(", ")} and others. ${count} nations now affected.`,
            "warning",
          );
        }
      }

      // Dynamic situational news
      const newsPool = [];

      if (worstCountry && worstRatio > 0.01) {
        const name = getCountryName(worstCountry);
        const ws = newStates.get(worstCountry);
        newsPool.push(
          `${name} emerges as pandemic epicenter with ${formatBig(ws.I)} active cases.`,
          `Hospitals in ${name} report 90% ICU occupancy as infections surge.`,
          `${name} government declares state of emergency amid rising case numbers.`,
          `Medical workers in ${name} appeal for international aid as resources dwindle.`,
        );
      }

      if (globalI > 10000) {
        newsPool.push(
          "Pharmaceutical companies accelerate vaccine development. Clinical trials begin.",
          "Global stock markets tumble as pandemic fears intensify.",
          "Schools and universities close across affected regions.",
          "Remote work becomes the norm as offices shutter worldwide.",
          "Scientists identify key mutations that could affect transmissibility.",
          "Social distancing measures enforced in major metropolitan areas.",
          "International flights reduced by 60% as travel bans expand.",
        );
      }

      // World Healing News
      if (globalR > globalI * 2 && globalI > 100000 && random() < 0.05) {
        addNews(
          nextDay,
          "Global recovery accelerates as healthcare systems stabilize and cases drop.",
          "info",
        );
      }
      if (globalR > globalI * 5 && globalI > 10000 && random() < 0.05) {
        addNews(
          nextDay,
          "World health officials cautiously optimistic as the pandemic recedes.",
          "info",
        );
      }

      if (globalI > 1000000) {
        newsPool.push(
          "Essential worker shortages reported in healthcare, food supply, and logistics.",
          "Misinformation about the disease spreads rapidly on social media.",
          "Economic recession officially declared in multiple G20 nations.",
          "Military deployed to enforce quarantine zones in worst-hit areas.",
          "Scientists warn of long-term health effects in recovered patients.",
        );
      }

      if (globalD > 100000) {
        newsPool.push(
          "Overwhelmed crematoriums lead to temporary morgue facilities worldwide.",
          "Life insurance claims spike 400% as death toll mounts.",
          "Mental health crisis deepens as grief and isolation take their toll.",
        );
      }

      if (newsPool.length > 0) {
        const pick = newsPool[Math.floor(random() * newsPool.length)];
        addNews(nextDay, pick, "info");
      }
    }

    // Track newly infected countries even outside the news cycle
    newStates.forEach((state, cid) => {
      if (state.I > 10 && !infectedCountriesRef.current.has(cid)) {
        infectedCountriesRef.current.add(cid);
      }
    });
  };

  const tick = () => {
    // Dynamic Vaccine Research: Depends on global stability
    let globalAlive = 0;
    let globalHealthy = 0;
    statesRef.current.forEach((s) => {
      globalAlive += s.S + s.E + s.I + s.R;
      globalHealthy += s.S + s.R;
    });
    const stabilityMultiplier =
      globalAlive > 0 ? globalHealthy / globalAlive : 0;
    // Boost the base speed to 1.8 so it's fast when stable, but slows down if the world is collapsing
    vaccineProgressRef.current +=
      (paramsRef.current.vaccineFunding || 0) * 0.33 * stabilityMultiplier;
    // 0.3% per day at max funding
    if (vaccineProgressRef.current > 100) vaccineProgressRef.current = 100;
    setVaccineProgress(vaccineProgressRef.current);

    setDay((prev) => {
      const nextDay = prev + 1;
      const currentParams = paramsRef.current;

      // Process airborne and waterborne inbound infections from FlatWorldMap
      while (inboundInfectionsRef.current.length > 0) {
        const inbound = inboundInfectionsRef.current.pop();

        // BORDER STRICTNESS LOGIC
        // Pathogens with long incubation bypass borders easily
        const stealthFactor = Math.min(
          0.8,
          (currentParams.incubationPeriod || 5) / 20,
        );
        const effectiveStrictness = Math.max(
          0,
          (currentParams.borderStrictness || 0) - stealthFactor,
        );
        if (random() < effectiveStrictness) continue; // Infection blocked at border!

        const targetId = inbound.countryId || inbound.country;
        const targetState = statesRef.current.get(targetId);
        if (targetState && targetState.S > 10) {
          const amount = inbound.amount || (inbound.type === "ship" ? 3 : 2);
          targetState.S -= amount;
          targetState.E += amount;
        }
      }

      // Process incoming vaccines from flights/ships
      if (inboundVaccinesRef.current.length > 0) {
        inboundVaccinesRef.current.forEach((id) => {
          const s = statesRef.current.get(id);
          if (s) s.vaccineAvailable = true;
        });
        inboundVaccinesRef.current = [];
      }

      // Initial Global Vaccine Deployment (starts in 3 prominent countries)

      if (vaccineProgressRef.current >= 50 && !vaccineStartedRef.current) {
        vaccineStartedRef.current = true;
        const prominentCountries = ["USA", "CHN", "GBR", "FRA", "DEU", "JPN"];
        let count = 0;
        prominentCountries.forEach((id) => {
          if (count < 3 && newStates.has(id)) {
            newStates.get(id).vaccineAvailable = true;
            count++;
          }
        });
      }
      if (vaccineProgressRef.current >= 75) {
        let limit = 10;
        Array.from(newStates.values()).forEach((s) => {
          if (limit > 0 && !s.vaccineAvailable) {
            s.vaccineAvailable = true;
            limit--;
          }
        });
      }
      if (vaccineProgressRef.current >= 100) {
        vaccineStartedRef.current = true;
        const prominentCountries = ["USA", "CHN", "GBR", "FRA", "DEU", "JPN"];
        let count = 0;
        prominentCountries.forEach((id) => {
          if (count < 3 && statesRef.current.has(id)) {
            statesRef.current.get(id).vaccineAvailable = true;
            count++;
          }
        });
      }

      const newStates = new Map();
      statesRef.current.forEach((state, countryId) => {
        newStates.set(countryId, { ...state });
      });

      statesRef.current.forEach((state, countryId) => {
        let targetState = newStates.get(countryId);
        let newState = stepSEIR(targetState, currentParams, 1);

        targetState.S = targetState.S;
        targetState.E = targetState.E;
        targetState.I = targetState.I;
        targetState.R = targetState.R;
        // VACCINE LOGIC

        // Distribute vaccine locally and via land borders
        newState.vaccineAvailable = state.vaccineAvailable; // Keep state
        if (targetState.vaccineAvailable && targetState.S > 0) {
          const vacAmount = Math.min(
            targetState.S,
            (targetState.S +
              targetState.E +
              targetState.I +
              targetState.R +
              targetState.D) *
              0.015,
          );
          targetState.S -= vacAmount;
          targetState.R += vacAmount;

          // Land border spread
          if (countriesDataCache) {
            const c = countriesDataCache.find((x) => x.id === countryId);
            if (c && c.neighbors && random() < 0.08) {
              const nid =
                c.neighbors[Math.floor(random() * c.neighbors.length)];
              const ns = newStates.get(nid);
              if (ns) ns.vaccineAvailable = true;
            }
          }
        }

        // INFECTION LAND BORDER SPREAD
        if (targetState.I > 100 && countriesDataCache) {
          const c = countriesDataCache.find((x) => x.id === countryId);
          // Pathogens with high R0 spread across borders easily
          const borderSpreadChance = 0.01 * (currentParams.r0 || 2.0);
          const stealthFactor = Math.min(
            0.8,
            (currentParams.incubationPeriod || 5) / 20,
          );
          const effectiveStrictness = Math.max(
            0,
            (currentParams.borderStrictness || 0) - stealthFactor,
          );

          if (
            c &&
            c.neighbors &&
            random() < borderSpreadChance &&
            random() > effectiveStrictness
          ) {
            const nid = c.neighbors[Math.floor(random() * c.neighbors.length)];
            const ns = newStates.get(nid);
            if (ns && ns.S > 10) {
              const amount = Math.floor(
                10 + random() * 40 + currentParams.r0 * 3,
              );
              ns.S -= amount;
              ns.E += amount;
            }
          }
        }
      });

      let globalI = 0;
      let globalD = 0;
      let globalR = 0;
      newStates.forEach((s) => {
        globalI += s.I;
        globalD += s.D;
        globalR += s.R;
      });

      // ROGUE / BIRD MIGRATION SPREAD (For isolated islands)
      // DOOMSDAY Rogue Seeding
      if (
        gameModeRef.current === "DOOMSDAY" &&
        globalI > 100000 &&
        random() < 0.2
      ) {
        const uninfectedKeys = Array.from(newStates.entries())
          .filter((x) => x[1].I === 0 && x[1].S > 0)
          .map((x) => x[0]);
        if (uninfectedKeys.length > 0) {
          const randomId =
            uninfectedKeys[Math.floor(random() * uninfectedKeys.length)];
          const target = newStates.get(randomId);
          const amount = Math.min(target.S, 100);
          target.S -= amount;
          target.E += amount;
        }
      }
      // Generate dynamic news

      // AEGIS Nuclear Evaluation
      let sumS = 0,
        sumE = 0;
      newStates.forEach((s) => {
        sumS += s.S;
        sumE += s.E;
      });
      const globalPop = sumS + sumE + globalI + globalR + globalD;

      if (
        gameModeRef.current === "AEGIS" &&
        globalPop > 0 &&
        !nukeFiredRef.current
      ) {
        const infectedRatio = (sumE + globalI) / globalPop;
        if (infectedRatio >= 0.25 && vaccineProgressRef.current < 100) {
          // Safety fail-safe
          setNukeFired(true);
          addNews(
            nextDay,
            "AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.",
            "warning",
          );
          newStates.forEach((c) => {
            c.D += c.E + c.I;
            c.E = 0;
            c.I = 0;
          });
          globalI = 0;
          sumE = 0;
        }
      }

      generateDynamicNews(nextDay, newStates, globalI, globalD, globalR);
      // Random spread removed to enforce strict flight/ship propagation

      // AEGIS DYNAMIC ADAPTATION
      if (gameModeRef.current === "AEGIS") {
        const infectedRatio = (sumE + globalI) / (globalPop + 1);
        // Simple growth check
        if (
          infectedRatio > 0.01 &&
          globalI >
            (logRef.current.length > 0
              ? logRef.current[logRef.current.length - 1]?.globalI || 0
              : 0)
        ) {
          setParamsState((prev) => ({
            ...prev,
            interventionStringency: Math.min(
              1.0,
              prev.interventionStringency + 0.02,
            ),
            borderStrictness: Math.min(1.0, prev.borderStrictness + 0.02),
            hygieneCompliance: Math.min(1.0, prev.hygieneCompliance + 0.02),
            quarantineEfficiency: Math.min(
              1.0,
              prev.quarantineEfficiency + 0.02,
            ),
          }));
        }
      }
      const mutation = checkMutation(
        nextDay,
        globalI,
        currentParams,
        variantsRef.current,
        gameModeRef.current,
      );
      if (mutation) {
        addNews(
          nextDay,
          `ALERT: New variant "${mutation.name}" detected. Scientists assess transmissibility changes.`,
          "warning",
        );

        variantsRef.current = [...variantsRef.current, mutation];
        setVariants(variantsRef.current);

        const updatedStates = applyVariantEffects(newStates, mutation);
        statesRef.current = updatedStates;

        setParamsState((prevP) => ({
          ...prevP,
          r0: prevP.r0 * mutation.r0Modifier,
        }));
      } else {
        statesRef.current = newStates;
      }

      setCountryStates(new Map(statesRef.current));
      setEventLog([...logRef.current]);

      let tE = 0,
        tI = 0,
        tR = 0,
        tD = 0;
      statesRef.current.forEach((s) => {
        tE += s.E;
        tI += s.I;
        tR += s.R;
        tD += s.D;
      });
      setChartData((chart) => [
        ...chart,
        { day: nextDay, E: tE, I: tI, R: tR, D: tD },
      ]);

      return nextDay;
    });
  };

  useEffect(() => {
    if (!isRunning || day < 2 || !countryStates) return;

    let sumS = 0,
      sumE = 0,
      sumI = 0,
      sumD = 0;

    // Process incoming vaccines from flights/ships
    if (inboundVaccinesRef.current.length > 0) {
      inboundVaccinesRef.current.forEach((cid) => {
        const s = newStates.get(cid);
        if (s) s.vaccineAvailable = true;
      });
      inboundVaccinesRef.current = [];
    }

    // Initial Global Vaccine Deployment (starts in 3 prominent countries)
    if (vaccineProgressRef.current >= 100 && !vaccineStartedRef.current) {
      vaccineStartedRef.current = true;
      const prominentCountries = ["USA", "CHN", "GBR", "FRA", "DEU", "JPN"];
      let count = 0;
      prominentCountries.forEach((id) => {
        if (count < 3 && newStates.has(id)) {
          newStates.get(id).vaccineAvailable = true;
          count++;
        }
      });
    }
    countryStates.forEach((c) => {
      sumS += c.S;
      sumE += c.E;
      sumI += c.I;
      sumD += c.D;
    });

    if (gameMode === "DOOMSDAY") {
      if (sumS <= 1000 && vaccineProgressRef.current < 100) {
        if (
          paramsRef.current.predictedDay &&
          day <= paramsRef.current.predictedDay
        ) {
          setGameResult("WIN");
        } else {
          setGameResult("LOSS_TIMING");
        }
        setIsRunning(false);
      } else if (sumE < 1 && sumI < 1) {
        setGameResult("LOSS");
        setIsRunning(false);
      }
    } else if (gameMode === "AEGIS") {
      if (sumE < 1 && sumI < 1) {
        if (
          paramsRef.current.predictedDay &&
          day <= paramsRef.current.predictedDay
        ) {
          setGameResult("WIN");
        } else {
          setGameResult("LOSS_TIMING");
        }
        setIsRunning(false);
      } else if (
        (sumS <= 1000 && vaccineProgressRef.current < 100) ||
        sumD > 2000000000
      ) {
        setGameResult("LOSS");
        setIsRunning(false);
      }
    }
  }, [day, countryStates, isRunning, gameMode]);

  return {
    countryStates,
    chartData,
    eventLog,
    variants,
    day,
    isRunning,
    isStaging,
    params,
    setParams,
    simSpeed,
    setSimSpeed,
    gameMode,
    setGameMode,
    gameResult,
    setGameResult,
    nukeFired,
    setNukeFired,
    vaccineProgress,
    seedCountry,
    setSeedCountry,
    inboundInfectionsRef,
    inboundVaccinesRef,
    prepare,
    start,
    stop,
    reset,
  };
}
