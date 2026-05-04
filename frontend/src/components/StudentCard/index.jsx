import React from "react";
import {
  ActionButton,
  Actions,
  Badge,
  Card,
  Meta,
  ScheduleChip,
  ScheduleList,
  StatusTag,
  StatusButton,
  TopRow,
} from "./style";

export default function StudentCard({
  student,
  onEdit,
  onDelete,
  onTogglePaid,
  onCharge,
}) {
  return (
    <Card>
      <TopRow>
        <div>
          <Badge>{student.plano || "Plano livre"}</Badge>
          <h3>{student.nome}</h3>
          <p>{student.email || "Sem email cadastrado"}</p>
        </div>

        <Meta>
          <StatusTag $status={student.pago ? "paid" : student.vencido ? "overdue" : "pending"}>
            {student.pago ? "Pago" : student.vencido ? "Vencido" : "Pendente"}
          </StatusTag>
          <strong>R$ {Number(student.valor || 0).toFixed(2)}</strong>
          <span>Vence dia {student.vencimento || "--"}</span>
        </Meta>
      </TopRow>

      <ScheduleList>
        {student.agenda.map((item, index) => (
          <ScheduleChip key={`${student.nome}-${item.dia}-${index}`}>
            <strong>{item.dia}</strong>
            <span>{item.horario || "Horario nao definido"}</span>
          </ScheduleChip>
        ))}
      </ScheduleList>

      <p>
        <strong>Telefone:</strong> {student.telefone}
      </p>

      <Actions>
        <StatusButton
          type="button"
          $isPaid={student.pago}
          $isOverdue={student.vencido}
          onClick={onTogglePaid}
        >
          {student.pago ? "Pago" : student.vencido ? "Vencido" : "Pendente"}
        </StatusButton>
        <ActionButton type="button" onClick={onEdit}>
          Editar
        </ActionButton>
        <ActionButton type="button" onClick={onCharge}>
          Cobrar no WhatsApp
        </ActionButton>
        <ActionButton type="button" $variant="danger" onClick={onDelete}>
          Excluir
        </ActionButton>
      </Actions>
    </Card>
  );
}
