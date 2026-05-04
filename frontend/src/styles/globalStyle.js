import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    color-scheme: dark;
    --page-bg-top: #040b1d;
    --page-bg-middle: #0a1838;
    --page-bg-bottom: #07142f;
    --text-main: #edf3ff;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    color: var(--text-main);
    background:
      radial-gradient(circle at top left, rgba(247, 166, 0, 0.16), transparent 18%),
      radial-gradient(circle at top right, rgba(56, 107, 214, 0.18), transparent 24%),
      radial-gradient(circle at bottom left, rgba(27, 78, 179, 0.16), transparent 22%),
      linear-gradient(180deg, var(--page-bg-top), var(--page-bg-middle) 45%, var(--page-bg-bottom));
    min-height: 100vh;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 38px 38px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 85%);
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }
`;
