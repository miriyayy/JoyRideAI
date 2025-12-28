import pandas as pd
import numpy as np

def process_transport_data(stops_path, routes_path, trips_path, stop_times_path):
    print("Dosyalar okunuyor...")
    stops = pd.read_csv(stops_path)
    routes = pd.read_csv(routes_path)
    trips = pd.read_csv(trips_path)
    stop_times = pd.read_csv(stop_times_path)

    # 1. VERİ BİRLEŞTİRME (ZİNCİRLEME MERGE)
    # Hangi Rota -> Hangi Sefer -> Hangi Duraklar?
    print("Veriler birleştiriliyor...")
    
    # Rota ve Seferleri eşleştir (Sadece Route ID yeterli değil, Trip ID lazım)
    # Genelde her rotanın (Route) birden fazla seferi (Trip) olur (Hafta içi, hafta sonu vs.)
    # Biz her rota için örnek BİR sefer alacağız ki veri şişmesin (first() kullanarak).
    representative_trips = trips.groupby('route_id').first().reset_index()[['route_id', 'trip_id', 'trip_headsign']]
    
    # Rota bilgisini ekle
    route_trips = pd.merge(routes[['route_id', 'route_short_name', 'route_long_name']], representative_trips, on='route_id')
    
    # Durak zamanlarını ve sıralamayı ekle
    trip_details = pd.merge(route_trips, stop_times[['trip_id', 'stop_id', 'stop_sequence']], on='trip_id')
    
    # Durak koordinatlarını ekle
    full_df = pd.merge(trip_details, stops[['stop_id', 'stop_name', 'stop_lat', 'stop_lon']], on='stop_id')

    # 2. SIRALAMA (CRITICAL STEP)
    # Her rotayı kendi içinde durak sırasına (sequence) göre diziyoruz.
    full_df = full_df.sort_values(by=['route_id', 'stop_sequence'])

    # 3. MESAFE VE SÜRE HESABI (Feature Engineering)
    print("Mesafeler hesaplanıyor...")

    # Bir sonraki durağın verilerini yan sütuna kaydır (Shift)
    full_df['next_stop_name'] = full_df.groupby('route_id')['stop_name'].shift(-1)
    full_df['next_lat'] = full_df.groupby('route_id')['stop_lat'].shift(-1)
    full_df['next_lon'] = full_df.groupby('route_id')['stop_lon'].shift(-1)

    # Haversine Formülü
    def haversine_vec(lat1, lon1, lat2, lon2):
        R = 6371000 # Metre cinsinden dünya yarıçapı
        phi1, phi2 = np.radians(lat1), np.radians(lat2)
        dphi = np.radians(lat2 - lat1)
        dlambda = np.radians(lon2 - lon1)
        a = np.sin(dphi/2)**2 + np.cos(phi1)*np.cos(phi2)*np.sin(dlambda/2)**2
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
        return R * c

    full_df['dist_meters'] = haversine_vec(full_df['stop_lat'], full_df['stop_lon'], full_df['next_lat'], full_df['next_lon'])

    # Süre Tahmini (Metrobüs için ortalama 40 km/s, diğerleri için 25 km/s varsayımı)
    # Saniyede alınan yol (m/s) = kmh / 3.6
    # Metrobüs hattı genelde '34' ile başlar. Basit bir mantık kuralım:
    full_df['avg_speed_kmh'] = full_df['route_short_name'].apply(lambda x: 40 if str(x).startswith('34') else 25)
    
    # Süre (Dakika) = (Mesafe(m) / (Hız(kmh) / 3.6)) / 60
    full_df['duration_min'] = (full_df['dist_meters'] / (full_df['avg_speed_kmh'] / 3.6)) / 60

    # Temizlik: Son durakların mesafesi NaN olur, onları doldur veya sil
    full_df = full_df.dropna(subset=['dist_meters'])

    # 4. SONUÇ
    return full_df[['route_short_name', 'stop_name', 'next_stop_name', 'dist_meters', 'duration_min']]

# --- KULLANIM ---
# Dosyaları indirdikten sonra bu fonksiyonu çağırın:
# sonuc = process_transport_data('stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt')
# sonuc.to_csv('processed_routes.csv', index=False)
# print(sonuc.head())