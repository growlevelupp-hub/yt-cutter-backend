import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint: download & cut video YouTube
app.post("/cut", (req, res) => {
  const { url, start, end } = req.body;

  if (!url) return res.status(400).json({ error: "URL YouTube wajib diisi" });

  const command = `yt-dlp -o - "${url}" | ffmpeg -i pipe:0 -ss ${start} -to ${end} -c copy output.mp4`;

  exec(command, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Video berhasil dipotong!", file: "output.mp4" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
