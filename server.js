import express from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 5000;

// untuk simpan file sementara
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// endpoint tes
app.get("/", (req, res) => {
  res.send("✅ Backend YT Cutter aktif!");
});

// endpoint download youtube
app.get("/download", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send("URL YouTube diperlukan!");
  }

  const outputPath = path.join(__dirname, "video.mp4");

  exec(`yt-dlp -f mp4 -o "${outputPath}" "${videoUrl}"`, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Gagal download video.");
    }

    res.download(outputPath, "video.mp4", () => {
      fs.unlinkSync(outputPath); // hapus setelah dikirim
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
