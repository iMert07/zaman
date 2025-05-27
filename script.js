function toBase12(n) {
  const digits = "θ123456789ΦΛ";
  if (n === 0) return "θθ";
  let result = "";
  while (n > 0) {
    result = digits[n % 12] + result;
    n = Math.floor(n / 12);
  }
  return result.padStart(2, 'θ');
}

function calculateCustomDate(now) {
  const baseYearMiladi = 1071;
  const baseYearExtra = 6000; // Base12 başlangıç yılı eklentisi

  // 20 Mart bu yılın başlangıcı (ay 0 tabanlı)
  const startDate = new Date(now.getFullYear(), 2, 20);

  if (now < startDate) {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  // Normal gün farkı
  let daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

  // Gerçek yıl farkı (miladi yıl)
  const realYearDiff = startDate.getFullYear() - baseYearMiladi;

  // 10 tabanında sabitler:
  // 20 yılda 5 gün ekleniyor (artık gün blokları)
  // 640 ve katlarında artık gün eklenmiyor
  const YEARS_FOR_EXTRA_DAYS = 20;
  const YEARS_SKIP_EXTRA = 640;

  // Artık günleri hesapla
  let totalExtraDays = 0;
  for (let y = 1; y <= realYearDiff; y++) {
    if (y % YEARS_SKIP_EXTRA === 0) {
      // 640'ın katları için artık gün yok (yani bu yılda ekleme yok)
      continue;
    }
    if (y % YEARS_FOR_EXTRA_DAYS === 0) {
      totalExtraDays += 5;
    }
  }

  // Gün sayısına artık günleri ekle
  daysSinceStart += totalExtraDays;

  // Base12'de 6000 = 6*12^3 = 10368 onluk yıl
  const base12ExtraInDecimal = 6 * 12 * 12 * 12;

  // Toplam yıl (gerçek yıl farkı + base12 başlangıcı + geçilen günlere göre yıl sayısı)
  const totalYearsDecimal = realYearDiff + base12ExtraInDecimal + Math.floor(daysSinceStart / 365);

  // Base12 olarak yıl
  const base12Year = toBase12(totalYearsDecimal);

  // Ay ve gün hesaplama (ilk 12 ay 30 gün, son ay artık günleri kapsar)
  let dayOfYear = (daysSinceStart - 1) % 365 + 1;

  let month, day;
  if (dayOfYear <= 360) {
    // Normal aylar
    month = Math.floor((dayOfYear - 1) / 30) + 1;
    day = ((dayOfYear - 1) % 30) + 1;
  } else {
    // Artık ay (son ay)
    month = 13;
    day = dayOfYear - 360;
  }

  return `${toBase12(day)}.${toBase12(month)}.${base12Year}`;
}

function updateTime() {
  const now = new Date();

  // Bugün 04:30 başlangıcı
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 30, 0, 0);
  if (now < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }

  // Geçen saniye (2x hız)
  const elapsedSeconds = ((now - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  // Saat sistemi: 12 saat, 120 dakika, 120 saniye
  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
