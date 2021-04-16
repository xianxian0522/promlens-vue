const vueConfig = {
    publicPath: './',
    outputDir: 'dist',
    devServer: {
        host: '0.0.0.0',
        port: 4306,
        open: true,
        proxy: {
            '/api/v1': {
                target: 'http://prometheus.proxy.sumscope.com:8000',
                changeOrigin: true,
            },
        }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    }
}

module.exports = vueConfig
