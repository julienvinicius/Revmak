# Revmak Backend

API RESTful para o projeto Revmak, desenvolvida com Node.js, Express, TypeScript e MySQL.

## Requisitos

- Node.js (v14 ou superior)
- MySQL (v8.0 ou superior)

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone <repositório>
cd revmak/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados MySQL:
   - Crie um banco de dados chamado `revmak`
   - Configure as credenciais no arquivo `.env`

4. Configure o arquivo `.env`:
```
# Ambiente
NODE_ENV=development

# Servidor
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Banco de dados
DB_NAME=revmak
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=revmak-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Database Sync (development only)
AUTO_SYNC=false
```

## Executando as Migrações

Para configurar o banco de dados:

```bash
# Executar migrações
npm run db:migrate

# Executar seeders (dados iniciais)
npm run db:seed

# Ou para resetar o banco de dados (desfazer migrações, migrar e semear)
npm run db:reset
```

## Executando o Servidor

```bash
# Modo de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Executar em produção
npm start
```

## Estrutura do Projeto

```
src/
  ├── config/         # Configurações
  ├── controllers/    # Controladores
  ├── database/       # Migrações e seeders
  ├── interfaces/     # Interfaces TypeScript
  ├── middlewares/    # Middlewares Express
  ├── models/         # Modelos Sequelize
  ├── routes/         # Rotas da API
  ├── utils/          # Utilitários
  └── index.ts        # Ponto de entrada
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/logout` - Logout de usuário
- `GET /api/auth/me` - Obter usuário atual
- `PATCH /api/auth/update-password` - Atualizar senha

### Usuários
- `GET /api/users/me` - Obter perfil do usuário
- `PATCH /api/users/update-me` - Atualizar perfil do usuário
- `DELETE /api/users/delete-me` - Desativar conta

### Admin (requer permissão de administrador)
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Obter usuário por ID
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário 