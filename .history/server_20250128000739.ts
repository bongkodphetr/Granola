const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check-db-connection', async (req,res)=>{
    try{
        await prisma.$connect();
        res.send({message: "DB Connected1"});
    }catch(error){
        res.status(500).send({error: "Cannot Connect DB"});
    }
})
app.post('/customer/create', async (req,res)=>{
    try{
        const payload = req.body;
        const customer = await prisma.customer.create({
            data:payload
        });
        res.json(customer);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
})
app.get('/customer/list', async (req,res)=>{
    try{
        const customers = await prisma.customer.findMany();
        res.json(customers);
    }catch(error){
        return res.status(500).send({error: error.message});
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});