require("dotenv").config();
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
// const bodyParser = require("body-parser")
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
const Routes = require("./routes/route.js")
const bcrypt = require('bcrypt');
const Admin = require('./models/adminSchema');
const Teacher = require('./models/teacherSchema');
const Student = require('./models/studentSchema');
const Sclass = require('./models/sclassSchema');

const PORT = process.env.PORT || 5000

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

console.log('MONGO_URL:', process.env.MONGO_URL);

async function ensureDemoUsers() {
  // 1. Upsert demo admin
  let admin = await Admin.findOne({ email: 'yogendra@12' });
  let adminPassword = admin && admin.password && admin.password.startsWith('$2b$') ? admin.password : await bcrypt.hash('zxc', 10);
  admin = await Admin.findOneAndUpdate(
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
  let teacher = await Teacher.findOne({ email: 'tony@12' });
  let teacherPassword = teacher && teacher.password && teacher.password.startsWith('$2b$') ? teacher.password : await bcrypt.hash('zxc', 10);
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
  let student = await Student.findOne({ rollNum: 1, name: 'Deeepesh Awasthi' });
  let studentPassword = student && student.password && student.password.startsWith('$2b$') ? student.password : await bcrypt.hash('zxc', 10);
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
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))