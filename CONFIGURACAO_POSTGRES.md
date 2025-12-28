# Configuração do PostgreSQL (Neon)

Este guia explica como configurar o banco de dados PostgreSQL usando Neon.

## 1. Configurar variáveis de ambiente

Adicione a seguinte linha ao seu arquivo `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:npg_jwfslp1PAKq6@ep-damp-unit-acpqrlbr-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Importante**: Use a URL do **pooler** (com `-pooler` no host) para melhor performance em produção.

## 2. Instalar dependências (se necessário)

O Prisma já está configurado. Certifique-se de ter as dependências instaladas:

```bash
pnpm install
```

## 3. Gerar o Prisma Client

```bash
npx prisma generate
```

## 4. Executar as migrations

Isso criará todas as tabelas no banco de dados PostgreSQL:

```bash
npx prisma migrate dev --name init
```

Ou, se preferir criar uma migration sem aplicar:

```bash
npx prisma migrate dev --create-only --name init
npx prisma migrate deploy
```

## 5. Verificar a conexão

Você pode verificar se a conexão está funcionando:

```bash
npx prisma db pull
```

Ou abrir o Prisma Studio para visualizar os dados:

```bash
npx prisma studio
```

## Mudanças do SQLite para PostgreSQL

### ✅ Melhorias implementadas:

1. **Enum para Role**: Agora usamos `enum Role` ao invés de `String`
2. **Decimal para Price**: Usamos `Decimal` ao invés de `Float` para precisão monetária
3. **Text fields**: Campos longos usam `@db.Text` para melhor performance
4. **Tipos nativos**: PostgreSQL suporta todos os tipos nativamente

### ⚠️ Notas importantes:

- O campo `price` agora é `Decimal` (não `Float`). A API converte automaticamente para `number` nas respostas.
- O campo `role` agora é um enum. Use `Role.TEACHER` ou `Role.STUDENT` no código TypeScript.
- Todos os tokens do NextAuth são armazenados como `@db.Text` para suportar valores longos.

## Troubleshooting

### Erro de conexão SSL

Se você receber erros de SSL, certifique-se de que `?sslmode=require` está na URL.

### Erro de timeout

Se a conexão estiver lenta, tente usar a URL sem pooler:

```env
DATABASE_URL="postgresql://neondb_owner:npg_jwfslp1PAKq6@ep-damp-unit-acpqrlbr.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Resetar o banco

Se precisar resetar o banco (⚠️ **CUIDADO: apaga todos os dados**):

```bash
npx prisma migrate reset
```

## Próximos passos

1. Execute as migrations
2. Teste a aplicação
3. Verifique se os dados estão sendo salvos corretamente
4. Configure backups no Neon (recomendado)
