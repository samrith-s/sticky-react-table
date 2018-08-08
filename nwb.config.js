module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
  webpack: {
    html: {
      template: 'public/index.html',
      title: `React Sticky Table - ${process.env.npm_package_version}`
    },
    rules: {
      postcss: {
        plugins: [require('precss')(), require('autoprefixer')()]
      },
      sass: {
        modules: true,
        localIdentName: '[hash:base64:5]'
      }
    },
    styles: {
      sass: [
        {
          sass: {
            modules: true,
            localIdentName: '[hash:base64:5]',
            sourceMap: true
          }
        }
      ]
    }
  }
};
