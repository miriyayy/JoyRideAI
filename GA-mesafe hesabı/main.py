import numpy as np
import requests
import math
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from fastapi.middleware.cors import CORSMiddleware # En üste ekle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tüm bağlantılara izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. MESAFE VE ALGORİTMA KISMI  ---

def get_osrm_distance(lat1, lon1, lat2, lon2):
    url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            return response.json()['routes'][0]['distance'] / 1000.0
    except:
        return None
    return None

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi, dlambda = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

class AntColonyOptimizer:
    def __init__(self, distances, n_ants=10, n_best=3, n_iterations=20, decay=0.95):
        self.distances = distances
        self.pheromone = np.ones(self.distances.shape) / len(distances)
        self.all_inds = range(len(distances))
        self.n_ants, self.n_best, self.n_iterations, self.decay = n_ants, n_best, n_iterations, decay

    def run(self):
        best_path = None
        all_time_best = ("path", np.inf)
        for _ in range(self.n_iterations):
            paths = []
            for _ in range(self.n_ants):
                path = self.gen_path(0)
                dist = sum(self.distances[move] for move in path)
                paths.append((path, dist))
            
            curr_best = min(paths, key=lambda x: x[1])
            if curr_best[1] < all_time_best[1]: all_time_best = curr_best
            self.pheromone *= self.decay
            for path, dist in sorted(paths, key=lambda x: x[1])[:self.n_best]:
                for move in path: self.pheromone[move] += 1.0 / (self.distances[move] if self.distances[move] > 0 else 0.1)
        return all_time_best

    def gen_path(self, start):
        path, visited, prev = [], {start}, start
        for _ in range(len(self.distances) - 1):
            move = self.pick_move(self.pheromone[prev], self.distances[prev], visited)
            path.append((prev, move))
            prev, visited.add(move)
        path.append((prev, start))
        return path

    def pick_move(self, pheromone, dist, visited):
        p = np.copy(pheromone)
        p[list(visited)] = 0
        d = np.copy(dist)
        d[d == 0] = 0.0001
        row = p * ((1.0 / d) ** 2)
        if row.sum() == 0: return np.random.choice(list(set(self.all_inds) - visited))
        return np.random.choice(self.all_inds, 1, p=row/row.sum())[0]

# --- 2. API KATMANI (Mobil ile bağlantı kuracak kısım) ---

app = FastAPI()

class Stop(BaseModel):
    name: str
    lat: float
    lon: float

class RouteRequest(BaseModel):
    stops: List[Stop]

@app.post("/solve")
async def solve_tsp(request: RouteRequest):
    if len(request.stops) < 2:
        raise HTTPException(status_code=400, detail="En az 2 durak gerekli.")

    coords = [(s.lat, s.lon) for s in request.stops]
    n = len(coords)
    dist_matrix = np.zeros((n, n))

    # Matrisi oluştur
    for i in range(n):
        for j in range(n):
            if i == j: dist_matrix[i][j] = np.inf
            else:
                d = get_osrm_distance(coords[i][0], coords[i][1], coords[j][0], coords[j][1])
                dist_matrix[i][j] = d if d is not None else haversine_distance(coords[i][0], coords[i][1], coords[j][0], coords[j][1])

    optimizer = AntColonyOptimizer(dist_matrix)
    best_path, best_dist = optimizer.run()

    # Sonucu sıralı listeye çevir
    ordered_stops = []
    curr_idx = best_path[0][0]
    ordered_stops.append(request.stops[curr_idx])
    for start, end in best_path:
        ordered_stops.append(request.stops[end])

    return {
        "total_distance_km": round(best_dist, 2),
        "route": ordered_stops
    }

@app.get("/")
def home():
    return {"status": "AI Sunucusu Calisiyor", "docs": "/docs adresine git"}