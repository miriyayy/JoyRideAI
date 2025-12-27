import os
import sys
import pickle
import pandas as pd
import xgboost as xgb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta

# --- 1. GÜVENLİ PATH AYARLAMA ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "xgb_model.json")
TEMPLATE_PATH = os.path.join(BASE_DIR, "data", "df_template.pkl")

# --- 2. MODELİ GÜVENLİ YÜKLEME ---
model = xgb.Booster()
model_loaded = False

if os.path.exists(MODEL_PATH):
    try:
        model.load_model(MODEL_PATH)
        model_loaded = True
        print(f" Model başarıyla yüklendi: {MODEL_PATH}")
    except Exception as e:
        print(f" Model dosyası yüklenemedi: {e}")
else:
    print(f" UYARI: Model dosyası yok! {MODEL_PATH}")

# --- 3. TEMPLATE YÜKLEME (BOZUK DOSYA KORUMASI) ---
df_template = None
if os.path.exists(TEMPLATE_PATH):
    try:
        with open(TEMPLATE_PATH, "rb") as f:
            df_template = pickle.load(f)
        print(f" Template yüklendi: {TEMPLATE_PATH}")
    except Exception as e:
        print(f" Template DOSYASI BOZUK, atlanıyor. Hata: {e}")
        df_template = None
else:
    print(f" Template dosyası bulunamadı.")

# Eğer dosya bozuksa veya yoksa, boş bir DataFrame oluştur (Server çökmesin)
if df_template is None:
    # Modelinin beklediği minimum sütunları buraya ekliyoruz
    df_template = pd.DataFrame(columns=["hour", "day_of_week", "month"])
    print("⚠️ Geçici (boş) template oluşturuldu.")

# --- 4. FASTAPI AYARLARI ---
app = FastAPI(title="JoyRideAI API")

class RecommendRequest(BaseModel):
    timestamp: str
    routes: list
    wait_minutes: list = [0, 15, 30, 45, 60]

def build_features(timestamp, route_name):
    # Template'i kopyala veya yeni oluştur
    if not df_template.empty:
        row = df_template.copy()
        if len(row) > 1:
            row = row.iloc[[0]].copy() 
            row[:] = 0 # İçini sıfırla
    else:
        # Template tamamen boşsa manuel oluştur
        row = pd.DataFrame([{"hour": 0}], columns=["hour", "day_of_week", "month"])

    row["hour"] = timestamp.hour
    row["day_of_week"] = timestamp.weekday()
    row["month"] = timestamp.month

    if route_name in row.columns:
        row[route_name] = 1
    elif route_name not in row.columns and not df_template.empty:
         row[route_name] = 0
         
    return row

@app.get("/")
def root():
    status = " Model Hazır" if model_loaded else " Model Yok"
    return {"message": "JoyRideAI API Online", "status": status}

@app.post("/recommend")
def recommend(data: RecommendRequest):
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model yüklü değil.")

    try:
        base_time = datetime.fromisoformat(data.timestamp)
    except ValueError:
        return {"error": "Tarih formatı hatalı. Örn: 2025-12-27T08:30:00"}

    results = []
    
    for route in data.routes:
        for wait in data.wait_minutes:
            ts = base_time + timedelta(minutes=wait)
            
            # Feature oluştur
            X = build_features(ts, route)
            
            # DataFrame -> DMatrix dönüşümü (XGBoost için şart)
            dmatrix = xgb.DMatrix(X)
            
            # Tahmin
            pred = model.predict(dmatrix)[0]
            
            results.append({
                "route": route,
                "departure_in_min": wait,
                "predicted_density": round(float(pred), 4)
            })

    if not results:
        return {"message": "Sonuç üretilemedi."}

    df_res = pd.DataFrame(results)
    best = df_res.sort_values("predicted_density").iloc[0]

    return {
        "best_route": best["route"],
        "best_departure_in_min": int(best["departure_in_min"]),
        "predicted_density": best["predicted_density"],
        "all_options": df_res.to_dict("records")
    }

if __name__ == "__main__":
    import uvicorn
    # Reload kapalı, host localhost
    uvicorn.run(app, host="127.0.0.1", port=8000)