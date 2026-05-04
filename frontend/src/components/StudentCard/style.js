import styled, { css } from "styled-components";

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(14, 27, 58, 0.96), rgba(28, 50, 96, 0.94));
  color: #f6f8ff;
  box-shadow: 0 20px 42px rgba(8, 15, 34, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.08);

  h3,
  p {
    margin: 0;
  }

  p {
    color: rgba(246, 248, 255, 0.72);
  }
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;

  h3 {
    margin-top: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(247, 166, 0, 0.16);
  color: #ffd36e;
  font-size: 0.84rem;
  font-weight: 700;
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;

  strong {
    font-size: 1.4rem;
  }

  span {
    color: rgba(246, 248, 255, 0.68);
  }

  @media (max-width: 720px) {
    align-items: flex-start;
  }
`;

export const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ $status }) =>
    $status === "paid"
      ? "rgba(39, 181, 107, 0.2)"
      : $status === "overdue"
        ? "rgba(219, 76, 76, 0.22)"
        : "rgba(247, 166, 0, 0.18)"};
  color: ${({ $status }) =>
    $status === "paid"
      ? "#8ef0b8"
      : $status === "overdue"
        ? "#ffadad"
        : "#ffd36e"};
  font-size: 0.82rem;
  font-weight: 700;
`;

export const ScheduleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ScheduleChip = styled.div`
  min-width: 130px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);

  strong,
  span {
    display: block;
  }

  strong {
    color: #ffffff;
  }

  span {
    margin-top: 4px;
    color: rgba(246, 248, 255, 0.68);
    font-size: 0.92rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const sharedButtonStyle = css`
  min-height: 46px;
  padding: 0 18px;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const StatusButton = styled.button`
  ${sharedButtonStyle};
  background: ${({ $isPaid, $isOverdue }) =>
    $isPaid
      ? "linear-gradient(135deg, #27b56b, #71dd9b)"
      : $isOverdue
        ? "linear-gradient(135deg, #d55353, #ff9b9b)"
        : "linear-gradient(135deg, #f7a600, #ffd36e)"};
  color: ${({ $isPaid, $isOverdue }) =>
    $isPaid ? "#082514" : $isOverdue ? "#3a0909" : "#2b1a00"};
`;

export const ActionButton = styled.button`
  ${sharedButtonStyle};
  background: ${({ $variant }) =>
    $variant === "danger"
      ? "rgba(219, 76, 76, 0.16)"
      : "rgba(255, 255, 255, 0.12)"};
  color: ${({ $variant }) => ($variant === "danger" ? "#ff9f9f" : "#ffffff")};
  border: 1px solid
    ${({ $variant }) =>
      $variant === "danger"
        ? "rgba(255, 159, 159, 0.18)"
        : "rgba(255, 255, 255, 0.08)"};
`;
