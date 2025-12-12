module.exports = {
  apps: [{
    name: "certkraft-lms",
    script: "./server/index.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};