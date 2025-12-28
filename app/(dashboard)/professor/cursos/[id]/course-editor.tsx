"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Video,
  Save,
  Loader2,
  Users,
  Globe,
  Lock,
} from "lucide-react";
import { YouTubeEmbed, YouTubeThumbnail } from "@/components/youtube-embed";

interface Exercise {
  id: string;
  name: string;
  youtubeUrl: string | null;
  notes: string | null;
  sets: number | null;
  reps: string | null;
  rest: string | null;
  orderIndex: number;
}

interface Day {
  id: string;
  dayNumber: number;
  name: string;
  exercises: Exercise[];
}

interface Week {
  id: string;
  weekNumber: number;
  name: string | null;
  days: Day[];
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Enrollment {
  id: string;
  user: User;
}

interface Course {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isPublic: boolean;
  price: number;
  weeks: Week[];
  enrollments: Enrollment[];
}

interface CourseEditorProps {
  course: Course;
}

export function CourseEditor({ course: initialCourse }: CourseEditorProps) {
  const router = useRouter();
  const [course, setCourse] = useState(initialCourse);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(course.weeks[0]?.id || "");
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Partial<Exercise> | null>(null);

  const currentWeek = course.weeks.find((w: Week) => w.id === selectedWeek);

  async function saveCourse() {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: course.name,
          description: course.description,
          isActive: course.isActive,
          isPublic: course.isPublic,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar curso");
    } finally {
      setIsSaving(false);
    }
  }

  async function addExercise(dayId: string) {
    if (!editingExercise?.name) return;

    try {
      const response = await fetch(`/api/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingExercise,
          dayId,
        }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar exercício");

      const newExercise = await response.json();

      setCourse((prev) => ({
        ...prev,
        weeks: prev.weeks.map((week: Week) => ({
          ...week,
          days: week.days.map((day: Day) =>
            day.id === dayId
              ? { ...day, exercises: [...day.exercises, newExercise] }
              : day
          ),
        })),
      }));

      setExerciseDialogOpen(false);
      setEditingExercise(null);
      setSelectedDay(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar exercício");
    }
  }

  async function updateExercise(exerciseId: string, dayId: string) {
    if (!editingExercise?.name) return;

    try {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExercise),
      });

      if (!response.ok) throw new Error("Erro ao atualizar exercício");

      const updatedExercise = await response.json();

      setCourse((prev) => ({
        ...prev,
        weeks: prev.weeks.map((week: Week) => ({
          ...week,
          days: week.days.map((day: Day) =>
            day.id === dayId
              ? {
                  ...day,
                  exercises: day.exercises.map((ex: Exercise) =>
                    ex.id === exerciseId ? updatedExercise : ex
                  ),
                }
              : day
          ),
        })),
      }));

      setExerciseDialogOpen(false);
      setEditingExercise(null);
      setSelectedDay(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar exercício");
    }
  }

  async function deleteExercise(exerciseId: string, dayId: string) {
    if (!confirm("Deseja realmente excluir este exercício?")) return;

    try {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir exercício");

      setCourse((prev) => ({
        ...prev,
        weeks: prev.weeks.map((week: Week) => ({
          ...week,
          days: week.days.map((day: Day) =>
            day.id === dayId
              ? { ...day, exercises: day.exercises.filter((ex: Exercise) => ex.id !== exerciseId) }
              : day
          ),
        })),
      }));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir exercício");
    }
  }

  function openExerciseDialog(day: Day, exercise?: Exercise) {
    setSelectedDay(day);
    setEditingExercise(
      exercise || {
        name: "",
        youtubeUrl: "",
        notes: "",
        sets: 3,
        reps: "10-12",
        rest: "60s",
      }
    );
    setExerciseDialogOpen(true);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/professor/cursos"
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para cursos
          </Link>
          <div className="flex items-center gap-4">
            <Input
              value={course.name}
              onChange={(e) => setCourse({ ...course, name: e.target.value })}
              className="text-2xl font-bold bg-transparent border-none text-white p-0 h-auto focus-visible:ring-0"
            />
            <Badge
              variant={course.isActive ? "default" : "secondary"}
              className={course.isActive ? "bg-emerald-500/20 text-emerald-400" : ""}
            >
              {course.isActive ? "Ativo" : "Inativo"}
            </Badge>
            <Badge
              variant="outline"
              className={course.isPublic ? "border-cyan-500/30 text-cyan-400" : "border-zinc-600 text-zinc-400"}
            >
              {course.isPublic ? (
                <><Globe className="w-3 h-3 mr-1" /> Público</>
              ) : (
                <><Lock className="w-3 h-3 mr-1" /> Privado</>
              )}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
            <Users className="w-4 h-4 mr-2" />
            {course.enrollments.length} alunos
          </Button>
          <Button
            onClick={saveCourse}
            disabled={isSaving}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      {/* Week tabs */}
      <Tabs value={selectedWeek} onValueChange={setSelectedWeek} className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 flex-wrap h-auto gap-1">
          {course.weeks.map((week: Week) => (
            <TabsTrigger
              key={week.id}
              value={week.id}
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              Semana {week.weekNumber}
            </TabsTrigger>
          ))}
        </TabsList>

        {course.weeks.map((week: Week) => (
          <TabsContent key={week.id} value={week.id} className="space-y-6">
            {/* Days grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {week.days.map((day: Day) => (
                <Card key={day.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{day.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openExerciseDialog(day)}
                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Exercício
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {day.exercises.length === 0 ? (
                      <p className="text-sm text-zinc-500 text-center py-8">
                        Nenhum exercício adicionado
                      </p>
                    ) : (
                      day.exercises.map((exercise: Exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                        >
                          <GripVertical className="w-4 h-4 text-zinc-600 mt-1 cursor-grab" />

                          {exercise.youtubeUrl && (
                            <div className="w-20 flex-shrink-0">
                              <YouTubeThumbnail url={exercise.youtubeUrl} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => openExerciseDialog(day, exercise)}
                              className="font-medium text-white text-left hover:text-emerald-400 transition-colors"
                            >
                              {exercise.name}
                            </button>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {exercise.sets && exercise.reps && (
                                <span className="text-xs text-zinc-500">
                                  {exercise.sets}x{exercise.reps}
                                </span>
                              )}
                              {exercise.rest && (
                                <span className="text-xs text-zinc-500">
                                  · {exercise.rest}
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExercise(exercise.id, day.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Exercise Dialog */}
      <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingExercise?.id ? "Editar Exercício" : "Novo Exercício"}
            </DialogTitle>
            <DialogDescription>
              Adicione os detalhes do exercício e um vídeo do YouTube para demonstração.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Nome do Exercício</Label>
              <Input
                placeholder="Ex: Supino Reto"
                value={editingExercise?.name || ""}
                onChange={(e) =>
                  setEditingExercise({ ...editingExercise, name: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Séries</Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="3"
                  value={editingExercise?.sets || ""}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      sets: parseInt(e.target.value) || null,
                    })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Repetições</Label>
                <Input
                  placeholder="10-12"
                  value={editingExercise?.reps || ""}
                  onChange={(e) =>
                    setEditingExercise({ ...editingExercise, reps: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Descanso</Label>
                <Input
                  placeholder="60s"
                  value={editingExercise?.rest || ""}
                  onChange={(e) =>
                    setEditingExercise({ ...editingExercise, rest: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Video className="w-4 h-4" />
                URL do YouTube
              </Label>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={editingExercise?.youtubeUrl || ""}
                onChange={(e) =>
                  setEditingExercise({ ...editingExercise, youtubeUrl: e.target.value })
                }
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              {editingExercise?.youtubeUrl && (
                <div className="mt-3">
                  <YouTubeEmbed
                    url={editingExercise.youtubeUrl}
                    title={editingExercise.name || "Preview"}
                    className="max-w-md"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white">Observações</Label>
              <Textarea
                placeholder="Dicas de execução, cuidados, variações..."
                value={editingExercise?.notes || ""}
                onChange={(e) =>
                  setEditingExercise({ ...editingExercise, notes: e.target.value })
                }
                rows={3}
                className="bg-zinc-800 border-zinc-700 text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setExerciseDialogOpen(false);
                setEditingExercise(null);
                setSelectedDay(null);
              }}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selectedDay) {
                  if (editingExercise?.id) {
                    updateExercise(editingExercise.id, selectedDay.id);
                  } else {
                    addExercise(selectedDay.id);
                  }
                }
              }}
              disabled={!editingExercise?.name}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              {editingExercise?.id ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
