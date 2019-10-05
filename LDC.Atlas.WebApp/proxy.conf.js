const PROXY_CONFIG = [
    {
        context: [
            "/*",
            "/api/v1/*"
        ],
        target: "http://ldcatlastst.westeurope.cloudapp.azure.com",
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
    }
]

module.exports = PROXY_CONFIG;