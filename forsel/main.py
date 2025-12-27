import requests
import pandas as pd
import time

# 1. İstanbul'un 39 İlçesinin Merkez Koordinatları (Enlem, Boylam)
istanbul_ilceleri = {
    "Adalar": (40.8769, 29.1292),
    "Arnavutköy": (41.1866, 28.7408),
    "Ataşehir": (40.9847, 29.1067),
    "Avcılar": (40.9801, 28.7175),
    "Bağcılar": (41.0346, 28.8569),
    "Bahçelievler": (40.9982, 28.8614),
    "Bakırköy": (40.9782, 28.8744),
    "Başakşehir": (41.0978, 28.8066),
    "Bayrampaşa": (41.0346, 28.9126),
    "Beşiktaş": (41.0422, 29.0067),
    "Beykoz": (41.1235, 29.1085),
    "Beylikdüzü": (41.0024, 28.6433),
    "Beyoğlu": (41.0284, 28.9736),
    "Büyükçekmece": (41.0217, 28.5798),
    "Çatalca": (41.1437, 28.4619),
    "Çekmeköy": (41.0336, 29.1722),
    "Esenler": (41.0366, 28.8878),
    "Esenyurt": (41.0343, 28.6801),
    "Eyüpsultan": (41.0478, 28.9327),
    "Fatih": (41.0082, 28.9784),
    "Gaziosmanpaşa": (41.0573, 28.9119),
    "Güngören": (41.0243, 28.8756),
    "Kadıköy": (40.9819, 29.0254),
    "Kağıthane": (41.0815, 28.9787),
    "Kartal": (40.8887, 29.1856),
    "Küçükçekmece": (40.9919, 28.7712),
    "Maltepe": (40.9497, 29.1739),
    "Pendik": (40.8762, 29.2335),
    "Sancaktepe": (40.9902, 29.2215),
    "Sarıyer": (41.1663, 29.0500),
    "Silivri": (41.0742, 28.2483),
    "Sultanbeyli": (40.9678, 29.2618),
    "Sultangazi": (41.1065, 28.8687),
    "Şile": (41.1744, 29.6125),
    "Şişli": (41.0536, 28.9940),
    "Tuzla": (40.8155, 29.3082),
    "Ümraniye": (41.0256, 29.0963),
    "Üsküdar": (41.0266, 29.0152),
    "Zeytinburnu": (40.9902, 28.9002)
}

def ilce_yagis_getir(ilce_adi, lat, lon):
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": "2023-11-15",  # HEDEF TARİH (Değiştirebilirsin)
        "end_date": "2023-11-20",    # BİTİŞ TARİHİ
        "hourly": ["rain", "soil_moisture_0_to_7cm"] # Yağmur + Toprak Nemi
    }
    
    try:
        r = requests.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        
        df = pd.DataFrame({
            'Tarih': data['hourly']['time'],
            'Yagis_mm': data['hourly']['rain'],
            'Toprak_Nemi': data['hourly']['soil_moisture_0_to_7cm'],
            'Ilce': ilce_adi,
            'Enlem': lat,
            'Boylam': lon
        })
        return df
    except Exception as e:
        print(f"Hata ({ilce_adi}): {e}")
        return pd.DataFrame()

# 2. Tüm İlçeleri Döngüye Alıp Veriyi Çekme
tum_veriler = []

print("Veriler çekiliyor, lütfen bekleyin (Yaklaşık 10-15 sn)...")

for ilce, (lat, lon) in istanbul_ilceleri.items():
    # API'yi yormamak için çok kısa bekletme (opsiyonel ama iyi pratik)
    time.sleep(0.5) 
    df_ilce = ilce_yagis_getir(ilce, lat, lon)
    if not df_ilce.empty:
        tum_veriler.append(df_ilce)

# 3. Sonuçları Birleştirme
if tum_veriler:
    df_istanbul = pd.concat(tum_veriler, ignore_index=True)
    
    # KÜÇÜK BİR ANALİZ YAPALIM:
    # Hangi ilçe bu tarihlerde toplam ne kadar yağış almış?
    ozet_tablo = df_istanbul.groupby('Ilce')['Yagis_mm'].sum().sort_values(ascending=False)
    
    print("\n--- ÇEKME İŞLEMİ TAMAMLANDI ---")
    print(f"Toplam Satır Sayısı: {len(df_istanbul)}")
    print("\nİlçelere Göre Toplam Yağış Sıralaması (En çok yağandan en aza):")
    print(ozet_tablo.head(10)) # İlk 10 ilçeyi göster
    print("\nVerinin ilk 5 satırı:")
    print(df_istanbul.head())
    
    # CSV Olarak Kaydetmek İstersen:
    df_istanbul.to_csv("istanbul_ilce_yagis_verisi.csv", index=False)
    print("\nDosya 'istanbul_ilce_yagis_verisi.csv' olarak kaydedildi.")

else:
    print("Hiç veri çekilemedi.")