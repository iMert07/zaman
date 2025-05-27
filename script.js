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
  // Miladi başlangıç tarihi: 20 Mart, gerçek 1071 yılı
  const baseYearMiladi = 1071;
  const baseYearExtra = 6000; // Base12 olarak eklenecek yıl sayısı (onlukta değil)

  // 21 Mart bu yılın başlangıcı
  const startDate = new Date(now.getFullYear(), 2, 21); // Ay 0 tabanlı, 2 = Mart

  // Eğer bugünün tarihi 21 Mart'tan önceyse, başlangıcı bir önceki yıla al
  if (now < startDate) {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  // Gün sayısı hesapla
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

  // Yıl farkı (gün sayısına göre gerçek yıl farkı)
  const realYearDiff = startDate.getFullYear() - baseYearMiladi;

  // Toplam yıl base12 olarak hesaplanacak:
  // gerçek yıl farkı + 6000 (base12) - bunu base10'a çeviriyoruz:
  // base12 6000 = 6 * 12^3 = 6 * 1728 = 10368 onluk yıl
  const base12ExtraInDecimal = 6 * 12 * 12 * 12; // 10368

  const totalYearsDecimal = realYearDiff + base12ExtraInDecimal + Math.floor(daysSinceStart / 365);

  // totalYearsDecimal'i base12'ye çeviriyoruz
  const base12Year = toBase12(totalYearsDecimal);

  // Ay ve gün hesaplama (normal 30 günlük aylar olarak)
  const month = Math.floor((daysSinceStart - 1) / 30) + 1;
  const day = ((daysSinceStart - 1) % 30) + 1;

  return `${toBase12(day)}.${toBase12(month)}.${base12Year}`;
}

function updateTime() {
  const now = new Date();

  // Saat 04:30 bugünün başlangıcı olacak
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 30, 0, 0);

  // Eğer henüz 04:30 olmadıysa, başlangıç dünkü 04:30 olmalı
  if (now < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }

  // Geçen saniyeyi hesapla (2x hız)
  const elapsedSeconds = ((now - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  // Özel saat sistemi: 12 saat, 120 dakika, 120 saniye
  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
