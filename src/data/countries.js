const countries = [
  {
    "id": "ZIMBABWE",
    "name": "Zimbabwe",
    "population": 17094876,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "ZAMBIA",
      "ESWATINI",
      "SOUTHAFRICA",
      "MOZAMBIQUE",
      "MALAWI",
      "LESOTHO",
      "BOTSWANA"
    ]
  },
  {
    "id": "ZAMBIA",
    "name": "Zambia",
    "population": 22100141,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "ZIMBABWE",
      "TANZANIA",
      "RWANDA",
      "MOZAMBIQUE",
      "MALAWI",
      "DEMREPCONGO",
      "BURUNDI",
      "BOTSWANA",
      "ANGOLA"
    ]
  },
  {
    "id": "YEMEN",
    "name": "Yemen",
    "population": 34500000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UNITEDARABEMIRATES",
      "SOMALIA",
      "SAUDIARABIA",
      "QATAR",
      "OMAN",
      "ETHIOPIA",
      "ERITREA",
      "DJIBOUTI"
    ]
  },
  {
    "id": "VIETNAM",
    "name": "Vietnam",
    "population": 100000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "THAILAND",
      "LAOS",
      "CAMBODIA",
      "MYANMAR"
    ]
  },
  {
    "id": "VENEZUELA",
    "name": "Venezuela",
    "population": 29000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "TRINIDADANDTOBAGO",
      "SURINAME",
      "GUYANA",
      "COLOMBIA"
    ]
  },
  {
    "id": "VATICAN",
    "name": "Vatican",
    "population": 800,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "VANUATU",
    "name": "Vanuatu",
    "population": 338017,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "SOLOMONIS",
      "FIJI"
    ]
  },
  {
    "id": "UZBEKISTAN",
    "name": "Uzbekistan",
    "population": 37368382,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "TURKMENISTAN",
      "TAJIKISTAN",
      "KYRGYZSTAN",
      "KAZAKHSTAN",
      "AFGHANISTAN"
    ]
  },
  {
    "id": "URUGUAY",
    "name": "Uruguay",
    "population": 3413457,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "PARAGUAY",
      "ARGENTINA"
    ]
  },
  {
    "id": "MICRONESIA",
    "name": "Micronesia",
    "population": 115000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "MARSHALLIS",
    "name": "Marshall Is.",
    "population": 42000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "UNITEDSTATESOFAMERICA",
    "name": "United States of America",
    "population": 341000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "UNITEDKINGDOM",
    "name": "United Kingdom",
    "population": 70077639,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "NETHERLANDS",
      "LUXEMBOURG",
      "IRELAND",
      "FRANCE",
      "BELGIUM"
    ]
  },
  {
    "id": "UNITEDARABEMIRATES",
    "name": "United Arab Emirates",
    "population": 11611010,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "YEMEN",
      "SAUDIARABIA",
      "QATAR",
      "OMAN",
      "KUWAIT",
      "IRAN"
    ]
  },
  {
    "id": "UKRAINE",
    "name": "Ukraine",
    "population": 39311709,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "TURKEY",
      "SLOVAKIA",
      "SERBIA",
      "ROMANIA",
      "MOLDOVA",
      "LITHUANIA",
      "LATVIA",
      "ESTONIA",
      "BULGARIA",
      "BELARUS"
    ]
  },
  {
    "id": "UGANDA",
    "name": "Uganda",
    "population": 51821665,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "TANZANIA",
      "SSUDAN",
      "RWANDA",
      "KENYA",
      "ETHIOPIA",
      "DEMREPCONGO",
      "BURUNDI"
    ]
  },
  {
    "id": "TURKMENISTAN",
    "name": "Turkmenistan",
    "population": 7683607,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UZBEKISTAN",
      "TAJIKISTAN",
      "IRAN",
      "AZERBAIJAN",
      "AFGHANISTAN"
    ]
  },
  {
    "id": "TURKEY",
    "name": "Turkey",
    "population": 86000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UKRAINE",
      "SYRIA",
      "MOLDOVA",
      "LEBANON",
      "JORDAN",
      "ISRAEL",
      "PALESTINE",
      "IRAQ",
      "GEORGIA",
      "CYPRUS",
      "BULGARIA",
      "ARMENIA"
    ]
  },
  {
    "id": "TUNISIA",
    "name": "Tunisia",
    "population": 12453535,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "LIBYA",
      "ITALY",
      "ALGERIA"
    ]
  },
  {
    "id": "TRINIDADANDTOBAGO",
    "name": "Trinidad and Tobago",
    "population": 1379389,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "VENEZUELA",
      "SURINAME",
      "GUYANA"
    ]
  },
  {
    "id": "TONGA",
    "name": "Tonga",
    "population": 104623,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "TOGO",
    "name": "Togo",
    "population": 8664654,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "NIGERIA",
      "MALI",
      "LIBERIA",
      "GHANA",
      "EQGUINEA",
      "CTEDIVOIRE",
      "CAMEROON",
      "BURKINAFASO",
      "BENIN"
    ]
  },
  {
    "id": "TIMORLESTE",
    "name": "Timor-Leste",
    "population": 1430574,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "INDONESIA"
    ]
  },
  {
    "id": "THAILAND",
    "name": "Thailand",
    "population": 72228631,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "VIETNAM",
      "LAOS",
      "CAMBODIA",
      "MYANMAR"
    ]
  },
  {
    "id": "TANZANIA",
    "name": "Tanzania",
    "population": 69000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "ZAMBIA",
      "UGANDA",
      "RWANDA",
      "MOZAMBIQUE",
      "MALAWI",
      "KENYA",
      "DEMREPCONGO",
      "BURUNDI"
    ]
  },
  {
    "id": "TAJIKISTAN",
    "name": "Tajikistan",
    "population": 10878421,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UZBEKISTAN",
      "TURKMENISTAN",
      "PAKISTAN",
      "KYRGYZSTAN",
      "KAZAKHSTAN",
      "AFGHANISTAN"
    ]
  },
  {
    "id": "SYRIA",
    "name": "Syria",
    "population": 23500000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "TURKEY",
      "LEBANON",
      "KUWAIT",
      "JORDAN",
      "ISRAEL",
      "PALESTINE",
      "IRAQ",
      "GEORGIA",
      "CYPRUS",
      "AZERBAIJAN",
      "ARMENIA"
    ]
  },
  {
    "id": "SWITZERLAND",
    "name": "Switzerland",
    "population": 9169721,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "SLOVAKIA",
      "SLOVENIA",
      "NETHERLANDS",
      "MONTENEGRO",
      "LUXEMBOURG",
      "ITALY",
      "HUNGARY",
      "GERMANY",
      "DENMARK",
      "CZECHIA",
      "CROATIA",
      "BOSNIAANDHERZ",
      "BELGIUM",
      "AUSTRIA"
    ]
  },
  {
    "id": "SWEDEN",
    "name": "Sweden",
    "population": 10686691,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "POLAND",
      "NORWAY",
      "LITHUANIA",
      "LATVIA",
      "FINLAND",
      "ESTONIA",
      "DENMARK"
    ]
  },
  {
    "id": "ESWATINI",
    "name": "eSwatini",
    "population": 1200000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "ZIMBABWE",
      "SOUTHAFRICA",
      "MOZAMBIQUE",
      "LESOTHO",
      "BOTSWANA"
    ]
  },
  {
    "id": "SURINAME",
    "name": "Suriname",
    "population": 645288,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "VENEZUELA",
      "TRINIDADANDTOBAGO",
      "GUYANA"
    ]
  },
  {
    "id": "SSUDAN",
    "name": "S. Sudan",
    "population": 52101275,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UGANDA",
      "SUDAN",
      "RWANDA",
      "KENYA",
      "ETHIOPIA",
      "ERITREA",
      "CENTRALAFRICANREP",
      "BURUNDI"
    ]
  },
  {
    "id": "SUDAN",
    "name": "Sudan",
    "population": 52101275,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "SSUDAN",
      "ERITREA",
      "EGYPT",
      "CHAD"
    ]
  },
  {
    "id": "SRILANKA",
    "name": "Sri Lanka",
    "population": 21940926,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "SPAIN",
    "name": "Spain",
    "population": 49774661,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "PORTUGAL",
      "MOROCCO",
      "FRANCE"
    ]
  },
  {
    "id": "SOUTHKOREA",
    "name": "South Korea",
    "population": 51700000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "NORTHKOREA",
      "JAPAN"
    ]
  },
  {
    "id": "SOUTHAFRICA",
    "name": "South Africa",
    "population": 65297671,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Africa",
    "neighbors": [
      "ZIMBABWE",
      "ESWATINI",
      "NAMIBIA",
      "LESOTHO",
      "BOTSWANA"
    ]
  },
  {
    "id": "SOMALIA",
    "name": "Somalia",
    "population": 25413010,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "YEMEN",
      "KENYA",
      "ETHIOPIA",
      "DJIBOUTI"
    ]
  },
  {
    "id": "SOLOMONIS",
    "name": "Solomon Is.",
    "population": 750000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "VANUATU"
    ]
  },
  {
    "id": "SLOVAKIA",
    "name": "Slovakia",
    "population": 5400000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UKRAINE",
      "SWITZERLAND",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "LITHUANIA",
      "LATVIA",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "GERMANY",
      "ESTONIA",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "SLOVENIA",
    "name": "Slovenia",
    "population": 2149099,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "NETHERLANDS",
      "MONTENEGRO",
      "MACEDONIA",
      "LUXEMBOURG",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "GERMANY",
      "DENMARK",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELGIUM",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "SINGAPORE",
    "name": "Singapore",
    "population": 6163119,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "SIERRALEONE",
    "name": "Sierra Leone",
    "population": 8894762,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "SENEGAL",
      "MAURITANIA",
      "MALI",
      "LIBERIA",
      "GUINEABISSAU",
      "GUINEA",
      "GHANA",
      "GAMBIA",
      "CTEDIVOIRE",
      "BURKINAFASO"
    ]
  },
  {
    "id": "SEYCHELLES",
    "name": "Seychelles",
    "population": 123773,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "SERBIA",
    "name": "Serbia",
    "population": 6604810,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "UKRAINE",
      "SLOVAKIA",
      "SLOVENIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "LITHUANIA",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "SENEGAL",
    "name": "Senegal",
    "population": 19092887,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "SIERRALEONE",
      "MAURITANIA",
      "MALI",
      "LIBERIA",
      "GUINEABISSAU",
      "GUINEA",
      "GAMBIA",
      "CTEDIVOIRE"
    ]
  },
  {
    "id": "SAUDIARABIA",
    "name": "Saudi Arabia",
    "population": 37287830,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": [
      "YEMEN",
      "UNITEDARABEMIRATES",
      "QATAR",
      "OMAN",
      "KUWAIT",
      "JORDAN",
      "IRAQ",
      "ERITREA"
    ]
  },
  {
    "id": "SOTOMANDPRINCIPE",
    "name": "São Tomé and Principe",
    "population": 230000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "SANMARINO",
    "name": "San Marino",
    "population": 34398,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "SAMOA",
    "name": "Samoa",
    "population": 221170,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "STVINANDGREN",
    "name": "St. Vin. and Gren.",
    "population": 110000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "SAINTLUCIA",
    "name": "Saint Lucia",
    "population": 180000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "STKITTSANDNEVIS",
    "name": "St. Kitts and Nevis",
    "population": 47000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region4",
    "neighbors": []
  },
  {
    "id": "RWANDA",
    "name": "Rwanda",
    "population": 14693180,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "ZAMBIA",
      "UGANDA",
      "TANZANIA",
      "SSUDAN",
      "MALAWI",
      "KENYA",
      "DEMREPCONGO",
      "BURUNDI"
    ]
  },
  {
    "id": "RUSSIA",
    "name": "Russia",
    "population": 143500000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": []
  },
  {
    "id": "ROMANIA",
    "name": "Romania",
    "population": 19181943,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "UKRAINE",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "LITHUANIA",
      "LATVIA",
      "HUNGARY",
      "GREECE",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "QATAR",
    "name": "Qatar",
    "population": 2997478,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "YEMEN",
      "UNITEDARABEMIRATES",
      "SAUDIARABIA",
      "OMAN",
      "KUWAIT",
      "IRAQ",
      "IRAN"
    ]
  },
  {
    "id": "PORTUGAL",
    "name": "Portugal",
    "population": 10896712,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SPAIN",
      "MOROCCO",
      "FRANCE"
    ]
  },
  {
    "id": "POLAND",
    "name": "Poland",
    "population": 36745565,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "SWEDEN",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "LITHUANIA",
      "LATVIA",
      "ITALY",
      "HUNGARY",
      "GERMANY",
      "ESTONIA",
      "DENMARK",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "PHILIPPINES",
    "name": "Philippines",
    "population": 117779651,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "BRUNEI"
    ]
  },
  {
    "id": "PERU",
    "name": "Peru",
    "population": 34870566,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": [
      "ECUADOR"
    ]
  },
  {
    "id": "PARAGUAY",
    "name": "Paraguay",
    "population": 7072689,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "URUGUAY",
      "BOLIVIA"
    ]
  },
  {
    "id": "PAPUANEWGUINEA",
    "name": "Papua New Guinea",
    "population": 10854300,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "PANAMA",
    "name": "Panama",
    "population": 4610044,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "NICARAGUA",
      "JAMAICA",
      "HONDURAS",
      "ELSALVADOR",
      "ECUADOR",
      "COSTARICA",
      "COLOMBIA"
    ]
  },
  {
    "id": "PALAU",
    "name": "Palau",
    "population": 17813,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "PAKISTAN",
    "name": "Pakistan",
    "population": 257388920,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "TAJIKISTAN",
      "AFGHANISTAN"
    ]
  },
  {
    "id": "OMAN",
    "name": "Oman",
    "population": 5541395,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "YEMEN",
      "UNITEDARABEMIRATES",
      "SAUDIARABIA",
      "QATAR",
      "IRAN"
    ]
  },
  {
    "id": "NORWAY",
    "name": "Norway",
    "population": 5658562,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SWEDEN",
      "DENMARK"
    ]
  },
  {
    "id": "NORTHKOREA",
    "name": "North Korea",
    "population": 26200000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SOUTHKOREA",
      "JAPAN"
    ]
  },
  {
    "id": "NIGERIA",
    "name": "Nigeria",
    "population": 239546768,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Africa",
    "neighbors": [
      "TOGO",
      "NIGER",
      "GHANA",
      "GABON",
      "EQGUINEA",
      "CAMEROON",
      "BURKINAFASO",
      "BENIN"
    ]
  },
  {
    "id": "NIGER",
    "name": "Niger",
    "population": 28155132,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "NIGERIA",
      "CHAD",
      "BENIN"
    ]
  },
  {
    "id": "NICARAGUA",
    "name": "Nicaragua",
    "population": 7067065,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "PANAMA",
      "JAMAICA",
      "HONDURAS",
      "GUATEMALA",
      "ELSALVADOR",
      "CUBA",
      "COSTARICA",
      "BELIZE"
    ]
  },
  {
    "id": "NEWZEALAND",
    "name": "New Zealand",
    "population": 5369959,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "NETHERLANDS",
    "name": "Netherlands",
    "population": 18241377,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "UNITEDKINGDOM",
      "SWITZERLAND",
      "SLOVENIA",
      "LUXEMBOURG",
      "ITALY",
      "GERMANY",
      "DENMARK",
      "CZECHIA",
      "BELGIUM",
      "AUSTRIA"
    ]
  },
  {
    "id": "NEPAL",
    "name": "Nepal",
    "population": 29869872,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "INDIA",
      "BHUTAN",
      "BANGLADESH"
    ]
  },
  {
    "id": "NAURU",
    "name": "Nauru",
    "population": 13000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "NAMIBIA",
    "name": "Namibia",
    "population": 3119104,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SOUTHAFRICA",
      "BOTSWANA",
      "ANGOLA"
    ]
  },
  {
    "id": "MOZAMBIQUE",
    "name": "Mozambique",
    "population": 35934522,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "ZIMBABWE",
      "ZAMBIA",
      "TANZANIA",
      "ESWATINI",
      "MALAWI",
      "MADAGASCAR"
    ]
  },
  {
    "id": "MOROCCO",
    "name": "Morocco",
    "population": 38757431,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SPAIN",
      "PORTUGAL",
      "MAURITANIA",
      "ALGERIA"
    ]
  },
  {
    "id": "MONTENEGRO",
    "name": "Montenegro",
    "population": 628425,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MOLDOVA",
      "MACEDONIA",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "MONGOLIA",
    "name": "Mongolia",
    "population": 3599314,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "CHINA"
    ]
  },
  {
    "id": "MOLDOVA",
    "name": "Moldova",
    "population": 2380591,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "UKRAINE",
      "TURKEY",
      "SLOVAKIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MACEDONIA",
      "LITHUANIA",
      "LATVIA",
      "HUNGARY",
      "GREECE",
      "ESTONIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "ALBANIA"
    ]
  },
  {
    "id": "MONACO",
    "name": "Monaco",
    "population": 38666,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "MEXICO",
    "name": "Mexico",
    "population": 133068448,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": []
  },
  {
    "id": "MAURITIUS",
    "name": "Mauritius",
    "population": 1254312,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "MAURITANIA",
    "name": "Mauritania",
    "population": 5360243,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SIERRALEONE",
      "SENEGAL",
      "MOROCCO",
      "MALI",
      "GUINEABISSAU",
      "GUINEA",
      "GAMBIA",
      "BURKINAFASO"
    ]
  },
  {
    "id": "MALTA",
    "name": "Malta",
    "population": 584631,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "MALI",
    "name": "Mali",
    "population": 25413010,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "TOGO",
      "SIERRALEONE",
      "SENEGAL",
      "MAURITANIA",
      "GUINEA",
      "GHANA",
      "CTEDIVOIRE",
      "BURKINAFASO",
      "BENIN"
    ]
  },
  {
    "id": "MALDIVES",
    "name": "Maldives",
    "population": 534178,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": []
  },
  {
    "id": "MALAYSIA",
    "name": "Malaysia",
    "population": 36283649,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "INDONESIA",
      "CAMBODIA",
      "BRUNEI"
    ]
  },
  {
    "id": "MALAWI",
    "name": "Malawi",
    "population": 22404957,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "ZIMBABWE",
      "ZAMBIA",
      "TANZANIA",
      "RWANDA",
      "MOZAMBIQUE",
      "BURUNDI"
    ]
  },
  {
    "id": "MADAGASCAR",
    "name": "Madagascar",
    "population": 33018973,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "MOZAMBIQUE"
    ]
  },
  {
    "id": "MACEDONIA",
    "name": "Macedonia",
    "population": 2080000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "LUXEMBOURG",
    "name": "Luxembourg",
    "population": 692809,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UNITEDKINGDOM",
      "SWITZERLAND",
      "SLOVENIA",
      "NETHERLANDS",
      "ITALY",
      "GERMANY",
      "DENMARK",
      "CZECHIA",
      "CROATIA",
      "BELGIUM",
      "AUSTRIA"
    ]
  },
  {
    "id": "LITHUANIA",
    "name": "Lithuania",
    "population": 2913328,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UKRAINE",
      "SWEDEN",
      "SLOVAKIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MOLDOVA",
      "LATVIA",
      "HUNGARY",
      "FINLAND",
      "ESTONIA",
      "CZECHIA",
      "BELARUS"
    ]
  },
  {
    "id": "LIECHTENSTEIN",
    "name": "Liechtenstein",
    "population": 41372,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": []
  },
  {
    "id": "LIBYA",
    "name": "Libya",
    "population": 7521952,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TUNISIA",
      "EGYPT",
      "CHAD"
    ]
  },
  {
    "id": "LIBERIA",
    "name": "Liberia",
    "population": 5779921,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TOGO",
      "SIERRALEONE",
      "SENEGAL",
      "GUINEABISSAU",
      "GUINEA",
      "GHANA",
      "GAMBIA",
      "CTEDIVOIRE",
      "BURKINAFASO"
    ]
  },
  {
    "id": "LESOTHO",
    "name": "Lesotho",
    "population": 2383413,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "ZIMBABWE",
      "ESWATINI",
      "SOUTHAFRICA",
      "BOTSWANA"
    ]
  },
  {
    "id": "LEBANON",
    "name": "Lebanon",
    "population": 5899141,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "JORDAN",
      "ISRAEL",
      "PALESTINE",
      "IRAQ",
      "GEORGIA",
      "EGYPT",
      "CYPRUS",
      "ARMENIA"
    ]
  },
  {
    "id": "LATVIA",
    "name": "Latvia",
    "population": 1863491,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UKRAINE",
      "SWEDEN",
      "SLOVAKIA",
      "ROMANIA",
      "POLAND",
      "MOLDOVA",
      "LITHUANIA",
      "HUNGARY",
      "FINLAND",
      "ESTONIA",
      "CZECHIA",
      "BELARUS"
    ]
  },
  {
    "id": "LAOS",
    "name": "Laos",
    "population": 7600000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "VIETNAM",
      "THAILAND",
      "CAMBODIA",
      "MYANMAR"
    ]
  },
  {
    "id": "KYRGYZSTAN",
    "name": "Kyrgyzstan",
    "population": 7100000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UZBEKISTAN",
      "TAJIKISTAN",
      "KAZAKHSTAN",
      "AFGHANISTAN"
    ]
  },
  {
    "id": "KUWAIT",
    "name": "Kuwait",
    "population": 4906653,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UNITEDARABEMIRATES",
      "SYRIA",
      "SAUDIARABIA",
      "QATAR",
      "JORDAN",
      "IRAQ",
      "IRAN",
      "AZERBAIJAN",
      "ARMENIA"
    ]
  },
  {
    "id": "KIRIBATI",
    "name": "Kiribati",
    "population": 137648,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": []
  },
  {
    "id": "KENYA",
    "name": "Kenya",
    "population": 58021519,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Africa",
    "neighbors": [
      "UGANDA",
      "TANZANIA",
      "SSUDAN",
      "SOMALIA",
      "RWANDA",
      "ETHIOPIA",
      "BURUNDI"
    ]
  },
  {
    "id": "KAZAKHSTAN",
    "name": "Kazakhstan",
    "population": 21020925,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "UZBEKISTAN",
      "TAJIKISTAN",
      "KYRGYZSTAN"
    ]
  },
  {
    "id": "JORDAN",
    "name": "Jordan",
    "population": 11618609,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "SAUDIARABIA",
      "LEBANON",
      "KUWAIT",
      "ISRAEL",
      "PALESTINE",
      "IRAQ",
      "EGYPT",
      "CYPRUS"
    ]
  },
  {
    "id": "JAPAN",
    "name": "Japan",
    "population": 124415351,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SOUTHKOREA",
      "NORTHKOREA"
    ]
  },
  {
    "id": "JAMAICA",
    "name": "Jamaica",
    "population": 2861192,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "PANAMA",
      "NICARAGUA",
      "HONDURAS",
      "HAITI",
      "DOMINICANREP",
      "CUBA",
      "COSTARICA",
      "BELIZE",
      "BAHAMAS"
    ]
  },
  {
    "id": "ITALY",
    "name": "Italy",
    "population": 59416439,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "TUNISIA",
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "POLAND",
      "NETHERLANDS",
      "MONTENEGRO",
      "MACEDONIA",
      "LUXEMBOURG",
      "HUNGARY",
      "GREECE",
      "GERMANY",
      "CZECHIA",
      "CROATIA",
      "BOSNIAANDHERZ",
      "BELGIUM",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "ISRAEL",
    "name": "Israel",
    "population": 10208843,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "LEBANON",
      "JORDAN",
      "PALESTINE",
      "IRAQ",
      "EGYPT",
      "CYPRUS"
    ]
  },
  {
    "id": "PALESTINE",
    "name": "Palestine",
    "population": 5400000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "LEBANON",
      "JORDAN",
      "ISRAEL",
      "IRAQ",
      "EGYPT",
      "CYPRUS"
    ]
  },
  {
    "id": "IRELAND",
    "name": "Ireland",
    "population": 5530984,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UNITEDKINGDOM",
      "FRANCE"
    ]
  },
  {
    "id": "IRAQ",
    "name": "Iraq",
    "population": 47420450,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "SAUDIARABIA",
      "QATAR",
      "LEBANON",
      "KUWAIT",
      "JORDAN",
      "ISRAEL",
      "PALESTINE",
      "IRAN",
      "GEORGIA",
      "CYPRUS",
      "AZERBAIJAN",
      "ARMENIA"
    ]
  },
  {
    "id": "IRAN",
    "name": "Iran",
    "population": 89800000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "UNITEDARABEMIRATES",
      "TURKMENISTAN",
      "QATAR",
      "OMAN",
      "KUWAIT",
      "IRAQ",
      "AZERBAIJAN",
      "AFGHANISTAN"
    ]
  },
  {
    "id": "INDONESIA",
    "name": "Indonesia",
    "population": 288149866,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TIMORLESTE",
      "MALAYSIA",
      "BRUNEI"
    ]
  },
  {
    "id": "INDIA",
    "name": "India",
    "population": 1476308381,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "NEPAL",
      "BHUTAN",
      "BANGLADESH"
    ]
  },
  {
    "id": "ICELAND",
    "name": "Iceland",
    "population": 395739,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": []
  },
  {
    "id": "HUNGARY",
    "name": "Hungary",
    "population": 9595122,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "LITHUANIA",
      "LATVIA",
      "ITALY",
      "GREECE",
      "GERMANY",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "HONDURAS",
    "name": "Honduras",
    "population": 11099399,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "PANAMA",
      "NICARAGUA",
      "JAMAICA",
      "GUATEMALA",
      "ELSALVADOR",
      "CUBA",
      "COSTARICA",
      "BELIZE"
    ]
  },
  {
    "id": "HAITI",
    "name": "Haiti",
    "population": 12007296,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "JAMAICA",
      "DOMINICANREP",
      "CUBA",
      "BAHAMAS"
    ]
  },
  {
    "id": "GUYANA",
    "name": "Guyana",
    "population": 843091,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "VENEZUELA",
      "TRINIDADANDTOBAGO",
      "SURINAME"
    ]
  },
  {
    "id": "GUINEABISSAU",
    "name": "Guinea-Bissau",
    "population": 2268635,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SIERRALEONE",
      "SENEGAL",
      "MAURITANIA",
      "LIBERIA",
      "GUINEA",
      "GAMBIA",
      "CTEDIVOIRE"
    ]
  },
  {
    "id": "GUINEA",
    "name": "Guinea",
    "population": 15228074,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SIERRALEONE",
      "SENEGAL",
      "MAURITANIA",
      "MALI",
      "LIBERIA",
      "GUINEABISSAU",
      "GHANA",
      "GAMBIA",
      "CTEDIVOIRE",
      "BURKINAFASO"
    ]
  },
  {
    "id": "GUATEMALA",
    "name": "Guatemala",
    "population": 18846727,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "NICARAGUA",
      "HONDURAS",
      "ELSALVADOR",
      "COSTARICA",
      "BELIZE"
    ]
  },
  {
    "id": "GRENADA",
    "name": "Grenada",
    "population": 118300,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": []
  },
  {
    "id": "GREECE",
    "name": "Greece",
    "population": 10502480,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "ITALY",
      "HUNGARY",
      "CYPRUS",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "ALBANIA"
    ]
  },
  {
    "id": "GHANA",
    "name": "Ghana",
    "population": 35362318,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TOGO",
      "SIERRALEONE",
      "NIGERIA",
      "MALI",
      "LIBERIA",
      "GUINEA",
      "CTEDIVOIRE",
      "BURKINAFASO",
      "BENIN"
    ]
  },
  {
    "id": "GERMANY",
    "name": "Germany",
    "population": 84200924,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "POLAND",
      "NETHERLANDS",
      "LUXEMBOURG",
      "ITALY",
      "HUNGARY",
      "DENMARK",
      "CZECHIA",
      "CROATIA",
      "BOSNIAANDHERZ",
      "BELGIUM",
      "AUSTRIA"
    ]
  },
  {
    "id": "GEORGIA",
    "name": "Georgia",
    "population": 3969220,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "LEBANON",
      "IRAQ",
      "AZERBAIJAN",
      "ARMENIA"
    ]
  },
  {
    "id": "GAMBIA",
    "name": "Gambia",
    "population": 2800000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SIERRALEONE",
      "SENEGAL",
      "MAURITANIA",
      "LIBERIA",
      "GUINEABISSAU",
      "GUINEA",
      "CTEDIVOIRE"
    ]
  },
  {
    "id": "GABON",
    "name": "Gabon",
    "population": 2615171,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "NIGERIA",
      "EQGUINEA",
      "CONGO",
      "CENTRALAFRICANREP",
      "CAMEROON"
    ]
  },
  {
    "id": "FRANCE",
    "name": "France",
    "population": 69304459,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "UNITEDKINGDOM",
      "SPAIN",
      "PORTUGAL",
      "IRELAND"
    ]
  },
  {
    "id": "FINLAND",
    "name": "Finland",
    "population": 5694430,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "SWEDEN",
      "LITHUANIA",
      "LATVIA",
      "ESTONIA",
      "BELARUS"
    ]
  },
  {
    "id": "FIJI",
    "name": "Fiji",
    "population": 941085,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region2",
    "neighbors": [
      "VANUATU"
    ]
  },
  {
    "id": "ETHIOPIA",
    "name": "Ethiopia",
    "population": 136623563,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Africa",
    "neighbors": [
      "YEMEN",
      "UGANDA",
      "SSUDAN",
      "SOMALIA",
      "KENYA",
      "ERITREA",
      "DJIBOUTI"
    ]
  },
  {
    "id": "ESTONIA",
    "name": "Estonia",
    "population": 1378090,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "UKRAINE",
      "SWEDEN",
      "SLOVAKIA",
      "POLAND",
      "MOLDOVA",
      "LITHUANIA",
      "LATVIA",
      "FINLAND",
      "BELARUS"
    ]
  },
  {
    "id": "ERITREA",
    "name": "Eritrea",
    "population": 3637662,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "YEMEN",
      "SSUDAN",
      "SUDAN",
      "SAUDIARABIA",
      "ETHIOPIA",
      "DJIBOUTI"
    ]
  },
  {
    "id": "EQGUINEA",
    "name": "Eq. Guinea",
    "population": 1700000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TOGO",
      "NIGERIA",
      "GABON",
      "CONGO",
      "CENTRALAFRICANREP",
      "CAMEROON",
      "BENIN"
    ]
  },
  {
    "id": "ELSALVADOR",
    "name": "El Salvador",
    "population": 6419609,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "PANAMA",
      "NICARAGUA",
      "HONDURAS",
      "GUATEMALA",
      "COSTARICA",
      "BELIZE"
    ]
  },
  {
    "id": "EGYPT",
    "name": "Egypt",
    "population": 114000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Africa",
    "neighbors": [
      "SUDAN",
      "LIBYA",
      "LEBANON",
      "JORDAN",
      "ISRAEL",
      "PALESTINE",
      "CYPRUS"
    ]
  },
  {
    "id": "ECUADOR",
    "name": "Ecuador",
    "population": 18445360,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "PERU",
      "PANAMA",
      "COLOMBIA"
    ]
  },
  {
    "id": "DOMINICANREP",
    "name": "Dominican Rep.",
    "population": 11400000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "JAMAICA",
      "HAITI",
      "CUBA",
      "BAHAMAS"
    ]
  },
  {
    "id": "DOMINICA",
    "name": "Dominica",
    "population": 66430,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "DJIBOUTI",
    "name": "Djibouti",
    "population": 1194140,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "YEMEN",
      "SOMALIA",
      "ETHIOPIA",
      "ERITREA"
    ]
  },
  {
    "id": "DENMARK",
    "name": "Denmark",
    "population": 6060246,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SWITZERLAND",
      "SWEDEN",
      "SLOVENIA",
      "POLAND",
      "NORWAY",
      "NETHERLANDS",
      "LUXEMBOURG",
      "GERMANY",
      "CZECHIA",
      "BELGIUM",
      "AUSTRIA"
    ]
  },
  {
    "id": "CZECHIA",
    "name": "Czechia",
    "population": 10500000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "NETHERLANDS",
      "MONTENEGRO",
      "MACEDONIA",
      "LUXEMBOURG",
      "LITHUANIA",
      "LATVIA",
      "ITALY",
      "HUNGARY",
      "GERMANY",
      "DENMARK",
      "CROATIA",
      "BOSNIAANDHERZ",
      "BELGIUM",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "CYPRUS",
    "name": "Cyprus",
    "population": 1382405,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "LEBANON",
      "JORDAN",
      "ISRAEL",
      "PALESTINE",
      "IRAQ",
      "GREECE",
      "EGYPT",
      "BULGARIA"
    ]
  },
  {
    "id": "CUBA",
    "name": "Cuba",
    "population": 11030169,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "NICARAGUA",
      "JAMAICA",
      "HONDURAS",
      "HAITI",
      "DOMINICANREP",
      "BELIZE",
      "BAHAMAS"
    ]
  },
  {
    "id": "CROATIA",
    "name": "Croatia",
    "population": 3909147,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MACEDONIA",
      "LUXEMBOURG",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "GERMANY",
      "CZECHIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "CTEDIVOIRE",
    "name": "Côte d'Ivoire",
    "population": 29000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TOGO",
      "SIERRALEONE",
      "SENEGAL",
      "MALI",
      "LIBERIA",
      "GUINEABISSAU",
      "GUINEA",
      "GHANA",
      "GAMBIA",
      "BURKINAFASO",
      "BENIN"
    ]
  },
  {
    "id": "COSTARICA",
    "name": "Costa Rica",
    "population": 5196750,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "PANAMA",
      "NICARAGUA",
      "JAMAICA",
      "HONDURAS",
      "GUATEMALA",
      "ELSALVADOR",
      "BELIZE"
    ]
  },
  {
    "id": "DEMREPCONGO",
    "name": "Dem. Rep. Congo",
    "population": 105000000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "ZAMBIA",
      "UGANDA",
      "TANZANIA",
      "RWANDA",
      "CONGO",
      "CENTRALAFRICANREP",
      "BURUNDI",
      "ANGOLA"
    ]
  },
  {
    "id": "CONGO",
    "name": "Congo",
    "population": 6200000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "GABON",
      "EQGUINEA",
      "DEMREPCONGO",
      "CENTRALAFRICANREP",
      "CAMEROON",
      "ANGOLA"
    ]
  },
  {
    "id": "COMOROS",
    "name": "Comoros",
    "population": 890351,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "COLOMBIA",
    "name": "Colombia",
    "population": 53879752,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": [
      "VENEZUELA",
      "PANAMA",
      "ECUADOR"
    ]
  },
  {
    "id": "CHINA",
    "name": "China",
    "population": 1418540972,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Eurasia",
    "neighbors": [
      "MONGOLIA"
    ]
  },
  {
    "id": "CHILE",
    "name": "Chile",
    "population": 20028730,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": [
      "ARGENTINA"
    ]
  },
  {
    "id": "CHAD",
    "name": "Chad",
    "population": 21182236,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SUDAN",
      "NIGER",
      "LIBYA",
      "CENTRALAFRICANREP",
      "CAMEROON"
    ]
  },
  {
    "id": "CENTRALAFRICANREP",
    "name": "Central African Rep.",
    "population": 5800000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SSUDAN",
      "GABON",
      "EQGUINEA",
      "DEMREPCONGO",
      "CONGO",
      "CHAD",
      "CAMEROON"
    ]
  },
  {
    "id": "CABOVERDE",
    "name": "Cabo Verde",
    "population": 531808,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "CANADA",
    "name": "Canada",
    "population": 42005692,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": []
  },
  {
    "id": "CAMEROON",
    "name": "Cameroon",
    "population": 30133311,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TOGO",
      "NIGERIA",
      "GABON",
      "EQGUINEA",
      "CONGO",
      "CHAD",
      "CENTRALAFRICANREP",
      "BENIN"
    ]
  },
  {
    "id": "CAMBODIA",
    "name": "Cambodia",
    "population": 17999689,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "VIETNAM",
      "THAILAND",
      "MALAYSIA",
      "LAOS",
      "MYANMAR"
    ]
  },
  {
    "id": "MYANMAR",
    "name": "Myanmar",
    "population": 55316878,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region3",
    "neighbors": [
      "VIETNAM",
      "THAILAND",
      "LAOS",
      "CAMBODIA",
      "BHUTAN",
      "BANGLADESH"
    ]
  },
  {
    "id": "BURUNDI",
    "name": "Burundi",
    "population": 14512318,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "ZAMBIA",
      "UGANDA",
      "TANZANIA",
      "SSUDAN",
      "RWANDA",
      "MALAWI",
      "KENYA",
      "DEMREPCONGO"
    ]
  },
  {
    "id": "BURKINAFASO",
    "name": "Burkina Faso",
    "population": 24279213,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TOGO",
      "SIERRALEONE",
      "NIGERIA",
      "MAURITANIA",
      "MALI",
      "LIBERIA",
      "GUINEA",
      "GHANA",
      "CTEDIVOIRE",
      "BENIN"
    ]
  },
  {
    "id": "BULGARIA",
    "name": "Bulgaria",
    "population": 6487985,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "UKRAINE",
      "TURKEY",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "HUNGARY",
      "GREECE",
      "CYPRUS",
      "CROATIA",
      "BOSNIAANDHERZ",
      "BELARUS",
      "ALBANIA"
    ]
  },
  {
    "id": "BRUNEI",
    "name": "Brunei",
    "population": 470293,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "PHILIPPINES",
      "MALAYSIA",
      "INDONESIA"
    ]
  },
  {
    "id": "BRAZIL",
    "name": "Brazil",
    "population": 214621310,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": []
  },
  {
    "id": "BOTSWANA",
    "name": "Botswana",
    "population": 2583900,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "ZIMBABWE",
      "ZAMBIA",
      "ESWATINI",
      "SOUTHAFRICA",
      "NAMIBIA",
      "LESOTHO",
      "ANGOLA"
    ]
  },
  {
    "id": "BOSNIAANDHERZ",
    "name": "Bosnia and Herz.",
    "population": 3200000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "GERMANY",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "AUSTRIA",
      "ALBANIA"
    ]
  },
  {
    "id": "BOLIVIA",
    "name": "Bolivia",
    "population": 12688788,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "PARAGUAY"
    ]
  },
  {
    "id": "BHUTAN",
    "name": "Bhutan",
    "population": 803453,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "NEPAL",
      "INDIA",
      "MYANMAR",
      "BANGLADESH"
    ]
  },
  {
    "id": "BENIN",
    "name": "Benin",
    "population": 14940382,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TOGO",
      "NIGERIA",
      "NIGER",
      "MALI",
      "GHANA",
      "EQGUINEA",
      "CTEDIVOIRE",
      "CAMEROON",
      "BURKINAFASO"
    ]
  },
  {
    "id": "BELIZE",
    "name": "Belize",
    "population": 426518,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "NICARAGUA",
      "JAMAICA",
      "HONDURAS",
      "GUATEMALA",
      "ELSALVADOR",
      "CUBA",
      "COSTARICA"
    ]
  },
  {
    "id": "BELGIUM",
    "name": "Belgium",
    "population": 12043286,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "UNITEDKINGDOM",
      "SWITZERLAND",
      "SLOVENIA",
      "NETHERLANDS",
      "LUXEMBOURG",
      "ITALY",
      "GERMANY",
      "DENMARK",
      "CZECHIA",
      "AUSTRIA"
    ]
  },
  {
    "id": "BELARUS",
    "name": "Belarus",
    "population": 9163221,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "UKRAINE",
      "SLOVAKIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MOLDOVA",
      "LITHUANIA",
      "LATVIA",
      "HUNGARY",
      "FINLAND",
      "ESTONIA",
      "BULGARIA"
    ]
  },
  {
    "id": "BARBADOS",
    "name": "Barbados",
    "population": 285025,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "BANGLADESH",
    "name": "Bangladesh",
    "population": 177180237,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "NEPAL",
      "INDIA",
      "MYANMAR",
      "BHUTAN"
    ]
  },
  {
    "id": "BAHRAIN",
    "name": "Bahrain",
    "population": 1613969,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "BAHAMAS",
    "name": "Bahamas",
    "population": 410000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "JAMAICA",
      "HAITI",
      "DOMINICANREP",
      "CUBA"
    ]
  },
  {
    "id": "AZERBAIJAN",
    "name": "Azerbaijan",
    "population": 10334095,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TURKMENISTAN",
      "SYRIA",
      "KUWAIT",
      "IRAQ",
      "IRAN",
      "GEORGIA",
      "ARMENIA"
    ]
  },
  {
    "id": "AUSTRIA",
    "name": "Austria",
    "population": 9286432,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SWITZERLAND",
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "NETHERLANDS",
      "MONTENEGRO",
      "MACEDONIA",
      "LUXEMBOURG",
      "ITALY",
      "HUNGARY",
      "GERMANY",
      "DENMARK",
      "CZECHIA",
      "CROATIA",
      "BOSNIAANDHERZ",
      "BELGIUM",
      "ALBANIA"
    ]
  },
  {
    "id": "AUSTRALIA",
    "name": "Australia",
    "population": 27849133,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "ARMENIA",
    "name": "Armenia",
    "population": 3112936,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TURKEY",
      "SYRIA",
      "LEBANON",
      "KUWAIT",
      "IRAQ",
      "GEORGIA",
      "AZERBAIJAN"
    ]
  },
  {
    "id": "ARGENTINA",
    "name": "Argentina",
    "population": 46241114,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Americas",
    "neighbors": [
      "URUGUAY",
      "CHILE"
    ]
  },
  {
    "id": "ANTIGUAANDBARB",
    "name": "Antigua and Barb.",
    "population": 94000,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "ANGOLA",
    "name": "Angola",
    "population": 39371879,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Africa",
    "neighbors": [
      "ZAMBIA",
      "NAMIBIA",
      "DEMREPCONGO",
      "CONGO",
      "BOTSWANA"
    ]
  },
  {
    "id": "ANDORRA",
    "name": "Andorra",
    "population": 83608,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": []
  },
  {
    "id": "ALGERIA",
    "name": "Algeria",
    "population": 47838512,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "TUNISIA",
      "MOROCCO"
    ]
  },
  {
    "id": "ALBANIA",
    "name": "Albania",
    "population": 2369551,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "SLOVAKIA",
      "SLOVENIA",
      "SERBIA",
      "ROMANIA",
      "POLAND",
      "MONTENEGRO",
      "MOLDOVA",
      "MACEDONIA",
      "ITALY",
      "HUNGARY",
      "GREECE",
      "CZECHIA",
      "CROATIA",
      "BULGARIA",
      "BOSNIAANDHERZ",
      "AUSTRIA"
    ]
  },
  {
    "id": "AFGHANISTAN",
    "name": "Afghanistan",
    "population": 44216785,
    "defenses": {
      "interventionStringency": 0,
      "borderStrictness": 0.05,
      "hygieneCompliance": 0.15,
      "quarantineEfficiency": 0.1,
      "vaccineFunding": 0.05
    },
    "continent": "Region1",
    "neighbors": [
      "UZBEKISTAN",
      "TURKMENISTAN",
      "TAJIKISTAN",
      "PAKISTAN",
      "KYRGYZSTAN",
      "IRAN"
    ]
  }
];

export default countries;
