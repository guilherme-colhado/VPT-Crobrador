import styled from "styled-components";

export const LoginShell = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

export const LoginGrid = styled.section`
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px);
  gap: 24px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const SideCopy = styled.div`
  padding: 36px;
  border-radius: 32px;
  background:
    radial-gradient(circle at top right, rgba(247, 166, 0, 0.28), transparent 26%),
    linear-gradient(135deg, rgba(8, 18, 47, 0.98), rgba(18, 45, 102, 0.96));
  color: #f6f8ff;
  box-shadow: 0 28px 60px rgba(5, 12, 28, 0.3);

  span {
    display: block;
    font-size: 0.82rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #ffd36e;
  }

  h1 {
    margin: 18px 0 14px;
    font-size: clamp(2.1rem, 4vw, 3.5rem);
    line-height: 0.98;
  }

  p {
    max-width: 560px;
    color: rgba(246, 248, 255, 0.78);
    line-height: 1.7;
  }
`;

export const LogoMark = styled.div`
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 1.7rem;
  font-weight: 700;
`;

export const AccentCard = styled.div`
  margin-top: 28px;
  padding: 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);

  strong {
    display: block;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
  }
`;

export const LoginCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px;
  border-radius: 32px;
  background: linear-gradient(180deg, rgba(8, 19, 46, 0.92), rgba(10, 27, 63, 0.88));
  border: 1px solid rgba(130, 163, 255, 0.14);
  box-shadow: 0 24px 50px rgba(3, 9, 24, 0.28);
  backdrop-filter: blur(14px);

  span {
    display: block;
    margin-bottom: 8px;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8e5f00;
  }

  h2 {
    margin: 0;
    color: #eef4ff;
    font-size: 2rem;
  }

  p {
    margin: 12px 0 0;
    color: rgba(219, 230, 255, 0.72);
    line-height: 1.6;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #dce8ff;
    font-weight: 600;
  }

  input {
    min-height: 50px;
    padding: 0 15px;
    border-radius: 16px;
    border: 1px solid rgba(130, 163, 255, 0.14);
    background: rgba(5, 16, 39, 0.9);
    color: #edf3ff;
    outline: none;

    &:focus {
      border-color: rgba(247, 166, 0, 0.8);
      box-shadow: 0 0 0 4px rgba(247, 166, 0, 0.12);
    }
  }
`;

export const ErrorText = styled.div`
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(219, 76, 76, 0.16);
  color: #ffb4b4;
  font-weight: 600;
`;

export const LoginButton = styled.button`
  min-height: 52px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #13203e, #274b8f);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 18px 34px rgba(19, 32, 62, 0.24);

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;
