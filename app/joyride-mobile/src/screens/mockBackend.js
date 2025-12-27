
export const generateSmartRoutes = (currentStation, currentDensity) => {
    let routes = [];
  
    // Senaryo 1: Yoğunluk %80 üzerindeyse
    if (currentDensity > 80) {
      routes.push({
        id: 1,
        title: '🚀 En Hızlı Kaçış',
        desc: `${currentStation} çok yoğun! Bir önceki duraktan Marmaray'a aktarma yap.`,
        time: '25 dk',
        saving: '15 dk Tasarruf',
        tags: ['M2', '->', 'Marmaray'],
        densityScore: 45
      });
      routes.push({
        id: 2,
        title: '☕ Konforlu Rota (Oturarak)',
        desc: `10 dk uzat ama Vapur ile git, deniz havası al.`,
        time: '45 dk',
        saving: 'Stres Yok',
        tags: ['Otobüs', '->', 'Vapur'],
        densityScore: 20
      });
    } 
    // Senaryo 2: Yoğunluk normalse
    else {
      routes.push({
        id: 1,
        title: '⚡ Standart Rota',
        desc: 'Mevcut hat şu an gayet akıcı, değişiklik yapmana gerek yok.',
        time: '20 dk',
        saving: 'En Hızlısı',
        tags: ['M2 Metro'],
        densityScore: currentDensity
      });
    }
  
    return routes;
  };