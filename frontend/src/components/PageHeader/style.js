import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: block;
`;

export const HeroCard = styled.section`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(247, 166, 0, 0.3), transparent 28%),
    linear-gradient(135deg, rgba(7, 16, 44, 0.98), rgba(16, 40, 91, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(3, 8, 24, 0.45);

  @media (min-width: 720px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
`;

export const LogoBadge = styled.div`
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LogoImage = styled.img`
  width: 70px;
  height: auto;
`;

export const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #f5f7ff;

  p {
    max-width: 540px;
    color: rgba(245, 247, 255, 0.78);
    line-height: 1.6;
  }
`;

export const HeroEyebrow = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f7a600;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 3vw, 3.2rem);
  line-height: 1;
`;

export const HeroStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;

  div {
    min-width: 120px;
  }
`;

export const StatsValue = styled.strong`
  display: block;
  font-size: 2rem;
  color: #ffffff;
`;

export const StatsLabel = styled.span`
  color: rgba(245, 247, 255, 0.68);
  font-size: 0.92rem;
`;

export const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const PrimaryButton = styled.button`
  width: fit-content;
  padding: 14px 22px;
  border: none;
  border-radius: 999px;
  background: ${({ $secondary }) =>
    $secondary
      ? "rgba(255, 255, 255, 0.1)"
      : "linear-gradient(135deg, #f7a600, #ffcc4d)"};
  color: ${({ $secondary }) => ($secondary ? "#ffffff" : "#091227")};
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: ${({ $secondary }) =>
    $secondary
      ? "none"
      : "0 14px 30px rgba(247, 166, 0, 0.3)"};
  border: ${({ $secondary }) =>
    $secondary ? "1px solid rgba(255, 255, 255, 0.12)" : "none"};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $secondary }) =>
      $secondary
        ? "none"
        : "0 18px 34px rgba(247, 166, 0, 0.38)"};
  }
`;
