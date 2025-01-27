const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;
const { PrismaClient } = require('@prisma/client');

// สร้าง Prisma Client instance พร้อม log
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ทดสอบการเชื่อมต่อ DB
app.get('/check-db-connection', async (req,res)=>{
    try{
        await prisma.$connect();
        res.send({message: "DB Connected"});
    }catch(error){
        console.error('DB Connection error:', error);
        res.status(500).send({error: "Cannot Connect DB"});
    }
})

// สร้าง Customer
app.post('/customer/create', async (req,res)=>{
    try{
        const { name, email, phone } = req.body;
        
        // เช็คข้อมูลที่จำเป็น
        if (!name || !email || !phone) {
            return res.status(400).json({
                error: "กรุณากรอกข้อมูลให้ครบ (name, email, phone)"
            });
        }

        // สร้าง customer โดยระบุ field ชัดเจน
        const customer = await prisma.customer.create({
            data: {
                name: name,
                email: email,
                phone: phone
            }
        });

        return res.status(201).json(customer);
    }catch(error){
        console.error('Create customer error:', error);
        return res.status(500).json({
            error: "ไม่สามารถสร้าง customer ได้",
            details: error.message
        });
    }
})

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});