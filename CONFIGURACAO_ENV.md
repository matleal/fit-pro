# 🔧 Guia de Configuração do .env

Este guia vai te ajudar a configurar todas as variáveis de ambiente necessárias para o FitPro funcionar.

## 📋 Passo a Passo

### 1. Copiar o arquivo de exemplo

```bash
cp .env.example .env
```

### 2. Configurar AUTH_SECRET

O `AUTH_SECRET` é uma chave secreta usada pelo NextAuth para criptografar sessões.

**Opção 1: Gerar online**
- Acesse: https://generate-secret.vercel.app/32
- Copie a chave gerada

**Opção 2: Gerar no terminal**
```bash
openssl rand -base64 32
```

**Exemplo:**
```env
AUTH_SECRET="aBc123XyZ456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890"
```

### 3. Configurar Google OAuth

#### Passo 1: Acessar Google Cloud Console
1. Vá para: https://console.cloud.google.com
2. Faça login com sua conta Google

#### Passo 2: Criar um Projeto
1. Clique no seletor de projetos (topo da página)
2. Clique em "New Project"
3. Dê um nome (ex: "FitPro")
4. Clique em "Create"

#### Passo 3: Habilitar Google+ API
1. No menu lateral, vá em "APIs & Services" > "Library"
2. Procure por "Google+ API" ou "Google Identity"
3. Clique e depois em "Enable"

#### Passo 4: Criar Credenciais OAuth
1. Vá em "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Se pedir, configure a tela de consentimento:
   - User Type: External
   - App name: FitPro
   - User support email: seu email
   - Developer contact: seu email
   - Salve e continue

#### Passo 5: Configurar OAuth Client
1. Application type: **Web application**
2. Name: **FitPro** (ou qualquer nome)
3. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
4. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Clique em "Create"

#### Passo 6: Copiar Credenciais
1. Você verá uma tela com:
   - **Client ID** (algo como: `123456789-abc...xyz.apps.googleusercontent.com`)
   - **Client Secret** (algo como: `GOCSPX-abc...xyz`)
2. Copie esses valores para o `.env`:

```env
AUTH_GOOGLE_ID="123456789-abc...xyz.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-abc...xyz"
```

### 4. Configurar NEXTAUTH_URL

Para desenvolvimento local, deixe como está:
```env
NEXTAUTH_URL="http://localhost:3000"
```

**Importante:** Se você mudar a porta do Next.js, atualize essa URL também.

### 5. Configurar DATABASE_URL

Para SQLite local, já está configurado:
```env
DATABASE_URL="file:./dev.db"
```

Não precisa alterar isso.

## ✅ Verificação Final

Seu arquivo `.env` deve ficar assim:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="sua-chave-secreta-gerada"
NEXTAUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="seu-client-id-do-google"
AUTH_GOOGLE_SECRET="seu-client-secret-do-google"
```

## 🚨 Problemas Comuns

### Erro: "Invalid credentials"
- Verifique se copiou o Client ID e Secret corretamente
- Certifique-se de que não há espaços extras
- Verifique se as URIs de redirecionamento estão corretas no Google Console

### Erro: "Redirect URI mismatch"
- Verifique se adicionou exatamente `http://localhost:3000/api/auth/callback/google` no Google Console
- Certifique-se de que não há barra no final

### Erro: "AUTH_SECRET is not set"
- Certifique-se de que o arquivo `.env` existe na raiz do projeto
- Verifique se não há espaços antes ou depois do `=`
- Reinicie o servidor após alterar o `.env`

## 📝 Exemplo Completo

Aqui está um exemplo completo de um `.env` configurado:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="aBc123XyZ456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"
```

## 🎯 Próximos Passos

Após configurar o `.env`:

1. Execute as migrations do Prisma:
   ```bash
   npx prisma migrate dev
   ```

2. Inicie o servidor:
   ```bash
   pnpm dev
   ```

3. Acesse: http://localhost:3000

4. Faça login com Google e teste!
