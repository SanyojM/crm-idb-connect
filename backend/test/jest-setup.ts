// test/jest-setup.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load the .env file from the root of the backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });