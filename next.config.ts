const nextConfig = {
  transpilePackages: ['@ungdev/rich-turbo-editor'],
  turbopack: {
    resolveAlias: {
      '@ungdev/rich-turbo-editor': './node_modules/@ungdev/rich-turbo-editor/dist/src/browser.jsx',
    },
  },
};

module.exports = nextConfig;
