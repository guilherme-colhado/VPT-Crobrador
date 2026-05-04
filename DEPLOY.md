# Deploy sem WhatsApp

## Estrutura

- `frontend`: React
- `backend`: Node.js + Express
- `backend/database.db`: SQLite

## O que ja foi ajustado

- O botao de cobranca por WhatsApp foi removido da interface.
- O backend nao tenta rodar cobrancas automaticas se a Z-API nao estiver configurada.
- O frontend pode rodar no mesmo dominio do backend.
- O backend agora usa `PORT` e `DATABASE_PATH`.
- O backend entrega o `frontend/build` quando esse build existe.
- O banco local pode ser copiado para o disco persistente no primeiro deploy.
- O backend agora aceita `DATABASE_URL` para Postgres, incluindo Supabase.

## Opcao mais simples

Use um unico servico no Render.

### Por que essa opcao

- Menos configuracao.
- Um unico link para os professores.
- Sem problema de CORS entre frontend e backend.
- Funciona no plano gratis para demonstracao.

### Arquivo pronto

- `render.yaml`

### Como publicar

1. Coloque este projeto em um repositorio GitHub.
2. No Render, clique em `New +` -> `Blueprint`.
3. Conecte o repositorio.
4. O Render vai ler o `render.yaml` e criar o servico `cobrador`.
5. Defina o valor de `ADMIN_PASSWORD` no painel antes do deploy finalizar.
6. Ao final, abra a URL gerada pelo Render.

## Fluxo recomendado

1. O servico sobe no plano `free`.
2. Sem `DATABASE_URL`, o SQLite roda no filesystem temporario do servico.
3. Com `DATABASE_URL`, o backend usa Postgres e os dados deixam de depender do filesystem local.
4. Entre com `ADMIN_USERNAME` e `ADMIN_PASSWORD` definidos no Render.

## Observacao

Segundo a documentacao atual da Render, `Web Service` gratuito e suportado, mas o filesystem e temporario sem disco persistente. Para testes curtos isso pode bastar, mas nao serve para manter dados com confiabilidade. Fontes: https://render.com/docs/free , https://render.com/docs/deploys/ , https://render.com/docs/blueprint-spec
