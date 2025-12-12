module.exports = {
  apps: [{
    name: "certkraft-lms",
    script: "./server/index.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: '1G'
  }]
};