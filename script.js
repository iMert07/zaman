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

// Gerçek 1071 yılından bu yana geçen yıl sayısını al, base12 çevir ve 6000 ekle
function calculateCustomDate(now) {
  const realYear = now.getFullYear();
  const baseYearStart = 1071;
  const yearsElapsed = realYear - baseYearStart;

  // Base 12 olarak geçen yıl sayısı
  const base12YearsElapsed = parseInt(toBase12(yearsElapsed), 12);

  // Base 12'de 6000 + geçen yıl = görünmesi istenen yıl
  const finalYearBase10 = base12YearsElapsed + parseInt("6000", 12);
  const finalYearBase12 = toBase12(finalYearBase10);

  // Ay ve gün hesaplama (20 Mart başlangıç)
  const startDate = new Date(realYear, 2, 20); // Mart = 2
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const month = Math.floor((daysSinceStart - 1) / 30) + 1;
  const day = ((daysSinceStart - 1) % 30) + 1;

  return `${toBase12(day)}-${toBase12(month)}-${finalYearBase12}`;
}

function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0); // Her gün saat 04:30'da başlar
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
