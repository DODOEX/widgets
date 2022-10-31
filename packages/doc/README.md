
## Usage

**Development**

`yarn workspace doc storybook`

- Build app continuously (HMR enabled)
- App served @ `http://localhost:6006`

**Production**

`yarn workspace doc build-storybook`

- Build app once (HMR disabled) to `/storybook-static/`


## tips

1. Webpack config：

Modify `webpackFinal` in `src/.storybook/main.js`

- [Storybook webpack](https://storybook.js.org/docs/react/configure/webpack#gatsby-focus-wrapper)


2. The root node in render doc:

Modify `decorators` in `src/.storybook/preview.js` 