'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dumbbell, Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is already authenticated, redirect
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = session.user.role;
      const redirectUrl = role === 'TEACHER' ? '/professor' : '/aluno';
      router.push(redirectUrl);
    }
  }, [status, session, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative bg-zinc-900/80 backdrop-blur-xl border-zinc-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Dumbbell className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              FitPro
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2">
              Plataforma de treinos para personal trainers
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-3">
            <Button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              variant="outline"
              className="w-full h-12 bg-white hover:bg-zinc-100 text-zinc-900 border-0 font-medium text-base"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900 text-zinc-500">
                Para professores e alunos
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Ao continuar, você concorda com nossos{' '}
            <a
              href="#"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Termos de Uso
            </a>{' '}
            e{' '}
            <a
              href="#"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Política de Privacidade
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
