require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    retry: {
      match: [/ETIMEDOUT/, /ECONNRESET/, /ECONNREFUSED/],
      max: 3
    }
});
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synchronized');
    
    setInterval(async () => {
      try {
        await sequelize.query('SELECT 1');
      } catch (err) {
        console.error('Keep-alive failed:', err);
      }
    }, 30000);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adRoutes = require('./routes/ads');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Not Found: ${req.method} ${req.path}`
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    fullError: process.env.NODE_ENV === 'development' ? err : undefined
  });

  if (err.name && err.name.startsWith('Sequelize')) {
    return handleSequelizeError(err, res);
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      details: {
        stack: err.stack,
        fullError: err
      }
    })
  });
});

function handleSequelizeError(err, res) {
  const errorType = err.name.replace('Sequelize', '');
  
  const errorMap = {
    ValidationError: {
      status: 400,
      message: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message,
        type: e.type,
        value: e.value
      }))
    },
    UniqueConstraintError: {
      status: 409,
      message: 'Duplicate entry',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    },
    ForeignKeyConstraintError: {
      status: 400,
      message: 'Reference error',
      details: {
        table: err.table,
        field: err.fields.join(', '),
        message: err.parent.sqlMessage
      }
    }
  };

  const response = errorMap[errorType] || {
    status: 500,
    message: 'Database Error'
  };

  return res.status(response.status).json({
    success: false,
    error: response.message,
    details: response.details
  });
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  await testConnection();
  console.log(` Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    sequelize.close().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;