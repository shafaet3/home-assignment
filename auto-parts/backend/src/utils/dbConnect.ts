import { prisma } from '../db';

export const testDbConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};
