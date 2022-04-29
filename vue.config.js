module.exports = {
  devServer: {
    open: true,//是否自动打开浏览器
    port: 80,//启动端口号
    https: false,//是否开启https
    hotOnly: false,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8081/',
          ws: true,
          changeOrigin: true
          
        }
    }
      },
}
