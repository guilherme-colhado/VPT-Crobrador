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

## Opcao mais simples

Use um unico servico no Render.

### Por que essa opcao

- Menos configuracao.
- Um unico link para os professores.
- Sem problema de CORS entre frontend e backend.
- O SQLite fica persistido em disco no mesmo servico.

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

1. Primeiro deploy: o Render cria o disco em `/var/data`.
2. Se `backend/database.db` ja tiver dados, ele copia esse arquivo para `/var/data/database.db` na primeira inicializacao.
3. Depois disso, os dados passam a sobreviver a novos deploys.
4. Entre com `ADMIN_USERNAME` e `ADMIN_PASSWORD` definidos no Render.

## Observacao

Segundo a documentacao atual da Render, `Persistent Disks` exigem web service pago e o filesystem sem disco e temporario. Para este projeto com SQLite, isso significa que o plano com disco persistente e o caminho seguro para demonstracao. Fontes: https://render.com/docs/disks , https://render.com/docs/deploys/ , https://render.com/docs/blueprint-spec , https://render.com/docs/deploy-create-react-app , https://render.com/docs/redirects-rewrites
