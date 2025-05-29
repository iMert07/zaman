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
    base12: `${base12DayStr}.${base12MonthStr}.${base12YearStr}`,
    decimal: {
      day: decDay,
      month: decMonth,
      year: decYear,
    }
  };
}

function calculateHijriDate(date) {
  // Hicri hesaplama için gerçek saat üzerinden basit hesap:
  // Bu örnekte Hicri hesaplama için yaklaşık algoritma kullanılıyor.
  // Daha doğru hesap için özel kütüphane veya API kullanılmalı.

  // İslam saati, Türkiye saatinden 3 saat ileride, gün başlangıcı 21:00.
  // Türkiye saati
  let turkeyDate = new Date(date);
  // Gün başlangıcı: bugün 21:00'den öncesi için bir önceki güne kaydır
  let hijriDayStart = new Date(turkeyDate);
  hijriDayStart.setHours(21,0,0,0);
  if (turkeyDate < hijriDayStart) {
    hijriDayStart.setDate(hijriDayStart.getDate() -1);
  }

  // Hicri hesaplama için sabit:
  // Hicri başlangıç: 16 Temmuz 622 (Miladi)
  const hijriBase = new Date(Date.UTC(622,6,16));
  const daysPassed = Math.floor((hijriDayStart - hijriBase) / (1000 * 60 * 60 * 24));

  // Hicri yıl yaklaşık 354 gün
  let hijriYear = Math.floor(daysPassed / 354);
  let dayOfYear = daysPassed % 354;

  // 12 ay, 29 veya 30 gün (ortalama 29.5)
  const hijriMonths = [30,29,30,29,30,29,30,29,30,29,30,29];
  let hijriMonth = 0;
  while(dayOfYear >= hijriMonths[hijriMonth]){
    dayOfYear -= hijriMonths[hijriMonth];
    hijriMonth++;
  }
  let hijriDay = dayOfYear + 1;

  return {
    year: hijriYear + 1,
    month: hijriMonth + 1,
    day: hijriDay
  };
}

function updateTime() {
  const now = new Date();

  // --- Türkiye saati ve tarihi (Gregoryen gerçek) ---
  const turkeyNow = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));

  const turkeyHours = turkeyNow.getHours().toString().padStart(2,'0');
  const turkeyMinutes = turkeyNow.getMinutes().toString().padStart(2,'0');
  const turkeySeconds = turkeyNow.getSeconds().toString().padStart(2,'0');
  const turkeyDate = turkeyNow.getDate().toString().padStart(2,'0');
  const turkeyMonth = (turkeyNow.getMonth()+1).toString().padStart(2,'0');
  const turkeyYear = turkeyNow.getFullYear();

  // --- İslam saati: Türkiye saatinden 3 saat ileri ---
  const islamDateRaw = new Date(turkeyNow.getTime() + 3*60*60*1000);
  const islamHours = islamDateRaw.getHours().toString().padStart(2,'0');
  const islamMinutes = islamDateRaw.getMinutes().toString().padStart(2,'0');
  const islamSeconds = islamDateRaw.getSeconds().toString().padStart(2,'0');

  // İslam tarihi hicri hesaplama
  const hijri = calculateHijriDate(turkeyNow);

  // --- Özel takvim ve saat ---
  // Gün 04:30'da başlar
  const todayStart = new Date(turkeyNow.getFullYear(), turkeyNow.getMonth(), turkeyNow.getDate(), 4, 30, 0);
  if (turkeyNow < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }

  const elapsedSeconds = ((turkeyNow - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  // Base12 saat
  const base12Clock = `${toBase12(hours)}.${toBase12(minutes)}.${toBase12(seconds)}`;

  // Onluk saat (0 padded)
  const decimalHours = hours.toString().padStart(2, '0');
  const decimalMinutes = minutes.toString().padStart(3, '0');
  const decimalSeconds = seconds.toString().padStart(3, '0');

  // Tarih (özel)
  const customDate = calculateCustomDate(turkeyNow);

  // DOM'a yazdırma
  document.getElementById('gregoryenClock').textContent = `${turkeyHours}:${turkeyMinutes}:${turkeySeconds}`;
  document.getElementById('gregoryenDate').textContent = `${turkeyDate}.${turkeyMonth}.${turkeyYear}`;

  document.getElementById('islamClock').textContent = `${islamHours}:${islamMinutes}:${islamSeconds}`;
  document.getElementById('islamDate').textContent = `${hijri.day}.${hijri.month}.${hijri.year}`;

  document.getElementById('customClock').textContent = base12Clock;
  document.getElementById('customDate').textContent = customDate.base12;

  document.getElementById('customClockDecimal').textContent = `${decimalHours}.${decimalMinutes}.${decimalSeconds}`;
  document.getElementById('customDateDecimal').textContent = `${customDate.decimal.day}.${customDate.decimal.month}.${customDate.decimal.year}`;
}

setInterval(updateTime, 500);
updateTime();
