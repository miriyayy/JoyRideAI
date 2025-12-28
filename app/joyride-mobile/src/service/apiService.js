const BASE_URL = 'http://192.168.56.1:8000'; 

export const getOptimizedRoute = async (selectedStops) => {
  try {
    const response = await fetch(`${BASE_URL}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stops: selectedStops, // [{name: "Durak 1", lat: 41.0, lon: 29.0}, ...]
      }),
    });

    if (!response.ok) {
      throw new Error('API hatası oluştu');
    }

    const data = await response.json();
    return data; // { total_distance_km: 15.5, route: [...] }
  } catch (error) {
    console.error("Rota hesaplama hatası:", error);
    throw error;
  }
};