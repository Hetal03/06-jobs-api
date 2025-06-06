require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const cors = require('cors');
require('express-async-errors');


const helmet = require('helmet');

const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');


const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const authMiddleware = require('./middleware/authentication');



const app = express();

app.use(express.json());

// Security Middleware
app.set('trust proxy', 1); // required for rate limiting on Render
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 min
}));

app.use(helmet());     // Secure HTTP headers
app.use(cors());       // Enable CORS
app.use(xss());        // Prevent XSS


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const corsOptions = {
  origin: ['http://localhost:3000'], // Frontend or Swagger origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// Error handling middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use('/api/v1/jobs', authMiddleware, jobsRouter);



// Middleware
//app.use(express.json());



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


// Route handlers
//app.get('/', (req, res) => {
//  res.send('jobs api');
//});

app.use(express.static('public'));


app.use('/api/v1/auth', authRouter);
//app.use('/api/v1/jobs', jobsRouter);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
