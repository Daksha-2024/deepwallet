// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());



// // Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // # In backend folder
// // node src/index.js
// // # or for development with nodemon
// // npx nodemon src/index.js



const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// API routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// API test
app.get("/", (req, res) => {
  res.json({ message: "Backend running on Render 🚀" });
});

// // Serve Angular production build
// const distPath = path.join(__dirname, '../../frontend/web-app/dist/web-app');
// app.use(express.static(distPath));

// // Wildcard route to handle Angular routing
// app.use((req, res, next) => {
//   res.sendFile(path.join(distPath, 'index.html'));
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render requires SSL
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
