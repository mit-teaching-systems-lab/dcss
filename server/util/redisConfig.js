exports.getRedisConfig = function() {
  // This is the environment variable Heroku exposes
  const url = process.env.REDIS_URL || null;
  if (url) {
    return process.env.STAGING ? {
      url,
      ssl: {
        rejectUnauthorized: false
      },
      sslmode: 'require'
    } : url;
  }

  return { host: 'localhost', port: 6379 };
};
