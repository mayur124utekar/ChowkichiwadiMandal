import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

import { app } from '../server/dist/app.js';

export default app;
