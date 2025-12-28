import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decimalToNumber } from '@/lib/utils';
import {
  Calendar,
  Globe,
  Lock,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CursosPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'TEACHER') {
    redirect('/login');
  }

  const courses = await prisma.course.findMany({
    where: { teacherId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { weeks: true, enrollments: true },
      },
    },
  });

  type CourseWithCount = typeof courses[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cursos</h1>
          <p className="text-zinc-400 mt-1">Gerencie seus cursos de treino</p>
        </div>
        <Link href="/professor/cursos/novo">
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Button>
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <Calendar className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Nenhum curso criado
            </h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Crie seu primeiro curso de treino para começar a organizar os
              treinos dos seus alunos.
            </p>
            <Link href="/professor/cursos/novo">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Criar primeiro curso
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: CourseWithCount) => (
            <Card
              key={course.id}
              className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/professor/cursos/${course.id}`}>
                      <CardTitle className="text-white group-hover:text-emerald-400 transition-colors cursor-pointer">
                        {course.name}
                      </CardTitle>
                    </Link>
                    {course.description && (
                      <CardDescription className="mt-1 line-clamp-2">
                        {course.description}
                      </CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-900 border-zinc-800"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/professor/cursos/${course.id}`}
                          className="flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:text-red-300">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Calendar className="w-4 h-4" />
                    <span>{course._count.weeks} semanas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Users className="w-4 h-4" />
                    <span>{course._count.enrollments} alunos</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={course.isActive ? 'default' : 'secondary'}
                    className={
                      course.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : ''
                    }
                  >
                    {course.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      course.isPublic
                        ? 'border-cyan-500/30 text-cyan-400'
                        : 'border-zinc-600 text-zinc-400'
                    }
                  >
                    {course.isPublic ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" /> Público
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Privado
                      </>
                    )}
                  </Badge>
                  {decimalToNumber(course.price) > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      R$ {(decimalToNumber(course.price) / 100).toFixed(2)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
