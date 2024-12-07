/*
Skenario Pembayaran :
A. Denda Buku Hilang (Rp55.000 / 1 buku) & Tidak Mencapai Target Baca (Rp35.000 / 1 buku)
1. Murid sumbang 1 buku
2. Murid sumbang Rp55.000
3. Murid sumbang Rp25.000 dibantu oleh teman Rp20.000 dan Rp10.000
4. Murid sumbang Rp25.000 kemudian menyumbangkan 1 buku
5. Murid sumbang buku berlebih dan otomatis bantu sumbang 1 buku ke teman lain
6. Murid sumbang uang berlebih dan bantu sumbang porsi yang berlebih ke teman lain 

B. Kelulusan Kelas 9 (Rp110.000 / 2 buku)
7. Murid sumbang dua buku
8. Murid sumbang Rp110.000
9. Murid sumbang satu buku dan Rp55.000
10. Murid sumbang < Rp55.000 dan dua buku dan bantu sumbang porsi yang berlebih ke teman lain 
11. Murid sumbang < Rp110.000 dan satu buku dan bantu sumbang porsi yang berlebih ke teman lain 
12. Murid sumbang > Rp110.000
13. Murid sumbang > 2 buku
14. Murid sumbang Rp50.000 nyicil sebayak 5x kemudian datang satu buku dari murid tersebut atau murid lain
15. Murid disumbang Rp100.000 oleh 5 orang teman, kemudian murid menyumbangkan dua buku
16. Murid disumbang Rp65.000 (Rp20.000, Rp20.000, Rp25.000), kemudian datang satu buku, berarti Rp25.000 harus dikalkulasi ulang
17. Murid disumbang Rp56.000 nyicil sebanyak 2x (Rp28.000) kemudian datang satu buku, berarti semua id di table riwayat bantuan harus dikalkulasi ulang sumbangan tunainya

nilai tertinggi tunai yang disumbang lebih kecil dari tunai berlebih yang harus disumbangkan
Misal :
18. Murid disumbang Rp56.000 nyicil sebanyak 560x (Rp100), nilai tunai yang harus dikurangkan adalah Rp1000, sementara nilai tunai tertinggi adalah Rp100

C. Denda Terlambat
1. Murid hanya dapat sumbang tunai

Kesimpulan :
1. Jika nilai tunai yang berlebih lebih kecil dari nilai tunai tertinggi yang disumbangkan, maka ambil nilai tunai tertinggi saja dan kalkulasi ulang
2. Jika nilai tunai yang berlebih lebih besar dari nilai tunai tertinggi yang disumbangkan, 
   maka lakukan looping untuk menghapus rows pada table riwayat bantuan 
   sampai nilai tunai sama dengan nilai totalNominal di table keterangan,
   jika ketika dihapus ternyata kurang, maka pembayaran tunai yang terakhir di hapus tadi dikalkulasi ulang 
   (misalnya Rp60.000 didapat dari nyicil Rp3000 20x, ketika Rp3000 yang kedua dihapus, maka sisanya Rp54.000, 
   sehingga harus dikalkulasi ulang uang Rp3000 kedua yang dihapus tadi. 
   Dan uang teman yang nyumbang Rp3000 kedua tadi, attribute "berlebih" jadi true 
   kalau ketika menyumbangkan Rp3000 tadi sumbangannya sudah pas) (skenario kalau uangnya udh Rp60.000 kemudian masuk 1 buku ketika sumbangan tamat SMP)

Pada setiap keterangan sumbangan, petugas memasukkan jumlah buku atau total nominal sebagai target supaya bisa lunas, dan nominal per buku
Jika pada table sumbangan target buku tercapai (prioritas), maka langsung lunas
Jika pada table sumbangan target jumlah pembayaran tunai telah tercapai, maka langsung lunas
Jika pada table sumbangan target buku berlebih, maka diberikan ke yang membutuhkan
Jika pada table sumbangan target pembayaran tunai berlebih, maka diberikan ke yang membutuhkan
Jika pada table sumbangan target pembayaran tunai belum tercapai tapi target buku tercapai, maka seluruh tunai diberikan ke yang membutuhkan

Kondisi Bantuan :
1. Bantuan yang tersedia menumpuk jika terdapat lebih dari satu murid yang sumbangannya berlebih dan tidak ada murid yang sumbangannya kurang
2. Bantuan yang tersedia langsung habis jika murid yang sumbangannya kurang > murid yang sumbangannya berlebih  

Jika ada row pembayaran tunai yang berlebih, langsung ambil row terakhir untuk disumbangkan ke yang lain

Table sumbangan buku terdapat dua id table sumbangan
1. Jika pada sumbangan buku terdapat dua id yang sama, berarti buku tersebut untuk dirinya sendiri
2. Jika pada sumbangan buku terdapat dua id yang berbeda, berarti buku tersebut disumbangkan ke orang lain
3. Jika pada sumbangan buku hanya terdapat satu id, berarti buku tersebut siap disumbangkan
*/

// buat fitur pengenaan denda otomatis (pakai timer?)
// bagi setiap murid yang tidak mencapai target penulisan intisari ketika sudah memasuki semester baru
// intisari ditotalkan dari bulan 1~6 atau 7~12

import { Genre, JenisKelamin } from "@prisma/client";

export const seeds = {
    buku : [
        {
            isbn : "978-602-8519-93-9", 
            judul : "Killing Commandantore", 
            genre : [Genre.FANTASY, Genre.SCIFI], 
            penerbit : "Orang Ganteng", 
            penulis : ["Orang Tamvan", "Orang-orang"], 
            halaman : 200, 
            sinopsis : "Pada suatu hari ada seseorang", 
            tanggalRusak : new Date(),
            tanggalHilang : new Date(),
            posisi : "A1",
            linkGambar : "https://example.com"
            },
            {
            isbn : "978-602-8519-93-9", 
            judul : "Killing Commandantore", 
            genre : [Genre.FANTASY, Genre.SCIFI], 
            penerbit : "Orang Ganteng", 
            penulis : ["Orang Tamvan", "Orang-orang"], 
            halaman : 200, 
            sinopsis : "Pada suatu hari ada seseorang", 
            tanggalRusak : new Date(),
            tanggalHilang : new Date(),
            posisi : "A1",
            linkGambar : "https://example.com"
            },
            {
            isbn : "978-602-8519-93-9", 
            judul : "Killing Commandantore", 
            genre : [Genre.FANTASY, Genre.SCIFI], 
            penerbit : "Orang Ganteng", 
            penulis : ["Orang Tamvan", "Orang-orang"], 
            halaman : 200, 
            sinopsis : "Pada suatu hari ada seseorang", 
            tanggalRusak : new Date(),
            tanggalHilang : new Date(),
            posisi : "A1",
            linkGambar : "https://example.com"
            },
            {
                isbn : "978-602-8519-94-8", 
                judul : "Killing Commandantore 2", 
                genre : [Genre.FANTASY, Genre.SCIFI], 
                penerbit : "Orang Ganteng", 
                penulis : ["Orang Tamvan", "Orang-orang"], 
                halaman : 200, 
                sinopsis : "Pada suatu hari ada seseorang", 
                tanggalRusak : new Date(),
                tanggalHilang : new Date(),
                posisi : "A1",
                linkGambar : "https://example.com"
            }
    ],
    kelas : [
        {id : 1, nama : "Al Fatih", tingkat : 1},
        {id : 2, nama : "Al Muttaqin", tingkat : 2},
        {id : 3, nama : "Al Falah", tingkat : 3}
    ],
    murid : [
        {
            nis : "12412423", 
            nama : "Olav Thomas", 
            jenisKelamin : JenisKelamin.LAKI, 
            idKelas : 1, 
            kontak : "0831242152", 
            alamat : "Jalan Kebun Kopi"},
            {
                nis : "12412421", 
                nama : "Olav Thomas", 
                jenisKelamin : JenisKelamin.LAKI, 
                idKelas : 1, 
                kontak : "0831242152", 
                alamat : "Jalan Kebun Kopi"
            },
            {
                nis : "12412422", 
                nama : "Olav Thomas", 
                jenisKelamin : JenisKelamin.LAKI, 
                idKelas : 1, 
                kontak : "0831242152", 
                alamat : "Jalan Kebun Kopi"
            }      
    ],
    guru : [
        {
            nip : "12412423", 
            nama : "Olav Thomas", 
            jenisKelamin : JenisKelamin.LAKI, 
            kontak : "0831242152", 
            alamat : "Jalan Kebun Kopi"},
            {
                nip : "12412421", 
                nama : "Olav Thomas", 
                jenisKelamin : JenisKelamin.LAKI, 
                kontak : "0831242152", 
                alamat : "Jalan Kebun Kopi"
            },
            {
                nip : "12412422", 
                nama : "Olav Thomas", 
                jenisKelamin : JenisKelamin.LAKI, 
                kontak : "0831242152", 
                alamat : "Jalan Kebun Kopi"
            }      
    ], 
    keterangan : [
        {   id : 1,
            keterangan : "Keterlambatan Pengembalian Buku",
            jumlahBuku : 5,
            totalNominal : 110000,
            nominalPerHari : 1000
        },
        {
            id : 2,
            keterangan : "Keterlambatan Pengembalian Buku",
            jumlahBuku : 2,
            totalNominal : 550000,
            nominalPerHari : 1000
        },
        {
            id : 3,
            keterangan : "Keterlambatan Pengembalian Buku",
            jumlahBuku : 3,
            totalNominal : 300000,
            nominalPerHari : 1000
        }, {
            id : 4,
            keterangan : "Keterlambatan Pengembalian Buku",
            jumlahBuku : 3,
            totalNominal : 300000,
            nominalPerHari : 1000
        }
    ],
    peminjaman : [
        {nis : "12412421", tanggalPinjam : new Date(), keterangan : "WOW"},
        {nip : "12412422", tanggalPinjam : new Date(), keterangan : "WOW"},
        {nip : "12412423", tanggalPinjam : new Date(), keterangan : "WOW"}
    ]
}