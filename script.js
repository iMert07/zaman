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

  // 20 Mart bu yılın başlangıcı
  const startDate = new Date(now.getFullYear(), 2, 20); // Ay 0 tabanlı, 2 = Mart

  // Eğer bugünün tarihi 20 Mart'tan önceyse, başlangıcı bir önceki yıla al
  if (now < startDate) {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  // Toplam geçen gün sayısı (20.03.1071'den bugüne)
  const baseStartDate = new Date(1071, 2, 20);
  const daysSinceBase = Math.floor((now - baseStartDate) / (1000 * 60 * 60 * 24)) + 1;

  // Yıl farkı (gerçek)
  const totalYearsDecimal = Math.floor(daysSinceBase / 365) + 6 * 12 * 12 * 12; // 6000 base12 = 10368 decimal

  // Gün yıl içindeki gün olarak hesapla
  const dayOfYear = daysSinceBase % 365 || 365;

  // Ay ve gün hesaplama
  let month, day;
  if (dayOfYear > 360) {
    month = 13;
    day = dayOfYear - 360;
  } else {
    month = Math.floor((dayOfYear - 1) / 30) + 1;
    day = ((dayOfYear - 1) % 30) + 1;
  }

  return `${toBase12(day)}.${toBase12(month)}.${toBase12(totalYearsDecimal)}`;
}

function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0);

  // Eğer şimdi 04:30'dan önceyse, saat başlangıcını bir gün öncesine al
  if (now < startTime) {
    startTime.setDate(startTime.getDate() - 1);
  }

  // Geçen saniyeyi hesapla, hız 2x
  const elapsedSeconds = ((now - startTime) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  // Saat sistemi: 12 tabanlı saat, 120 tabanlı dakika ve saniye
  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
