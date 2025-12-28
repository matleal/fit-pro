# FitPro - Plataforma de Treinos para Personal Trainers

Uma plataforma moderna para personal trainers organizarem e compartilharem treinos com seus alunos.

## Funcionalidades

### Para Professores (Personal Trainers)
- ✅ Dashboard com visão geral de programas e alunos
- ✅ Criação de programas de treino estruturados (Semanas > Dias > Exercícios)
- ✅ Embed de vídeos do YouTube para demonstração de exercícios
- ✅ Gerenciamento de alunos (adicionar por email ou convite)
- ✅ Sistema de códigos de convite para novos alunos

### Para Alunos
- ✅ Visualização dos treinos atribuídos
- ✅ Navegação por semana e dia
- ✅ Player de vídeo integrado para cada exercício
- ✅ Detalhes de séries, repetições e descanso

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Autenticação**: NextAuth.js com Google OAuth
- **Banco de Dados**: SQLite com Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Linguagem**: TypeScript

## Configuração

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="gere-uma-chave-secreta-aqui"

# Google OAuth (obtenha em https://console.cloud.google.com)
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"

# App URL
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure as URIs autorizadas:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Copie o Client ID e Client Secret para o `.env`

### 4. Inicializar o banco de dados

```bash
npx prisma migrate dev
```

### 5. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
app/
├── (auth)/                  # Páginas de autenticação
│   ├── login/
│   └── escolher-tipo/
├── (dashboard)/             # Área logada
│   ├── professor/           # Dashboard do professor
│   │   ├── programas/       # CRUD de programas
│   │   ├── alunos/          # Gestão de alunos
│   │   └── convites/        # Códigos de convite
│   └── aluno/               # Dashboard do aluno
│       └── treinos/         # Visualização de treinos
├── api/                     # API Routes
│   ├── auth/
│   ├── programs/
│   ├── exercises/
│   ├── students/
│   └── invites/
└── convite/[code]/          # Página de convite

components/
├── ui/                      # Componentes shadcn/ui
├── dashboard/               # Componentes do dashboard
└── youtube-embed.tsx        # Player do YouTube

lib/
├── auth.ts                  # Configuração NextAuth
├── prisma.ts                # Cliente Prisma
└── utils.ts                 # Utilitários
```

## Fluxo de Uso

### Professor
1. Faça login com Google
2. Escolha "Sou Personal Trainer"
3. Crie um programa de treino
4. Adicione semanas, dias e exercícios
5. Convide alunos por código ou email
6. Atribua programas aos alunos

### Aluno
1. Receba um código de convite do seu professor
2. Acesse o link do convite
3. Faça login com Google
4. Visualize seus treinos na dashboard

## Próximos Passos (Roadmap)

- [ ] Tracking de progresso do aluno
- [ ] Notificações por email
- [ ] PWA para acesso mobile
- [ ] Upload de vídeos próprios
- [ ] Histórico de treinos realizados
- [ ] Métricas e relatórios

## Licença

MIT
