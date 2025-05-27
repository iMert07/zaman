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
  // Başlangıç tarihi 20 Mart 1071
  const baseYearStart = 1071;
  const startDate = new Date(baseYearStart, 2, 20); // Ay: 2 => Mart (0 bazlı)
  const diffMillis = now - startDate;
  const daysSinceStart = Math.floor(diffMillis / (1000 * 60 * 60 * 24)) + 1;

  // Ay ve gün hesaplaması (30 günlük ay, 365 günlük yıl varsayımı)
  const month = Math.floor((daysSinceStart - 1) / 30) + 1;
  const day = ((daysSinceStart - 1) % 30) + 1;

  // Geçen gerçek yıl sayısı
  const realYearDiff = now.getFullYear() - baseYearStart;

  // 6000 base12 yılın decimal karşılığı: 6*12^3 = 6*1728=10368
  const base12_6000_decimal = 10368;

  // Toplam yıl decimal olarak:
  const totalYearDecimal = realYearDiff + base12_6000_decimal;

  // Toplam yıl base12'ye çevriliyor:
  const yearBase12 = toBase12(totalYearDecimal);

  return `${toBase12(day)}-${toBase12(month)}-${yearBase12}`;
}

function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0);

  // Zaman hızlandırılmış (2x)
  const elapsedSeconds = (now - startTime) / 1000 * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}:${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
