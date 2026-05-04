import React from "react";
import {
  ActionsRow,
  HeroCard,
  HeroCopy,
  HeroEyebrow,
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
        <LogoBadge>
          <LogoImage src={Logo} alt="Logo da academia" />
        </LogoBadge>

        <HeroCopy>
          <HeroEyebrow>Gestao de alunos e cobrancas</HeroEyebrow>
          <Title>Painel da turma com agenda semanal</Title>
          <p>
            Organize dias, horarios e cobrancas em uma interface mais clara
            para acompanhar cada aluno.
          </p>
        </HeroCopy>

        <HeroStats>
          <div>
            <StatsValue>{totalStudents}</StatsValue>
            <StatsLabel>alunos ativos</StatsLabel>
          </div>
          <div>
            <StatsValue>{pendingStudents}</StatsValue>
            <StatsLabel>pendencias</StatsLabel>
          </div>
        </HeroStats>

        <ActionsRow>
          <PrimaryButton type="button" onClick={onToggleForm}>
            {isFormOpen ? "Fechar formulario" : "Adicionar aluno"}
          </PrimaryButton>
          <PrimaryButton type="button" $secondary onClick={onLogout}>
            Sair
          </PrimaryButton>
        </ActionsRow>
      </HeroCard>
    </HeaderWrapper>
  );
}
