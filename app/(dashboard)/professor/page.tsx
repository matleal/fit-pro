import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, UserPlus, Plus, ArrowRight } from "lucide-react";

export default async function ProfessorDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER") {
    redirect("/aluno");
  }

  const [coursesCount, enrollmentsCount, pendingInvites, recentCourses] = await Promise.all([
    prisma.course.count({ where: { teacherId: session.user.id } }),
    prisma.enrollment.count({
      where: {
        course: {
          teacherId: session.user.id,
        },
      },
    }),
    prisma.inviteCode.count({ where: { teacherId: session.user.id, used: false } }),
    prisma.course.findMany({
      where: { teacherId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { weeks: true, enrollments: true },
        },
      },
    }),
  ]);

  type RecentCourse = typeof recentCourses[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Olá, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-zinc-400 mt-1">
            Gerencie seus cursos e acompanhe seus alunos
          </p>
        </div>
        <Link href="/professor/cursos/novo">
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Cursos
            </CardTitle>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{coursesCount}</div>
            <p className="text-xs text-zinc-500 mt-1">
              cursos criados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Inscrições
            </CardTitle>
            <Users className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{enrollmentsCount}</div>
            <p className="text-xs text-zinc-500 mt-1">
              alunos inscritos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Convites Pendentes
            </CardTitle>
            <UserPlus className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{pendingInvites}</div>
            <p className="text-xs text-zinc-500 mt-1">
              aguardando uso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Cursos Recentes</CardTitle>
          <Link href="/professor/cursos">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentCourses.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 mb-4">Nenhum curso criado ainda</p>
              <Link href="/professor/cursos/novo">
                <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeiro curso
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCourses.map((course: RecentCourse) => (
                <Link
                  key={course.id}
                  href={`/professor/cursos/${course.id}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                >
                  <div>
                    <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {course._count.weeks} semanas · {course._count.enrollments} alunos
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
