import numpy as np
import pandas as pd
import random
import folium
import os
import webbrowser
import requests
import time
import math

# --- 1. OSRM VE HAVERSINE MESAFE FONKSİYONLARI ---

def haversine_distance(lat1, lon1, lat2, lon2):
    """Yedek olarak kullanılacak Kuş Uçuşu Hesaplama"""
    R = 6371  # Dünya yarıçapı (km)
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def get_osrm_distance(lat1, lon1, lat2, lon2):
    """OSRM API kullanarak gerçek yol mesafesini (km) döndürür"""
    # OSRM koordinat sırası: Longitude, Latitude (Bizimkinin tersi!)
    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"
    
    try:
        response = requests.get(url, timeout=2) # 2 saniye bekle, cevap yoksa pes et
        if response.status_code == 200:
            data = response.json()
            # OSRM mesafeyi metre verir, biz km'ye çeviriyoruz
            dist_meters = data['routes'][0]['distance']
            return dist_meters / 1000.0
        else:
            return None
    except:
        return None

# --- 2. ACO SINIFI (ALGORİTMA MOTORU) ---
class AntColonyOptimizer:
    def __init__(self, distances, n_ants, n_best, n_iterations, decay, alpha=1, beta=1):
        self.distances = distances
        self.pheromone = np.ones(self.distances.shape) / len(distances)
        self.all_inds = range(len(distances))
        self.n_ants = n_ants
        self.n_best = n_best
        self.n_iterations = n_iterations
        self.decay = decay
        self.alpha = alpha
        self.beta = beta

    def run(self):
        shortest_path = None
        all_time_shortest_path = ("placeholder", np.inf)
        
        for i in range(self.n_iterations):
            all_paths = self.gen_all_paths()
            self.spread_pheronome(all_paths, self.n_best, shortest_path=shortest_path)
            
            current_shortest = min(all_paths, key=lambda x: x[1])
            
            if current_shortest[1] < all_time_shortest_path[1]:
                all_time_shortest_path = current_shortest
            
            self.pheromone = self.pheromone * self.decay

        return all_time_shortest_path

    def spread_pheronome(self, all_paths, n_best, shortest_path):
        sorted_paths = sorted(all_paths, key=lambda x: x[1])
        for path, dist in sorted_paths[:n_best]:
            for move in path:
                d = self.distances[move]
                if d == 0: d = 0.0001
                self.pheromone[move] += 1.0 / d

    def gen_path_dist(self, path):
        total_dist = 0
        for ele in path:
            total_dist += self.distances[ele]
        return total_dist

    def gen_all_paths(self):
        all_paths = []
        for i in range(self.n_ants):
            path = self.gen_path(0)
            all_paths.append((path, self.gen_path_dist(path)))
        return all_paths

    def gen_path(self, start_node):
        path = []
        visited = set()
        visited.add(start_node)
        prev = start_node
        
        for i in range(len(self.distances) - 1):
            move = self.pick_move(self.pheromone[prev], self.distances[prev], visited)
            path.append((prev, move))
            prev = move
            visited.add(move)
        
        path.append((prev, start_node)) 
        return path

    def pick_move(self, pheromone, dist, visited):
        pheromone = np.copy(pheromone)
        pheromone[list(visited)] = 0 

        safe_dist = np.copy(dist)
        safe_dist[safe_dist == 0] = 0.0001
        
        visibility = 1.0 / safe_dist
        row = pheromone ** self.alpha * (visibility ** self.beta)
        
        if row.sum() == 0:
            unvisited = list(set(self.all_inds) - visited)
            return np.random.choice(unvisited)

        norm_row = row / row.sum()
        
        if np.isnan(norm_row).any():
             unvisited = list(set(self.all_inds) - visited)
             return np.random.choice(unvisited)
             
        move = np.random.choice(self.all_inds, 1, p=norm_row)[0]
        return move

# --- 3. YARDIMCI FONKSİYONLAR ---
def calculate_distance_matrix(coords):
    n = len(coords)
    dist_matrix = np.zeros((n, n))
    
    print(f"\n🌍 Mesafe Matrisi Hesaplanıyor ({n}x{n})...")
    print("Not: Gerçek yol verisi için internet kullanılıyor. Lütfen bekleyin.")
    
    osrm_count = 0
    fallback_count = 0

    for i in range(n):
        for j in range(n):
            if i == j: 
                dist_matrix[i][j] = np.inf 
            else:
                lat1, lon1 = coords[i]
                lat2, lon2 = coords[j]
                
                # Önce OSRM dene
                dist = get_osrm_distance(lat1, lon1, lat2, lon2)
                
                if dist is not None:
                    dist_matrix[i][j] = dist
                    osrm_count += 1
                    # Sunucuyu yormamak için minik bekleme
                    time.sleep(0.1) 
                else:
                    # Hata olursa Haversine kullan
                    dist_matrix[i][j] = haversine_distance(lat1, lon1, lat2, lon2)
                    fallback_count += 1
    
    print(f"✅ Tamamlandı. (OSRM: {osrm_count}, Yedek Hesap: {fallback_count})")
    return dist_matrix

def visualize_route_on_map(stops_list, path_indices, output_file="rota_haritasi.html"):
    start_node = path_indices[0][0]
    center_lat = stops_list[start_node]['lat']
    center_lon = stops_list[start_node]['lon']
    m = folium.Map(location=[center_lat, center_lon], zoom_start=13)

    for i, stop in enumerate(stops_list):
        folium.Marker(
            [stop['lat'], stop['lon']],
            popup=stop['name'],
            tooltip=f"{i+1}. {stop['name']}",
            icon=folium.Icon(color="blue", icon="info-sign")
        ).add_to(m)

    route_coords = []
    
    # OSRM ile rotayı haritada detaylı çizmek için polyline decode gerekebilir 
    # Ama şimdilik basit çizgilerle gösteriyoruz (Hackathon hızı için)
    for start, end in path_indices:
        p1 = [stops_list[start]['lat'], stops_list[start]['lon']]
        p2 = [stops_list[end]['lat'], stops_list[end]['lon']]
        route_coords.append(p1)
        if end == path_indices[-1][1]: 
            route_coords.append(p2)

    folium.PolyLine(route_coords, color="red", weight=5, opacity=0.7).add_to(m)
    m.save(output_file)
    print(f"✅ Harita oluşturuldu: {output_file}")
    
    try:
        webbrowser.open(output_file)
    except:
        pass

# --- 4. ANA PROGRAM ---

current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, 'stops.csv')

print("📂 Dosya okunuyor...")

try:
    stops = pd.read_csv(csv_path, encoding='windows-1254')
except FileNotFoundError:
    print(f"❌ HATA: 'stops.csv' dosyası {current_dir} içinde bulunamadı.")
    exit()
except UnicodeDecodeError:
    stops = pd.read_csv(csv_path, encoding='utf-8')

test_duraklari = ["Kadıköy", "Beşiktaş", "Taksim", "Eminönü", "Sultanahmet", "Üsküdar"]
selected_stops = []

print("📍 Duraklar seçiliyor...")
for name in test_duraklari:
    found = stops[stops['stop_name'].str.contains(name, case=False, na=False)]
    if not found.empty:
        durak = found.iloc[0]
        selected_stops.append({'name': durak['stop_name'], 'lat': durak['stop_lat'], 'lon': durak['stop_lon']})
    else:
        print(f"⚠️ Uyarı: {name} bulunamadı, atlanıyor.")

if len(selected_stops) < 2:
    print("❌ Rota oluşturmak için en az 2 durak gerekli.")
    exit()

coords = [(d['lat'], d['lon']) for d in selected_stops]

# Mesafe Matrisini Hesapla (Burada OSRM devreye giriyor)
dist_matrix = calculate_distance_matrix(coords)

print("\n🐜 Karıncalar en kısa yolu arıyor...")
optimizer = AntColonyOptimizer(dist_matrix, n_ants=10, n_best=3, n_iterations=50, decay=0.95, alpha=1, beta=2)

try:
    best_path, best_distance = optimizer.run()

    print("\n🏆 EN İYİ ROTA BULUNDU!")
    print(f"Toplam Mesafe: {best_distance:.2f} km")
    print("-" * 30)

    curr = best_path[0][0]
    print(f"🏁 Başlangıç: {selected_stops[curr]['name']}")

    for i, (start, end) in enumerate(best_path):
        d_val = dist_matrix[start][end]
        if d_val == np.inf: d_val = 0
        print(f"⬇️ {d_val:.2f} km")
        print(f"Durak {i+1}: {selected_stops[end]['name']}")

    print("-" * 30)
    visualize_route_on_map(selected_stops, best_path)

except Exception as e:
    print(f"\n❌ BEKLENMEYEN HATA: {e}")