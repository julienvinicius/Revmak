# Projeto Revmak

Este é um projeto full-stack com React, Node.js e MongoDB, preparado para desenvolvimento mobile com React Native.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Aplicação React com Next.js
- **Backend**: API RESTful com Node.js, Express e MongoDB
- **Mobile**: (Futuro) Aplicação React Native

## Requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- MongoDB (local ou remoto)
- Docker e Docker Compose (opcional)

## Configuração e Execução

### Sem Docker

#### Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar em desenvolvimento
npm run dev

# Construir para produção
npm run build

# Executar em produção
npm start
```

#### Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Construir para produção
npm run build

# Executar em produção
npm start
```

### Com Docker

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar todos os serviços
docker-compose down
```

## Funcionalidades

### Backend

- Autenticação com JWT
- Gerenciamento de usuários
- API RESTful
- Validação de dados
- Tratamento de erros
- Segurança (CORS, Helmet, Rate Limiting)

### Frontend

- Autenticação e autorização
- Rotas protegidas
- Layout responsivo com Tailwind CSS
- Formulários com validação

## Tecnologias Utilizadas

### Backend

- Node.js
- Express
- TypeScript
- MongoDB com Mongoose
- JWT para autenticação
- bcrypt para criptografia
- Middleware de segurança (helmet, cors, rate-limit)

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- NextAuth.js para autenticação

## Estrutura de Diretórios

### Backend

```
backend/
├── src/
│   ├── config/       # Configurações
│   ├── controllers/  # Controladores
│   ├── interfaces/   # Interfaces TypeScript
│   ├── middlewares/  # Middlewares
│   ├── models/       # Modelos do Mongoose
│   ├── routes/       # Rotas
│   ├── utils/        # Utilitários
│   └── index.ts      # Ponto de entrada
├── .env.example      # Exemplo de variáveis de ambiente
├── package.json      # Dependências
├── tsconfig.json     # Configuração TypeScript
└── Dockerfile        # Configuração Docker
```

### Frontend

```
frontend/
├── src/
│   ├── app/          # Páginas Next.js
│   ├── components/   # Componentes React
│   ├── context/      # Contextos React
│   ├── hooks/        # Hooks personalizados
│   ├── services/     # Serviços de API
│   ├── styles/       # Estilos
│   ├── types/        # Tipos TypeScript
│   └── utils/        # Utilitários
├── public/           # Arquivos estáticos
├── package.json      # Dependências
├── next.config.js    # Configuração Next.js
└── Dockerfile        # Configuração Docker
``` 