'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NovoCursoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weeksCount, setWeeksCount] = useState(4);
  const [isPublic, setIsPublic] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          weeksCount,
          isPublic,
          price: 0, // Free for now
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar curso');
      }

      const course = await response.json();
      router.push(`/professor/cursos/${course.id}`);
    } catch (error) {
      console.error(error);
      alert('Erro ao criar curso');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/professor/cursos"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para cursos
        </Link>
        <h1 className="text-3xl font-bold text-white">Novo Curso</h1>
        <p className="text-zinc-400 mt-1">
          Crie um novo curso de treino para seus alunos
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Informações do Curso</CardTitle>
          <CardDescription>
            Preencha os dados básicos do curso. Você poderá adicionar semanas,
            dias e exercícios depois.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome do Curso
              </Label>
              <Input
                id="name"
                placeholder="Ex: Hipertrofia Iniciante"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Descrição (opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo e características do curso..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeks" className="text-white">
                Número de Semanas
              </Label>
              <Input
                id="weeks"
                type="number"
                min={1}
                max={52}
                value={weeksCount}
                onChange={(e) => setWeeksCount(parseInt(e.target.value) || 1)}
                className="bg-zinc-800 border-zinc-700 text-white w-32"
              />
              <p className="text-xs text-zinc-500">
                Você pode adicionar mais semanas depois
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
              <div>
                <Label className="text-white">Curso Público</Label>
                <p className="text-sm text-zinc-500">
                  Cursos públicos aparecem no catálogo para todos os alunos
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !name}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Curso
              </Button>
              <Link href="/professor/cursos">
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
