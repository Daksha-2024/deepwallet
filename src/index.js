const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const pool = require('../src/config/db'); // ✅ auto-select local or Render
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// 🔹 User API routes
app.use('/api/users', userRoutes);

// 🔹 Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

// 🔹 DB health-check route
app.get("/db-check", async (req, res) => {
  try {
    const tablesResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    );

    // Optional: Get row count per table
    const rowCounts = {};
    for (let row of tablesResult.rows) {
      const tableName = row.table_name;
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
      rowCounts[tableName] = parseInt(countResult.rows[0].count, 10);
    }

    res.json({
      status: 'ok',
      db: process.env.NODE_ENV === 'production' ? 'Render Internal' : 'Local/External',
      tables: tablesResult.rows.map(r => r.table_name),
      rowCounts,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// require('dotenv').config();

// const pool = require('../src/config/db'); // ✅ will auto-select local or Render
// const userRoutes = require('./routes/userRoutes');

// const app = express();
 
// app.use(helmet());
// app.use(morgan('combined'));
// app.use(cors());
// app.use(express.json());

// app.use('/api/users', userRoutes);

// app.get("/", (req, res) => {
//   res.json({ message: "Backend running 🚀" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
