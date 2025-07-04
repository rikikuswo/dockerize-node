const app = require('../../app');
const http = require('http');
const { connectMongoDB } = require('../db/db'); // Sesuaikan path relatif

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  await connectMongoDB(); // Pastikan koneksi MongoDB berhasil sebelum server berjalan
});