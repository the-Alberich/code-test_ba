import express from 'express';
import cors from 'cors';
import logRoutes from './routes/logRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // allow all origins
app.use(express.json());

app.use('/api', logRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
