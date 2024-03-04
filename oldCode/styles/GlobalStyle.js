import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            color: unset;
            }

            body {
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                textarea:-webkit-autofill,
                textarea:-webkit-autofill:hover,
                textarea:-webkit-autofill:focus {
                -webkit-box-shadow: none !important;
            }
        }
    }
`;
