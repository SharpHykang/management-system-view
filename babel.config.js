module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 注册路由懒加载插件
    '@babel/plugin-syntax-dynamic-import',
  ]
}