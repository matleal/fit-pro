# 🔐 Guia Completo: Configurar Google OAuth para Localhost

## ❌ Erro: "redirect_uri_mismatch"

Este erro acontece quando a URI de redirecionamento configurada no Google Console não corresponde à que o NextAuth está usando.

## ✅ Solução Passo a Passo

### 1. Acesse o Google Cloud Console

👉 https://console.cloud.google.com

### 2. Selecione ou Crie um Projeto

- Se já tem um projeto, selecione no topo
- Se não tem, clique em "New Project" e crie um chamado "FitPro"

### 3. Configure a Tela de Consentimento OAuth

1. No menu lateral, vá em **"APIs & Services"** > **"OAuth consent screen"**
2. Selecione **"External"** (para desenvolvimento)
3. Clique em **"Create"**
4. Preencha:
   - **App name**: `FitPro` (ou qualquer nome)
   - **User support email**: Seu email
   - **Developer contact information**: Seu email
5. Clique em **"Save and Continue"**
6. Na tela de "Scopes", clique em **"Save and Continue"** (sem adicionar nada)
7. Na tela de "Test users", adicione seu email se necessário
8. Clique em **"Save and Continue"**

### 4. Crie as Credenciais OAuth

1. Vá em **"APIs & Services"** > **"Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"** > **"OAuth 2.0 Client IDs"**
3. Se for a primeira vez, pode pedir para configurar a tela de consentimento (já fizemos isso)

### 5. Configure o OAuth Client (IMPORTANTE!)

Preencha exatamente assim:

**Application type:**
- ✅ **Web application**

**Name:**
- `FitPro Local` (ou qualquer nome)

**Authorized JavaScript origins:**
```
http://localhost:3000
```
⚠️ **IMPORTANTE:**
- Sem barra no final
- Sem `https://`
- Apenas `http://localhost:3000`

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
```
⚠️ **IMPORTANTE:**
- Sem barra no final
- Caminho completo: `/api/auth/callback/google`
- Começa com `http://localhost:3000`

### 6. Copie as Credenciais

Após criar, você verá:

**Client ID:**
```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**Client Secret:**
```
GOCSPX-abcdefghijklmnopqrstuvwxyz
```

### 7. Cole no arquivo `.env`

Abra o arquivo `.env` e cole:

```env
AUTH_GOOGLE_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"
```

⚠️ **Sem aspas extras!** O arquivo já tem aspas, então cole apenas o valor entre as aspas.

### 8. Verifique o NEXTAUTH_URL

No `.env`, certifique-se de que está:

```env
NEXTAUTH_URL="http://localhost:3000"
```

### 9. Reinicie o Servidor

```bash
# Pare o servidor (Ctrl+C) e inicie novamente
pnpm dev
```

## 🧪 Como Testar

1. Acesse: http://localhost:3000
2. Clique em "Entrar" ou "Login"
3. Clique em "Continuar com Google"
4. Selecione sua conta Google
5. Autorize o acesso
6. Você deve ser redirecionado de volta para o app

## 🔍 Verificações de Debug

### Verificar qual URI está sendo usada

O NextAuth sempre usa: `{NEXTAUTH_URL}/api/auth/callback/{provider}`

No nosso caso:
```
http://localhost:3000/api/auth/callback/google
```

### Verificar no Google Console

1. Vá em **"APIs & Services"** > **"Credentials"**
2. Clique no seu OAuth 2.0 Client ID
3. Verifique se tem exatamente:
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

### Verificar no .env

```bash
cat .env | grep AUTH
```

Deve mostrar:
```
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

## ❌ Problemas Comuns

### Erro: "redirect_uri_mismatch"

**Causas:**
1. URI no Google Console diferente da esperada
2. Porta diferente (ex: rodando em 3001 mas configurado 3000)
3. `http://` vs `https://` (use `http://` para localhost)
4. Barra no final da URI

**Solução:**
- Verifique se a URI no Google Console é **exatamente**: `http://localhost:3000/api/auth/callback/google`
- Verifique se o `NEXTAUTH_URL` no `.env` é `http://localhost:3000`

### Erro: "access_denied"

**Causa:** App ainda em modo de teste e seu email não está na lista de test users

**Solução:**
1. Vá em "OAuth consent screen"
2. Adicione seu email em "Test users"
3. Ou publique o app (não recomendado para desenvolvimento)

### Erro: "invalid_client"

**Causa:** Client ID ou Secret incorretos

**Solução:**
- Verifique se copiou corretamente do Google Console
- Verifique se não há espaços extras no `.env`
- Reinicie o servidor após alterar o `.env`

## 📸 Screenshots de Referência

### Tela de Credenciais OAuth

```
Authorized JavaScript origins:
┌─────────────────────────────────┐
│ http://localhost:3000            │
└─────────────────────────────────┘

Authorized redirect URIs:
┌──────────────────────────────────────────────────────┐
│ http://localhost:3000/api/auth/callback/google        │
└──────────────────────────────────────────────────────┘
```

## ✅ Checklist Final

Antes de testar, verifique:

- [ ] Projeto criado no Google Cloud Console
- [ ] OAuth consent screen configurado
- [ ] OAuth 2.0 Client ID criado
- [ ] **Authorized JavaScript origins**: `http://localhost:3000`
- [ ] **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
- [ ] Client ID e Secret copiados para `.env`
- [ ] `NEXTAUTH_URL="http://localhost:3000"` no `.env`
- [ ] Servidor reiniciado após alterar `.env`

## 🚀 Pronto!

Agora você deve conseguir fazer login com Google no localhost!
