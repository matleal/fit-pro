"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Users,
  Search,
  Loader2,
  Check,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface Course {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  price: number;
  teacher: {
    id: string;
    name: string | null;
    image: string | null;
  };
  enrollmentCount: number;
  weeksCount: number;
  isEnrolled: boolean;
  createdAt: string;
}

export default function CatalogoPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const response = await fetch("/api/courses/catalog");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function enrollInCourse(courseId: string) {
    setEnrollingId(courseId);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        // Update local state
        setCourses((prev) =>
          prev.map((course: Course) =>
            course.id === courseId
              ? { ...course, isEnrolled: true, enrollmentCount: course.enrollmentCount + 1 }
              : course
          )
        );
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao se inscrever");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Erro ao se inscrever no curso");
    } finally {
      setEnrollingId(null);
    }
  }

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Catálogo de Cursos</h1>
        <p className="text-zinc-400 mt-1">
          Explore e inscreva-se nos cursos disponíveis
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <Input
          placeholder="Buscar cursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? "Nenhum curso encontrado" : "Nenhum curso disponível"}
            </h2>
            <p className="text-zinc-500">
              {searchQuery
                ? "Tente buscar por outros termos"
                : "Novos cursos serão adicionados em breve"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <Card
              key={course.id}
              className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-zinc-700" />
                  </div>
                )}
                {course.isEnrolled && (
                  <Badge className="absolute top-3 right-3 bg-emerald-500 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Inscrito
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={course.teacher.image || ""} />
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      {course.teacher.name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-lg line-clamp-1">
                      {course.name}
                    </CardTitle>
                    <p className="text-sm text-zinc-500">
                      Por {course.teacher.name}
                    </p>
                  </div>
                </div>
                {course.description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {course.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{course.weeksCount} semanas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollmentCount} alunos</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    {course.price === 0 ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400">Gratuito</Badge>
                    ) : (
                      <span className="text-lg font-bold text-white">
                        R$ {(course.price / 100).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {course.isEnrolled ? (
                    <Button
                      onClick={() => router.push(`/aluno/cursos/${course.id}`)}
                      className="bg-zinc-800 hover:bg-zinc-700"
                    >
                      Acessar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => enrollInCourse(course.id)}
                      disabled={enrollingId === course.id}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                      {enrollingId === course.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Inscrever-se"
                      )}
                    </Button>
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
