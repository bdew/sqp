import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylistic from "@stylistic/eslint-plugin";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    stylistic.configs["recommended"],
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
]);

export default eslintConfig;
