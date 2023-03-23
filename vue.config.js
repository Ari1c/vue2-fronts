const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
      transpileDependencies: true,
      lintOnSave:false,
    //   publicPath:'/fronts',
      assetsDir:"assets",
      outputDir:"dist",
      devServer:{
          host:"0.0.0.0",
          port:8080
        //   proxy:{
        //       '/api':{
        //           target:process.env.VUE_APP_SERVICE_URL,
        //           changeOrigin:true,
        //       }
        //   }
      },
      configureWebpack:{
          performance:{
              maxEntrypointSize:5000000,
              maxAssetSize:3000000    
          },
      },
  })
