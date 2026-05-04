import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import StudentForm from "../../components/StudentForm";
import { useAuth } from "../../contexts/AuthContext";
import { WEEK_DAYS } from "../../constants/weekDays";
import { api } from "../../services/api";
import {
  DetailLine,
  DetailList,
  EmptyState,
  FiltersBar,
  InfoBanner,
  LoadingState,
  MetaChip,
  MetaRow,
  ModalBackdrop,
  ModalShell,
  Page,
  SchedulePill,
  ScheduleStack,
  SearchField,
  SectionTitle,
  SideColumn,
  StatusField,
  StudentsTable,
  StudentsSection,
  TableActionButton,
  TableInfo,
  TableShell,
  TableStudent,
  ActionGroup,
} from "./style";

const initialFormState = {
  nome: "",
  telefone: "",
  email: "",
  plano: "",
  valor: "",
  vencimento: "",
  vencido: false,
  agenda: [{ dia: WEEK_DAYS[0], horario: "18:00" }],
};

export default function Students() {
  const { logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    if (!isFormOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeFormModal();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFormOpen]);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await api.get("/alunos");
        setStudents(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          return;
        }

        setFeedback("Nao foi possivel carregar os alunos do backend.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, [logout]);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleScheduleChange(index, field, value) {
    setForm((current) => ({
      ...current,
      agenda: current.agenda.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function handleAddSchedule() {
    setForm((current) => ({
      ...current,
      agenda: [...current.agenda, { dia: WEEK_DAYS[0], horario: "18:00" }],
    }));
  }

  function handleRemoveSchedule(index) {
    setForm((current) => ({
      ...current,
      agenda: current.agenda.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function closeFormModal() {
    setIsFormOpen(false);
    setEditingStudentId(null);
    setForm(initialFormState);
  }

  function openCreateModal() {
    setEditingStudentId(null);
    setForm(initialFormState);
    setIsFormOpen(true);
  }

  function openEditModal(student) {
    setEditingStudentId(student.id);
    setForm({
      nome: student.nome || "",
      telefone: student.telefone || "",
      email: student.email || "",
      plano: student.plano || "",
      valor: String(student.valor ?? ""),
      vencimento: String(student.vencimento ?? ""),
      vencido: Boolean(student.vencido),
      agenda:
        student.agenda && student.agenda.length > 0
          ? student.agenda.map((item) => ({
              dia: item.dia || WEEK_DAYS[0],
              horario: item.horario || "18:00",
            }))
          : [{ dia: WEEK_DAYS[0], horario: "18:00" }],
    });
    setIsFormOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nome.trim() || !form.telefone.trim()) {
      return;
    }

    try {
      const payload = {
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim(),
        plano: form.plano.trim(),
        valor: Number(form.valor || 0),
        dia_vencimento: Number(form.vencimento || 1),
        vencido: form.vencido,
        agenda: form.agenda.filter((item) => item.dia || item.horario),
      };

      if (editingStudentId) {
        const response = await api.put(`/alunos/${editingStudentId}`, payload);
        setStudents((current) =>
          current.map((student) =>
            student.id === editingStudentId ? response.data : student,
          ),
        );
        setFeedback("Aluno atualizado com sucesso.");
      } else {
        const response = await api.post("/alunos", payload);
        setStudents((current) => [response.data, ...current]);
        setFeedback("Aluno cadastrado com sucesso.");
      }

      closeFormModal();
    } catch (error) {
      setFeedback(
        editingStudentId && error.response?.status === 404
          ? "O backend em execucao ainda nao suporta edicao. Reinicie o servidor backend e tente novamente."
          : editingStudentId
            ? "Nao foi possivel atualizar o aluno."
            : "Nao foi possivel salvar o aluno.",
      );
    }
  }

  async function handleDeleteStudent(studentId) {
    try {
      await api.delete(`/alunos/${studentId}`);
      setStudents((current) =>
        current.filter((student) => student.id !== studentId),
      );
      setFeedback("Aluno removido.");
    } catch (error) {
      setFeedback("Nao foi possivel excluir o aluno.");
    }
  }

  async function handleTogglePaid(student) {
    try {
      const response = await api.patch(`/alunos/${student.id}/status`, {
        pago: !student.pago,
      });

      setStudents((current) =>
        current.map((item) =>
          item.id === student.id ? response.data : item,
        ),
      );

      setFeedback(
        response.data.pago
          ? "Aluno marcado como pago."
          : "Aluno voltou para status pendente.",
      );
    } catch (error) {
      setFeedback("Nao foi possivel atualizar o status do aluno.");
    }
  }

  function formatChargePreview(student) {
    return `Ola ${student.nome} venho por essa mensagem cobrar a mensalidade R$ ${Number(
      student.valor || 0,
    ).toFixed(2)} que venceria dia ${student.vencimento || "--"}.`;
  }

  function handleChargePreview(student) {
    setFeedback(formatChargePreview(student));
  }

  const pendingStudents = students.filter((student) => !student.pago).length;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredStudents = students.filter((student) => {
    const matchesName = student.nome.toLowerCase().includes(normalizedSearch);

    if (statusFilter === "pagos") {
      return matchesName && student.pago;
    }

    if (statusFilter === "pendentes") {
      return matchesName && !student.pago && !student.vencido;
    }

    if (statusFilter === "vencidos") {
      return matchesName && !student.pago && student.vencido;
    }

    return matchesName;
  });

  return (
    <Page>
      <PageHeader
        totalStudents={students.length}
        pendingStudents={pendingStudents}
        isFormOpen={isFormOpen}
        onToggleForm={() =>
          isFormOpen ? closeFormModal() : openCreateModal()
        }
        onLogout={logout}
      />

      {feedback ? <InfoBanner>{feedback}</InfoBanner> : null}

      {isFormOpen && (
        <ModalBackdrop onClick={closeFormModal}>
          <ModalShell onClick={(event) => event.stopPropagation()}>
            <StudentForm
              form={form}
              onChange={handleChange}
              onScheduleChange={handleScheduleChange}
              onAddSchedule={handleAddSchedule}
              onRemoveSchedule={handleRemoveSchedule}
              onSubmit={handleSubmit}
              onClose={closeFormModal}
              mode={editingStudentId ? "edit" : "create"}
            />
          </ModalShell>
        </ModalBackdrop>
      )}

      <StudentsSection>
        <SectionTitle>
          <div>
            <span>Turma atual</span>
            <h2>Alunos cadastrados</h2>
          </div>
          <p>
            Visualize quem esta em dia, acompanhe os horarios fixos de treino
            da turma e consulte a mensagem de cobranca.
          </p>
        </SectionTitle>

        <FiltersBar>
          <SearchField>
            <label htmlFor="student-search">Pesquisar por nome</label>
            <input
              id="student-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Digite o nome do aluno"
            />
          </SearchField>

          <StatusField>
            <label htmlFor="student-status">Status de pagamento</label>
            <select
              id="student-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="pagos">Pagos</option>
              <option value="pendentes">Pendentes</option>
              <option value="vencidos">Vencidos</option>
            </select>
          </StatusField>
        </FiltersBar>

        {isLoading ? (
          <LoadingState>Carregando alunos...</LoadingState>
        ) : students.length === 0 ? (
          <EmptyState>
            Nenhum aluno cadastrado ainda. Abra o formulario para criar o
            primeiro registro.
          </EmptyState>
        ) : filteredStudents.length === 0 ? (
          <EmptyState>
            Nenhum aluno encontrado para a busca ou filtro selecionado.
          </EmptyState>
        ) : (
          <TableShell>
            <StudentsTable>
              <thead>
                <tr>
                  <th>Painel</th>
                  <th>Informacoes do aluno</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td data-label="Painel">
                      <SideColumn>
                        <ActionGroup>
                          <TableActionButton
                            type="button"
                            $tone={
                              student.pago
                                ? "paid"
                                : student.vencido
                                  ? "overdue"
                                  : "pending"
                            }
                            onClick={() => handleTogglePaid(student)}
                          >
                            {student.pago
                              ? "Pago"
                              : student.vencido
                                ? "Vencido"
                                : "Pendente"}
                          </TableActionButton>
                          <TableActionButton
                            type="button"
                            onClick={() => openEditModal(student)}
                          >
                            Editar
                          </TableActionButton>
                          <TableActionButton
                            type="button"
                            onClick={() => handleChargePreview(student)}
                          >
                            Cobrar
                          </TableActionButton>
                          <TableActionButton
                            type="button"
                            $tone="danger"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            Excluir
                          </TableActionButton>
                        </ActionGroup>
                      </SideColumn>
                    </td>
                    <td data-label="Informacoes">
                      <TableInfo>
                        <TableStudent>
                          <strong>{student.nome}</strong>
                          <span>{student.email || "Sem email cadastrado"}</span>
                          <small>{student.telefone}</small>
                        </TableStudent>

                        <MetaRow>
                          <MetaChip>
                            <strong>Plano</strong>
                            <span>{student.plano || "Plano livre"}</span>
                          </MetaChip>
                          <MetaChip>
                            <strong>Valor</strong>
                            <span>R$ {Number(student.valor || 0).toFixed(2)}</span>
                          </MetaChip>
                          <MetaChip>
                            <strong>Vencimento</strong>
                            <span>Dia {student.vencimento || "--"}</span>
                          </MetaChip>
                        </MetaRow>

                        <DetailList>
                          <DetailLine>
                            <strong>Aulas:</strong>
                            <ScheduleStack>
                              {student.agenda.map((item, index) => (
                                <SchedulePill
                                  key={`${student.id}-${item.dia}-${index}`}
                                >
                                  {item.dia}
                                  {item.horario ? ` ${item.horario}` : ""}
                                </SchedulePill>
                              ))}
                            </ScheduleStack>
                          </DetailLine>
                        </DetailList>
                      </TableInfo>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StudentsTable>
          </TableShell>
        )}
      </StudentsSection>
    </Page>
  );
}
