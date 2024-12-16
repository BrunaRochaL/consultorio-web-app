# Advice Health App

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 18 ou superior)
- npm (geralmente vem com Node.js)

## Instalação

1. Clone o repositório:
git clone
cd advice-health-app


2. Instale as dependências:
npm install


## Executando o Projeto

O projeto possui dois componentes principais que precisam ser executados:

### Frontend (Aplicação React)

Para iniciar o servidor de desenvolvimento:
npm run dev

A aplicação estará disponível em `http://localhost:5173`

### Backend (JSON Server)

Para iniciar o servidor de dados:
npm run server

O servidor estará disponível em `http://localhost:3001`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run lint` - Executa a verificação de código
- `npm run preview` - Visualiza a build de produção
- `npm run server` - Inicia o JSON Server

## Principais Tecnologias

- React 18
- TypeScript
- Redux Toolkit
- React Router DOM
- Bootstrap 5
- Chart.js
- React Bootstrap
- JSON Server

## Desenvolvimento

O projeto utiliza:
- TypeScript para tipagem estática
- ESLint para linting
- Prettier para formatação de código
- Redux Toolkit para gerenciamento de estado
- React Router para navegação
- Bootstrap para estilização
- Chart.js para visualização de dados

## Ambiente de Produção

Para gerar uma build de produção:
npm run build

Para visualizar a build localmente:
npm run preview

## Notas Importantes

- Certifique-se de que o JSON Server (backend) esteja rodando antes de iniciar o frontend
- O arquivo `db.json` contém os dados iniciais do projeto
- As variáveis de ambiente podem ser configuradas através do arquivo `.env`

## Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório do projeto.
