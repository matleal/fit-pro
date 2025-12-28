"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import { YouTubeEmbed } from "@/components/youtube-embed";

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

interface Program {
  id: string;
  name: string;
  description: string | null;
  weeks: Week[];
}

interface WorkoutViewerProps {
  program: Program;
  initialWeek: number;
}

export function WorkoutViewer({ program, initialWeek }: WorkoutViewerProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    Math.max(0, Math.min(initialWeek - 1, program.weeks.length - 1))
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const currentWeek = program.weeks[currentWeekIndex];

  function goToPreviousWeek() {
    setCurrentWeekIndex((prev) => Math.max(0, prev - 1));
    setSelectedExercise(null);
  }

  function goToNextWeek() {
    setCurrentWeekIndex((prev) => Math.min(program.weeks.length - 1, prev + 1));
    setSelectedExercise(null);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/aluno"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para meus treinos
        </Link>
        <h1 className="text-3xl font-bold text-white">{program.name}</h1>
        {program.description && (
          <p className="text-zinc-400 mt-1">{program.description}</p>
        )}
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousWeek}
          disabled={currentWeekIndex === 0}
          className="border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            Semana {currentWeek?.weekNumber || 1}
          </h2>
          <p className="text-sm text-zinc-500">
            {currentWeekIndex + 1} de {program.weeks.length} semanas
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextWeek}
          disabled={currentWeekIndex === program.weeks.length - 1}
          className="border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Days tabs */}
      {currentWeek && (
        <Tabs defaultValue={currentWeek.days[0]?.id} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 w-full justify-start">
            {currentWeek.days.map((day: Day) => (
              <TabsTrigger
                key={day.id}
                value={day.id}
                onClick={() => setSelectedExercise(null)}
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 flex-1"
              >
                {day.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {currentWeek.days.map((day: Day) => (
            <TabsContent key={day.id} value={day.id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exercises list */}
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-white">{day.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {day.exercises.length === 0 ? (
                      <p className="text-zinc-500 text-center py-8">
                        Nenhum exercício neste dia
                      </p>
                    ) : (
                      day.exercises.map((exercise: Exercise, index: number) => (
                        <button
                          key={exercise.id}
                          onClick={() => setSelectedExercise(exercise)}
                          className={`w-full text-left p-4 rounded-lg transition-colors ${
                            selectedExercise?.id === exercise.id
                              ? "bg-emerald-500/10 border border-emerald-500/30"
                              : "bg-zinc-800/50 hover:bg-zinc-800 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-zinc-300">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white">
                                {exercise.name}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {exercise.sets && exercise.reps && (
                                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                    {exercise.sets} × {exercise.reps}
                                  </Badge>
                                )}
                                {exercise.rest && (
                                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                    {exercise.rest} descanso
                                  </Badge>
                                )}
                                {exercise.youtubeUrl && (
                                  <Badge className="bg-red-500/20 text-red-400">
                                    <Play className="w-3 h-3 mr-1" />
                                    Vídeo
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Exercise detail */}
                <Card className="bg-zinc-900 border-zinc-800 h-fit sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {selectedExercise ? selectedExercise.name : "Selecione um exercício"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedExercise ? (
                      <div className="space-y-6">
                        {/* Video */}
                        {selectedExercise.youtubeUrl && (
                          <YouTubeEmbed
                            url={selectedExercise.youtubeUrl}
                            title={selectedExercise.name}
                          />
                        )}

                        {/* Details */}
                        <div className="grid grid-cols-3 gap-4">
                          {selectedExercise.sets && (
                            <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                              <p className="text-2xl font-bold text-white">
                                {selectedExercise.sets}
                              </p>
                              <p className="text-sm text-zinc-500">Séries</p>
                            </div>
                          )}
                          {selectedExercise.reps && (
                            <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                              <p className="text-2xl font-bold text-white">
                                {selectedExercise.reps}
                              </p>
                              <p className="text-sm text-zinc-500">Reps</p>
                            </div>
                          )}
                          {selectedExercise.rest && (
                            <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                              <p className="text-2xl font-bold text-white">
                                {selectedExercise.rest}
                              </p>
                              <p className="text-sm text-zinc-500">Descanso</p>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {selectedExercise.notes && (
                          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                            <div className="flex items-center gap-2 text-emerald-400 mb-2">
                              <Info className="w-4 h-4" />
                              <span className="text-sm font-medium">Observações</span>
                            </div>
                            <p className="text-zinc-300 text-sm whitespace-pre-wrap">
                              {selectedExercise.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <Play className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">
                          Clique em um exercício para ver os detalhes e o vídeo demonstrativo
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
