export function formatRupiah(value: number) {
  return Number(value)
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
    .replace("Rp", "Rp ");
}
