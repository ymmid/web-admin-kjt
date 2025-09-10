function numberToWordsInner(number: number): string {
  const initialNumber = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  if (number === 0) return "";
  if (number < 12) return initialNumber[number];
  if (number < 20) return numberToWordsInner(number - 10) + " belas";
  if (number < 100)
    return (
      numberToWordsInner(Math.floor(number / 10)) +
      " puluh " +
      numberToWordsInner(number % 10)
    );
  if (number < 200) return "seratus " + numberToWordsInner(number - 100);
  if (number < 1000)
    return (
      numberToWordsInner(Math.floor(number / 100)) +
      " ratus " +
      numberToWordsInner(number % 100)
    );
  if (number < 2000) {
    if (number === 1000) return "seribu";
    return "seribu " + numberToWordsInner(number - 1000);
  }
  if (number < 1000000)
    return (
      numberToWordsInner(Math.floor(number / 1000)) +
      " ribu " +
      numberToWordsInner(number % 1000)
    );
  if (number < 1000000000)
    return (
      numberToWordsInner(Math.floor(number / 1000000)) +
      " juta " +
      numberToWordsInner(number % 1000000)
    );

  return "angka terlalu besar";
}

export default function numberToWords(number: number): string {
  const result = numberToWordsInner(number).trim();
  return result ? `${result} rupiah` : "";
}
