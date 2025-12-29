# 🚀 JoyRideAI: Veri Odaklı, Konfor Odaklı Akıllı Şehir Ekosistemi

**JoyRideAI**, 32 saatlik yoğun bir hackathon sürecinde *"İstanbul'un karmaşasına akıllı bir çözüm"* mottosuyla geliştirildi. Projemiz, İBB Açık Veri Portalı'ndan alınan gerçek verilerle beslenen uçtan uca bir ulaşım ekosistemidir.

Harika bir bakış açısı. Sadece teknik bir çözüm değil, aynı zamanda **sürdürülebilirlik** ve **vatandaş memnuniyeti** odaklı bir hikaye oluşturmuşsunuz. Bu "insan odaklı" yaklaşım jüriyi her zaman daha fazla etkiler.



Aşağıda, ana README dosyana bu vizyonu ve alt klasörlerdeki detaylı dökümanlara yönlendiren (linkli) yapıyı ekledim:



---



# 🚀 JoyRideAI: Veri Odaklı ve Konforlu Akıllı Ulaşım Sistemi



**JoyRideAI**, 32 saatlik yoğun bir hackathon sürecinde "İstanbul'un karmaşasına akıllı bir çözüm" mottosuyla geliştirildi.



## 🌟 Vizyonumuz: Hız Değil, Konfor ve Sürdürülebilirlik



Klasik navigasyonlar sadece "A'dan B'ye en hızlı nasıl gidilir?" sorusuna odaklanırken, biz şu kritik soruya odaklandık:

**"A'dan B'ye en az kalabalıkla ve maksimum konforla nasıl giderim?"**



Bu yaklaşımla şunları hedefliyoruz:



* **Toplu Taşımayı Cazip Kılmak:** Tek kişilik araç kullanımını azaltarak karbon salımını düşürmek.

* **Öngörülü Çözümler:** "Bu kalabalıkta araca binebilir miyim?" stresini, AI destekli yoğunluk tahminiyle ortadan kaldırmak.

* **Operasyonel Verimlilik:** İBB çözüm merkezlerine gelen "ek sefer" taleplerini, sorun oluşmadan önce tahmin edip çözmek.



---



## 🏗️ Proje Bileşenleri



Sistemimiz birbirini besleyen iki ana koldan oluşmaktadır:



### 1. 📱 Kullanıcılar İçin: Akıllı Mobil Asistan



Yolcuların stres ve yoğunluk seviyelerine göre rota seçebildiği mobil uygulama.



* **Özellik:** Yoğunluktan kaçan "İstanbul Hackleri" ve konfor puanlaması.

* 👉 **[Mobil Uygulama Detayları & Kurulumu için Tıklayın](https://github.com/miriyayy/JoyRideAI/blob/main/app/joyride-mobile/README.md)**



### 2. 🖥️ İBB İçin: Karar Destek Sistemi (Web)



Operatörlerin şehirdeki nabzı tuttuğu, AI'nın "Buraya ek sefer lazım" uyarısı verdiği yönetim paneli.



* **Özellik:** Gerçek zamanlı istasyon izleme ve otomatik sefer aralığı optimizasyon önerileri.

* 👉 **[Web Dashboard Detayları & Kurulumu için Tıklayın](https://github.com/miriyayy/JoyRideAI/blob/main/web/ibb-hackathon-web/README.md)**



---



## 🧠 Algoritma ve Veri Bilimi Derinliği



Sistemin arkasında yatan matematiksel güç iki ana modülde toplanmıştır:



### 📈 Makine Öğrenmesi (Yoğunluk Tahmini)



İBB Açık Veri Portalı'ndan alınan saatlik yolcu verileriyle eğitilen modeller, %99.83 doğrulukla istasyon doluluğunu tahmin eder.



* **Kullanılan Algoritmalar:** CatBoost, LSTM, XGBoost, Random Forest, SVM, DNN.



### 📍 Rota Optimizasyonu (Genetik Algoritma)



Duraklar arasındaki gerçek mesafeleri (OSRM) kullanarak en mantıklı rotayı hesaplar.



* **Teknoloji:** Karınca Kolonisi Optimizasyonu (ACO) ve Graf Teorisi.

* 👉 **[Algoritma ve Genetik Hesaplama Detayları için Tıklayın](https://github.com/miriyayy/JoyRideAI/blob/main/GA-mesafe%20hesab%C4%B1/README.MD)**



---



## 🛠️ Teknoloji Yığını



| Katman | Teknolojiler |

| --- | --- |

| **Veri & Yapay Zeka** | Python (Pandas, Scikit-learn, CatBoost, TensorFlow) |

| **Backend** | FastAPI, Uvicorn |

| **Frontend (Web)** | React.js, Tailwind CSS, Leaflet.js |

| **Mobil** | React Native, Expo, React Navigation |

| **Mesafe Motoru** | OSRM (Open Source Routing Machine) |



---



## 📂 Proje Dizini



* 📂 `app/` - Mobil Uygulama kaynak kodları.

* 📂 `web/` - Web Kontrol Paneli kaynak kodları.

* 📂 `GA-mesafe hesabı/` - Rota optimizasyon algoritmaları.

* 📂 `hackathon-api/` - Python API servisleri.

* 📄 `catboost_model.cbm` - En iyi performans veren tahmin modelimiz.



---



**JoyRideAI** | *Tech Istanbul Hackathon 2025* - Yolculuğunu şansa değil, yapay zekaya bırak. 🚇✨



