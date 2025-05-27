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
  const origin = new Date("1071-03-20T00:00:00Z"); // Gerçek başlangıç tarihi
  const msInDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor((now - origin) / msInDay);

  const yearsPassed = Math.floor(daysPassed / 360); // Her yıl 360 gün
  const base12Offset = parseInt("6000", 12); // Base12: 6000 yıl
  const totalBase12Years = yearsPassed + base12Offset;
  const finalYear = toBase12(totalBase12Years);

  const dayOfYear = daysPassed % 360;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;

  return `${toBase12(day)}-${toBase12(month)}-${finalYear}`;
}

function updateTime() {
  const now = new Date();

  // Gün 04:30'da başlar
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0);

  let elapsedSeconds;
  if (now >= startTime) {
    elapsedSeconds = (now - startTime) / 1000;
  } else {
    // Erken saatlerde, bir önceki günün 04:30'una göre hesapla
    const yesterday = new Date(startTime);
    yesterday.setDate(startTime.getDate() - 1);
    elapsedSeconds = (now - yesterday) / 1000;
  }

  const totalSeconds = Math.floor(elapsedSeconds * 2); // 1 saniye = 2 birim
  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}:${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
