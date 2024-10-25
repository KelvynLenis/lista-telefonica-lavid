import { createClient } from 'redis';

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-12070.c308.sa-east-1-1.ec2.redns.redis-cloud.com',
    port: 12070
  }
});

