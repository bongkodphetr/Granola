const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/check-db-connectiob', async (req,res)=>{
    try{
        await prisma.$connect();
        res.send({message: "DB Connected"});
    }catch(error){
        res.status(500).send({error: "Cannot Connect DB"});
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});