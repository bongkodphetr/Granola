const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const port = 3001;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add connection handling
prisma.$connect()
    .then(() => {
        console.log('Successfully connected to database');
    })
    .catch((error) => {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    });

app.get('/check-db-connection', async (req,res)=>{
    try{
        await prisma.$connect();
        res.send({message: "DB Connected"});
    }catch(error){
        res.status(500).send({error: "Cannot Connect DB"});
    }
})
app.post('/customer/create', async (req,res)=>{
    try {
        const payload = req.body;
        
        // Add validation for required fields
        if (!payload) {
            return res.status(400).json({ error: 'Request body is required' });
        }

        const customer = await prisma.customer.create({
            data: payload
        });
        
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({
            error: 'Failed to create customer',
            details: error.message
        });
    }
})

// Add cleanup on app shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});