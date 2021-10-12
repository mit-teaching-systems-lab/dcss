exports.getRedisConfig = function() {
  // This is the environment variable Heroku exposes
  const url = process.env.REDIS_URL || null;
  if (url) {
    const settings = process.env.STAGING ? {
      ssl: {
        rejectUnauthorized: false
      },
      sslmode: 'require'
    } : {
      tls: {
        rejectUnauthorized: false
      }
    };

    return {
      ...settings,
      url
    };
  }

  return { host: 'localhost', port: 6379 };
};
