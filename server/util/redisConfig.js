exports.getRedisConfig = function() {
  // This is the environment variable Heroku exposes
  const url = process.env.REDIS_URL || null;
  if (url) {
    const settings = {
      ssl: {
        rejectUnauthorized: false
      }
    };

    if (process.env.STAGING) {
      settings.sslmode = 'require';
    }

    return {
      ...settings,
      url
    };
  }

  return { host: 'localhost', port: 6379 };
};
