module.exports = {
  css:{
      // css预设器配置项 注意：在 sass-loader v7 中，这个选项名是 "data"
      loaderOptions: {
          sass: {
              data: `
                @import "@/assets/styles/index.scss";
              `
          }
      }
  },
  devServer: {
    host: 'localhost',
    port: '8200',
    disableHostCheck: true,
    open: false
  }
}