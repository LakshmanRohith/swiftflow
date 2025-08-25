// // path: server/src/index.ts

// import express from 'express';
// import 'dotenv/config';
// import cors from 'cors';
// import helmet from 'helmet';
// import { errorHandler } from './utils/errorHandler';
// import authRoutes from './api/auth/auth.routes';
// import projectRoutes from './api/projects/projects.routes';
// import { taskRouter } from './api/tasks/tasks.routes';
// import { requireAuth } from './middleware/requireAuth';


// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- Global Middleware ---
// // Enable CORS for all routes
// app.use(cors());
// // Set various HTTP headers for security
// app.use(helmet());
// // Parse incoming JSON requests
// app.use(express.json());
// // Parse URL-encoded data
// app.use(express.urlencoded({ extended: true }));


// // --- API Routes ---
// app.get('/', (req, res) => {
//   res.send('SwiftFlow API is running!');
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', requireAuth, taskRouter);

// // --- Error Handling ---
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
// path: server/src/index.ts

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './utils/errorHandler';
import authRoutes from './api/auth/auth.routes';
import projectRoutes from './api/projects/projects.routes';
import { taskRouter } from './api/tasks/tasks.routes';
import { requireAuth } from './middleware/requireAuth';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',               // local frontend
        'https://swiftflow-omega.vercel.app'  // Vercel frontend
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // allows cookies/auth headers
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // logs requests

// --- API Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'SwiftFlow API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', requireAuth, taskRouter);

// --- Error Handling ---
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
