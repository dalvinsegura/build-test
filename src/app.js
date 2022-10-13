import express  from 'express';
import morgan from 'morgan';
import pkg from '../package.json';

import membersRoutes from './routes/members.routes';
import customersRoutes from './routes/customers.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.set('pkg', pkg);

app.use(morgan('dev'));
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        version: app.get('pkg').version
    })
});

app.use('/api/members', membersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/auth', authRoutes);

export default app;
