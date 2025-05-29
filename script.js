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
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const val = digits.indexOf(str[i]);
    if (val === -1) return NaN;
    result = result * 12 + val;
  }
  return result;
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
  const gregBase = new Date(1071, 2, 21);
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

  const yearToDisplay = estimatedYear + 1 + (6 * 12 * 12 * 12);

  return `${toBase12(day)}.${toBase12(month)}.${toBase12(yearToDisplay)}`;
}

function padNumber(num, length) {
  return num.toString().padStart(length, '0');
}

function updateTime() {
  const now = new Date();

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 30, 0);
  if (now < todayStart) {
    todayStart.setDate(todayStart.getDate() - 1);
  }

  const elapsedSeconds = ((now - todayStart) / 1000) * 2;
  const totalSeconds = Math.floor(elapsedSeconds);

  const hours = Math.floor(totalSeconds / (120 * 120)) % 12;
  const minutes = Math.floor((totalSeconds / 120) % 120);
  const seconds = totalSeconds % 120;

  const base12Hours = toBase12(hours);
  const base12Minutes = toBase12(minutes);
  const base12Seconds = toBase12(seconds);

  const base12Time = `${base12Hours}.${base12Minutes}.${base12Seconds}`;
  const base12Date = calculateCustomDate(now);

  const [bDay, bMonth, bYear] = base12Date.split('.');
  const decimalDay = fromBase12(bDay);
  const decimalMonth = fromBase12(bMonth);
  const decimalYear = fromBase12(bYear);

  const decimalTime = `${padNumber(hours, 2)}.${padNumber(minutes, 3)}.${padNumber(seconds, 3)}`;
  const decimalDate = `${padNumber(decimalDay, 2)}.${padNumber(decimalMonth, 2)}.${padNumber(decimalYear, 4)}`;

  document.getElementById('clock').textContent = base12Time;
  document.getElementById('date').textContent = base12Date;

  document.getElementById('decimalTime').textContent = decimalTime;
  document.getElementById('decimalDate').textContent = decimalDate;
}

const style = document.createElement('style');
style.textContent = `
  #clock, #date, #decimalTime, #decimalDate {
    font-family: monospace;
    text-align: center;
    user-select: none;
    margin: 4px 0;
  }
  #decimalTime, #decimalDate {
    font-size: 0.9em;
    color: #555;
  }
`;
document.head.appendChild(style);

setInterval(updateTime, 500);
updateTime();
