module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'prettier'],
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'prettier'
    ],
    rules: {
      // Prettier se encarga del formato
      'prettier/prettier': 'error',
  
      // Reglas útiles
      'react/react-in-jsx-scope': 'off', // Next.js no requiere React import
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/prop-types': 'off', // no usamos PropTypes en TS
    },
  };
  