import { CodegenConfig } from '@graphql-codegen/cli';

// Config: https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config
const config: CodegenConfig = {
  schema: './src/uniswap-data-api/schema.graphql',
  documents: ['src/services/ammv3/queries.ts'],
  generates: {
    './src/uniswap-data-api/': {
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
