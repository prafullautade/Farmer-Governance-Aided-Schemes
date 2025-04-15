  const express = require('express');
  const cors = require('cors');
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Importing route files
  const authRoutes = require('./routes/authRoutes');
  const cropRoutes = require('./routes/crops');
  const schemeRoutes = require('./routes/schemes');
  const schemeApplicationRoutes = require('./routes/applications');

  // Routes
  app.use('/auth', authRoutes);
  app.use('/api/crops', cropRoutes);
  app.use('/api/schemes', schemeRoutes);
  app.use('/api/applications', schemeApplicationRoutes);

  // Root route
  app.get('/', (req, res) => {
    res.send('Farmer Govt Scheme API Running...');
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
