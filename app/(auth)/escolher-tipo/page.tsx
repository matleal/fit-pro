"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, GraduationCap, Loader2 } from "lucide-react";

export default function EscolherTipoPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<"TEACHER" | "STUDENT" | null>(null);

  // If already has a role set and not a new user, redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function handleSubmit() {
    if (!selected) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });

      if (response.ok) {
        // Update the session to reflect the new role
        await update();

        // Force redirect using window.location for a clean navigation
        const redirectUrl = selected === "TEACHER" ? "/professor" : "/aluno";
        window.location.href = redirectUrl;
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Erro ao atualizar tipo de usuário");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor");
      setIsLoading(false);
    }
  }

  // Show loading while checking session
  if (status === "loading") {
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

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4">
            <Dumbbell className="w-8 h-8 text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo ao FitPro!
          </h1>
          <p className="text-zinc-400">
            Como você pretende usar a plataforma?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelected("TEACHER")}
            className={`p-6 rounded-xl text-left transition-all ${
              selected === "TEACHER"
                ? "bg-emerald-500/10 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                : "bg-zinc-900/80 border-2 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Sou Personal Trainer
            </h3>
            <p className="text-zinc-400 text-sm">
              Crie programas de treino, adicione vídeos e gerencie seus alunos.
            </p>
          </button>

          <button
            onClick={() => setSelected("STUDENT")}
            className={`p-6 rounded-xl text-left transition-all ${
              selected === "STUDENT"
                ? "bg-cyan-500/10 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                : "bg-zinc-900/80 border-2 border-zinc-800 hover:border-zinc-700"
            }`}
          >
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Sou Aluno
            </h3>
            <p className="text-zinc-400 text-sm">
              Acesse os treinos criados pelo seu personal trainer.
            </p>
          </button>
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!selected || isLoading}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-12"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
