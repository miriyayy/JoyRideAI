// src/utils/mockBackend.js

// 1. İSTANBUL DURAK VERİTABANI (MOCK)
const STATION_DB = {
  "Yenikapı": { lines: ["M1", "M2", "Marmaray"], density: 92, status: "AŞIRI YOĞUN" },
  "Söğütlüçeşme": { lines: ["Metrobüs", "Marmaray", "YHT"], density: 85, status: "YOĞUN" },
  "Zincirlikuyu": { lines: ["Metrobüs", "M2"], density: 88, status: "KALABALIK" },
  "Taksim": { lines: ["M2", "F1"], density: 65, status: "NORMAL" },
  "Kadıköy": { lines: ["M4", "Vapur"], density: 70, status: "NORMAL" },
  "Hacıosman": { lines: ["M2"], density: 40, status: "SAKİN" },
  "Beylikdüzü": { lines: ["Metrobüs"], density: 95, status: "PATLIYOR" }
};

// 2. DURAK BİLGİSİ GETİR (Home Ekranı İçin)
export const getStationData = (stationName) => {
  // Büyük/küçük harf duyarlılığını kaldır
  const formattedName = Object.keys(STATION_DB).find(k => k.toLowerCase() === stationName.toLowerCase());
  
  if (formattedName) {
    return { name: formattedName, ...STATION_DB[formattedName] };
  } else {
    // Bilinmeyen duraksa varsayılan değer döndür
    return { name: stationName, lines: ["Hat Bilinmiyor"], density: 50, status: "VERİ YOK" };
  }
};

// 3. ROTA HESAPLAYICI (Smart Algorithm)
export const generateSmartRoutes = (fromStation, toStation) => {
  let routes = [];
  const start = fromStation.toLowerCase();
  const end = toStation.toLowerCase();

  // SENARYO: Yenikapı -> Söğütlüçeşme (Avrupa'dan Asya'ya)
  if (start.includes("yenikapı") && end.includes("söğütlüçeşme")) {
    routes.push({
      id: 1,
      title: '⚡ Marmaray (En Hızlı)',
      desc: 'Yenikapı aktarma merkezinden Marmaray ile direkt geçiş. Trafik riski sıfır.',
      time: '12 dk',
      saving: '25 dk Tasarruf',
      tags: ['Marmaray', 'Direkt'],
      densityScore: 65,
      risk: 'Konforlu ✅'
    });
    routes.push({
      id: 2,
      title: '🚌 M2 + Metrobüs',
      desc: 'Mecidiyeköy\'e gidip Metrobüs\'e binmek. (Önermiyoruz, köprü trafiği var)',
      time: '45 dk',
      saving: 'Yavaş',
      tags: ['M2', '->', '34AS'],
      densityScore: 95,
      risk: 'Yüksek Stres 😫'
    });
  }
  // SENARYO: Zincirlikuyu -> Beylikdüzü (Metrobüs Çilesi)
  else if (start.includes("zincirlikuyu") && end.includes("beylikdüzü")) {
    routes.push({
      id: 1,
      title: '🚌 Metrobüs (Klasik)',
      desc: '34BZ hattına bin. Oturma ihtimalin düşük ama en hızlısı bu.',
      time: '50 dk',
      saving: 'Standart',
      tags: ['34BZ', 'Metrobüs'],
      densityScore: 99,
      risk: 'Balık İstifi 🐟'
    });
    routes.push({
      id: 2,
      title: '🚇 M2 + M1A + Otobüs',
      desc: 'Metrodan şaşma ama 3 aktarma yaparsın.',
      time: '90 dk',
      saving: 'Çok Uzun',
      tags: ['M2', '->', 'M1A'],
      densityScore: 40,
      risk: 'Yorucu 🏃‍♂️'
    });
  }
  // GENEL AKILLI SENARYO (Diğer durumlar için)
  else {
    routes.push({
      id: 1,
      title: `🚀 Önerilen Rota: ${toStation}`,
      desc: `${fromStation} durağından en optimize edilmiş güzergah.`,
      time: '35 dk',
      saving: 'En Mantıklı',
      tags: ['Metro', '->', 'Tramvay'],
      densityScore: 45,
      risk: 'Normal'
    });
    routes.push({
        id: 2,
        title: `🚕 Paylaşımlı Taksi`,
        desc: `Şu an bölgede trafik az. 3-4 kişiyseniz taksi mantıklı.`,
        time: '20 dk',
        saving: 'Konforlu',
        tags: ['Taksi'],
        densityScore: 10,
        risk: 'Pahalı 💸'
      });
  }

  return routes;
};