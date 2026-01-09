export default {
  locales: ['en-US', 'zh-CN'],
  orderBy: 'messageId',
  sourceLocale: 'en-US',
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src'],
    },
  ],
  format: 'po',
  // Uncomment if using Translation.io service
  // service: {
  //   name: 'TranslationIO',
  //   apiKey: process.env.LINGUI_KEY,
  // },
};
