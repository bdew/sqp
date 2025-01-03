// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    compat.extends("plugin:react-hooks/recommended"),
    compat.extends("plugin:@next/next/recommended"),
    stylistic.configs["recommended-flat"],
    {
        rules: {
            "eqeqeq": "error",
            "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
            "@stylistic/semi": ["warn", "always"],
            "@stylistic/quotes": ["warn", "double"],
            "@stylistic/indent": ["warn", 4],
            "@stylistic/brace-style": ["warn", "1tbs"],
            "@stylistic/jsx-indent-props": ["warn", 4],
            "@stylistic/jsx-one-expression-per-line": "off",
            "@stylistic/member-delimiter-style": [
                "warn",
                {
                    multiline: {
                        delimiter: "semi",
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: "semi",
                        requireLast: false,
                    },
                    multilineDetection: "brackets",
                },
            ],
        },
    },
);
