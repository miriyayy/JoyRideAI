# 🚀 JoyRide Web – Gerçek Zamanlı Ulaşım Kontrol Merkezi

**JoyRide Web**, İstanbul’un yoğun toplu taşıma altyapısı için geliştirilmiş,  
**Gerçek Zamanlı Ulaşım Yönetim Sistemi** ve **Yapay Zekâ Karar Destek Platformu**dur.

Bu web uygulaması; operatörlerin istasyon yoğunluklarını izlemesini, saatlik tahminleri analiz etmesini ve kritik durumlarda **AI destekli optimizasyon kararları** almasını sağlar.

---

## 📺 Proje Demosu
Aşağıdaki video, JoyRide ekosisteminin (Web) nasıl entegre çalıştığını ve operatör panelinin kullanımını göstermektedir:

<div align="center">
  <video src="src/assets/demo.mp4" width="100%" controls>
    Tarayıcınız video etiketini desteklemiyor.
  </video>
</div>

---

## 🌟 Projenin Amacı

Metropol şehirlerde ulaşım yönetimi yalnızca sefer planlaması değil, **yoğunluk, stres ve zaman optimizasyonu** problemidir.  
JoyRide Web bu probleme şu çözümleri sunar:

- **Gerçek Zamanlı İzleme**  
  İstasyon bazlı yolcu yoğunluğu, kapasite ve doluluk oranlarını anlık olarak gösterir.

- **Tahmine Dayalı Analiz (Predictive Analytics)**  
  Saatlik tahminler (Hourly Forecast) ile yoğunluk artışları önceden öngörülür.

- **Yapay Zekâ Karar Destek Sistemi**  
  Kritik durumlarda operatöre otomatik çözüm önerileri sunar.

---

## 🖥️ Web Kontrol Merkezi Özellikleri

### 📊 Yoğunluk & Kapasite Paneli
- **Mevcut Kapasite**
- **Yolcu Sayısı**
- **Tahmini Yoğunluk (%)**
- Durum bazlı uyarılar (**Normal / Warning / Critical**)

### 🧠 AI Decision Support
Kritik yoğunluk algılandığında sistem şu aksiyonları önerir:

- Sefer aralığını **4 dk → 2 dk** düşürme
- Hat bazlı yük dengeleme
- Operatör onayıyla **AI Optimization** uygulama

✓ Optimizasyon uygulandığında sistem durumu otomatik günceller.

### 🗺️ Harita Tabanlı İzleme
- **Leaflet** ile karanlık tema (Dark Mode)
- İstasyonlar koordinat bazlı canlı harita üzerinde gösterilir
- Yoğunluğa göre renk kodlaması

### 📈 Saatlik Tahminler
- **Recharts** ile Hourly Forecast grafikleri
- Geçmiş veriye dayalı yoğunluk projeksiyonları

---

## 📸 Uygulama Ekran Görüntüsü

| Web Operasyon Merkezi |
| --- |
| ![](assets/screen_web.png) |
| Gerçek zamanlı harita, saatlik tahminler ve AI optimizasyon paneli |

---

## 🧠 Teknik Mimari

### 🔹 Veri Katmanı
- Simüle edilmiş istasyon yoğunluk verileri
- Kapasite, yolcu sayısı ve doluluk oranı hesaplamaları

### 🔹 Karar Mekanizması
- Eşik tabanlı yoğunluk analizi
- Kritik durumda AI öneri üretimi
- Operatör tetiklemeli optimizasyon

### 🔹 Görselleştirme
- Harita + Grafik + Panel senkronizasyonu
- Gerçek zamanlı durum güncellemeleri

---

## 🛠️ Teknolojik Stack

- **Frontend:** React.js, Vite
- **Harita:** Leaflet
- **Grafikler:** Recharts
- **UI:** Tailwind CSS
- **AI & Logic:** JavaScript tabanlı simülasyon katmanı

---

## 📂 Proje Yapısı

```text
ibb-hackathon-web/
├── src/
│   ├── assets/        # Logo ve görseller
│   ├── data/          # İstasyon ve tahmin verileri
│   ├── components/    # Harita, grafik ve paneller
│   └── App.jsx        # Ana kontrol merkezi
│
├── assets/
│   └── screen_web.png # Web ekran görüntüsü
│
└── demo.mp4           # Proje demo videosu


🚀 Kurulum ve Çalıştırma
bash
Kodu kopyala
npm install
npm run dev
Uygulama varsayılan olarak localhost üzerinde çalışır.