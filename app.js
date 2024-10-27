import 'dotenv/config';
import express from 'express';
import sequelize from './configs/sequelize.config.js';

import AuthRoutes from './routes/auth.routes.js';
import FileRoutes from './routes/file.routes.js';
import { connectToChannel } from './configs/rabbitmq.config.js';
import initializeConsumers from './controllers/consumers/initial.js';

async function start() {
    const app = express();

    app.use(express.urlencoded());
    app.use(express.json());

    app.use('/api/v1', AuthRoutes);
    app.use('/api/v1', FileRoutes);

    app.use('/', (req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    const channel = await connectToChannel();
    await initializeConsumers(channel);

    await sequelize.sync({ alter: true });
    app.listen(3000);
}

start();
