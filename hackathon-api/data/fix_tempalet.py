import pandas as pd
import pickle

feature_columns = [
    "hour", "day_of_week", "month", 
    "34G", "34BZ", "34C", "34AS", "Sogutlucesme", "Zincirlikuyu" 
    # ... vb. tüm one-hot encoded sütunlar
]

df_template = pd.DataFrame(columns=feature_columns)

with open("data/df_template.pkl", "wb") as f:
    pickle.dump(df_template, f)

print("✅ df_template.pkl başarıyla onarıldı ve kaydedildi!")