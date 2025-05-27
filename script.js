// Sayıyı 12 tabanına dönüştüren fonksiyon
function toBase12(n) {
  const digits = "θ123456789ΦΛ"; // 0-9, 10 için Φ (Phi), 11 için Λ (Lambda)
  if (n === 0) return "θθ"; // Sıfır için "00" yerine "θθ"
  let result = "";
  while (n > 0) {
    result = digits[n % 12] + result;
    n = Math.floor(n / 12);
  }
  return result.padStart(2, 'θ'); // İki basamaklı olmasını ve başında 'θ' olmasını sağlar
}

// 12 tabanındaki bir dizeyi 10 tabanındaki bir sayıya dönüştüren fonksiyon
function fromBase12(s) {
  const digits = "θ123456789ΦΛ";
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    result = result * 12 + digits.indexOf(s[i]);
  }
  return result;
}

// Özel tarihi hesaplayan fonksiyon
function calculateCustomDate(now) {
  const trueStartDate = new Date(1071, 2, 20); // Gerçek başlangıç yılı 1071, 20 Mart
  const msSinceTrueStart = now - trueStartDate;
  const daysSinceTrueStart = Math.floor(msSinceTrueStart / (1000 * 60 * 60 * 24));

  // Geçen yıl sayısını on tabanında bulalım
  const currentYear = now.getFullYear();
  const base10YearsPassed = currentYear - 1071; // Örneğin, 2025 ise 2025-1071 = 954

  // Geçen yıl sayısını 12 tabanına çevirelim. (Örn: 954 -> "676")
  const base12YearsPassedString = toBase12(base10YearsPassed);

  // Eklemek istediğiniz 6000 yılın 12 tabanındaki karşılığı ("3540")
  // ve bunun 12 tabanındaki sayı olarak değeri (bu, "6000" olarak girdiğimiz sayıya karşılık gelir,
  // yani 6000 (on tabanında) 12 tabanında "3540" şeklindedir.
  // Bu "3540" sayısını on tabanına çevirerek bir değer elde etmeliyiz.)
  // HAYIR! Doğrudan 12 tabanındaki "6000" sayısını eklemeliyiz.
  // Yani "676" (12 tabanında) + "6000" (12 tabanında) = "6676" (12 tabanında)

  // Önce geçen yılları 12 tabanında bir sayı olarak alıp, sonra ekleyeceğimiz 6000'i de 12 tabanında alıp topluyoruz.
  // fromBase12() fonksiyonu 12 tabanındaki bir stringi alıp on tabanına çevirir.
  // Burada "676" (12 tabanındaki değer) + "6000" (12 tabanındaki değer) işlemini yapmalıyız.

  // 1. Geçen yılları 12 tabanındaki değerine çevir (on tabanına dönüştür)
  const yearsPassedInBase10 = fromBase12(base12YearsPassedString);

  // 2. 6000 (on tabanında) sayısının 12 tabanındaki string karşılığını al
  const base12OffsetString = toBase12(6000); // 6000 (base 10) -> "3540" (base 12)

  // 3. Bu 12 tabanındaki string karşılığını on tabanına dönüştürerek değeri al
  const offsetValueInBase10 = fromBase12(base12OffsetString); // "3540" (base 12) -> 6000 (base 10)

  // Şimdi iki on tabanındaki değeri toplayıp, sonucu tekrar 12 tabanına çevirip, sonra on tabanına çevirmeliyiz.
  // VEYA, daha basit: doğrudan geçen yılların sayısını (on tabanında) alıp, üzerine on tabanındaki 6000'i ekleyip sonucu 12 tabanında gösterebiliriz.
  // Hayır, asıl istenen: 12 tabanında "676" + 12 tabanında "6000" = 12 tabanında "6676".
  // Bunu yapmak için, 12 tabanındaki sayılar üzerinde toplama işlemi yapan bir fonksiyona ihtiyacımız var, ya da her birini on tabanına çevirip toplayıp tekrar 12 tabanına çevirmeliyiz.

  // En basit yolu: İstenen nihai değeri (6676) hesaplayıp onu yıl olarak göstermek.
  // Geçen yıl sayısı (örneğin 954) için 12 tabanındaki gösterimi "676"
  // Eklemek istediğimiz 6000 yılın 12 tabanındaki gösterimi "3540"
  // İstediğiniz "6676" sonucunu elde etmek için, geçen yıl sayısının 12 tabanındaki **on tabanındaki değeri**
  // üzerine 6000'in **on tabanındaki değeri** eklenmeli.
  // Örneğin, `fromBase12(toBase12(954))` = 954.
  // Demek ki, doğrudan `base10YearsPassed`'ı kullanmalıyız.

  // Geçen yıl sayısı (on tabanında) üzerine 6000 (on tabanında) ekle
  // VE BU TOPLAMI 12 TABANINDA GÖSTER
  // (Örn: 954 + 6000 = 6954. Bunu 12 tabanına çevirip göster)

  // Yoksa, "yıl kısmında 6676 yazıyor olsun" derken, 6676'nın on tabanındaki 6676 olarak görünmesini mi istiyorsunuz?
  // Yoksa 12 tabanında 6676 olarak görünmesini mi? "6676" bir string mi olmalı?

  // İlk mesajdaki "954 yerine 676 çıkacak biçimde" ifadesi, 954 (base 10) sayısının
  // 12 tabanına çevrilmiş hali olan "676" stringini kullanmak anlamına geliyor gibiydi.
  // Eğer yıl kısmında "6676" stringi yazsın istiyorsanız, o zaman direkt bu stringi vermeliyiz.
  // Ancak "bunu hesapla ki sonra değişebilsin" dediğiniz için dinamik olmalı.

  // Yeni yoruma göre:
  // 1. 1071'den itibaren geçen yıl sayısını al (on tabanında, örneğin 954).
  // 2. Bu sayının 12 tabanındaki string karşılığını bul (örneğin "676").
  // 3. Bu "676" stringinin sonuna "6000" stringini ekle (yani "6766000" mi?). Hayır.
  // "676" (12 tabanında) + "6000" (12 tabanında) = "6676" (12 tabanında)
  // Bu, 12 tabanındaki toplama işlemi demektir.
  // `fromBase12(toBase12(base10YearsPassed))` -> Bu bize geçen yıl sayısının on tabanındaki gerçek değerini veriyor. (Örn: 954)
  // `fromBase12(toBase12(6000))` -> Bu bize 6000'in on tabanındaki gerçek değerini veriyor. (Örn: 6000)

  // YANİ, aslında yıl olarak gösterilecek olan değer:
  // (1071'den bugüne kadar geçen yıl sayısı *on tabanında*) + (6000 *on tabanında*) olmalı.
  // VE BU SONUCU 12 TABANINDA GÖSTERMELİYİZ.

  const yearsSince1071 = currentYear - 1071; // Örn: 2025 - 1071 = 954 (on tabanında)
  const offsetAmount = 6000; // Eklemek istediğimiz sabit 6000 yıl (on tabanında)

  // Toplam yıl sayısı (on tabanında)
  const totalYearsInBase10 = yearsSince1071 + offsetAmount; // Örn: 954 + 6000 = 6954

  // Bu toplam yıl sayısını 12 tabanına çevirerek yıl kısmında gösterelim.
  const finalDisplayedYear = toBase12(totalYearsInBase10); // Örn: 6954 -> "403Φ" (12 tabanında)

  // Ama siz "6676" görünmesini istiyorsunuz.
  // Bu "6676"nın nasıl hesaplandığını tekrar gözden geçirelim:
  // Bugün 2025 diyelim. 2025 - 1071 = 954 yıl geçmiş.
  // Bu 954 yılın 12 tabanındaki gösterimi: toBase12(954) = "676".
  // SİZ BU "676" stringinin BAŞINA "6" EKLEYEREK "6676" elde etmek mi istiyorsunuz?
  // Veya "676" (12 tabanında) + "6000" (12 tabanında) TOPLAMA İŞLEMİNİ Mİ YAPMALIYIZ?
  // Eğer 12 tabanında toplama ise, "676" (12 tabanında) = 954 (on tabanında)
  // "6000" (12 tabanında) = 6 * 12^3 = 6 * 1728 = 10368 (on tabanında)
  // Toplam: 954 + 10368 = 11322 (on tabanında)
  // 11322'nin 12 tabanındaki karşılığı: toBase12(11322) = "6676"
  // EVET, buydu! Yani, geçen yıl sayısının on tabanındaki değeri (954) + 6000'in 12 tabanındaki değerinin on tabanındaki karşılığı (10368).

  const yearsPassedFromStart = currentYear - 1071; // 2025 - 1071 = 954 (on tabanında)

  // 6000'in 12 tabanındaki karşılığı "3540" (string olarak)
  // "3540" (12 tabanında) sayısının on tabanındaki değeri:
  // 3*12^3 + 5*12^2 + 4*12^1 + 0*12^0 = 3*1728 + 5*144 + 4*12 + 0 = 5184 + 720 + 48 = 5952
  // DİKKAT: fromBase12("6000") değil, fromBase12(toBase12(6000)) bu da 6000'e eşit.
  // Eğer 6000'i **doğrudan 12 tabanında bir sayı olarak** almak istiyorsanız,
  // `fromBase12("6000")` yapmalıyız. Bu da 6 * 12^3 = 10368 yapar.
  // Evet, sanırım istediğiniz bu. "6000 yıl ekle" derken, 6000'i 12 tabanında bir sayı olarak alıp
  // onun on tabanındaki karşılığını eklemek.

  const base12OffsetInBase10 = fromBase12("6000"); // "6000" stringini 12 tabanında bir sayı gibi alıp on tabanına çevirir (10368)

  const combinedYearInBase10 = yearsPassedFromStart + base12OffsetInBase10;
  // Örneğin: 954 (geçen yıl) + 10368 (eklenen yıl) = 11322

  // Bu on tabanındaki toplamı, 12 tabanına çevirerek gösterelim.
  const displayedYearInBase12 = toBase12(combinedYearInBase10); // Örneğin: 11322 -> "6676"

  // Ay ve günü standart takvimden alalım
  // Yıl içindeki gün sayısını bulur (artık günler hariç)
  const daysInCurrentCustomYear = daysSinceTrueStart % 365;
  const month = Math.floor(daysInCurrentCustomYear / 30) + 1;
  const day = (daysInCurrentCustomYear % 30) + 1;

  // Final çıktısı
  return `${toBase12(day)}-${toBase12(month)}-${displayedYearInBase12}`;
}

// Zamanı güncelleyen fonksiyon (mevcut kodunuzdan alındı)
function updateTime() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(4, 30, 0, 0); // Başlangıç saati 04:30
  const elapsedSeconds = (now - startTime) / 1000 * 2; // Geçen saniyeler * 2
  const totalSeconds = Math.floor(elapsedSeconds);
  const hours = Math.floor(totalSeconds / (120 * 120)) % 12; // Saat (12 tabanında)
  const minutes = Math.floor((totalSeconds / 120) % 120); // Dakika (120 saniyeye göre)
  const seconds = totalSeconds % 120; // Saniye (120 saniyeye göre)

  document.getElementById('clock').textContent = `${toBase12(hours)}.${toBase12(minutes)}:${toBase12(seconds)}`;
  document.getElementById('date').textContent = calculateCustomDate(now);
}

// Her 500 ms'de bir zamanı güncelle
setInterval(updateTime, 500);
updateTime(); // Sayfa yüklendiğinde bir kez çalıştır
