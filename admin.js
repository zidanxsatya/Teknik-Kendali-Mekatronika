// ==========================================================
// GANTI kode akses ini. Ini hanya penghalang sederhana di sisi
// tampilan, BUKAN keamanan sungguhan — lihat README.md bagian
// "Catatan Keamanan" untuk penjelasan lebih lanjut.
// ==========================================================
const KODE_AKSES_GURU = "ganti-kode-ini";

document.getElementById("btn-masuk").addEventListener("click", cekPassword);
document.getElementById("input-password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") cekPassword();
});

function cekPassword() {
  const input = document.getElementById("input-password").value;
  const errorEl = document.getElementById("gate-error");

  if (input === KODE_AKSES_GURU) {
    document.getElementById("gate").classList.remove("active");
    document.getElementById("konten").classList.add("active");
    muatData();
  } else {
    errorEl.hidden = false;
  }
}

document.getElementById("btn-refresh").addEventListener("click", muatData);

function muatData() {
  const tbody = document.getElementById("tabel-body");
  const jumlahEl = document.getElementById("jumlah-data");
  tbody.innerHTML = "";
  jumlahEl.textContent = "Memuat data…";

  db.collection("hasil_kuis")
    .orderBy("waktu", "desc")
    .get()
    .then((snapshot) => {
      jumlahEl.textContent = `${snapshot.size} data tersimpan`;

      snapshot.forEach((doc) => {
        const d = doc.data();
        const waktu = d.waktu ? d.waktu.toDate().toLocaleString("id-ID") : "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(d.nama)}</td>
          <td>${escapeHtml(d.kelas)}</td>
          <td>${d.skor_benar} / ${d.skor_total}</td>
          <td>${waktu}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Gagal memuat data:", error);
      jumlahEl.textContent = "Gagal memuat data. Cek koneksi atau Firestore Rules kamu.";
    });
}

// mencegah nama/kelas yang mengandung tag HTML merusak tampilan tabel
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}
