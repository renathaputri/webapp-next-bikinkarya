# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# BikinKarya — AI-Powered Work Experience Simulator

**Version:** 1.0
**Last Updated:** Mei 2026
**Status:** Active Development

---

# 1. Overview

BikinKarya adalah platform simulasi pengalaman kerja berbasis AI yang membantu fresh graduate dan mahasiswa tingkat akhir Indonesia mempersiapkan diri memasuki dunia kerja melalui project simulasi realistis, manajemen task, dan pembangunan portofolio yang siap ditunjukkan ke rekruter.

Alih-alih hanya belajar teori, pengguna akan:

- Menerima brief layaknya client sungguhan
- Mengelola task menggunakan kanban board
- Membangun portofolio dari hasil kerja nyata
- Melatih kesiapan interview sesuai bidang

> BikinKarya bukan sekadar platform latihan. Ini adalah simulasi pengalaman kerja nyata — dari dapat brief sampai deliver hasil — yang menghasilkan portofolio konkret untuk memenangkan persaingan di dunia kerja.

---

# 2. Objectives

## Primary Goals

- Menjembatani gap antara skill akademik dan ekspektasi industri untuk fresh graduate Indonesia
- Menghasilkan pengalaman kerja tersimulasi yang setara dengan magang 1–3 bulan
- Membantu pengguna membangun portofolio konkret tanpa harus menunggu project nyata
- Meningkatkan kepercayaan diri fresh graduate saat melamar kerja atau freelance
- Menyediakan brief AI yang realistis dan berstandar industri, bukan latihan generik

## Success Metrics

### Engagement

| Metrik | Target |
|---|---|
| Pengguna menyelesaikan minimal 1 brief dalam 7 hari pertama | >= 70% |
| Pengguna kembali generate brief baru setelah menyelesaikan task pertama | >= 60% |
| Pengguna menyatakan brief terasa realistis dan relevan | >= 80% |
| Task yang di-done dilengkapi upload ke portofolio | >= 50% |

### Impact (3 Bulan)

| Metrik | Target |
|---|---|
| Total brief yang di-generate | >= 10.000 |
| Total task yang diselesaikan | >= 4.000 |
| Portofolio publik yang aktif | >= 1.500 |
| Pengguna aktif mingguan | >= 500 |

---

# 3. Problem Statement

## Skala Krisis SDM Indonesia

Indonesia menghadapi paradoks ketenagakerjaan: pengangguran terdidik terus meningkat sementara ribuan lowongan kerja tidak terpenuhi karena mismatch skill. BPS (2024) mencatat lebih dari 9,9 juta pengangguran terbuka, dengan proporsi terbesar justru lulusan Diploma dan Sarjana.

Masalahnya bukan kurangnya lapangan kerja, melainkan:

- Fresh graduate tidak memiliki pengalaman kerja nyata yang bisa ditunjukkan
- Portofolio akademik tidak merepresentasikan kemampuan kerja profesional
- Gap antara materi kuliah dan kebutuhan industri yang terus melebar
- Biaya dan akses ke kursus atau bootcamp yang tidak merata

## Mengapa Fresh Graduate Kesulitan

Perusahaan ingin kandidat yang "siap kerja", tapi pengalaman kerja nyata hanya bisa didapat dari... kerja. Lingkaran ini sangat sulit dipecahkan:

- **Tidak ada project nyata** — tugas kuliah terlalu akademik, tidak merepresentasikan pekerjaan sesungguhnya
- **Portofolio kosong** — tanpa portofolio sulit lolos screening HRD, tapi tanpa kerja portofolio tidak terbentuk
- **Tidak tahu standar industri** — brief dari dosen berbeda jauh dengan brief dari client nyata
- **Tidak ada feedback loop** — tidak ada cara terstruktur untuk tahu apakah kemampuan sudah cukup

## Gap yang Belum Terisi

Platform latihan yang ada saat ini (Leetcode, Greatfrontend) fokus pada coding dan engineering. Tidak ada platform yang secara khusus mensimulasikan pekerjaan kreatif dan marketing berbasis brief client nyata — yang justru menjadi mayoritas lowongan entry-level di Indonesia.

> Gap antara "sudah belajar desain" dan "bisa kerja sebagai desainer" inilah yang BikinKarya dirancang untuk menutupnya.

---

# 4. Target Users

## Persona 1 — Dinda: Fresh Graduate yang Anxious

**Profil:** Lulusan DKV, 22 tahun, Surabaya. IPK 3.4, aktif berorganisasi, tapi belum punya portofolio profesional.

**Situasi:** Sudah melamar ke 15 perusahaan desain, tidak ada yang lolos screening. HRD selalu meminta portofolio, tapi Dinda hanya punya tugas kuliah yang terasa tidak relevan.

**Pain Points:**
- Tidak tahu brief client nyata itu seperti apa
- Malu menunjukkan portofolio yang isinya hanya tugas kuliah
- Tidak punya akses ke magang karena tinggal di luar kota besar

**Kebutuhan:** Platform yang bisa mensimulasikan brief nyata dan menghasilkan portofolio yang layak ditunjukkan ke HRD dalam waktu singkat.

---

## Persona 2 — Rizki: Mahasiswa Tingkat Akhir yang Bingung

**Profil:** Mahasiswa Komunikasi semester 7, 21 tahun, Bandung. Tertarik di digital marketing tapi belum pernah handle campaign nyata.

**Situasi:** Melihat teman-temannya mulai melamar kerja dan internship. Rizki merasa kemampuannya di bawah rata-rata karena tidak punya pengalaman nyata, meski sudah mengikuti beberapa kelas online.

**Pain Points:**
- Kelas online terlalu teoritikal, tidak ada simulasi kerja nyata
- Tidak tahu apakah skill-nya sudah cukup untuk industri
- Tidak punya portofolio yang bisa ditunjukkan saat interview

**Kebutuhan:** Cara terstruktur untuk berlatih mengerjakan project digital marketing yang terasa seperti brief dari client sungguhan.

---

## Persona 3 — Arga: Graphic Designer Otodidak

**Profil:** Tidak kuliah, 23 tahun, Yogyakarta. Belajar desain otodidak dari YouTube dan tutorial online.

**Situasi:** Ingin masuk ke agensi kreatif tapi tidak punya ijazah. Satu-satunya modal adalah portofolio, tapi semua karyanya adalah project pribadi yang tidak ada konteks bisnis nyata.

**Pain Points:**
- Karya personal tidak menunjukkan kemampuan kerja profesional
- Tidak tahu cara membaca dan mengeksekusi brief client
- Sulit mendapat kepercayaan dari perusahaan tanpa track record

**Kebutuhan:** Brief client realistis yang bisa dieksekusi dan hasilnya dijadikan portofolio profesional.

---

# 5. Core Features

## 5.1 Study Case Generator

Pengguna dapat men-generate brief project realistis berdasarkan bidang dan level yang dipilih.

### Supported Fields

- UI/UX Design
- Graphic Design
- Digital Marketing

### Generate Options

| Input | Pilihan |
|---|---|
| Bidang | UI/UX Design / Graphic Design / Digital Marketing |
| Difficulty | Junior / Mid / Senior |

### Difficulty Level Structure

| Aspek | Junior | Mid | Senior |
|---|---|---|---|
| Scope | Kecil | Menengah | Kompleks |
| Ambiguity | Jelas | Mulai ambigu | Sangat ambigu |
| Decision Making | Sedikit | Sedang | Tinggi |
| Constraint | Basic | Multi-constraint | Kompleks dan dinamis |
| Stakeholder | 1 client | Beberapa pihak | Banyak stakeholder |
| Deadline Pressure | Santai | Realistis | Ketat |
| Revisi | Minim | Mulai banyak | Intens dan dinamis |
| Strategic Thinking | Rendah | Sedang | Tinggi |

### Contoh per Level

**Junior** — execution task sederhana, brief jelas, deliverable spesifik
- Poster event
- Redesign landing page
- Social media content

**Mid** — workflow realistis, beberapa constraint, revisi dan objective bisnis
- Onboarding fintech
- Campaign produk
- Branding UMKM

**Senior** — problem solving strategis, stakeholder complexity, ambiguity tinggi
- Redesign retention flow
- Rebranding startup
- Recovery marketing campaign

### Brief Structure

Setiap generated brief mencakup:

- **Client & Background** — nama brand fiktif, industri, dan konteks bisnis
- **Platform & Target User** — spesifikasi platform dan demografi target audience
- **Goal & Deliverables** — tujuan bisnis yang terukur dan daftar output yang diharapkan
- **Deadline & Constraints** — tenggat waktu simulasi dan batasan teknis/kreatif
- **Expected Output** — arahan visual atau komunikasi yang perlu diikuti

### User Actions

- Generate ulang brief (unlimited)
- Add to Board → brief langsung masuk Kanban sebagai task baru
- Archive brief

---

## 5.2 Kanban Board

Task management sederhana berbasis workflow kerja profesional.

### Board Structure

| Kolom | Deskripsi |
|---|---|
| To Do | Brief baru yang belum dikerjakan |
| In Progress | Brief yang sedang dikerjakan |
| Done | Brief selesai, trigger upload portofolio |

### Features

- Drag & drop task antar kolom
- Brief detail per card (expandable)
- Badge bidang dan difficulty level
- Tanggal di-generate
- Mark as Done → trigger portfolio upload flow
- Archive task

---

## 5.3 Portfolio Builder

Setiap task yang dipindahkan ke kolom Done akan memicu flow upload portofolio.

### Portfolio Upload Flow

Saat task di-mark Done, user diminta mengisi:

1. **Thumbnail** — upload gambar cover/hasil kerja (file gambar)
2. **Result Link** — link eksternal hasil kerja (Figma, Behance, Google Drive, website project)

Sistem melakukan validasi format URL sebelum data disimpan.

### Portfolio Content per Item

| Komponen | Keterangan |
|---|---|
| Thumbnail | Gambar cover project yang diupload user |
| Judul Project | Nama brand dan jenis project |
| Brief Original | Brief lengkap yang di-generate AI |
| Result Link | Link ke hasil kerja eksternal |
| Difficulty Tag | Junior / Mid / Senior |
| Category | Bidang project |

### Public Portfolio Link

Setiap pengguna memiliki public portfolio page:

```
bikinkarya.app/portfolio/[username]
```

- Dapat di-share langsung ke HRD atau rekruter
- Toggle visibilitas per item (publik / privat)
- Tampilan grid yang clean dan recruiter-ready

---

## 5.4 Interview Simulator

Pengguna dapat melatih kesiapan interview sesuai bidang yang dipilih.

### Interview Flow

1. User masuk ke halaman Interview
2. AI generate pertanyaan sesuai bidang akun
3. Timer berjalan (default 1 menit, dapat diatur)
4. User menjawab secara mandiri
5. User dapat memilih:
   - **Skip** — lewati pertanyaan
   - **Generate Baru** — generate pertanyaan berbeda
   - **Explain** — lihat contoh jawaban dan penjelasan dari AI

### Interview Features

- Pertanyaan relevan dengan bidang yang dipilih
- Timer yang dapat dikustomisasi (30 detik – 5 menit)
- Penjelasan jawaban dari AI setelah skip atau request

---

# 6. Navigation Structure

## Public Pages

```
/                        → Landing Page
/login                   → Login
/register                → Register
/portfolio/[username]    → Public Portfolio (dapat diakses tanpa login)
```

## Private Pages (Sidebar)

```
/dashboard   → Home & Overview
/generate    → Study Case Generator
/board       → Kanban Board
/portfolio   → Portfolio Builder & Manager
/interview   → Interview Simulator
/profile     → User Profile & Settings
```

## Sidebar Layout

```
┌─────────────────┐
│  BikinKarya     │
│  [Nama User]    │
├─────────────────┤
│  Dashboard      │
│  Generate       │
│  Board          │
│  Portfolio      │
│  Interview      │
├─────────────────┤
│  Profile        │
│  Logout         │
└─────────────────┘
```

---

# 7. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Frontend | Next.js + Tailwind CSS | Full-stack framework, SSR, routing built-in |
| ORM | Prisma | Type-safe, schema-first, mudah di-migrate |
| Database | Supabase (PostgreSQL) | Free tier, managed, reliable |
| Storage | Supabase Storage | Konsisten dengan DB, aman di Cloud Run |
| Auth | NextAuth.js | Session management, integrasi mudah |
| AI Generator | Gemini API | Generate brief dan pertanyaan interview |
| Deployment | Google Cloud Run | Sesuai syarat lomba, scalable |
| Container | Docker | Required untuk Cloud Run |

## Database Schema (Prisma)

```prisma
model User {
  id         String      @id @default(cuid())
  username   String      @unique
  password   String
  field      String      // "uiux" | "graphicdesign" | "digimark"
  createdAt  DateTime    @default(now())

  tasks      Task[]
  portfolios Portfolio[]
}

model Task {
  id         String     @id @default(cuid())
  userId     String
  user       User       @relation(fields: [userId], references: [id])
  field      String
  difficulty String     // "junior" | "mid" | "senior"
  brief      Json
  status     String     @default("todo") // "todo" | "inprogress" | "done"
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  portfolio  Portfolio?
}

model Portfolio {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  taskId      String   @unique
  task        Task     @relation(fields: [taskId], references: [id])
  thumbnail   String   // URL Supabase Storage
  workLink    String   // Link Figma / Behance / Drive
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

---

# 8. User Journey

## Onboarding

| Step | Halaman | Aksi |
|---|---|---|
| 1 | Landing Page | Klik Mulai Sekarang |
| 2 | Register | Isi username, email, password |
| 3 | Onboarding | Pilih bidang utama |
| 4 | Dashboard | Empty state + CTA generate brief pertama |

## Core Loop

| Step | Halaman | Aksi |
|---|---|---|
| 1 | Generator | Pilih bidang & level, klik Generate |
| 2 | Generator | Baca brief, re-generate jika tidak srek |
| 3 | Generator | Klik Add to Board |
| 4 | — | Kerjakan project di luar app |
| 5 | Kanban | Pindahkan card ke Done |
| 6 | Portfolio Upload | Upload thumbnail + isi result link |
| 7 | Portfolio | Lihat item portofolio, copy public link |
| 8 | — | Kirim link portofolio ke HRD / rekruter |

---

# 9. Product Philosophy

## Core Philosophy

BikinKarya percaya bahwa setiap orang berhak mendapatkan kesempatan yang setara untuk membuktikan kemampuannya — tanpa harus bergantung pada koneksi, nama kampus, atau privilege akses ke pengalaman kerja.

> Belajar skill saja tidak cukup. Pengguna membutuhkan pengalaman simulatif, workflow nyata, dan tempat aman untuk berkembang.

## Product Principles

### Learn by Doing
Belajar terbaik terjadi melalui praktik. Brief yang dikerjakan jauh lebih valuable dari teori yang dibaca.

### Simplicity First
UI minimal agar pengguna fokus berpikir dan bekerja, bukan belajar cara pakai platformnya.

### Realistic Experience
Brief dan workflow harus terasa seperti dunia kerja nyata — ada client, ada constraint, ada deadline.

### Portfolio-Driven Growth
Setiap latihan menghasilkan output nyata yang bisa ditunjukkan, bukan sekadar sertifikat.

### Output Over Process
Yang penting bukan seberapa banyak yang dipelajari, tapi seberapa konkret hasilnya.

---

# 10. UX Direction

UX harus terasa:
- Minimal dan tidak intimidating
- Modern dan clean
- Fokus — tidak ada distraksi dari core loop

Prinsip UX:
- **Minimal cognitive load** — setiap halaman punya satu tujuan utama
- **Readability tinggi** — tipografi dan spacing yang nyaman
- **Smooth workflow** — dari generate ke board ke portfolio tanpa friction
- **Motivating empty states** — bukan "Tidak ada data", tapi "Yuk bikin karya pertamamu!"
- **Mobile-responsive** — mayoritas fresh graduate Indonesia mengakses via smartphone

---

# 11. Roadmap

## Phase 1 — MVP untuk Lomba (Bulan 1)

- [ ] Landing page dengan value proposition yang jelas
- [ ] Sistem autentikasi: register dan login (username + password)
- [ ] Study Case Generator: 3 bidang, 3 level, brief realistis berbasis Gemini API
- [ ] Kanban Board: drag-and-drop dengan 3 kolom status
- [ ] Portfolio Builder: grid view, upload thumbnail, link eksternal, public link
- [ ] Interview Simulator: generate pertanyaan, timer, explain answer
- [ ] User Profile & statistik dasar
- [ ] Deploy ke Google Cloud Run

## Phase 2 — Post-Lomba Growth (Bulan 2–4)

- [ ] Tambah bidang: Web Development, Copywriting, Video Editing
- [ ] Sistem poin dan gamifikasi: streak, badge, level up
- [ ] AI feedback atas hasil kerja yang disubmit
- [ ] Fitur komunitas: lihat portofolio user lain sebagai inspirasi
- [ ] Export portofolio ke PDF

## Phase 3 — Ekosistem (Bulan 5+)

- [ ] Company partnership: brief nyata dari startup dan agensi mitra
- [ ] Job board terintegrasi: lowongan entry-level relevan dengan bidang user
- [ ] Talent Discovery: perusahaan menemukan talent dari portofolio, bukan CV
- [ ] Mobile app (Android & iOS)
- [ ] API untuk institusi pendidikan

---

# 12. Long-Term Vision

BikinKarya bertujuan menjadi:

> Infrastruktur pengembangan karir untuk generasi kreatif Indonesia — tempat di mana kemampuan dibuktikan lewat karya, bukan sekadar ijazah atau nama kampus.

**Future Ecosystem Potential:**
- **BikinKarya for Companies** — rekruter browse portofolio kandidat berdasarkan brief yang pernah dikerjakan
- **BikinKarya for Schools** — institusi pendidikan menggunakan BikinKarya sebagai platform praktik industri
- **Brief Marketplace** — brand dan agensi nyata post brief untuk dikerjakan komunitas
- **Indonesia Creative Workforce Index** — data insight tentang tren skill dan gap SDM kreatif Indonesia

---

# 13. Conclusion

BikinKarya hadir dengan satu keyakinan sederhana: fresh graduate Indonesia tidak kekurangan bakat — mereka kekurangan kesempatan untuk membuktikannya.

Dengan menggabungkan AI brief generator yang realistis, task management yang terstruktur, interview simulator, dan portfolio builder yang siap dibagikan ke rekruter, BikinKarya menutup gap yang selama ini membuat ribuan lulusan berbakat terjebak dalam lingkaran "butuh pengalaman untuk dapat pengalaman."

> Yang membedakan BikinKarya bukan fiturnya, tapi momen yang dilayaninya — periode 1–6 bulan setelah wisuda, ketika seorang fresh graduate mencari cara untuk membuktikan bahwa mereka siap. Di jendela kritis itulah BikinKarya hadir: memberikan brief nyata, membangun portofolio, dan membuka pintu karir.

---

*PRD ini merupakan dokumen hidup yang diperbarui seiring perkembangan produk.*
*BikinKarya — Buktikan kemampuanmu lewat karya.*
