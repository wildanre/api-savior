import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Create 10 dummy Users
    const users = await Promise.all(
        Array.from({ length: 10 }).map(() =>
            prisma.user.create({
                data: {
                    name: `User ${Math.floor(Math.random() * 1000)}`,
                    email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
                    password: 'password123',
                    role: Math.random() > 0.5 ? 'user' : 'admin',
                    phoneNumber: `08123456789${Math.floor(Math.random() * 10)}`,
                    address: '123 Random St.',
                    age: Math.floor(Math.random() * 50) + 18,
                    gender: Math.random() > 0.5 ? 'male' : 'female',
                },
            })
        )
    );

    // Create 3 dummy Tokos
    const tokos = await Promise.all(
        Array.from({ length: 3 }).map(() =>
            prisma.toko.create({
                data: {
                    nama: `Toko ${Math.floor(Math.random() * 1000)}`,
                    alamat: `Alamat Toko ${Math.floor(Math.random() * 100)}`,
                    imageUrl: `https://example.com/toko${Math.floor(Math.random() * 100)}.jpg`,
                },
            })
        )
    );

    // Create 10 dummy Barangs related to Tokos
    const barangs = await Promise.all(
        tokos.flatMap(toko =>
            Array.from({ length: 3 }).map(() =>
                prisma.barang.create({
                    data: {
                        nama: `Barang ${Math.floor(Math.random() * 1000)}`,
                        harga: Math.floor(Math.random() * 100000) + 1000,
                        stok: Math.floor(Math.random() * 100) + 1,
                        imageUrl: `https://example.com/barang${Math.floor(Math.random() * 100)}.jpg`,
                        tokoId: toko.id,
                    },
                })
            )
        )
    );

    // Create 3 dummy Bank Sampah
    const bankSampahs = await Promise.all(
        Array.from({ length: 3 }).map(() =>
            prisma.bankSampah.create({
                data: {
                    name: `Bank Sampah ${Math.floor(Math.random() * 1000)}`,
                    location: `Lokasi Bank Sampah ${Math.floor(Math.random() * 100)}`,
                },
            })
        )
    );

    // Create 10 dummy Sampah items related to Bank Sampah
    const sampahs = await Promise.all(
        bankSampahs.flatMap(bankSampah =>
            Array.from({ length: 2 }).map(() =>
                prisma.sampah.create({
                    data: {
                        category: `Category ${Math.floor(Math.random() * 5)}`,
                        price: Math.floor(Math.random() * 10000) + 500,
                        bankSampahId: bankSampah.id,
                    },
                })
            )
        )
    );

    console.log('Seed data created successfully!');
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
