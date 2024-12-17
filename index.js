import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'Hesoyam';

app.post('/signup', async (req, res) => {
  const { name, email, password, role, phoneNumber, address, age, point, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        phoneNumber,
        address,
        age,
        point: point || 0,
        gender,
      },
    });

    res.status(201).json({ message: 'User created successfully.', user: result });
  } catch (error) {
    res.status(500).json({ error: 'User creation failed.', details: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful.', token, user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.', details: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phoneNumber: true,
        address: true,
        age: true,
        point: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.', details: error.message });
  }
});

app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, phoneNumber, address, age, point, gender } = req.body;

  try {
    // Jika password diberikan, kita hash password baru
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        password: hashedPassword || undefined,  // Gunakan password baru hanya jika diberikan
        role,
        phoneNumber,
        address,
        age,
        point,
        gender,
      },
    });

    res.json({ message: 'User updated successfully.', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.', details: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error: ', error);  // Log error untuk debugging
    res.status(500).json({ error: 'Failed to delete user.', details: error.message });
  }
});



// CRUD untuk Toko
app.post('/toko', async (req, res) => {
  const { nama, alamat, imageUrl } = req.body;

  if (!nama || !alamat || !imageUrl) {
    return res.status(400).json({ error: 'Nama, alamat, dan imageUrl diperlukan.' });
  }

  try {
    const toko = await prisma.toko.create({
      data: {
        nama,
        alamat,
        imageUrl,
      },
    });
    res.status(201).json({ message: 'Toko berhasil dibuat.', toko });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat toko.', details: error.message });
  }
});

app.get('/toko', async (req, res) => {
  try {
    const tokos = await prisma.toko.findMany({
      include: {
        barang: true,
      },
    });
    res.json(tokos);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil daftar toko.', details: error.message });
  }
});

app.put('/toko/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, alamat, imageUrl } = req.body;

  try {
    const toko = await prisma.toko.update({
      where: { id },
      data: { nama, alamat, imageUrl },
    });
    res.json({ message: 'Toko berhasil diperbarui.', toko });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui toko.', details: error.message });
  }
});

app.delete('/toko/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.toko.delete({ where: { id } });
    res.json({ message: 'Toko berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus toko.', details: error.message });
  }
});

// CRUD untuk Barang
app.post('/barang', async (req, res) => {
  const { nama, harga, stok, imageUrl, tokoId } = req.body;

  if (!nama || harga === undefined || stok === undefined || !imageUrl || !tokoId) {
    return res.status(400).json({ error: 'Nama, harga, stok, imageUrl, dan tokoId diperlukan.' });
  }

  try {
    const barang = await prisma.barang.create({
      data: {
        nama,
        harga,
        stok,
        imageUrl,
        tokoId,
      },
    });
    res.status(201).json({ message: 'Barang berhasil dibuat.', barang });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat barang.', details: error.message });
  }
});

app.get('/barang', async (req, res) => {
  try {
    const barangs = await prisma.barang.findMany({
      include: {
        toko: true,
      },
    });
    res.json(barangs);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil daftar barang.', details: error.message });
  }
});

app.put('/barang/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, harga, stok, imageUrl } = req.body;

  try {
    const barang = await prisma.barang.update({
      where: { id },
      data: { nama, harga, stok, imageUrl },
    });
    res.json({ message: 'Barang berhasil diperbarui.', barang });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui barang.', details: error.message });
  }
});

app.delete('/barang/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.barang.delete({ where: { id } });
    res.json({ message: 'Barang berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus barang.', details: error.message });
  }
});

// CRUD untuk BankSampah
app.post('/bank-sampah', async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required.' });
  }

  try {
    const bankSampah = await prisma.bankSampah.create({
      data: {
        name,
        location,
      },
    });
    res.status(201).json({ message: 'Bank Sampah created successfully.', bankSampah });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Bank Sampah.', details: error.message });
  }
});

app.get('/bank-sampah', async (req, res) => {
  try {
    const bankSampahs = await prisma.bankSampah.findMany({
      include: {
        sampah: true,  // Include Sampah related to the BankSampah
      },
    });
    res.json(bankSampahs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Bank Sampah.', details: error.message });
  }
});

app.put('/bank-sampah/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    const bankSampah = await prisma.bankSampah.update({
      where: { id },
      data: { name, location },
    });
    res.json({ message: 'Bank Sampah updated successfully.', bankSampah });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Bank Sampah.', details: error.message });
  }
});

app.delete('/bank-sampah/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.bankSampah.delete({ where: { id } });
    res.json({ message: 'Bank Sampah deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Bank Sampah.', details: error.message });
  }
});

// CRUD untuk Sampah
app.post('/sampah', async (req, res) => {
  const { category, price, bankSampahId } = req.body;

  if (!category || price === undefined || !bankSampahId) {
    return res.status(400).json({ error: 'Category, price, and bankSampahId are required.' });
  }

  try {
    const sampah = await prisma.sampah.create({
      data: {
        category,
        price,
        bankSampahId,
      },
    });
    res.status(201).json({ message: 'Sampah created successfully.', sampah });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Sampah.', details: error.message });
  }
});

app.get('/sampah', async (req, res) => {
  try {
    const sampahs = await prisma.sampah.findMany({
      include: {
        bankSampah: true,  // Include related Bank Sampah
      },
    });
    res.json(sampahs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Sampah.', details: error.message });
  }
});

app.put('/sampah/:id', async (req, res) => {
  const { id } = req.params;
  const { category, price } = req.body;

  try {
    const sampah = await prisma.sampah.update({
      where: { id },
      data: { category, price },
    });
    res.json({ message: 'Sampah updated successfully.', sampah });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Sampah.', details: error.message });
  }
});

app.delete('/sampah/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.sampah.delete({ where: { id } });
    res.json({ message: 'Sampah deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Sampah.', details: error.message });
  }
});

// CRUD for Pelaporan
app.post('/pelaporan', async (req, res) => {
  const { name, userId, judul, address, description, imageUrl } = req.body;

  if (!userId || !judul || !address || !description || !imageUrl) {
    return res.status(400).json({ error: 'User ID, judul, address, description, and imageUrl are required.' });
  }

  try {
    const pelaporan = await prisma.pelaporan.create({
      data: {
        name,
        userId,
        judul,
        address,
        description,
        imageUrl,
      },
    });
    res.status(201).json({ message: 'Pelaporan created successfully.', pelaporan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Pelaporan.', details: error.message });
  }
});

app.get('/pelaporan', async (req, res) => {
  const { userId } = req.query; 

  try {
    const pelaporans = await prisma.pelaporan.findMany({
      where: userId ? { userId: parseInt(userId) } : undefined,
      include: {
        name: true,
      },
    });
    res.json(pelaporans);
  } catch (error) {
    console.error('Error fetching pelaporan:', error);
    res.status(500).json({ error: 'Failed to fetch Pelaporan.', details: error.message });
  }
});


app.put('/pelaporan/:id', async (req, res) => {
  const { id } = req.params; // UUID tetap dalam format string
  const updateData = req.body;

  try {
    // Validasi status
    const validStatuses = ['sent', 'reviewed', 'completed', 'rejected'];
    if (updateData.status && !validStatuses.includes(updateData.status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    // Update data
    const pelaporan = await prisma.pelaporan.update({
      where: { id }, // Gunakan kolom mapped "_id" melalui Prisma
      data: updateData,
    });

    res.status(200).json({ message: 'Pelaporan updated successfully.', pelaporan });
  } catch (error) {
    console.error('Error updating pelaporan:', error.message);
    res.status(500).json({ error: 'Failed to update Pelaporan.', details: error.message });
  }
});


app.delete('/pelaporan/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pelaporan.delete({
      where: { id }, // id adalah UUID (string)
    });
    res.json({ message: 'Pelaporan deleted successfully.' });
  } catch (error) {
    console.error('Error deleting Pelaporan:', error.message);
    res.status(500).json({ error: 'Failed to delete Pelaporan.', details: error.message });
  }
});


app.get('/pelaporan/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pelaporan = await prisma.pelaporan.findUnique({
      where: { id: parseInt(id) },
      include: {
        name: true, // Include user info if needed
      },
    });

    if (!pelaporan) {
      return res.status(404).json({ error: 'Pelaporan not found.' });
    }

    res.json(pelaporan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Pelaporan details.', details: error.message });
  }
});

// Create (POST) a new Penukaran
app.post('/penukaran', async (req, res) => {
  try {
    const { userId, sampahId, bankSampahId, amount, earned } = req.body;
    const newPenukaran = await prisma.penukaran.create({
      data: {
        userId,
        sampahId,
        bankSampahId,
        amount,
        earned,
      },
    });
    res.status(201).json(newPenukaran);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create penukaran' });
  }
});

// GET all penukaran dengan filter berdasarkan status dan tanggal
app.get('/penukaran', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, page, limit, userId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const penukarans = await prisma.penukaran.findMany({
      where: {
        ...(userId && { userId: parseInt(userId) }), // Filter berdasarkan userId
        ...(status && { status }),
        ...(dateFrom && dateTo && {
          dateCreated: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        }),
      },
      include: {
        name: true,
        category: true,
        bankSampah: true,
      },
      skip: offset,
      take: parseInt(limit) || 10,
    });

    res.status(200).json(penukarans);
  } catch (error) {
    console.error('Error in /penukaran:', error); // Tambahkan log error
    res.status(500).json({ error: 'Failed to fetch penukaran' });
  }
});



// Read (GET) a single Penukaran by ID
app.get('/penukaran/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const penukaran = await prisma.penukaran.findUnique({
      where: { id: parseInt(id) },
    });
    if (!penukaran) {
      return res.status(404).json({ error: 'Penukaran not found' });
    }
    res.status(200).json(penukaran);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch penukaran' });
  }
});

// Update status penukaran

app.put('/penukaran/:id', async (req, res) => {
  const { id } = req.params;
  const { status, earned } = req.body;

  try {
    // Cari penukaran berdasarkan ID
    const penukaran = await prisma.penukaran.findUnique({
      where: { id },
    });

    if (!penukaran) {
      return res.status(404).json({ error: 'Penukaran tidak ditemukan.' });
    }

    if (penukaran.status === 'cancelled') {
      return res.status(400).json({ error: 'Status sudah cancelled, tidak bisa diubah.' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Validasi earned
    if (status === 'success' && (!earned || isNaN(earned) || earned <= 0)) {
      return res.status(400).json({ error: 'Earned is invalid' });
    }

    // Perbarui status transaksi di database
    const updatedPenukaran = await prisma.penukaran.update({
      where: { id },
      data: { status },
    });

    // Jika status berubah menjadi "success", perbarui poin pengguna terkait
    if (status === 'success' && earned) {
      const user = await prisma.user.update({
        where: { id: updatedPenukaran.userId },
        data: {
          point: {
            increment: earned,
          },
        },
      });
      console.log('Updated user:', user); // Debug output untuk pengguna
    }

    res.status(200).json({
      message: 'Status dan poin berhasil diperbarui',
      penukaran: updatedPenukaran,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui status atau poin' });
  }
});


// Delete (DELETE) a Penukaran by ID
app.delete('/penukaran/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.penukaran.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete penukaran' });
  }
});

// CRUD untuk Payment
app.post('/payment', async (req, res) => {
  const { userId, tokoId, barangId, totalPrice } = req.body;

  console.log('Request body:', req.body);

  if (!userId || !tokoId || !barangId || totalPrice === undefined) {
    return res.status(400).json({ error: 'userId, tokoId, barangId, dan totalPrice diperlukan.' });
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        userId,
        tokoId,
        barangId,
        totalPrice,
      },
    });
    res.status(201).json({ message: 'Payment berhasil dibuat.', payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Gagal membuat payment.', details: error.message });
  }
});

app.get('/payment', async (req, res) => {
  const { userId } = req.query;

  try {
    const payments = await prisma.payment.findMany({
      where: userId ? { userId: parseInt(userId) } : undefined,
      include: {
        user: true,
        toko: true,
        barang: true,
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Gagal mengambil daftar payment.', details: error.message });
  }
});


// Update untuk pembaruan status pembayaran
app.put('/payment/:id', async (req, res) => {
  const { id } = req.params;
  const { status, totalPrice } = req.body;

  try {
    // Cek status pembayaran sebelum melakukan update
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment tidak ditemukan.' });
    }

    if (payment.status === 'cancelled') {
      return res.status(400).json({ error: 'Status sudah cancelled, tidak bisa diubah.' });
    }

    // Update status pembayaran
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    // Jika status diubah menjadi "success", kurangi poin pengguna
    if (status === 'success' && totalPrice) {
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          point: {
            decrement: totalPrice,
          },
        },
      });
    }

    res.json({ message: 'Payment berhasil diperbarui.', payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui payment.', details: error.message });
  }
});


app.delete('/payment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.payment.delete({
      where: { id },
    });
    res.json({ message: 'Payment berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus payment.', details: error.message });
  }
});


const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
);

export default app;
