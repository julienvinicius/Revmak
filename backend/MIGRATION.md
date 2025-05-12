# Migração de MongoDB para MySQL

Este documento descreve o processo de migração do banco de dados do projeto Revmak de MongoDB para MySQL.

## Alterações Realizadas

1. **Dependências**:
   - Removido: Mongoose
   - Adicionado: MySQL2, Sequelize, Sequelize CLI

2. **Configuração do Banco de Dados**:
   - Criado arquivo de configuração do Sequelize em `src/config/database.ts`
   - Adicionado suporte a variáveis de ambiente para configuração do banco de dados
   - Configurado timezone para Brasil (GMT-3)

3. **Modelos**:
   - Atualizado modelo de usuário para usar Sequelize em vez de Mongoose
   - Implementado hooks para hash de senha
   - Configurado validações de campos

4. **Migrações**:
   - Configurado Sequelize CLI para gerenciar migrações
   - Criada migração para tabela de usuários
   - Criado seeder para usuário administrador

5. **Controladores**:
   - Atualizado todos os controladores para usar métodos do Sequelize
   - Substituído métodos como `findById` por `findByPk`
   - Atualizado operações CRUD para seguir padrões do Sequelize

6. **Middleware de Autenticação**:
   - Atualizado middleware para trabalhar com modelos do Sequelize

7. **Tratamento de Erros**:
   - Atualizado middleware de erro para lidar com erros específicos do Sequelize
   - Adicionado tratamento para erros de validação e restrições únicas

## Estrutura do Banco de Dados

### Tabela: users

| Coluna      | Tipo         | Restrições                |
|-------------|--------------|---------------------------|
| id          | INTEGER      | PRIMARY KEY, AUTO_INCREMENT |
| name        | STRING       | NOT NULL                  |
| email       | STRING       | NOT NULL, UNIQUE          |
| password    | STRING       | NOT NULL                  |
| role        | ENUM         | DEFAULT 'user'            |
| is_active   | BOOLEAN      | DEFAULT true              |
| created_at  | DATE         | NOT NULL                  |
| updated_at  | DATE         | NOT NULL                  |

## Como Executar a Migração

1. Configure o arquivo `.env` com as credenciais do MySQL
2. Crie o banco de dados no MySQL
3. Execute as migrações: `npm run db:migrate`
4. Execute os seeders: `npm run db:seed`

## Considerações Futuras

- Implementar transações para operações que afetam múltiplas tabelas
- Configurar índices para otimizar consultas frequentes
- Implementar relacionamentos entre tabelas conforme o projeto cresce 