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
  // Gerçek 20 Mart yılbaşı
  const realYear = now.getFullYear();
  const startDate = new Date(realYear, 2, 20); // Mart = 2

  // Eğer bugün 20 Mart'tan önceyse, bir önceki yılı baz al
  if (now < startDate) {
    startDate.setFullYear(realYear - 1);
  }

  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  // Gün ve ay hesaplama (her ay = 30 gün)
  const month = Math.floor(daysSinceStart / 30) + 1;
  const day = (daysSinceStart % 30) + 1;

  // Yıl hesaplama
  const yearsPassed = now.getFullYear() - 1071;
  const base12Years = parseInt(yearsPassed.toString(), 10);
  const base12Number = toBase12(base12Years);
  const customYear = toBase12(6000 + parseInt(base12Number, 12));

  return `${toBase12(day)}-${toBase12(month)}-${customYear}`;
}

function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0);

  // Saat başlangıcından geçen süre
  let elapsedSeconds = (now - startTime) / 1000;
  if (elapsedSeconds < 0) elapsedSeconds += 24 * 60 * 60; // Dünkü 04:30'u kullan

  const scaledSeconds = elapsedSeconds * 2; // Zaman hızlandırma
  const totalSeconds = Math.floor(scaledSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent =
    `${toBase12(hours)}.${toBase12(minutes)}:${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
