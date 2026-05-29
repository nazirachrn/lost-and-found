import { databaseService } from "../firebase/databaseService";

// Helper function to offset dates
const daysAgo = (num) => {
  const d = new Date();
  d.setDate(d.getDate() - num);
  return d.toISOString();
};

export const seedMockData = () => {
  // Check if seeding is already completed
  const users = localStorage.getItem("ll_users");
  if (users && JSON.parse(users).length > 0) {
    return; // Already seeded!
  }

  console.log("%c[LostLink Seeder] Seeding high-fidelity sandbox data...", "color: #a855f7; font-weight: bold;");

  // 1. Seed 5 Users
  const dummyUsers = [
    {
      uid: "demo-admin-id",
      email: "admin@lostlink.com",
      nama: "Administrator",
      displayName: "Administrator",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
      role: "admin",
      createdAt: daysAgo(30)
    },
    {
      uid: "demo-user-1",
      email: "fandi@lostlink.com",
      nama: "Fandi Ahmad",
      displayName: "Fandi Ahmad",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Fandi",
      role: "user",
      createdAt: daysAgo(20)
    },
    {
      uid: "demo-user-2",
      email: "nazira@lostlink.com",
      nama: "Nazira Chairani",
      displayName: "Nazira Chairani",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nazira",
      role: "user",
      createdAt: daysAgo(18)
    },
    {
      uid: "demo-user-3",
      email: "budi@lostlink.com",
      nama: "Budi Setiawan",
      displayName: "Budi Setiawan",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Budi",
      role: "user",
      createdAt: daysAgo(15)
    },
    {
      uid: "demo-user-4",
      email: "clara@lostlink.com",
      nama: "Clara Sinta",
      displayName: "Clara Sinta",
      photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Clara",
      role: "user",
      createdAt: daysAgo(10)
    }
  ];
  localStorage.setItem("ll_users", JSON.stringify(dummyUsers));
  localStorage.setItem("ll_active_session", JSON.stringify(dummyUsers[1])); // Default active session: Fandi

  // Images for items
  const images = {
    hp: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=550&auto=format&fit=crop&q=80",
    laptop: "https://images.unsplash.com/photo-1496181130204-7552cc15f1e3?w=550&auto=format&fit=crop&q=80",
    dompet: "https://images.unsplash.com/photo-1627124765135-566b533e4b77?w=550&auto=format&fit=crop&q=80",
    tas: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=550&auto=format&fit=crop&q=80",
    kunci: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=550&auto=format&fit=crop&q=80",
    kartu: "https://images.unsplash.com/photo-1593537871752-0941913c1c50?w=550&auto=format&fit=crop&q=80",
    aksesoris: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=550&auto=format&fit=crop&q=80",
    lainnya: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=550&auto=format&fit=crop&q=80"
  };

  // 2. Seed 15 Missing Items (Barang Hilang)
  // Coordinates are clustered around a Campus area in Jakarta (-6.2088, 106.8456)
  const dummyMissing = [
    {
      id: "missing-1",
      namaBarang: "iPhone 13 Pro Max",
      kategori: "HP",
      warna: "Hitam",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2088,
      longitude: 106.8456,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Kehilangan iPhone 13 Pro Max dengan casing silikon transparan. Terakhir aktif di meja belajar perpustakaan lantai 2 dekat jendela.",
      ciriKhusus: "Ada goresan kecil di sudut kanan bawah dekat port charging. Wallpaper foto kucing putih.",
      foto: images.hp,
      kontakAlternatif: "WA: 08123456789",
      userId: "demo-user-1", // Fandi
      status: "missing",
      createdAt: daysAgo(2)
    },
    {
      id: "missing-2",
      namaBarang: "Laptop ASUS ROG Zephyrus G14",
      kategori: "Laptop",
      warna: "Abu-abu",
      lokasi: "Aula Seminar",
      latitude: -6.2105,
      longitude: 106.8472,
      tanggal: daysAgo(4).split('T')[0],
      deskripsi: "Laptop ASUS gaming tertinggal di barisan kursi belakang Aula Seminar setelah acara kelulusan.",
      ciriKhusus: "Gantungan kunci anime terikat di resleting tas laptop hitam. Logo ASUS menyala putih.",
      foto: images.laptop,
      kontakAlternatif: "Telegram: @fandiah",
      userId: "demo-user-1", // Fandi
      status: "missing",
      createdAt: daysAgo(4)
    },
    {
      id: "missing-3",
      namaBarang: "Dompet Kulit Coklat",
      kategori: "Dompet",
      warna: "Coklat",
      lokasi: "Cafe Kopi",
      latitude: -6.2072,
      longitude: 106.8441,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Dompet lipat kulit sapi tertinggal di area kasir atau meja outdoor Cafe Kopi.",
      ciriKhusus: "Ada inisial nama 'B.S.' di bagian kulit dalam. Berisi KTP, SIM, dan Kartu Debit.",
      foto: images.dompet,
      userId: "demo-user-3", // Budi
      status: "missing",
      createdAt: daysAgo(1)
    },
    {
      id: "missing-4",
      namaBarang: "Tas Ransel Eiger",
      kategori: "Tas",
      warna: "Biru",
      lokasi: "Kampus Utama",
      latitude: -6.2099,
      longitude: 106.8465,
      tanggal: daysAgo(3).split('T')[0],
      deskripsi: "Tas ransel Eiger 25L hilang saat ditaruh di koridor Fakultas Teknik saat praktikum.",
      ciriKhusus: "Di dalamnya berisi modul kalkulus, jas lab biru, dan botol minum hijau stainless.",
      foto: images.tas,
      userId: "demo-user-2", // Nazira
      status: "missing",
      createdAt: daysAgo(3)
    },
    {
      id: "missing-5",
      namaBarang: "Kunci Motor Honda Vario",
      kategori: "Kunci",
      warna: "Hitam",
      lokasi: "Parkiran Utara",
      latitude: -6.2112,
      longitude: 106.8439,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Kunci motor vario beserta gantungan kulit hitam hilang di area parkiran motor fakultas ekonomi.",
      ciriKhusus: "Gantungan kunci bertuliskan 'HONDA' dari bahan kulit tebal hitam, ada remote alarm kecil.",
      foto: images.kunci,
      userId: "demo-user-4", // Clara
      status: "missing",
      createdAt: daysAgo(1)
    },
    {
      id: "missing-6",
      namaBarang: "Kartu Mahasiswa (KTM)",
      kategori: "Kartu Identitas",
      warna: "Putih",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2089,
      longitude: 106.8457,
      tanggal: daysAgo(5).split('T')[0],
      deskripsi: "KTM hilang kemungkinan terjatuh saat proses tapping pintu masuk perpustakaan.",
      ciriKhusus: "Atas nama 'Clara Sinta', NIM: 2021081014. Terbungkus card holder biru muda.",
      foto: images.kartu,
      userId: "demo-user-4", // Clara
      status: "missing",
      createdAt: daysAgo(5)
    },
    {
      id: "missing-7",
      namaBarang: "Earphone Sony WF-1000XM4",
      kategori: "Aksesoris",
      warna: "Silver",
      lokasi: "Cafe Kopi",
      latitude: -6.2073,
      longitude: 106.8443,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Case beserta earphone Sony TWS tertinggal di meja barista/meja kasir Cafe Kopi.",
      ciriKhusus: "Case dipasangi case silikon abu-abu bermotif marmer. Bagian ujung earbud ada noda kecil.",
      foto: images.aksesoris,
      userId: "demo-user-3", // Budi
      status: "missing",
      createdAt: daysAgo(2)
    },
    {
      id: "missing-8",
      namaBarang: "Kacamata Rayban Classic",
      kategori: "Aksesoris",
      warna: "Hitam",
      lokasi: "Aula Seminar",
      latitude: -6.2104,
      longitude: 106.8471,
      tanggal: daysAgo(6).split('T')[0],
      deskripsi: "Kacamata hitam diletakkan di podium aula seminar dan terlupa setelah selesai membawakan materi presentasi.",
      ciriKhusus: "Frame hitam kokoh, lensa polarized gelap, ada emboss logo Rayban kecil di sudut lensa.",
      foto: images.aksesoris,
      userId: "demo-user-2", // Nazira
      status: "missing",
      createdAt: daysAgo(6)
    },
    {
      id: "missing-9",
      namaBarang: "Powerbank Anker 20000mAh",
      kategori: "Aksesoris",
      warna: "Hitam",
      lokasi: "Kampus Utama",
      latitude: -6.2095,
      longitude: 106.8461,
      tanggal: daysAgo(3).split('T')[0],
      deskripsi: "Powerbank tertinggal di gazebo depan gedung rektorat saat nongkrong sore.",
      ciriKhusus: "Terdapat goresan baret panjang melintang di body depan. Disertai kabel type C pendek tergulung.",
      foto: images.aksesoris,
      userId: "demo-user-1", // Fandi
      status: "missing",
      createdAt: daysAgo(3)
    },
    {
      id: "missing-10",
      namaBarang: "Flashdisk SanDisk Ultra 64GB",
      kategori: "Aksesoris",
      warna: "Merah",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2087,
      longitude: 106.8455,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Flashdisk merah hitam tertancap di komputer nomor 12 laboratorium perpustakaan.",
      ciriKhusus: "Terdapat gantungan tali merah kecil. Berisi file skripsi dan folder 'DOKUMEN_PENTING'.",
      foto: images.aksesoris,
      userId: "demo-user-3", // Budi
      status: "missing",
      createdAt: daysAgo(1)
    },
    {
      id: "missing-11",
      namaBarang: "Botol Minum Thermos Stainless",
      kategori: "Lainnya",
      warna: "Biru",
      lokasi: "Kampus Utama",
      latitude: -6.2098,
      longitude: 106.8466,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Tumbler minum stainless tertinggal di area bangku taman dekat gedung perkuliahan.",
      ciriKhusus: "Ditempel sticker logo brand outdoor seperti Patagonia dan Supreme.",
      foto: images.lainnya,
      userId: "demo-user-4", // Clara
      status: "missing",
      createdAt: daysAgo(2)
    },
    {
      id: "missing-12",
      namaBarang: "Kunci Rumah / Kos",
      kategori: "Kunci",
      warna: "Silver",
      lokasi: "Cafe Kopi",
      latitude: -6.2071,
      longitude: 106.8440,
      tanggal: daysAgo(3).split('T')[0],
      deskripsi: "Gantungan kunci berisi 3 buah anak kunci rumah terjatuh di sekitar parkiran Cafe Kopi.",
      ciriKhusus: "Gantungan boneka rajut kuning berbentuk beruang kecil.",
      foto: images.kunci,
      userId: "demo-user-2", // Nazira
      status: "missing",
      createdAt: daysAgo(3)
    },
    {
      id: "missing-13",
      namaBarang: "Dompet Kartu Jims Honey",
      kategori: "Dompet",
      warna: "Abu-abu",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2086,
      longitude: 106.8453,
      tanggal: daysAgo(4).split('T')[0],
      deskripsi: "Dompet kartu (card holder) abu-abu jatuh di toilet wanita perpustakaan lantai 1.",
      ciriKhusus: "Terdiri dari 6 slot kartu, berisi KTP atas nama Nazira, SIM C, dan beberapa struk cafe.",
      foto: images.dompet,
      userId: "demo-user-2", // Nazira
      status: "missing",
      createdAt: daysAgo(4)
    },
    {
      id: "missing-14",
      namaBarang: "Jaket Coach Erigo",
      kategori: "Lainnya",
      warna: "Hitam",
      lokasi: "Parkiran Utara",
      latitude: -6.2110,
      longitude: 106.8437,
      tanggal: daysAgo(5).split('T')[0],
      deskripsi: "Jaket tertinggal di jok motor Honda Scoopy krem di parkiran teknik sipil.",
      ciriKhusus: "Ukuran XL, ada sticker bordir logo harimau di bagian punggung belakang jaket.",
      foto: images.lainnya,
      userId: "demo-user-1", // Fandi
      status: "missing",
      createdAt: daysAgo(5)
    },
    {
      id: "missing-15",
      namaBarang: "Smartwatch Xiaomi Band 7",
      kategori: "Aksesoris",
      warna: "Hitam",
      lokasi: "Kampus Utama",
      latitude: -6.2096,
      longitude: 106.8462,
      tanggal: daysAgo(7).split('T')[0],
      deskripsi: "Smartwatch terjatuh saat berolahraga basket di lapangan olahraga outdoor kampus.",
      ciriKhusus: "Strap karet hitam, ada retakan sangat tipis di bagian sensor detak jantung di bawah jam.",
      foto: images.aksesoris,
      userId: "demo-user-3", // Budi
      status: "missing",
      createdAt: daysAgo(7)
    }
  ];
  localStorage.setItem("ll_missing_items", JSON.stringify(dummyMissing));

  // 3. Seed 15 Found Items (Saya Menemukan Barang)
  // Several coordinates and descriptions match the missing list to test the "Auto-Matching System"!
  const dummyFound = [
    {
      id: "found-1",
      namaBarang: "iPhone 13 Silikon",
      kategori: "HP",
      warna: "Hitam",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2089,
      longitude: 106.8458,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Menemukan iPhone warna hitam tergeletak di meja pojok perpustakaan lantai 2. Kondisi baterai drop / mati.",
      ciriKhusus: "Casing bening transparan kekuningan. Di dalam casing terdapat stiker mini kartun.",
      foto: images.hp,
      userId: "demo-user-2", // Nazira found it (Fandi's iPhone!)
      status: "matching", // Matching status triggered by system!
      createdAt: daysAgo(2)
    },
    {
      id: "found-2",
      namaBarang: "Tas Backpack Eiger Biru",
      kategori: "Tas",
      warna: "Biru",
      lokasi: "Kampus Utama",
      latitude: -6.2100,
      longitude: 106.8467,
      tanggal: daysAgo(3).split('T')[0],
      deskripsi: "Ditemukan tas ransel merk Eiger warna navy di bangku lobi gedung Dekanat Fakultas Teknik.",
      ciriKhusus: "Ada gantungan boneka kecil, di dalam berisi modul kuliah kalkulus.",
      foto: images.tas,
      userId: "demo-user-3", // Budi found it (Nazira's Tas!)
      status: "matching",
      createdAt: daysAgo(3)
    },
    {
      id: "found-3",
      namaBarang: "Dompet Kulit Pria",
      kategori: "Dompet",
      warna: "Coklat",
      lokasi: "Cafe Kopi",
      latitude: -6.2073,
      longitude: 106.8442,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Menemukan dompet kulit lipat coklat di meja nomor 8 dekat pintu masuk Cafe Kopi.",
      ciriKhusus: "Dompet cukup tebal, terdapat banyak kartu kredit/debit di dalamnya.",
      foto: images.dompet,
      userId: "demo-user-4", // Clara found it (Budi's wallet!)
      status: "found",
      createdAt: daysAgo(1)
    },
    {
      id: "found-4",
      namaBarang: "Kunci Motor Honda Remote",
      kategori: "Kunci",
      warna: "Hitam",
      lokasi: "Parkiran Utara",
      latitude: -6.2113,
      longitude: 106.8440,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Menemukan kunci motor merk Honda terjatuh di paving block parkiran motor FE.",
      ciriKhusus: "Dilengkapi remote kunci kecil berwarna hitam dan gantungan kulit hitam.",
      foto: images.kunci,
      userId: "demo-user-1", // Fandi found it (Clara's key!)
      status: "matching",
      createdAt: daysAgo(1)
    },
    {
      id: "found-5",
      namaBarang: "KTM atas nama Clara Sinta",
      kategori: "Kartu Identitas",
      warna: "Putih",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2088,
      longitude: 106.8456,
      tanggal: daysAgo(5).split('T')[0],
      deskripsi: "Ditemukan KTM mahasiswi terjatuh di tangga luar perpustakaan gedung A.",
      ciriKhusus: "Nama tertera Clara Sinta, NIM 2021081014. Terpasang gantungan bening.",
      foto: images.kartu,
      userId: "demo-user-3", // Budi found it (Clara's KTM!)
      status: "returned", // Already verified and returned!
      createdAt: daysAgo(5)
    },
    {
      id: "found-6",
      namaBarang: "Kacamata Hitam polarized",
      kategori: "Aksesoris",
      warna: "Hitam",
      lokasi: "Aula Seminar",
      latitude: -6.2105,
      longitude: 106.8473,
      tanggal: daysAgo(5).split('T')[0],
      deskripsi: "Menemukan kacamata hitam diletakkan di atas meja pembicara aula seminar lantai 3.",
      ciriKhusus: "Gagang kacamata hitam dengan engsel metal emas, lensanya polarized gelap.",
      foto: images.aksesoris,
      userId: "demo-user-1", // Fandi found it (Nazira's Rayban!)
      status: "found",
      createdAt: daysAgo(5)
    },
    {
      id: "found-7",
      namaBarang: "Tumbler Biru Sticker",
      kategori: "Lainnya",
      warna: "Biru",
      lokasi: "Kampus Utama",
      latitude: -6.2097,
      longitude: 106.8465,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Menemukan tumbler minum warna biru dengan tempelan stiker-stiker distro di halte bus kampus.",
      ciriKhusus: "Terdapat sticker bertuliskan 'Patagonia' dan 'Supreme'.",
      foto: images.lainnya,
      userId: "demo-user-2", // Nazira found it (Clara's bottle!)
      status: "found",
      createdAt: daysAgo(2)
    },
    {
      id: "found-8",
      namaBarang: "Card Holder Jims Honey",
      kategori: "Dompet",
      warna: "Abu-abu",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2087,
      longitude: 106.8454,
      tanggal: daysAgo(4).split('T')[0],
      deskripsi: "Ditemukan dompet kartu abu-abu di area wastafel toilet perpustakaan lantai 1.",
      ciriKhusus: "Terdapat beberapa kartu identitas penting di dalamnya.",
      foto: images.dompet,
      userId: "demo-user-3", // Budi found it (Nazira's Card Holder!)
      status: "found",
      createdAt: daysAgo(4)
    },
    {
      id: "found-9",
      namaBarang: "Kunci Gembok / Kos Rajut",
      kategori: "Kunci",
      warna: "Silver",
      lokasi: "Cafe Kopi",
      latitude: -6.2072,
      longitude: 106.8441,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Ditemukan serangkaian anak kunci gembok kos dengan gantungan rajut kuning di dekat parkiran Cafe Kopi.",
      ciriKhusus: "Gantungan rajut tebal berwarna kuning berbentuk beruang.",
      foto: images.kunci,
      userId: "demo-user-4", // Clara found it (Nazira's key!)
      status: "found",
      createdAt: daysAgo(2)
    },
    {
      id: "found-10",
      namaBarang: "Smartwatch Xiaomi Band",
      kategori: "Aksesoris",
      warna: "Hitam",
      lokasi: "Kampus Utama",
      latitude: -6.2095,
      longitude: 106.8461,
      tanggal: daysAgo(7).split('T')[0],
      deskripsi: "Menemukan jam pintar Xiaomi Band terjatuh di bawah tribun lapangan basket outdoor kampus.",
      ciriKhusus: "Layar masih menyala sedikit, baterai lemah, strap silikon hitam polos.",
      foto: images.aksesoris,
      userId: "demo-user-2", // Nazira found it (Budi's Smartwatch!)
      status: "found",
      createdAt: daysAgo(7)
    },
    {
      id: "found-11",
      namaBarang: "Flashdisk Sandisk 64GB",
      kategori: "Aksesoris",
      warna: "Merah",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2088,
      longitude: 106.8456,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Menemukan flashdisk Sandisk merah menyala tertancap di PC perpustakaan.",
      ciriKhusus: "Terikat tali kecil berwarna merah, di dalamnya berisi file bertuliskan skripsi.",
      foto: images.aksesoris,
      userId: "demo-user-2", // Nazira found it (Budi's Flashdisk!)
      status: "found",
      createdAt: daysAgo(1)
    },
    {
      id: "found-12",
      namaBarang: "Headphones JBL Tune 510BT",
      kategori: "Aksesoris",
      warna: "Putih",
      lokasi: "Cafe Kopi",
      latitude: -6.2072,
      longitude: 106.8441,
      tanggal: daysAgo(3).split('T')[0],
      deskripsi: "Menemukan headphones wireless JBL warna putih tertinggal di sofa Cafe Kopi lantai 2.",
      ciriKhusus: "Kondisi sangat mulus, ada baret gesekan tipis di ear cup sebelah kanan.",
      foto: images.aksesoris,
      userId: "demo-user-1", // Fandi found it
      status: "found",
      createdAt: daysAgo(3)
    },
    {
      id: "found-13",
      namaBarang: "Payung Transparan Lipat",
      kategori: "Lainnya",
      warna: "Putih",
      lokasi: "Perpustakaan Pusat",
      latitude: -6.2087,
      longitude: 106.8455,
      tanggal: daysAgo(1).split('T')[0],
      deskripsi: "Payung transparan ala jepang ditaruh di rak payung lobi perpustakaan dan tertinggal sampai malam.",
      ciriKhusus: "Gagang payung berbahan kayu coklat terang melengkung.",
      foto: images.lainnya,
      userId: "demo-user-4", // Clara found it
      status: "found",
      createdAt: daysAgo(1)
    },
    {
      id: "found-14",
      namaBarang: "Cincin Perak Pria",
      kategori: "Aksesoris",
      warna: "Silver",
      lokasi: "Aula Seminar",
      latitude: -6.2104,
      longitude: 106.8471,
      tanggal: daysAgo(4).split('T')[0],
      deskripsi: "Menemukan cincin perak ukir naga di wastafel aula pertemuan setelah seminar usai.",
      ciriKhusus: "Terdapat ukiran motif naga melingkar di sekeliling badan cincin perak.",
      foto: images.aksesoris,
      userId: "demo-user-3", // Budi found it
      status: "found",
      createdAt: daysAgo(4)
    },
    {
      id: "found-15",
      namaBarang: "Earbuds Case Case silikon",
      kategori: "Aksesoris",
      warna: "Abu-abu",
      lokasi: "Cafe Kopi",
      latitude: -6.2074,
      longitude: 106.8444,
      tanggal: daysAgo(2).split('T')[0],
      deskripsi: "Ditemukan case TWS silikon bermotif marmer abu-abu tertinggal di laci meja outdoor.",
      ciriKhusus: "Silikon bermotif marmer dengan gantungan carabiner besi hitam kecil.",
      foto: images.aksesoris,
      userId: "demo-user-2", // Nazira found it (Budi's Sony TWS!)
      status: "found",
      createdAt: daysAgo(2)
    }
  ];
  localStorage.setItem("ll_found_items", JSON.stringify(dummyFound));

  // 4. Seed 5 Claims (Klaim Verifikasi Kepemilikan)
  const dummyClaims = [
    {
      id: "claim-1",
      itemId: "found-1", // Fandi's iPhone found by Nazira
      itemName: "iPhone 13 Pro Max",
      itemType: "found",
      reporterId: "demo-user-2", // Nazira is the finder/reporter
      claimantId: "demo-user-1", // Fandi claims it
      claimantName: "Fandi Ahmad",
      ciriKhusus: "Ada goresan kecil di sudut kanan bawah dekat port charging. Wallpaper foto kucing putih angora.",
      isiBarang: "Di dalam casing silikon transparan tersebut, terselip uang Rp 50.000 terlipat rapi.",
      buktiTambahan: "Saya memiliki kotak box kardus pembelian iPhone tersebut dengan nomor IMEI yang sesuai di HP.",
      fotoPendukung: "",
      status: "pending", // Pending admin approval
      createdAt: daysAgo(1)
    },
    {
      id: "claim-2",
      itemId: "found-2", // Nazira's Tas found by Budi
      itemName: "Tas Backpack Eiger Biru",
      itemType: "found",
      reporterId: "demo-user-3", // Budi is the finder/reporter
      claimantId: "demo-user-2", // Nazira claims it
      claimantName: "Nazira Chairani",
      ciriKhusus: "Ada gantungan kunci boneka rajut alpaca putih terikat di resleting tas Eiger.",
      isiBarang: "Di dalamnya berisi modul praktikum kalkulus, jas lab biru berlogo Teknik Kimia, dan botol minum hijau stainless steel.",
      buktiTambahan: "Jas laboratorium di dalam tas bertuliskan bordir nama saya 'Nazira C.'.",
      fotoPendukung: "",
      status: "verified", // Approved / Verified!
      createdAt: daysAgo(2)
    },
    {
      id: "claim-3",
      itemId: "found-3", // Budi's Wallet found by Clara
      itemName: "Dompet Kulit Pria",
      itemType: "found",
      reporterId: "demo-user-4", // Clara is the finder/reporter
      claimantId: "demo-user-3", // Budi claims it
      claimantName: "Budi Setiawan",
      ciriKhusus: "Ada inisial nama B.S. di bagian kulit dalam dompet lipat berwarna coklat.",
      isiBarang: "Berisi KTP atas nama Budi Setiawan, SIM A, Kartu Debit Mandiri, dan uang tunai Rp 150.000.",
      buktiTambahan: "Foto KTP yang berada di dalam dompet tersebut sama persis dengan profil akun saya.",
      fotoPendukung: "",
      status: "pending",
      createdAt: daysAgo(1)
    },
    {
      id: "claim-4",
      itemId: "found-5", // Clara's KTM found by Budi
      itemName: "KTM atas nama Clara Sinta",
      itemType: "found",
      reporterId: "demo-user-3", // Budi is the finder/reporter
      claimantId: "demo-user-4", // Clara claimed it
      claimantName: "Clara Sinta",
      ciriKhusus: "KTM atas nama saya Clara Sinta dengan foto wajah berhijab hitam.",
      isiBarang: "Hanya satu lembar kartu mahasiswa di dalam card holder transparan.",
      buktiTambahan: "Kartu mahasiswa tersebut tertera NIM saya 2021081014.",
      fotoPendukung: "",
      status: "returned", // Completed and returned!
      createdAt: daysAgo(5)
    },
    {
      id: "claim-5",
      itemId: "found-4", // Clara's key found by Fandi
      itemName: "Kunci Motor Honda Remote",
      itemType: "found",
      reporterId: "demo-user-1", // Fandi is the finder/reporter
      claimantId: "demo-user-4", // Clara claims it
      claimantName: "Clara Sinta",
      ciriKhusus: "Gantungan kunci bertuliskan 'HONDA' dari bahan kulit tebal hitam, ada remote alarm kecil.",
      isiBarang: "Kunci kontak motor vario 150cc beserta remote alarm hitam kecil.",
      buktiTambahan: "Saya memiliki STNK motor atas nama saya sendiri untuk membuktikan motornya.",
      fotoPendukung: "",
      status: "rejected", // Rejected due to incorrect details
      createdAt: daysAgo(1)
    }
  ];
  localStorage.setItem("ll_claims", JSON.stringify(dummyClaims));

  // 5. Seed 10 Chats (Messages between Fandi and Nazira, etc.)
  const dummyMessages = [
    {
      id: "msg-1",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-1", // Fandi
      senderName: "Fandi Ahmad",
      receiverId: "demo-user-2", // Nazira
      text: "Halo Nazira, apakah Anda benar menemukan iPhone 13 Pro Max di perpustakaan?",
      createdAt: daysAgo(1.5)
    },
    {
      id: "msg-2",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-2", // Nazira
      senderName: "Nazira Chairani",
      receiverId: "demo-user-1", // Fandi
      text: "Halo Fandi! Iya benar, saya menemukan HP iPhone hitam di meja lantai 2 perpustakaan kemarin sore.",
      createdAt: daysAgo(1.4)
    },
    {
      id: "msg-3",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-1", // Fandi
      senderName: "Fandi Ahmad",
      receiverId: "demo-user-2", // Nazira
      text: "Wah alhamdulillah, itu kemungkinan besar HP saya. Casingnya silikon bening transparan kan ya?",
      createdAt: daysAgo(1.35)
    },
    {
      id: "msg-4",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-2", // Nazira
      senderName: "Nazira Chairani",
      receiverId: "demo-user-1", // Fandi
      text: "Benar sekali! Casingnya bening agak menguning sedikit. Untuk membuktikannya, bisakah Anda jelaskan wallpaper atau stiker di dalamnya?",
      createdAt: daysAgo(1.3)
    },
    {
      id: "msg-5",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-1", // Fandi
      senderName: "Fandi Ahmad",
      receiverId: "demo-user-2", // Nazira
      text: "Tentu! Wallpapernya foto kucing persia putih saya. Dan di balik casing, ada stiker bertuliskan band 'Nirvana' kecil.",
      createdAt: daysAgo(1.25)
    },
    {
      id: "msg-6",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-2", // Nazira
      senderName: "Nazira Chairani",
      receiverId: "demo-user-1", // Fandi
      text: "Wah cocok sekali! Iya benar, ada stiker Nirvana di dalamnya. Silakan ajukan tombol 'Klaim Barang' di halaman barang ya agar terekam di sistem admin.",
      createdAt: daysAgo(1.2)
    },
    {
      id: "msg-7",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-1", // Fandi
      senderName: "Fandi Ahmad",
      receiverId: "demo-user-2", // Nazira
      text: "Siap, sudah saya ajukan klaim barusan. Nanti setelah admin verifikasi, bolehkah kita ketemuan di Cafe Kopi kampus untuk serah terima?",
      createdAt: daysAgo(1.1)
    },
    {
      id: "msg-8",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-2", // Nazira
      senderName: "Nazira Chairani",
      receiverId: "demo-user-1", // Fandi
      text: "Boleh banget! Saya biasa nongkrong di Cafe Kopi tiap siang jam 1. Kabari saja ya kalau admin sudah menyetujui klaimnya.",
      createdAt: daysAgo(1.05)
    },
    {
      id: "msg-9",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-1", // Fandi
      senderName: "Fandi Ahmad",
      receiverId: "demo-user-2", // Nazira
      text: "Siap, terima kasih banyak ya Nazira! Kamu baik sekali.",
      createdAt: daysAgo(1.0)
    },
    {
      id: "msg-10",
      chatId: "chat-fandi-nazira",
      senderId: "demo-user-2", // Nazira
      senderName: "Nazira Chairani",
      receiverId: "demo-user-1", // Fandi
      text: "Sama-sama Fandi, senang bisa membantu!",
      createdAt: daysAgo(0.9)
    }
  ];
  localStorage.setItem("ll_messages", JSON.stringify(dummyMessages));

  // 6. Seed Notifications (Toast and badge logs)
  const dummyNotifications = [
    {
      id: "notif-1",
      userId: "demo-user-1", // Fandi
      title: "Potential Match Ditemukan!",
      message: "Item 'iPhone 13 Pro Max' yang Anda laporkan memiliki kecocokan tinggi dengan 'iPhone 13 Silikon' yang ditemukan oleh Nazira Chairani.",
      type: "match",
      itemId: "found-1",
      read: false,
      createdAt: daysAgo(2)
    },
    {
      id: "notif-2",
      userId: "demo-user-2", // Nazira
      title: "Klaim Disetujui Admin!",
      message: "Klaim Anda untuk 'Tas Backpack Eiger Biru' telah diverifikasi oleh Administrator dan disetujui. Silakan hubungi penemu untuk serah terima.",
      type: "claim_approved",
      itemId: "found-2",
      read: false,
      createdAt: daysAgo(1)
    },
    {
      id: "notif-3",
      userId: "demo-user-1", // Fandi
      title: "Pesan Baru Diterima",
      message: "Nazira Chairani mengirimkan pesan: 'Sama-sama Fandi, senang bisa membantu!'",
      type: "chat",
      itemId: "chat-fandi-nazira",
      read: false,
      createdAt: daysAgo(0.9)
    },
    {
      id: "notif-4",
      userId: "demo-user-4", // Clara
      title: "Klaim Ditolak Admin",
      message: "Klaim Anda untuk 'Kunci Motor Honda Remote' ditolak karena bukti/ciri khusus yang Anda berikan tidak cocok dengan barang temuan.",
      type: "claim_rejected",
      itemId: "found-4",
      read: false,
      createdAt: daysAgo(1)
    }
  ];
  localStorage.setItem("ll_notifications", JSON.stringify(dummyNotifications));

  console.log("%c[LostLink Seeder] High-fidelity sandbox data seeded successfully!", "color: #10b981; font-weight: bold;");
};
