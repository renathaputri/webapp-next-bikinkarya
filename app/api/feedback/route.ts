import { NextRequest } from "next/server";
import { ok, err } from "@/lib/response";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { username, message } = await request.json();

    if (!message || message.trim() === "") {
      return err("Pesan tidak boleh kosong", 400);
    }

    if (message.length > 3000) {
      return err("Pesan maksimal 3000 karakter", 400);
    }

    // Konfigurasi transporter untuk nodemailer
    // CATATAN: Pastikan untuk menambahkan variable environment di .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gunakan App Password jika menggunakan Gmail
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "lyonerena@gmail.com",
      subject: `Laporan Bug BikinKarya dari @${username || "Anonymous"}`,
      text: `Laporan Bug dari @${username || "Anonymous"}\n\nDetail Bug:\n${message}`,
    };

    // Jika SMTP tidak di-set up, kita log ke console saja agar tidak crash
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ SMTP credentials not found in .env! Logging feedback instead:");
      console.log(mailOptions);
    } else {
      await transporter.sendMail(mailOptions);
    }

    return ok({ message: "Feedback sent successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    return err("Gagal mengirim feedback", 500);
  }
}
