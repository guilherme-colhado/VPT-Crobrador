import styled from "styled-components";

export const FormCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(8, 19, 46, 0.95), rgba(10, 27, 63, 0.92));
  backdrop-filter: blur(14px);
  border: 1px solid rgba(130, 163, 255, 0.14);
  box-shadow: 0 24px 50px rgba(3, 9, 24, 0.28);
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;

  span {
    display: inline-block;
    margin-bottom: 8px;
    font-size: 0.8rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8e5f00;
  }

  h2 {
    margin: 0;
    color: #eef4ff;
  }

  p {
    max-width: 360px;
    margin: 0;
    line-height: 1.6;
    color: rgba(219, 230, 255, 0.72);
  }

  button {
    width: 42px;
    min-width: 42px;
    height: 42px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: #eef4ff;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
  }

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckboxField = styled.label`
  grid-column: 1 / -1;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(130, 163, 255, 0.12);
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: #d55353;
  }

  label {
    display: block;
    cursor: pointer;
  }

  span {
    display: block;
    margin-top: 4px;
    color: rgba(219, 230, 255, 0.72);
    line-height: 1.5;
    font-size: 0.92rem;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.92rem;
    font-weight: 600;
    color: #dce8ff;
  }

  input,
  select {
    min-height: 48px;
    padding: 0 14px;
    border-radius: 16px;
    border: 1px solid rgba(130, 163, 255, 0.14);
    background: rgba(5, 16, 39, 0.92);
    color: #edf3ff;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;

    &:focus {
      border-color: rgba(247, 166, 0, 0.8);
      box-shadow: 0 0 0 4px rgba(247, 166, 0, 0.12);
      transform: translateY(-1px);
    }
  }

  small {
    color: rgba(219, 230, 255, 0.72);
    font-size: 0.82rem;
    line-height: 1.4;
  }
`;

export const ScheduleBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(5, 16, 39, 0.96), rgba(8, 21, 51, 0.92));
  border: 1px solid rgba(130, 163, 255, 0.12);
`;

export const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;

  span {
    display: inline-block;
    margin-bottom: 8px;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #62708f;
  }

  h3 {
    margin: 0;
    color: #eef4ff;
  }

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const InlineFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(160px, 1fr) auto;
  gap: 12px;
  align-items: end;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const AddScheduleButton = styled.button`
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(130, 163, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: #eef4ff;
  font-weight: 700;
  cursor: pointer;
`;

export const RemoveScheduleButton = styled.button`
  min-height: 48px;
  padding: 0 18px;
  border: none;
  border-radius: 16px;
  background: rgba(219, 76, 76, 0.12);
  color: #a12e2e;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  align-self: flex-start;
  padding: 14px 22px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #13203e, #274b8f);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 18px 34px rgba(19, 32, 62, 0.24);
`;
