module.exports = {
    apps: [{
        name: 'home_system',
        script: './bin/www',
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: true,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            PORT: 3000,

        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 4874,
        }
    }]
}