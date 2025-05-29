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

function getHijriDate(gregDate) {
  // Basit Hicri hesaplama için (Miladi -> Hicri dönüşüm)
  // 622-07-16 başlangıç, yaklaşık 354.367 gün Hicri yıl
  const hijriStart = new Date(Date.UTC(622, 6, 16)); // 16 Temmuz 622 UTC
  const diffMs = gregDate.getTime() - hijriStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hijriYear = Math.floor(diffDays / 354.367) + 1;
  const dayOfYear = Math.floor(diffDays % 354.367);

  // Hicri aylar (yaklaşık 30 veya 29 gün)
  const hijriMonths = [30,29,30,29,30,29,30,29,30,29,30,29];
  let month = 0;
  let daysLeft = dayOfYear;
  for (let i = 0; i < 12; i++) {
    if (daysLeft < hijriMonths[i]) {
      month = i + 1;
      break;
    }
    daysLeft -= hijriMonths[i];
  }
  const day = daysLeft + 1;

  return { year: hijriYear, month, day };
}

function padLeft(num, size) {
  let s = num.toString();
  while (s.length < size) s = "0" + s;
  return s;
}

function updateTime() {
  const now = new Date();

  // Türkiye Saati (GMT+3 sabit kabul edelim)
  const turkeyOffset = 3 * 60; // dakika olarak
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const turkeyTime = new Date(utc.getTime() + turkeyOffset * 60000);

  // İslam saati = Türkiye saati + 3 saat
  const islamTime = new Date(turkeyTime.getTime() + 3 * 60 * 60000);

  // İslam gün değişimi: gerçek saat 21 olduğunda değil, islamTime 24 saat dolduğunda değişir.
  // Bu yüzden islamTime için gün değişimini kendimiz kontrol edeceğiz.

  // İslam gün başlangıcı = 00:00 islamTime (yeni gün)
  const islamDayStart = new Date(islamTime);
  islamDayStart.setHours(0,0,0,0);

  // Özel Saat - Gün 04:30'da başlar, 1 gerçek saniye = 2 özel saniye
  const todayStart = new Date(turkeyTime.getFullYear(), turkeyTime.getMonth(), turkeyTime.getDate(), 4, 30, 0);
  if (turkeyTime < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }
  const elapsedSeconds = ((turkeyTime - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  const base12Clock = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;
  const decimalHours = hours.toString().padStart(2, '0');
  const decimalMinutes = minutes.toString().padStart(3, '0');
  const decimalSeconds = seconds.toString().padStart(3, '0');
  const decimalClock = `${decimalHours}.${decimalMinutes}.${decimalSeconds}`;

  const customDate = calculateCustomDate(turkeyTime);

  // Hicri tarih islamTime üzerinden hesaplanır.
  const hijriDateObj = getHijriDate(islamTime);
  const hijriDateStr = `${padLeft(hijriDateObj.day,2)}.${padLeft(hijriDateObj.month,2)}.${hijriDateObj.year}`;

  // Gün değişimi islamTime 24'ü geçtiğinde yapılır, saat 24:00:00
  // Çünkü javascriptte saat 24 yok, 0 kabul edilir, gün değişimi zaten hesaplanıyor.

  // HTML elemanlarına yazdır
  document.getElementById('gregorianTime').textContent = turkeyTime.toLocaleString('tr-TR', {hour12:false});
  document.getElementById('customClock').textContent = base12Clock;
  document.getElementById('customDate').textContent = customDate.base12;

  document.getElementById('customClockDecimal').textContent = decimalClock;
  document.getElementById('customDateDecimal').textContent = `${customDate.decimal.day}.${customDate.decimal.month}.${customDate.decimal.year}`;

  document.getElementById('hijriTime').textContent = islamTime.toLocaleString('tr-TR', {hour12:false});
  document.getElementById('hijriDate').textContent = hijriDateStr;
}

setInterval(updateTime, 500);
updateTime();
