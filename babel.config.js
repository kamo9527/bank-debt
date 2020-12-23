const addPlugins = [
  [
    '@nutui/babel-plugin-separate-import',
    {
      style: 'css',
    },
  ],
];
// if (process.env.NODE_ENV === 'production') {
//   addPlugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
// }
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: addPlugins,
};
