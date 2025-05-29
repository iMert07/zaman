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

  const dayOfYear = daysPassed - totalDays;
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;

  const base12Year = estimatedYear + 1 + (6 * 12 * 12 * 12); // +6000 base12 = 10368

  const base12DayStr = toBase12(day);
  const base12MonthStr = toBase12(month);
  const base12YearStr = toBase12(base12Year);

  function fromBase12(str) {
    const digits = "θ123456789ΦΛ";
    let val = 0;
    for (let ch of str) {
      val = val * 12 + digits.indexOf(ch);
    }
    return val;
  }

  const decDay = fromBase12(base12DayStr).toString().padStart(2, '0');
  const decMonth = fromBase12(base12MonthStr).toString().padStart(2, '0');
  const decYear = fromBase12(base12YearStr).toString().padStart(5, '0');

  return {
    base12: `${base12DayStr}.${base12MonthStr}.${base12YearStr}`,
    decimal: {
      day: decDay,
      month: decMonth,
      year: decYear,
    }
  };
}

function getGregorianDateTime(now) {
  // Türkiye saati (UTC+3)
  const options = {
    timeZone: 'Europe/Istanbul',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  const formatter = new Intl.DateTimeFormat('tr-TR', options);
  const parts = formatter.formatToParts(now);
  
  const dateTime = {};
  parts.forEach(part => {
    dateTime[part.type] = part.value;
  });
  
  return {
    time: `${dateTime.hour}.${dateTime.minute}.${dateTime.second}`,
    date: `${dateTime.day}.${dateTime.month}.${dateTime.year}`
  };
}

function getIslamicDateTime(now) {
  // Hicri takvim için (3 saat ileri)
  const islamicDate = new Date(now);
  islamicDate.setHours(islamicDate.getHours() + 3); // 3 saat ileri
  
  // Hicri takvim hesaplaması
  const islamicFormatter = new Intl.DateTimeFormat('tr-TR-u-ca-islamic', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Istanbul'
  });
  
  const islamicParts = islamicFormatter.formatToParts(islamicDate);
  const islamicDateTime = {};
  islamicParts.forEach(part => {
    islamicDateTime[part.type] = part.value;
  });
  
  // İslami saat (Gregoryen saat +3)
  const islamicTime = new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Istanbul'
  }).format(islamicDate);
  
  const [h, m, s] = islamicTime.split(':');
  
  return {
    time: `${h}.${m}.${s}`,
    date: `${islamicDateTime.day}.${islamicDateTime.month}.${islamicDateTime.year}`
  };
}

function updateTime() {
  const now = new Date();

  // Özel saat ve tarih
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 30, 0);
  if (now < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }

  const elapsedSeconds = ((now - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  const base12Clock = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;
  const decimalHours = hours.toString().padStart(2, '0');
  const decimalMinutes = minutes.toString().padStart(3, '0');
  const decimalSeconds = seconds.toString().padStart(3, '0');
  const decimalClock = `${decimalHours}.${decimalMinutes}.${decimalSeconds}`;

  const customDate = calculateCustomDate(now);

  // Gregoryen (Türkiye) saat ve tarih
  const gregorian = getGregorianDateTime(now);
  
  // İslami (Hicri) saat ve tarih
  const islamic = getIslamicDateTime(now);

  // Güncelleme - Özel Zaman
  document.getElementById('clock').textContent = base12Clock;
  document.getElementById('date').textContent = customDate.base12;
  document.getElementById('clockDecimal').textContent = decimalClock;
  document.getElementById('dateDecimal').textContent = `${customDate.decimal.day}.${customDate.decimal.month}.${customDate.decimal.year}`;
  
  // Güncelleme - Gregoryen
  document.getElementById('clock2').textContent = gregorian.time;
  document.getElementById('date2').textContent = gregorian.date;
  
  // Güncelleme - İslami
  document.getElementById('clockDecimal2').textContent = islamic.time;
  document.getElementById('dateDecimal2').textContent = islamic.date;
}

setInterval(updateTime, 500);
updateTime();
