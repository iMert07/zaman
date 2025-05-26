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
  const startDate = new Date(now.getFullYear(), 2, 20); // 20 Mart
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const baseYear = 6835 + Math.floor(daysSinceStart / 365);
  const month = Math.floor((daysSinceStart - 1) / 30) + 1;
  const day = ((daysSinceStart - 1) % 30) + 1;
  return `${toBase12(day)}-${toBase12(month)}-${baseYear}`;
}

function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0);
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
