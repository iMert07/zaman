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

function fromBase12(str) {
  const digits = "θ123456789ΦΛ";
  return str.split('').reduce((acc, digit) => acc * 12 + digits.indexOf(digit), 0);
}

function calculateCustomDate(now) {
  const referenceYear = 1071;
  const referenceDate = new Date(referenceYear, 2, 20); // 20 Mart 1071
  const totalDays = Math.floor((now - referenceDate) / (1000 * 60 * 60 * 24));

  const yearPassedDecimal = Math.floor(totalDays / 360); // 1 yıl = 360 gün
  const base12Year = toBase12(yearPassedDecimal);

  const base12Offset = fromBase12("6θθθ"); // 6000 base12
  const finalYear = toBase12(fromBase12(base12Year) + base12Offset);

  const remainingDays = totalDays % 360;
  const month = Math.floor(remainingDays / 30) + 1;
  const day = (remainingDays % 30) + 1;

  return `${toBase12(day)}-${toBase12(month)}-${finalYear}`;
}

function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0);
  if (now < startTime) {
    startTime.setDate(startTime.getDate() - 1);
  }

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
