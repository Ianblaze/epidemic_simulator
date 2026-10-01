import { useState, useRef, useCallback, useEffect } from "react";
import { stepSEIR } from "../simulation/seir.js";
import { checkMutation, applyVariantEffects } from "../simulation/mutations.js";
import { setGlobalSeed, random } from "../simulation/rng.js";
import { stepSimulation } from "../simulation/stepSimulation.js";

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
  const dayRef = useRef(0);
  const [gameResult, setGameResult] = useState(null);
  const [transitEvents, setTransitEvents] = useState([]);
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

  // DOOMSDAY's seeded random stream must be reserved for model transitions so
  // the prediction and deployed simulation consume the same sequence. News is
  // cosmetic and uses an independent source in that mode.
  const newsRandom = () => gameModeRef.current === "DOOMSDAY" ? Math.random() : random();

  const initSimulation = useCallback(() => {
    statesRef.current.clear();
    setDay(0);
      dayRef.current = 0;
    setGameResult(null);
    setNukeFired(false);
    setTransitEvents([]);
    setVaccineProgress(0);
    vaccineProgressRef.current = 0;
    vaccineStartedRef.current = false;
    inboundInfectionsRef.current = [];
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


    // ---- VACCINE MILESTONES ----
    const vProgress = vaccineProgressRef.current || 0;
    const vMilestones = [
      [1, "Scientists sequence the genetic code of the pathogen. Early vaccine research begins."],
      [25, "First human trials of experimental vaccine show promising early results."],
      [50, "Phase 3 vaccine trials completed. Manufacturing facilities ramping up production."],
      [75, "Vaccine distribution begins globally. Frontline workers prioritized."],
      [95, "Global vaccination drive reaches critical mass. Case numbers expected to plummet."]
    ];

    for (const [threshold, msg] of vMilestones) {
      const key = `v_${threshold}`;
      if (vProgress >= threshold && !ms.has(key)) {
        ms.add(key);
        addNews(nextDay, msg, "success");
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
    if (nextDay - lastNewsRef.current >= 5 && newsRandom() < 0.6) {
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
      if (globalR > globalI * 2 && globalI > 100000 && newsRandom() < 0.05) {
        addNews(
          nextDay,
          "Global recovery accelerates as healthcare systems stabilize and cases drop.",
          "info",
        );
      }
      if (globalR > globalI * 5 && globalI > 10000 && newsRandom() < 0.05) {
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
        const pick = newsPool[Math.floor(newsRandom() * newsPool.length)];
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
    const nextDay = dayRef.current + 1;
    dayRef.current = nextDay;
    setDay(nextDay);
    
    while (inboundInfectionsRef.current.length > 0) {
      const inbound = inboundInfectionsRef.current.pop();
      const targetId = inbound.countryId || inbound.country;
      const targetState = statesRef.current.get(targetId);
      if (targetState && targetState.S > 10) {
        const amount = inbound.amount || (inbound.type === "ship" ? 3 : 2);
        targetState.S -= amount;
        targetState.E += amount;
      }
    }
    if (inboundVaccinesRef.current.length > 0) {
      inboundVaccinesRef.current.forEach((id) => {
        const s = statesRef.current.get(id);
        if (s) s.vaccineAvailable = true;
      });
      inboundVaccinesRef.current = [];
    }

    let prevGlobalI = 0;
    statesRef.current.forEach(s => prevGlobalI += s.I);

    const result = stepSimulation(
        statesRef.current, paramsRef.current, nextDay, gameModeRef.current,
        prevGlobalI, vaccineProgressRef.current, vaccineStartedRef.current, variantsRef.current
    );

    statesRef.current = result.newStates;
    setTransitEvents(result.transitEvents || []);
    setParamsState(result.newParams);
    vaccineProgressRef.current = result.newVaccineProgress;
    setVaccineProgress(vaccineProgressRef.current);
    vaccineStartedRef.current = result.newVaccineStarted;
    
    if (result.nukeFired && !nukeFiredRef.current) {
        setNukeFired(true);
        addNews(nextDay, "AEGIS AI EXECUTED NUCLEAR SANITIZATION PROTOCOL. ALL INFECTED ZONES NEUTRALIZED.", "warning");
    }

    if (result.newVariants.length > variantsRef.current.length) {
        const mutation = result.newVariants[result.newVariants.length - 1];
        addNews(nextDay, `ALERT: New variant "${mutation.name}" detected. Scientists assess transmissibility changes.`, "warning");
        variantsRef.current = result.newVariants;
        setVariants(variantsRef.current);
    }

    let globalR = 0;
    statesRef.current.forEach(s => globalR += s.R);
    generateDynamicNews(nextDay, statesRef.current, result.totalGlobalI, result.globalD, globalR);

    setCountryStates(new Map(statesRef.current));
    setEventLog([...logRef.current]);

    setChartData((chart) => [
      ...chart,
      { day: nextDay, E: result.globalE, I: result.totalGlobalI, R: globalR, D: result.globalD },
    ]);
  };

  useEffect(() => {
    if (!isRunning || day < 2 || !countryStates) return;

    let sumS = 0, sumE = 0, sumI = 0, sumD = 0;
    countryStates.forEach((c) => {
      sumS += c.S; sumE += c.E; sumI += c.I; sumD += c.D;
    });

    if (gameMode === "DOOMSDAY") {
      if (sumS < 1) {
        if (paramsRef.current.predictedDay && Math.abs(day - paramsRef.current.predictedDay) <= 100) {
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
        if (paramsRef.current.predictedDay && Math.abs(day - paramsRef.current.predictedDay) <= 100) {
          setGameResult("WIN");
        } else {
          setGameResult("LOSS_TIMING");
        }
        setIsRunning(false);
      } else if ((sumS <= 1000 && vaccineProgressRef.current < 100) || sumD > 2000000000) {
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
    transitEvents,
    prepare,
    start,
    stop,
    reset,
  };
}
