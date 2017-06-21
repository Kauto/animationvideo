let mix = require('laravel-mix');

mix.webpackConfig({
  output: {
    libraryTarget: 'umd',
    umdNamedDefine: true,
    library: 'AnimationVideo'
  },
});

if (global.process.env.NODE_ENV === 'production') {
  mix.js('src/animationvideo.js', 'lib/animationvideo.min.js');
} else {
  mix.js('src/animationvideo.js', 'lib/');
}
