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

function countExtraWeeks(years) {
  let extra = 0;
  for (let i = 1; i <= years; i++) {
    if (i % 20 === 0 && i % 640 !== 0) {
      extra += 5;
    }
  }
  return extra;
}

function calculateCustomDate(now) {
  const gregBase = new Date(1071, 2, 21); // 21 Mart 1071
  const daysPassed = Math.floor((now - gregBase) / (1000 * 60 * 60 * 24));

  let estimatedYear = Math.floor(daysPassed / 365);
  let totalDays = estimatedYear * 365 + countExtraWeeks(estimatedYear);

  while (totalDays > daysPassed) {
    estimatedYear--;
    totalDays = estimatedYear * 365 + countExtraWeeks(estimatedYear);
  }

  while (totalDays + (estimatedYear + 1) * 0 < daysPassed) {
    estimatedYear++;
    totalDays = estimatedYear * 365 + countExtraWeeks(estimatedYear);
    if (totalDays > daysPassed) {
      estimatedYear--;
      totalDays = estimatedYear * 365 + countExtraWeeks(estimatedYear);
      break;
    }
  }

  const dayOfYear = daysPassed - totalDays;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;

  // Base12 olarak 6000 yıl ekle (görsel amaçlı), ama zamana dahil etme
  const yearToDisplay = estimatedYear + 1 + (6 * 12 * 12 * 12); // +6000 base12 = 10368

  return `${toBase12(day)}.${toBase12(month)}.${toBase12(yearToDisplay)}`;
}

function updateTime() {
  const now = new Date();

  // Gün 04:30'da başlar
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 30, 0);
  if (now < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }

  const elapsedSeconds = ((now - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

setInterval(updateTime, 500);
updateTime();
