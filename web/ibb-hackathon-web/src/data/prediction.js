const stationData = [
    {
      "id": 1,
      "location_name": "Yenikapı Metro İstasyonu",
      "type": "metro",
      "line": "M2",
      "scenario_time": "Pazartesi 08:00",
      "metrics": {
        "predicted_density": 92,
        "current_capacity": 1200,
        "passenger_count": 1104
      },
      "hourly_forecast": [
        {"time": "06:00", "density": 40},
        {"time": "07:00", "density": 65},
        {"time": "08:00", "density": 92},
        {"time": "09:00", "density": 85},
        {"time": "10:00", "density": 60}
      ],
      "web_view": {
        "action_required": true,
        "suggestion": "Sefer aralığını 4 dk -> 2 dk düşür.",
        "status": "critical"
      }
    },
    {
      "id": 2,
      "location_name": "Zincirlikuyu Metrobüs",
      "type": "metrobus",
      "line": "34AS",
      "scenario_time": "Cuma 19:00 (Konser)",
      "metrics": {
        "predicted_density": 88,
        "current_capacity": 160,
        "passenger_count": 140
      },
      "hourly_forecast": [
        {"time": "17:00", "density": 70},
        {"time": "18:00", "density": 85},
        {"time": "19:00", "density": 88},
        {"time": "20:00", "density": 80},
        {"time": "21:00", "density": 50}
      ],
      "web_view": {
        "action_required": true,
        "suggestion": "Söğütlüçeşme yönüne ek 5 araç.",
        "status": "warning"
      }
    },
    {
      "id": 3,
      "location_name": "Altunizade",
      "type": "metrobus",
      "line": "34G",
      "scenario_time": "Pazartesi 10:00",
      "metrics": {
        "predicted_density": 45,
        "current_capacity": 160,
        "passenger_count": 72
      },
      "hourly_forecast": [
        {"time": "08:00", "density": 90},
        {"time": "09:00", "density": 70},
        {"time": "10:00", "density": 45},
        {"time": "11:00", "density": 40}
      ],
      "web_view": {
        "action_required": false,
        "suggestion": "Mevcut tarife uygun.",
        "status": "normal"
      }
    }
  ]

export default stationData