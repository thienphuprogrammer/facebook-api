import { RedisOptions } from 'ioredis';

export const redisUrlParser = (url: string): RedisOptions => {
  if (url.includes('://:')) {
    const arr = url.split('://:')[1].split('@');
    const secondArr = arr[1].split(':');

    return {
      host: secondArr[0],
      port: parseInt(secondArr[1], 10),
      password: arr[0],
    };
  }

  const connectString = url.split('://')[1];
  const arr = connectString.split(':');
  return {
    host: arr[0],
    port: parseInt(arr[1], 10),
  };
};
