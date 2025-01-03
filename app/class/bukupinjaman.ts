import { bukuPinjamanType, prisma } from "@/lib";
import { EksemplarBuku } from "./eksemplarbuku";
import { Peminjaman } from "./peminjaman";

export class BukuPinjaman {
    idPeminjaman : number;
    bukuISBN : string;
    bukuId? : number;
    tenggatWaktu? : Date | null;
    tanggalKembali? : Date | null;

    constructor(data : bukuPinjamanType) {
        this.idPeminjaman = data.idPeminjaman;
        this.bukuISBN = data.bukuISBN;
        this.bukuId = data.bukuId;
        this.tenggatWaktu = data.tenggatWaktu;
        this.tanggalKembali = data.tanggalKembali;
    }

    static async tambahBukuPinjaman(data : bukuPinjamanType) {
        const {idPeminjaman, bukuISBN, bukuId, tenggatWaktu} = data;
        if (!idPeminjaman || !bukuISBN || !bukuId || !tenggatWaktu) {
            throw new Error("Harus mengisi field yang wajib");
        }
        const dataBukuPinjaman = await prisma.bukuPinjaman.create({
              data: {
                idPeminjaman: idPeminjaman,
                bukuISBN: bukuISBN!,
                bukuId: bukuId!,
                tenggatWaktu: tenggatWaktu,
              },
            });

        return dataBukuPinjaman;
    }

    static async konfirmasiPengembalian(data : bukuPinjamanType) {
        const {idPeminjaman, bukuISBN, bukuId} = data;
        
        if (!idPeminjaman || !bukuISBN || !bukuId) {
            throw new Error("Harus mengisi field yang wajib")
        }
        const dataEksemplarBuku = await EksemplarBuku.cariEksemplarBuku({isbn : bukuISBN, id : bukuId});
    
        if (!dataEksemplarBuku?.bukuISBN || !dataEksemplarBuku?.id) {
          throw new Error("Data buku tidak ditemukan.");
        }
    
        const dataPeminjaman = await Peminjaman.cariPeminjaman(idPeminjaman);
    
        if (!dataPeminjaman?.id) {
          throw new Error("Data peminjaman tidak ditemukan.");
        }
    
        await prisma.bukuPinjaman.update({
          data: {
            tanggalKembali: new Date(),
          },
          where: {
            idPeminjaman_bukuISBN_bukuId: {
              idPeminjaman: dataPeminjaman.id,
              bukuISBN: dataEksemplarBuku.bukuISBN,
              bukuId: dataEksemplarBuku.id,
            },
          },
        });
      }

      static async konfirmasiSemuaPengembalianBuku(idPeminjaman : number) {
        await prisma.bukuPinjaman.updateMany({
          where : {
            idPeminjaman
          }, data : {
            tanggalKembali : new Date(Date.now())
          }
        })
      }

        static async perbaruiTenggatWaktuPeminjaman(data : bukuPinjamanType) {

        const {idPeminjaman, bukuISBN, bukuId, tenggatWaktu} = data;

        if (!idPeminjaman || !bukuISBN || !bukuId || !tenggatWaktu) {
            throw new Error("Harus mengisi field yang wajib")
        }
        try {
          await prisma.bukuPinjaman.update({
            data: {
              tenggatWaktu,
            },
            where: {
              idPeminjaman_bukuISBN_bukuId: {
                idPeminjaman,
                bukuISBN: bukuISBN,
                bukuId: bukuId,
              },
            },
          });
        } catch (error) {
          throw new Error("Gagal memperbarui tenggat waktu peminjaman")
        }
        }

        static async hapusSemuaBukuPinjaman(idPeminjaman : number) {
            await prisma.bukuPinjaman.deleteMany({
                where : {
                  idPeminjaman
                }
              })
        }
}