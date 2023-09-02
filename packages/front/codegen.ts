import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../server/src/graphql/schema.graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/types.ts': {
      plugins: ['typescript'],
      config: {
        scalars: {
          Date: 'Date'
        }
      }
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.tsx',
        baseTypesPath: 'types.ts'
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        scalars: {
          Date: 'Date'
        }
      }
    }
  }
}

export default config
