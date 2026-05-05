import React from "react";
import { WEEK_DAYS } from "../../constants/weekDays";
import {
  AddScheduleButton,
  CheckboxField,
  Field,
  FieldGrid,
  FormCard,
  FormHeader,
  InlineFields,
  RemoveScheduleButton,
  SaveButton,
  ScheduleBlock,
  ScheduleHeader,
} from "./style";

export default function StudentForm({
  form,
  onChange,
  onScheduleChange,
  onAddSchedule,
  onRemoveSchedule,
  onSubmit,
  onClose,
  mode = "create",
}) {
  const isEditing = mode === "edit";
  const isPhoneValid = /^\+[1-9]\d{7,14}$/.test(
    form.telefone.replace(/[^\d+]/g, ""),
  );

  return (
    <FormCard onSubmit={onSubmit}>
      <FormHeader>
        <div>
          <span>{isEditing ? "Editar cadastro" : "Novo cadastro"}</span>
          <h2>{isEditing ? "Atualizar aluno" : "Aluno com agenda semanal"}</h2>
        </div>
        <p>
          {isEditing
            ? "Revise os dados atuais e ajuste agenda, plano, vencimento e contatos."
            : "Defina os dados principais e registre os dias da semana com seus respectivos horarios."}
        </p>
        <button type="button" onClick={onClose} aria-label="Fechar modal">
          x
        </button>
      </FormHeader>

      <FieldGrid>
        <Field>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            value={form.nome}
            onChange={onChange}
            placeholder="Nome completo"
          />
        </Field>

        <Field>
          <label htmlFor="telefone">Celular</label>
          <input
            id="telefone"
            name="telefone"
            value={form.telefone}
            onChange={onChange}
            placeholder="+55 11 99999-9999"
            inputMode="tel"
            maxLength="20"
          />
          <small>
            {isPhoneValid
              ? "Numero pronto para contato."
              : "Informe o codigo do pais e o celular no padrao internacional."}
          </small>
        </Field>

        <Field>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="aluno@email.com"
          />
        </Field>

        <Field>
          <label htmlFor="plano">Plano</label>
          <input
            id="plano"
            name="plano"
            value={form.plano}
            onChange={onChange}
            placeholder="Personal, funcional, musculacao..."
          />
        </Field>

        <Field>
          <label htmlFor="valor">Valor mensal</label>
          <input
            id="valor"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            value={form.valor}
            onChange={onChange}
            placeholder="70.00"
          />
        </Field>

        <Field>
          <label htmlFor="vencimento">Dia do vencimento</label>
          <input
            id="vencimento"
            name="vencimento"
            type="number"
            min="1"
            max="31"
            value={form.vencimento}
            onChange={onChange}
            placeholder="10"
          />
          <small>Dia mensal em que a cobranca vence.</small>
        </Field>

        <CheckboxField>
          <input
            id="vencido"
            name="vencido"
            type="checkbox"
            checked={form.vencido}
            onChange={onChange}
          />
          <div>
            <label htmlFor="vencido">Aluno ja esta vencido</label>
            <span>
              Marque esta opcao quando a mensalidade ja estiver atrasada no
              momento do cadastro.
            </span>
          </div>
        </CheckboxField>
      </FieldGrid>

      <ScheduleBlock>
        <ScheduleHeader>
          <div>
            <span>Agenda</span>
            <h3>Dias e horarios das aulas</h3>
          </div>
          <AddScheduleButton type="button" onClick={onAddSchedule}>
            Adicionar horario
          </AddScheduleButton>
        </ScheduleHeader>

        {form.agenda.map((item, index) => (
          <InlineFields key={`${item.dia}-${index}`}>
            <Field>
              <label htmlFor={`dia-${index}`}>Dia</label>
              <select
                id={`dia-${index}`}
                value={item.dia}
                onChange={(event) =>
                  onScheduleChange(index, "dia", event.target.value)
                }
              >
                {WEEK_DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <label htmlFor={`horario-${index}`}>Horario</label>
              <input
                id={`horario-${index}`}
                type="time"
                value={item.horario}
                onChange={(event) =>
                  onScheduleChange(index, "horario", event.target.value)
                }
              />
            </Field>

            <RemoveScheduleButton
              type="button"
              onClick={() => onRemoveSchedule(index)}
              disabled={form.agenda.length === 1}
            >
              Remover
            </RemoveScheduleButton>
          </InlineFields>
        ))}
      </ScheduleBlock>

      <SaveButton type="submit">
        {isEditing ? "Salvar alteracoes" : "Salvar aluno"}
      </SaveButton>
    </FormCard>
  );
}
