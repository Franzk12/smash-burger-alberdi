module.exports = {
  apps: [
    {
      name: "smash-bot",
      script: "bot.js",
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: "10s",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
