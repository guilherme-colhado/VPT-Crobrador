import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 56px;
`;

export const StudentsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InfoBanner = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(8, 19, 46, 0.92), rgba(10, 27, 63, 0.88));
  border: 1px solid rgba(130, 163, 255, 0.14);
  color: #dce8ff;
  box-shadow: 0 16px 30px rgba(3, 9, 24, 0.24);
`;

export const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(220px, 0.7fr);
  gap: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const sharedFieldStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(8, 19, 46, 0.92), rgba(10, 27, 63, 0.88));
  border: 1px solid rgba(130, 163, 255, 0.14);
  box-shadow: 0 16px 30px rgba(3, 9, 24, 0.24);

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #dce8ff;
  }

  input,
  select {
    min-height: 48px;
    padding: 0 14px;
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

export const SearchField = styled(sharedFieldStyle)``;

export const StatusField = styled(sharedFieldStyle)``;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(7, 13, 28, 0.58);
  backdrop-filter: blur(8px);
`;

export const ModalShell = styled.div`
  width: min(920px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 28px;
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;

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
    font-size: clamp(1.6rem, 2.8vw, 2.4rem);
  }

  p {
    max-width: 420px;
    margin: 0;
    color: rgba(219, 230, 255, 0.72);
    line-height: 1.6;
  }

  @media (max-width: 820px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TableShell = styled.div`
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(8, 19, 46, 0.92), rgba(10, 27, 63, 0.88));
  border: 1px solid rgba(130, 163, 255, 0.14);
  box-shadow: 0 18px 40px rgba(3, 9, 24, 0.24);
`;

export const StudentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    display: none;
  }

  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }

  tr {
    padding: 16px;
    border-bottom: 1px solid rgba(130, 163, 255, 0.12);
  }

  tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 6px 0;
    color: #dce8ff;
  }

  td::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8ea6d8;
  }

  @media (min-width: 980px) {
    thead {
      display: table-header-group;
    }

    tbody {
      display: table-row-group;
    }

    tr {
      display: table-row;
      padding: 0;
    }

    td,
    th {
      display: table-cell;
      padding: 18px 16px;
      vertical-align: top;
      text-align: left;
    }

    th {
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #8ea6d8;
      background: rgba(255, 255, 255, 0.04);
    }

    td {
      border-top: 1px solid rgba(130, 163, 255, 0.1);
    }

    th:first-child,
    td:first-child {
      width: 260px;
    }

    td::before {
      display: none;
    }
  }
`;

export const SideColumn = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const TableInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const MetaChip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 110px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(130, 163, 255, 0.1);

  strong {
    color: #8ea6d8;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  span {
    color: #eef4ff;
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

export const TableStudent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #eef4ff;
  }

  span,
  small {
    color: rgba(219, 230, 255, 0.72);
  }
`;

export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DetailLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: rgba(219, 230, 255, 0.82);

  strong {
    color: #8ea6d8;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

export const ScheduleStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const SchedulePill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(130, 163, 255, 0.12);
  color: #eef4ff;
  font-size: 0.78rem;
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TableActionButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "danger"
        ? "rgba(255, 159, 159, 0.18)"
        : "rgba(130, 163, 255, 0.12)"};
  background: ${({ $tone }) =>
    $tone === "paid"
      ? "linear-gradient(135deg, #27b56b, #71dd9b)"
      : $tone === "overdue"
        ? "linear-gradient(135deg, #d55353, #ff9b9b)"
        : $tone === "pending"
          ? "linear-gradient(135deg, #f7a600, #ffd36e)"
          : $tone === "danger"
            ? "rgba(219, 76, 76, 0.16)"
            : "rgba(255, 255, 255, 0.08)"};
  color: ${({ $tone }) =>
    $tone === "paid"
      ? "#082514"
      : $tone === "overdue"
        ? "#3a0909"
        : $tone === "pending"
          ? "#2b1a00"
          : $tone === "danger"
            ? "#ffadad"
            : "#eef4ff"};
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
`;

export const EmptyState = styled.div`
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(8, 19, 46, 0.92), rgba(10, 27, 63, 0.88));
  border: 1px solid rgba(130, 163, 255, 0.14);
  color: #dce8ff;
  text-align: center;
`;

export const LoadingState = styled(EmptyState)``;
