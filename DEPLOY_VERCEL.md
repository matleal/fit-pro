# Deploy na Vercel

Este guia explica como fazer deploy do FitPro na Vercel.

## ✅ Configuração Automática

O projeto já está configurado para deploy na Vercel. Não é necessário alterar o comando de build manualmente.

### Arquivos de Configuração

1. **`package.json`**:
   - `build`: `prisma generate && next build` - Gera o Prisma Client antes do build
   - `postinstall`: `prisma generate` - Gera o Prisma Client após instalar dependências

2. **`vercel.json`** (opcional, mas recomendado):
   - Define o comando de build explicitamente
   - Configura o framework como Next.js
   - Usa pnpm como gerenciador de pacotes

## 🚀 Deploy na Vercel

### Opção 1: Via Dashboard da Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Conecte seu repositório GitHub (`matleal/fit-pro`)
4. A Vercel detectará automaticamente:
   - Framework: Next.js
   - Build Command: `prisma generate && next build` (do package.json)
   - Install Command: `pnpm install`
   - Output Directory: `.next`

### Opção 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel
```

## 🔐 Variáveis de Ambiente na Vercel

Configure as seguintes variáveis de ambiente no dashboard da Vercel:

### Obrigatórias:

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
AUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=https://seu-dominio.vercel.app
AUTH_GOOGLE_ID=seu-google-client-id
AUTH_GOOGLE_SECRET=seu-google-client-secret
```

### Como Configurar:

1. No dashboard da Vercel, vá em **Settings** > **Environment Variables**
2. Adicione cada variável
3. Selecione os ambientes (Production, Preview, Development)
4. Clique em **Save**

## 📝 Notas Importantes

### Prisma Client

- O Prisma Client é gerado automaticamente durante o build via `postinstall` e `build` scripts
- Não é necessário executar `prisma generate` manualmente na Vercel

### Migrations

As migrations do Prisma **não são executadas automaticamente** na Vercel. Você tem duas opções:

#### Opção 1: Executar manualmente (Recomendado para produção)

```bash
# Após o primeiro deploy, execute:
npx prisma migrate deploy
```

Ou configure um script no package.json:

```json
{
  "scripts": {
    "migrate:deploy": "prisma migrate deploy"
  }
}
```

E execute na Vercel via CLI ou adicione ao build command (não recomendado para produção).

#### Opção 2: Usar Prisma Migrate Deploy no Build (Desenvolvimento)

Se quiser que as migrations sejam executadas automaticamente no build (apenas para desenvolvimento/preview):

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

⚠️ **Atenção**: Isso pode causar problemas se múltiplos deploys acontecerem simultaneamente.

### Google OAuth Redirect URI

Certifique-se de adicionar a URL da Vercel nas configurações do Google OAuth:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá em **APIs & Services** > **Credentials**
3. Edite seu OAuth 2.0 Client ID
4. Adicione nas **Authorized redirect URIs**:
   - `https://seu-projeto.vercel.app/api/auth/callback/google`
   - `https://seu-projeto-*.vercel.app/api/auth/callback/google` (para previews)

## 🔍 Troubleshooting

### Erro: "Prisma Client not generated"

- Verifique se `postinstall` script está no package.json
- Verifique se `prisma generate` está no build command
- Limpe o cache na Vercel: **Settings** > **Clear Build Cache**

### Erro: "Database connection failed"

- Verifique se `DATABASE_URL` está configurada corretamente
- Certifique-se de que o banco PostgreSQL está acessível (não bloqueado por firewall)
- Use a URL do **pooler** do Neon para melhor performance

### Erro: "Module '@prisma/client' has no exported member 'Role'"

- Já resolvido! O projeto usa `lib/types.ts` para o tipo Role
- Se ainda ocorrer, verifique se `prisma generate` está sendo executado

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js na Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma na Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
