import pandas as pd
import numpy as np
import joblib

# Load the clean dataset
df = pd.read_csv('dataset_seguridad_limpio.csv')

# Print total counts per municipality (historical data)
print("=== Real Total Cases per Municipality ===")
total_cases = df['Municipio'].value_counts()
for mun, count in total_cases.items():
    print(f"{mun}: {count} cases")
print(f"Total: {total_cases.sum()} cases")
print("========================================\n")

# Calculate real crime shares for each municipality
print("=== Real Crime Shares ===")
crime_shares = {}
categories = ['Hurto Personas', 'Hurto Residencias', 'Hurto Comercios', 'Hurto Motocicletas', 'Hurto Automotores', 'Homicidio', 'Amenazas', 'Extorsion', 'Acoso Sexual', 'Otro']
for mun in ['Funza', 'Mosquera', 'Madrid']:
    df_mun = df[df['Municipio'] == mun]
    total_mun = len(df_mun)
    shares = df_mun['Categoria_Delito'].value_counts(normalize=True)
    crime_shares[mun] = {}
    print(f"  {mun}:")
    for cat in categories:
        val = shares.get(cat, 0.0)
        crime_shares[mun][cat] = round(val, 4)
        print(f"    '{cat}': {round(val, 4)},")
print("=========================\n")

# Load models for predicting missing months of 2026
model = joblib.load('modelo_random_forest.joblib')
le_mun = joblib.load('encoder_municipio.joblib')
le_del = joblib.load('encoder_delito.joblib')

# Define all months for 2026 and identify which are missing in the dataset
all_months_2026 = list(range(1, 13))
present_months = sorted(df[(df['Año'] == 2026)]['Mes'].unique().tolist())
missing_months = [m for m in all_months_2026 if m not in present_months]

print("=== 2026 Monthly Data ===")
print(f"Present months in dataset: {present_months}")
print(f"Missing months to predict: {missing_months}\n")

# Helper to obtain total incidents for a municipality, year, month (real or predicted)
def get_total_for(mun, year, month):
    real_row = df[(df['Año'] == year) & (df['Mes'] == month) & (df['Municipio'] == mun)]
    if not real_row.empty:
        return int(real_row['Cantidad'].sum())
    # Predict when data is missing
    mun_enc = le_mun.transform([mun])[0]
    mes_sin = np.sin(2 * np.pi * month / 12)
    mes_cos = np.cos(2 * np.pi * month / 12)
    rows = []
    for delito in categories:
        del_enc = le_del.transform([delito])[0]
        rows.append([year, month, mes_sin, mes_cos, mun_enc, del_enc])
    entrada = pd.DataFrame(rows, columns=['Año', 'Mes', 'Mes_sin', 'Mes_cos', 'Municipio_enc', 'Categoria_Delito_enc'])
    preds = model.predict(entrada)
    preds = np.clip(preds, 0, None)
    return int(round(preds.sum()))

# Historical quarterly points we already display (unchanged)
historical_quarters = [
    (2023, 1), (2023, 4), (2023, 7), (2023, 10),
    (2024, 1), (2024, 4), (2024, 7), (2024, 10),
    (2025, 1), (2025, 4), (2025, 7), (2025, 10),
    (2026, 1)  # January 2026 exists in dataset
]

# Build full series per municipality: historic quarters + all months of 2026 (Jan‑Dec)
full_series = {mun: [] for mun in ['Funza', 'Mosquera', 'Madrid']}
for mun in full_series.keys():
    # Historical quarterly data
    for y, m in historical_quarters:
        full_series[mun].append(get_total_for(mun, y, m))
    # Full 2026 months (Jan‑Dec)
    for m in all_months_2026:
        full_series[mun].append(get_total_for(mun, 2026, m))

print("=== Complete 2026 Series per Municipality (including historical quarters) ===")
for mun, data in full_series.items():
    print(f"{mun}: {data}\n")

# Compute new overall total including predicted months
overall_total = sum([sum(vals) for vals in full_series.values()])
print(f"NEW HISTORIC+PREDICTED TOTAL CASES: {overall_total}\n")
