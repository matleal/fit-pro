"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Debug de Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-zinc-400">Status:</p>
            <p className="text-white font-mono">{status}</p>
          </div>

          {session && (
            <div>
              <p className="text-zinc-400">Session:</p>
              <pre className="text-white font-mono text-sm bg-zinc-800 p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}

          {!session && status === "unauthenticated" && (
            <div>
              <p className="text-red-400">Não autenticado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
