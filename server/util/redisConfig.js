exports.getRedisConfig = function() {
  // This is the environment variable Heroku exposes
  const url = process.env.REDIS_URL || null;
  if (url) {
    return {
      url,
      ssl: {
        rejectUnauthorized: false
      },
      sslmode: 'require'
    };
  }

  return { host: 'localhost', port: 6379 };
};
