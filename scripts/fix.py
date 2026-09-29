import re

with open('src/data/transit.js', 'r') as f:
    text = f.read()

waypoints = '''  {
    "id": "GIB",
    "name": "Gibraltar",
    "lat": 35.9,
    "lon": -5.5,
    "country": "SPAIN"
  },
  {
    "id": "CAP",
    "name": "Cape Horn",
    "lat": -56.0,
    "lon": -67.0,
    "country": "CHILE"
  },
  {
    "id": "MAL",
    "name": "Strait of Malacca",
    "lat": 2.5,
    "lon": 101.3,
    "country": "MALAYSIA"
  },
  {
    "id": "CUB",
    "name": "Caribbean Sea",
    "lat": 18.0,
    "lon": -75.0,
    "country": "CUBA"
  },
  {
    "id": "BAB",
    "name": "Bab el-Mandeb",
    "lat": 12.5,
    "lon": 43.3,
    "country": "YEMEN"
  },
'''

text = text.replace('export const seaports = [\n', 'export const seaports = [\n' + waypoints)

new_ships = '''"ships": [
    { "path": ["SHG", "HKG_P", "MAL", "SGP", "BOM_P", "BAB", "SUEZ", "PIR", "GOA", "BAR", "GIB", "ANT", "RTM", "HAM"] },
    { "path": ["HAM", "RTM", "GIB", "NYC", "CUB", "PAN", "LAX", "VNC"] },
    { "path": ["VNC", "LAX", "YOK", "BUS", "SHG"] },
    { "path": ["SHG", "BUS", "YOK", "SYD_P"] },
    { "path": ["SYD_P", "JKT", "MAL", "SGP", "BOM_P", "DXB_P"] },
    { "path": ["DXB_P", "MOM", "DUR", "CPT", "SNT", "EZE"] },
    { "path": ["SNT", "CUB", "NYC", "RTM"] },
    { "path": ["VAL", "CLO", "PAN", "NYC"] },
    { "path": ["ALG", "BAR", "GIB", "ANT"] }
  ]'''

text = re.sub(r'"ships": \[.*?\]\s*\}\s*\]\n\}\;', new_ships + '\n};\n', text, flags=re.MULTILINE|re.DOTALL)
text = re.sub(r'"ships": \[.*?\]\s*\]\s*\}', new_ships + '\n}', text, flags=re.MULTILINE|re.DOTALL)

with open('src/data/transit.js', 'w') as f:
    f.write(text)
