import { auth } from '@/lib/auth';
import { Role } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell, Users, Video, BookOpen, Library } from 'lucide-react';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    // Check if user has selected a role (new users default to STUDENT but should choose)
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, createdAt: true },
    });

    // If user was created in the last 5 minutes and is still STUDENT, show role selection
    const isNewUser = dbUser &&
      new Date().getTime() - new Date(dbUser.createdAt).getTime() < 5 * 60 * 1000;

    if (isNewUser && dbUser && dbUser.role === Role.STUDENT) {
      // Check if they have any enrollments (meaning they joined via invite)
      const hasEnrollments = await prisma.enrollment.findFirst({
        where: { userId: session.user.id },
      });

      // If no enrollments, let them choose their role
      if (!hasEnrollments) {
        redirect("/escolher-tipo");
      }
    }

    const role = session.user.role;
    if (role === Role.TEACHER) {
      redirect('/professor');
    } else {
      redirect('/aluno');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-zinc-900" />
          </div>
          <span className="text-xl font-bold text-white">FitPro</span>
        </div>
        <Link href="/login">
          <Button variant="outline" className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700">
            Entrar
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Plataforma de Cursos para Personal Trainers
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white max-w-4xl leading-tight mb-6">
          Crie e venda seus cursos de{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            treino online
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mb-12">
          Crie cursos de treino completos, vincule vídeos do YouTube e disponibilize
          para seus alunos de forma organizada. Em breve: monetização dos cursos!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8 h-14 text-lg">
              Começar Agora
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700 px-8 h-14 text-lg">
            Ver Demonstração
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full">
          <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 text-left">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cursos Estruturados</h3>
            <p className="text-zinc-400">
              Organize treinos por semanas e dias, criando cursos completos para seus alunos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 text-left">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Vídeos do YouTube</h3>
            <p className="text-zinc-400">
              Vincule vídeos demonstrativos diretamente aos exercícios para melhor orientação.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 text-left">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <Library className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Catálogo de Cursos</h3>
            <p className="text-zinc-400">
              Alunos podem explorar e se inscrever em cursos públicos diretamente pela plataforma.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
