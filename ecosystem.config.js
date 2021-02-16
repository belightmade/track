module.exports = {
  apps: [
    {
      name: 'track-prod',
      script: 'nuxt',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',

      env: {
        HOST: '127.0.0.1',
        PORT: 3000,
        NODE_ENV: 'production',
      },

      output: './logs/console.log',
      error: './logs/consoleError.log',
    },
  ],
}
