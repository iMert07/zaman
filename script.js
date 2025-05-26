// Base 12 için özel karakterler: θ=0, Φ=10, Λ=11
function toBase12(n) {
  const digits = ['θ', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Φ', 'Λ'];
  if (n === 0) return 'θθ';
  let result = '';
  while (n > 0) {
    result = digits[n % 12] + result;
    n = Math.floor(n / 12);
  }
  return result.padStart(2, 'θ');
}

function updateClock() {
  const now = new Date();

  // Gerçek saat 04:30’dan bu yana geçen zamanı hesapla
  const todayStart = new Date(now);
  todayStart.setHours(4, 30, 0, 0);
  if (now < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }
  const elapsedMs = now - todayStart;
  const totalCustomSeconds = elapsedMs / 500; // 1 özel saniye = 0.5 gerçek saniye

  const secondsPerMinute = 120;
  const minutesPerHour = 120;
  const hoursPerDay = 12;

  const customSeconds = Math.floor(totalCustomSeconds % secondsPerMinute);
  const customMinutes = Math.floor((totalCustomSeconds / secondsPerMinute) % minutesPerHour);
  const customHours = Math.floor((totalCustomSeconds / (secondsPerMinute * minutesPerHour)) % hoursPerDay);

  const displayTime =
    toBase12(customHours) + '.' +
    toBase12(customMinutes) + ':' +
    toBase12(customSeconds);
  document.getElementById('time').textContent = displayTime;

  // TAKVİM HESABI
  const yearStart = new Date(now.getFullYear(), 2, 20); // 20 Mart
  if (now < yearStart) yearStart.setFullYear(yearStart.getFullYear() - 1);
  const dayCount = Math.floor((now - yearStart) / (1000 * 60 * 60 * 24)) + 1;

  const baseYear = 1071;
  const year = baseYear + Math.floor(dayCount / 365);
  const month = Math.floor((dayCount % 365) / 30) + 1;
  const day = (dayCount % 30) || 30;

  const displayDate =
    toBase12(day) + '-' +
    toBase12(month) + '-' +
    year;
  document.getElementById('date').textContent = displayDate;
}

setInterval(updateClock, 500);
updateClock();
