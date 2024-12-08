"use client";
import { Accordion, AccordionItem } from "@nextui-org/react";
import PreProcessMarkdown from "@/components/PreProcessMarkdown";

const faqList = [
  {
    titles:
      "Bagaimana cara mengirim/menerima email melalui Smartphone Android Saya?",
    details:
      "Anda dapat mengirim/menerima email melalui aplikasi email client baik di Smartphone (Android/iPhone/Windows Mobile/BlackBerry) atau di komputer Anda (Microsoft Outlook/Mozila Thunderbird) tanpa menggunakan Web Browser. Untuk melakukannya, silahkan mengikuti langkah-langkah konfigurasi email client sesuai panduan.",
  },
  {
    titles:
      "Selain untuk akses jurnal online, apa yang dapat saya gunakan dengan email undiksha?",
    details:
      "Saat ini layanan sistem UPT TIK mulai menerapkan fitur Single Sign On (SSO) dengan menggunakan user email. Email undiksha bisa digunakan untuk mengakses semua sistem yang telah terdaftar hanya dengan sekali login.",
  },
  {
    titles:
      "Saya ada Kesalahan Nama/Tempat/ Tanggal Lahir dan Nama Ibu Kandung bagaimana caranya merubah?",
    details:
      "Perubahan data dasar seperti Nama, Tempat/Tanggal Lahir, dan Nama Ibu Kandung dilakukan oleh Bagian Akademik Undiksha ke Pusat. Proses verifikasi dan perubahan data di pusat memerlukan waktu 30 hari kerja. Dokumen yang Diperlukan: Surat Permohonan Perubahan Data, Ijazah, Transkrip Akademik / Kartu Hasil Studi, Akta Lahir, Kartu Keluarga, Kartu Tanda Penduduk (KTP). Semua dokumen harus dipindai secara terpisah dalam format PDF dengan ukuran maksimal 200KB. Kirimkan berkas melalui tautan berikut: https://go.undiksha.ac.id/Perubahan-Data-PDDikti. Catatan: Mohon dipastikan data yang tertera pada semua dokumen kependudukan sudah sama, baik penulisan nama, tempat dan tanggal lahir. Apabila belum, dilakukan perbaikan terlebih dahulu pada Dinas Kependudukan dan Catatan Sipil",
  },
  {
    titles: "Apakah di Undiksha memiliki kampus di denpasar?",
    details:
      "Kampus Undiksha di Denpasar terletak di Jalan Raya Sesetan No. 196, Kelurahan Sesetan, Denpasar Selatan, Kota Denpasar. Kampus ini melayani berbagai jurusan untuk perkuliahan sebagai berikut: \n1. PGSD \n2. Akuntansi \n3. Manajemen \n4. Pendidikan Jasmani, Kesehatan, Rekreasi \n5. Pendidikan Bahasa Inggris \n6. Ilmu Hukum \n7. Pendidikan Teknik Informatika \n8. Sistem Informasi \n9. Ilmu Komputer \n10. Pascasarjana. \nDengan beragam program studi ini, Kampus Undiksha Denpasar menawarkan pendidikan berkualitas untuk berbagai disiplin ilmu.",
  },
  {
    titles: "Bagaimana Cara melakukan Verval Ijasah?",
    details:
      "Kementerian Pendidikan dan Kebudayaan (Kemendikbud) mewajibkan guru honorer terdaftar di Data Pokok Pendidikan (Dapodik). Oleh sebab itu, wajib bagi kamu yang berstatus sebagai guru atau kepala sekolah honorer untuk melakukan verval ijazah. Verval ijazah ini berlaku untuk guru honorer di sekolah negeri maupun swasta. Jika kamu mengalami kendala dalam verval ijazah, berikut ini langkah-langkah yang bisa kamu ikuti: \n\n**Langkah-langkah Verval Ijazah** \n- Siapkan Ijazah \n- Siapkan ijazah S1 kamu dan masukkan datanya ke laman https://ijazah.kemdikbud.go.id. \n- Buka laman Info GTK \n- Kunjungi laman Info GTK di https://info.gtk.kemdikbud.go.id. \n- Pilih menu Login Langsung ke GTK atau melalui SSO Dapodik \n- Setelah masuk ke laman Info GTK, pilih menu 'Login Langsung ke GTK' atau melalui SSO Dapodik. \n- Login dengan PTK \n- Masukkan username berupa alamat email atau akun PTK yang sudah terverifikasi, password PTK, dan kode captcha. Lalu klik login. \n- Verval Ijazah \n- Setelah login, pilih menu verval ijazah. Jika sudah pernah verifikasi, kamu bisa tekan tombol 'Perbaikan Hasil Validasi'. \n- Isi Form \n- Isi form dengan data yang benar, seperti: \n- Cari dan pilih perguruan tinggi. \n- Masukkan prodi dan NIM, lalu klik cek. \n- Setelah data lengkap, klik simpan data. \n- Unggah Dokumen untuk Verifikasi Manual \n- Jika data tidak ditemukan, unggah dokumen ijazah asli kamu dengan ukursan maksimal 1 MB. \n- Verifikasi akan Diproses \n- Tunggu proses verifikasi dari panitia pusat. \n\n**Hal yang Perlu Diperhatikan saat Verval Ijazah** \n- Verval ijazah tidak menentukan kelayakan untuk mengikuti PPPK.\n- Verval ijazah memverifikasi kepemilikan ijazah dengan database Dikti.\n- Pastikan nama, perguruan tinggi, prodi, NIM, dan nomor ijazah sesuai.\n- Untuk ijazah S1 non-guru, pastikan gelar linear dengan formasi yang didaftarkan.\n- Jika nomor ijazah tidak terdaftar, hubungi kampus untuk melaporkan ke Dikti.\n- Pastikan nomor ijazah dapat diverifikasi melalui SIVIL. \n- Bagi lulusan sebelum tahun 2002/2003 yang tidak ditemukan di SIVIL, hubungi perguruan tinggi masing-masing.",
  },
  {
    titles: "Apakah Undiksha memiliki Asrama?",
    details:
      "Silakan dapat di cek pada link berikut: https://undiksha.ac.id/pmb/biaya-pendidikan/",
  },
  {
    titles: "Berapa Biaya Kuliah di Undiksha?",
    details:
      "Silakan dapat di cek informasi lebih lanjut pada link berikut: https://asrama.undiksha.ac.id/",
  },
  {
    titles:
      "Dimana saya bisa dapatkan sertifikat dan akreditasi Lembaga dan Fakultas?",
    details:
      "Silakan dapat di cek informasi lebih lanjut pada link berikut: https://akademik.undiksha.ac.id/dokumen-akademik/akreditasi-program-studi/",
  },
];

export default function FAQ() {
  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-lg 2xl:max-w-screen-2xl">
      <div id="info-bot" className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">FAQ</h1>
        <p className="text-sm sm:text-xl font-semibold">
          Coba cek masalah anda di FAQ kami
        </p>
        <p className="text-xs sm:text-base">
          Mungkin kendala yang anda hadapi sudah kami tangani
        </p>
      </div>

      <Accordion variant="shadow" className="mt-6 text-sm bg-sky-50">
        {faqList.map((faq, index) => (
          <AccordionItem key={index} aria-label={faq.titles} title={faq.titles}>
            <p>{PreProcessMarkdown(faq.details)}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
