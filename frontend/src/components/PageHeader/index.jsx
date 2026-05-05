import React from "react";
import {
  ActionsRow,
  HeaderTop,
  HeroCard,
  HeroCopy,
  HeroStats,
  HeaderWrapper,
  LogoImage,
  LogoBadge,
  PrimaryButton,
  StatsLabel,
  StatsValue,
  Title,
} from "./style";
import Logo from "../../assets/logo.png";

export default function PageHeader({
  totalStudents,
  pendingStudents,
  onToggleForm,
  isFormOpen,
  onLogout,
}) {
  return (
    <HeaderWrapper>
      <HeroCard>
        <HeaderTop>
          <LogoBadge>
            <LogoImage src={Logo} alt="Logo da academia" />
          </LogoBadge>

          <HeroCopy>
            <Title>VPT Cobrador</Title>
            <p>
              Organize a turma, acompanhe pagamentos e visualize a agenda das
              aulas de forma mais clara.
            </p>
          </HeroCopy>

          <ActionsRow>
            <PrimaryButton type="button" onClick={onToggleForm}>
              {isFormOpen ? "Fechar formulario" : "Adicionar aluno"}
            </PrimaryButton>
            <PrimaryButton type="button" $secondary onClick={onLogout}>
              Sair do sistema
            </PrimaryButton>
          </ActionsRow>
        </HeaderTop>

        <HeroStats>
          <div>
            <StatsValue>{totalStudents}</StatsValue>
            <StatsLabel>alunos ativos</StatsLabel>
          </div>
          <div>
            <StatsValue>{pendingStudents}</StatsValue>
            <StatsLabel>mensalidades pendentes</StatsLabel>
          </div>
        </HeroStats>
      </HeroCard>
    </HeaderWrapper>
  );
}
