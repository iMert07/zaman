function calculateCustomDate(now) {
  const digits = "θ123456789ΦΛ";

  // Base 12 çevirme fonksiyonu içinde tekrar tanımlı
  function toBase12(n) {
    if (n === 0) return "θθ";
    let result = "";
    while (n > 0) {
      result = digits[n % 12] + result;
      n = Math.floor(n / 12);
    }
    return result.padStart(2, 'θ');
  }

  // Gerçek 1071 yılından bu yana geçen yıl sayısı
  const realYear = now.getFullYear();
  const yearsElapsed = realYear - 1071;

  // Base 12 olarak bu yıl farkını al
  const base12YearsElapsed = parseInt(toBase12(yearsElapsed), 12);

  // Base 12 olarak 6000 yıl ekle
  const base12Offset = parseInt("6000", 12); // base 12’de 6000 = 10368 (base 10)
  const finalYearBase10 = base12YearsElapsed + base12Offset;

  // Base 12 gösterimi
  const finalYearBase12 = toBase12(finalYearBase10);

  // Ay ve gün hesapla (20 Mart = yılın 1. günü)
  const startDate = new Date(now.getFullYear(), 2, 20); // Mart = 2
  const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const month = Math.floor((daysSinceStart - 1) / 30) + 1;
  const day = ((daysSinceStart - 1) % 30) + 1;

  return `${toBase12(day)}-${toBase12(month)}-${finalYearBase12}`;
}
