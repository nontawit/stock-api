const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware เพื่อให้ Express อ่านข้อมูล JSON ได้
app.use(express.json());

// เส้นทางพื้นฐาน
app.get('/', (req, res) => {
    res.send('API is working');
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//ดึงสินค้าทั้งหมด
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.stock');
        res.json(result.rows);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;