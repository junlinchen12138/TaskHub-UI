const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');

module.exports = [
    react.configs.recommended,
    reactHooks.configs.recommended,
    jsxA11y.configs.recommended,
];
