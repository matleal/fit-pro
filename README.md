# FitPro - Plataforma de Cursos para Personal Trainers

Uma plataforma moderna para personal trainers criarem e venderem cursos de treino online para seus alunos.

## 🚀 Funcionalidades

### Para Professores (Personal Trainers)
- ✅ Dashboard com visão geral de cursos e inscrições
- ✅ Criação de cursos estruturados (Semanas > Dias > Exercícios)
- ✅ Embed de vídeos do YouTube para demonstração de exercícios
- ✅ Sistema de códigos de convite para acesso gratuito a cursos
- ✅ Controle de visibilidade (público/privado) dos cursos
- ✅ Preparado para sistema de pagamento (em desenvolvimento)

### Para Alunos
- ✅ Catálogo de cursos públicos para explorar e se inscrever
- ✅ Visualização dos cursos inscritos
- ✅ Navegação por semana e dia
- ✅ Player de vídeo integrado para cada exercício
- ✅ Detalhes de séries, repetições e descanso
- ✅ Layout responsivo com menu mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Autenticação**: NextAuth.js v5 com Google OAuth
- **Banco de Dados**: PostgreSQL (Neon) com Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Linguagem**: TypeScript
- **Gerenciador de Pacotes**: pnpm

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (ou npm/yarn)
- Conta no Google Cloud Console (para OAuth)
- Banco PostgreSQL (recomendado: [Neon](https://neon.tech))

## ⚙️ Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/matleal/fit-pro.git
cd fit-pro
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# NextAuth
AUTH_SECRET="gere-uma-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="seu-google-client-id"
AUTH_GOOGLE_SECRET="seu-google-client-secret"
```

**Para gerar AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure as URIs autorizadas:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copie o Client ID e Client Secret para o `.env`

📖 Veja o guia detalhado em [GUIA_GOOGLE_OAUTH.md](./GUIA_GOOGLE_OAUTH.md)

### 5. Configurar Banco de Dados

#### Opção 1: Neon (Recomendado - Gratuito)

1. Crie uma conta em [Neon](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string e adicione ao `.env` como `DATABASE_URL`
4. Use a URL do **pooler** para melhor performance

📖 Veja o guia detalhado em [CONFIGURACAO_POSTGRES.md](./CONFIGURACAO_POSTGRES.md)

#### Opção 2: PostgreSQL Local

```bash
# Instalar PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Criar banco
createdb fitpro

# Adicionar ao .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fitpro"
```

### 6. Inicializar o banco de dados

```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev
```

### 7. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
app/
├── (auth)/                  # Páginas de autenticação
│   ├── login/
│   └── escolher-tipo/
├── (dashboard)/             # Área logada
│   ├── professor/           # Dashboard do professor
│   │   ├── cursos/          # CRUD de cursos
│   │   └── convites/        # Códigos de convite
│   └── aluno/               # Dashboard do aluno
│       ├── catalogo/        # Catálogo de cursos
│       └── cursos/          # Cursos inscritos
├── api/                     # API Routes
│   ├── auth/
│   ├── courses/
│   ├── enrollments/
│   ├── exercises/
│   └── invites/
└── convite/[code]/          # Página de convite

components/
├── ui/                      # Componentes shadcn/ui
├── dashboard/               # Sidebar e Mobile Header
└── youtube-embed.tsx        # Player do YouTube

lib/
├── auth.ts                  # Configuração NextAuth
├── prisma.ts                # Cliente Prisma
└── utils.ts                 # Utilitários

prisma/
├── schema.prisma            # Schema do banco
└── migrations/              # Migrations do Prisma
```

## 🎯 Fluxo de Uso

### Professor
1. Faça login com Google
2. Escolha "Sou Personal Trainer"
3. Crie um curso de treino
4. Adicione semanas, dias e exercícios
5. Configure se o curso é público (aparece no catálogo)
6. Gere códigos de convite para acesso gratuito

### Aluno
1. Faça login com Google
2. Escolha "Sou Aluno" ou use um código de convite
3. Explore o catálogo de cursos públicos
4. Inscreva-se em cursos gratuitos
5. Visualize seus cursos e treinos

## 🔐 Segurança

- ✅ Autenticação via NextAuth.js
- ✅ Proteção de rotas com middleware
- ✅ Validação de permissões (professor/aluno)
- ✅ Sanitização de inputs
- ✅ Variáveis de ambiente para dados sensíveis

## 📱 Responsividade

- ✅ Layout adaptativo (mobile, tablet, desktop)
- ✅ Sidebar oculto em mobile com menu hambúrguer
- ✅ Componentes otimizados para touch
- ✅ Design mobile-first

## 🚧 Próximos Passos (Roadmap)

- [ ] Sistema de pagamento (Stripe/Mercado Pago)
- [ ] Tracking de progresso do aluno
- [ ] Notificações por email
- [ ] PWA para acesso mobile
- [ ] Upload de vídeos próprios
- [ ] Histórico de treinos realizados
- [ ] Métricas e relatórios
- [ ] Sistema de avaliações e comentários

## 📚 Documentação Adicional

- [Configuração do .env](./CONFIGURACAO_ENV.md)
- [Configuração do PostgreSQL](./CONFIGURACAO_POSTGRES.md)
- [Guia do Google OAuth](./GUIA_GOOGLE_OAUTH.md)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ para personal trainers
