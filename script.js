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
  const base12Year = estimatedYear + 1 + (6 * 12 * 12 * 12); // +6000 base12 = 10368

  const base12DayStr = toBase12(day);
  const base12MonthStr = toBase12(month);
  const base12YearStr = toBase12(base12Year);

  // Base12 stringini onluk sayıya çevirme fonksiyonu
  function fromBase12(str) {
    const digits = "θ123456789ΦΛ";
    let val = 0;
    for(let ch of str){
      val = val * 12 + digits.indexOf(ch);
    }
    return val;
  }

  // Onluk değerler base12 stringlerine göre:
  const decDay = fromBase12(base12DayStr).toString().padStart(2, '0');
  const decMonth = fromBase12(base12MonthStr).toString().padStart(2, '0');
  const decYear = fromBase12(base12YearStr).toString().padStart(5, '0');

  return {
    base12: ${base12DayStr}.${base12MonthStr}.${base12YearStr},
    decimal: {
      day: decDay,
      month: decMonth,
      year: decYear,
    }
  };
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

  // Base12 saat
  const base12Clock = ${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)};

  // Onluk saat (0 padded)
  const decimalHours = hours.toString().padStart(2, '0');
  const decimalMinutes = minutes.toString().padStart(3, '0');
  const decimalSeconds = seconds.toString().padStart(3, '0');

  const decimalClock = ${decimalHours}.${decimalMinutes}.${decimalSeconds};

  // Tarih
  const customDate = calculateCustomDate(now);

  document.getElementById('clock').textContent = base12Clock;
  document.getElementById('date').textContent = customDate.base12;

  document.getElementById('clockDecimal').textContent = decimalClock;
  document.getElementById('dateDecimal').textContent = ${customDate.decimal.day}.${customDate.decimal.month}.${customDate.decimal.year};
}

setInterval(updateTime, 500);
updateTime();
