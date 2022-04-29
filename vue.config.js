module.exports = {
  devServer: {
    open: true,//是否自动打开浏览器
    port: 80,//启动端口号
    https: false,//是否开启https
    hotOnly: false,
      proxy: {
        '/api': {
          // target: 'http://121.37.174.212:8082/',
          target: 'http://127.0.0.1:8082/',
          ws: true,
          changeOrigin: true
          
        }
    }
      },
}
