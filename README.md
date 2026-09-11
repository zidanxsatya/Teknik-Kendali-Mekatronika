# Kuis Pelajaran

Website materi pelajaran + kuis untuk siswa, tanpa login (cukup isi nama & kelas), dengan nilai tersimpan otomatis ke Firebase Firestore.

## Struktur file

```
index.html          -> halaman utama siswa (identitas, materi, kuis, hasil)
admin.html           -> halaman rekap nilai untuk guru
style.css            -> semua styling
script.js            -> logika kuis di halaman siswa
admin.js             -> logika halaman admin
firebase-config.js   -> konfigurasi Firebase (WAJIB kamu isi sendiri)
```

## 1. Setup Firebase (5 menit)

1. Buka https://console.firebase.google.com, buat project baru.
2. Di dashboard project, klik ikon web `</>` untuk "Add app" > Web.
3. Beri nama app, lalu Firebase akan menampilkan object `firebaseConfig`.
4. Copy nilainya ke file `firebase-config.js`, gantikan semua tulisan `GANTI_...`.
5. Di menu kiri Firebase Console, buka **Build > Firestore Database** > **Create database**. Pilih lokasi server (misalnya `asia-southeast2` / Jakarta biar cepat), lalu mulai dalam **test mode** dulu.

## 2. Atur Firestore Security Rules (PENTING)

Test mode Firestore itu terbuka untuk siapa saja, termasuk untuk membaca dan MENGHAPUS data. Sebelum dipakai sungguhan, buka tab **Rules** di Firestore dan ganti dengan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /hasil_kuis/{docId} {
      allow create: if request.resource.data.nama is string
                    && request.resource.data.kelas is string
                    && request.resource.data.skor_benar is int;
      allow read: if false;   // hanya bisa ditulis, tidak bisa dibaca dari luar
      allow update, delete: if false;
    }
  }
}
```

Dengan aturan ini, siapapun bisa **mengirim** nilai kuis (create), tapi tidak ada yang bisa membaca atau menghapus data lewat internet secara langsung — hanya kamu, lewat Firebase Console atau halaman `admin.html` yang memakai kredensial project kamu sendiri.

> Catatan: kode akses di `admin.js` (`KODE_AKSES_GURU`) hanyalah penghalang tampilan, bukan keamanan sungguhan — siapa pun yang melihat kode sumbernya bisa menemukan kodenya. Untuk kelas kecil biasanya cukup, tapi kalau butuh keamanan lebih ketat, gunakan **Firebase Authentication** di kemudian hari.

## 3. Coba di komputer sendiri dulu

Buka folder ini di VS Code, install extension **Live Server**, klik kanan `index.html` > "Open with Live Server". Coba isi form, kerjakan kuis, lalu cek di Firebase Console > Firestore Database apakah datanya muncul di koleksi `hasil_kuis`.

## 4. Deploy ke GitHub Pages

1. Buat repository baru di GitHub (bisa public atau private).
2. Di terminal, dari folder project ini:
   ```
   git init
   git add .
   git commit -m "Kuis pelajaran pertama"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
3. Di GitHub, buka repo > **Settings > Pages**.
4. Di bagian "Build and deployment", pilih source: **Deploy from a branch**, branch: **main**, folder: **/(root)**.
5. Tunggu 1-2 menit, website akan aktif di `https://USERNAME.github.io/NAMA-REPO/`.

## 5. Kustomisasi

- **Ganti materi**: edit bagian `<div class="materi-body">` di `index.html`.
- **Ganti soal**: edit array `soalList` di awal `script.js`.
- **Ganti warna/font**: edit variabel di bagian `:root` pada `style.css`.
- **Ganti kode akses admin**: edit `KODE_AKSES_GURU` di `admin.js`.
