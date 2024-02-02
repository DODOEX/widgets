import { CodegenConfig } from '@graphql-codegen/cli';

// Config: https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config
console.log('jie', process.env.SCHEMA_URL);
const config: CodegenConfig = {
  schema: process.env.SCHEMA_URL,
  documents: ['src/**/*.{ts,tsx}', '!src/gql/**/*'],
  generates: {
    './src/gql/': {
      // https://the-guild.dev/graphql/codegen/plugins/presets/preset-client
      preset: 'client',
      plugins: [],
      config: {
        documentMode: 'string',
        skipTypename: true,
        enumsAsTypes: true,
      },
    },
  },
  ignoreNoDocuments: true,
  verbose: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
