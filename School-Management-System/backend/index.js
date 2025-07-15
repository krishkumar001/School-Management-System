import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from 'http';
import { Server } from 'socket.io';
import Routes from "./routes/route.js";
import bcrypt from 'bcrypt';
import Admin from './models/adminSchema.js';
import Teacher from './models/teacherSchema.js';
import Student from './models/studentSchema.js';
import Sclass from './models/sclassSchema.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

console.log('MONGO_URL:', process.env.MONGO_URL);

async function ensureDemoUsers() {
  // 1. Upsert demo admin
  let adminPassword = await bcrypt.hash('zxc', 10);
  let admin = await Admin.findOneAndUpdate(
    { email: 'yogendra@12' },
    {
      name: 'Demo Admin',
      email: 'yogendra@12',
      password: adminPassword,
      schoolName: 'Demo School',
      role: 'Admin'
    },
    { upsert: true, new: true }
  );

  // 2. Upsert demo class
  const sclass = await Sclass.findOneAndUpdate(
    { sclassName: '12', school: admin._id },
    {
      sclassName: '12',
      school: admin._id
    },
    { upsert: true, new: true }
  );

  // 3. Upsert demo teacher
  let teacherPassword = await bcrypt.hash('zxc', 10);
  await Teacher.findOneAndUpdate(
    { email: 'tony@12' },
    {
      name: 'Demo Teacher',
      email: 'tony@12',
      password: teacherPassword,
      school: admin._id,
      teachSclass: sclass._id,
      role: 'Teacher'
    },
    { upsert: true, new: true }
  );

  // 4. Upsert demo student
  let studentPassword = await bcrypt.hash('zxc', 10);
  await Student.findOneAndUpdate(
    { rollNum: 1, name: 'Deeepesh Awasthi' },
    {
      name: 'Deeepesh Awasthi',
      rollNum: 1,
      password: studentPassword,
      sclassName: sclass._id,
      school: admin._id,
      role: 'Student'
    },
    { upsert: true, new: true }
  );
}

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async () => {
        console.log("Connected to MongoDB");
        await ensureDemoUsers();
        app.use('/', Routes);

        // Socket.IO connection
        io.on('connection', (socket) => {
          console.log('A user connected:', socket.id);
          socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
          });
        });

        // Make io accessible in routes/controllers
        app.set('io', io);

        server.listen(process.env.PORT || 5000, () => {
          console.log('Server started on port', process.env.PORT || 5000);
        });
    })
    .catch((error) => console.log("NOT CONNECTED TO NETWORK", error));