// import js from "@eslint/js";

// export default [
//     js.configs.recommended,
//     {
//         rules: {
//             "no-unused-vars": "warn",
//             "no-undef": "warn"
//         }
//     }
// ];

import js from "@eslint/js";
import globals from "globals"; //

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node // Adds process, console, etc.
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn"
        }
    }
];