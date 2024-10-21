const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // ใช้ DATABASE_URL แทนการระบุทีละตัว
});

// Middleware เพื่อให้ Express อ่านข้อมูล JSON ได้
app.use(express.json());
app.use(cors());

// เส้นทางพื้นฐาน
app.get('/', (req, res) => {
    res.send('API is working');
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//ดึงสินค้าทั้งหมด
app.get('/all', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM public.stock');
        res.json(result.rows);
    } catch (error) {
        console.error('Connection error:', error);
        res.status(500).json({ error: 'Connection error' });
    } finally {
        client.release();
    }
});


module.exports = app;