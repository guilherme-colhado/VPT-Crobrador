import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  AccentCard,
  ErrorText,
  Field,
  LoginButton,
  LoginCard,
  LoginGrid,
  LoginShell,
  LogoMark,
  SideCopy,
} from "./style";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login(credentials);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError("Credenciais invalidas. Verifique o usuario administrador.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginShell>
      <LoginGrid>
        <SideCopy>
          <LogoMark>C</LogoMark>
          <span>Acesso administrativo</span>
          <h1>Controle a agenda e as cobrancas em um unico painel.</h1>
          <p>
            Esta area e exclusiva do administrador. Depois do login, o sistema
            continua monitorando vencimentos e pode disparar lembretes
            automaticos pelo backend.
          </p>
          <AccentCard>
            <strong>Fluxo automatico</strong>
            <p>
              O backend verifica diariamente os alunos pendentes e envia
              mensagens cinco dias antes do vencimento e outra no proprio dia,
              se ainda nao houver quitacao.
            </p>
          </AccentCard>
        </SideCopy>

        <LoginCard onSubmit={handleSubmit}>
          <div>
            <span>Entrar</span>
            <h2>Administrador</h2>
            <p>Use o usuario unico configurado no backend.</p>
          </div>

          <Field>
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="admin"
              autoComplete="username"
            />
          </Field>

          <Field>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Sua senha"
              autoComplete="current-password"
            />
          </Field>

          {error ? <ErrorText>{error}</ErrorText> : null}

          <LoginButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Acessar painel"}
          </LoginButton>
        </LoginCard>
      </LoginGrid>
    </LoginShell>
  );
}
