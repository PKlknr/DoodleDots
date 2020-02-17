const cssnano = require('cssnano');
const postcss_color_mod = require('postcss-color-mod-function');
const postcss_preset_env = require('postcss-preset-env');
const postcss_Import = require('postcss-import');
const postcss_Url = require('postcss-url');
const purgecss = require('@fullhuman/postcss-purgecss');

const dev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    postcss_Import(),
    postcss_Url(),
    require('tailwindcss'),
    postcss_preset_env({
      stage: 0,
      autoprefixer: {
        grid: true,
      },
    }),
    0 && postcss_color_mod(),
    !dev && cssnano({
      autoprefixer: false,
      preset: ['default'],
    }),
    !dev &&
      purgecss({
        content: ['./**/*.html', './**/*.svelte'],
        whitelistPatterns: [/svelte-/],
        defaultExtractor: content => {
          const regExp = new RegExp(/[A-Za-z0-9-_:/]+/g);

          const matchedTokens = [];

          let match = regExp.exec(content);

          while (match) {
            if (match[0].startsWith('class:')) {
              matchedTokens.push(match[0].substring(6));
            } else {
              matchedTokens.push(match[0]);
            }

            match = regExp.exec(content);
          }

          return matchedTokens;
        },
      }),
  ],
};
