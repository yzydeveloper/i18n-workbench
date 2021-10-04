module.exports = {
    extends: '@antfu/eslint-config',
    overrides: [
        {
            files: ['*.js', '*.ts'],
            rules: {
                'no-debugger': 'off',
                'no-console': 0,
                'template-curly-spacing': 'off',
                'indent': ['error', 4, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] }],
                'max-len': ['error', { code: 180 }],
                'linebreak-style': 0,
                'arrow-parens': 0,
                'generator-star-spacing': 0,
                'operator-linebreak': ['error', 'before'],
                'eol-last': 0,
                'global-require': 0,
                'semi': ['error', 'never'],
                'comma-dangle': ['error', 'only-multiline'],
                'no-underscore-dangle': 0,
                'space-before-function-paren': [0, 'always'],
                'keyword-spacing': 0,
                'no-new': 0,
                'default-case': 0,
                'no-unused-expressions': [
                    'error',
                    {
                        allowShortCircuit: true,
                        allowTernary: true,
                    },
                ],
                'no-param-reassign': [
                    'error',
                    {
                        props: false,
                    },
                ],
                'no-plusplus': [
                    'error',
                    {
                        allowForLoopAfterthoughts: true,
                    },
                ],
                'no-confusing-arrow': [
                    'error',
                    {
                        allowParens: true,
                    },
                ],
                'no-mixed-operators': 0,
                'no-bitwise': 0,
                'import/no-unresolved': 'off',
                'import/extensions': 'off',
                'import/first': 'off',
                'import/no-dynamic-require': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/named': 'off',
                'import/no-named-as-default': 'off',
                'import/no-named-as-default-member': 'off',
                'import/no-duplicates': 'off',
                'import/no-cycle': 'off',
                'import/order': 'off',
                'import/no-self-import': 'off',
                'import/no-useless-path-segments': 'off',
                'class-methods-use-this': 'off',
                'max-classes-per-file': 'off',
                '@typescript-eslint/indent': ['error', 4]
            },
        },
    ],
}
