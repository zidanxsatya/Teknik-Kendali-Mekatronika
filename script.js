// ==========================================================
// DATA SOAL
// Ganti / tambah soal di sini. "jawaban" adalah index (mulai 0)
// dari pilihan yang benar di array "opsi".
// ==========================================================
const soalList = [
  {
    pertanyaan: "Berapa hasil dari 1/4 + 2/4?",
    opsi: ["1/4", "3/4", "3/8", "1/2"],
    jawaban: 1
  },
  {
    pertanyaan: "Manakah yang merupakan pembilang dari pecahan 5/8?",
    opsi: ["5", "8", "13", "3"],
    jawaban: 0
  },
  {
    pertanyaan: "Berapa hasil dari 1/2 + 1/3?",
    opsi: ["2/5", "5/6", "1/6", "2/6"],
    jawaban: 1
  },
  {
    pertanyaan: "Pecahan 6/8 jika disederhanakan menjadi?",
    opsi: ["2/3", "3/4", "1/2", "4/5"],
    jawaban: 1
  },
  {
    pertanyaan: "Berapa hasil dari 3/5 - 1/5?",
    opsi: ["2/5", "4/5", "2/10", "1/5"],
    jawaban: 0
  }
];

// ==========================================================
// STATE
// ==========================================================
let siswa = { nama: "", kelas: "" };
let jawabanSiswa = new Array(soalList.length).fill(null);
let indexSoal = 0;

// ==========================================================
// ELEMEN
// ==========================================================
const sections = {
  identitas: document.getElementById("section-identitas"),
  materi: document.getElementById("section-materi"),
  kuis: document.getElementById("section-kuis"),
  hasil: document.getElementById("section-hasil")
};

function tampilkanSection(nama) {
  Object.values(sections).forEach(s => s.classList.remove("active"));
  sections[nama].classList.add("active");
}

// ==========================================================
// SECTION 1 -> 2 : SIMPAN IDENTITAS
// ==========================================================
document.getElementById("form-identitas").addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = document.getElementById("input-nama").value.trim();
  const kelas = document.getElementById("input-kelas").value.trim();
  const errorEl = document.getElementById("identitas-error");

  if (!nama || !kelas) {
    errorEl.hidden = false;
    return;
  }
  errorEl.hidden = true;

  siswa.nama = nama;
  siswa.kelas = kelas;
  document.getElementById("kuis-nama-tampil").textContent = `${nama} — Kelas ${kelas}`;

  tampilkanSection("materi");
});

// ==========================================================
// SECTION 2 -> 3 : MULAI KUIS
// ==========================================================
document.getElementById("btn-ke-kuis").addEventListener("click", function () {
  indexSoal = 0;
  renderSoal();
  tampilkanSection("kuis");
});

// ==========================================================
// SECTION 3 : LOGIKA KUIS
// ==========================================================
const opsiContainer = document.getElementById("opsi-container");
const btnSebelumnya = document.getElementById("btn-sebelumnya");
const btnSelanjutnya = document.getElementById("btn-selanjutnya");

function renderSoal() {
  const soal = soalList[indexSoal];
  document.getElementById("kuis-progress").textContent = `Soal ${indexSoal + 1} dari ${soalList.length}`;
  document.getElementById("soal-teks").textContent = soal.pertanyaan;

  opsiContainer.innerHTML = "";
  soal.opsi.forEach((teks, i) => {
    const label = document.createElement("label");
    label.className = "opsi";
    if (jawabanSiswa[indexSoal] === i) label.classList.add("selected");

    label.innerHTML = `
      <input type="radio" name="opsi" ${jawabanSiswa[indexSoal] === i ? "checked" : ""}>
      <span>${teks}</span>
    `;

    label.addEventListener("click", () => {
      jawabanSiswa[indexSoal] = i;
      renderSoal();
    });

    opsiContainer.appendChild(label);
  });

  btnSebelumnya.disabled = indexSoal === 0;
  btnSelanjutnya.disabled = jawabanSiswa[indexSoal] === null;
  btnSelanjutnya.textContent = indexSoal === soalList.length - 1 ? "Selesai ✓" : "Selanjutnya →";
}

btnSebelumnya.addEventListener("click", () => {
  if (indexSoal > 0) {
    indexSoal--;
    renderSoal();
  }
});

btnSelanjutnya.addEventListener("click", () => {
  if (jawabanSiswa[indexSoal] === null) return;

  if (indexSoal < soalList.length - 1) {
    indexSoal++;
    renderSoal();
  } else {
    selesaikanKuis();
  }
});

// re-enable tombol "Selanjutnya" begitu siswa memilih opsi
opsiContainer.addEventListener("click", () => {
  btnSelanjutnya.disabled = jawabanSiswa[indexSoal] === null;
});

// ==========================================================
// SECTION 3 -> 4 : HITUNG SKOR & SIMPAN KE FIRESTORE
// ==========================================================
function hitungSkor() {
  let benar = 0;
  soalList.forEach((soal, i) => {
    if (jawabanSiswa[i] === soal.jawaban) benar++;
  });
  return benar;
}

function selesaikanKuis() {
  const benar = hitungSkor();
  const total = soalList.length;

  document.getElementById("hasil-skor").textContent = `${benar} / ${total}`;
  document.getElementById("hasil-nama-kelas").textContent = `${siswa.nama} — Kelas ${siswa.kelas}`;

  tampilkanSection("hasil");
  simpanKeFirestore(benar, total);
}

function simpanKeFirestore(benar, total) {
  const statusEl = document.getElementById("hasil-status");

  db.collection("hasil_kuis").add({
    nama: siswa.nama,
    kelas: siswa.kelas,
    skor_benar: benar,
    skor_total: total,
    mata_pelajaran: "Matematika: Pecahan",
    waktu: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    statusEl.textContent = "Nilai kamu sudah tersimpan. Terima kasih!";
    statusEl.classList.add("ok");
  })
  .catch((error) => {
    console.error("Gagal menyimpan ke Firestore:", error);
    statusEl.textContent = "Gagal menyimpan nilai. Screenshot halaman ini dan tunjukkan ke guru kamu.";
    statusEl.classList.add("gagal");
  });
}
