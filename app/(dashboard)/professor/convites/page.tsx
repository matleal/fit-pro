"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Copy,
  Check,
  Trash2,
  UserPlus,
  Loader2,
  Clock,
} from "lucide-react";

interface InviteCode {
  id: string;
  code: string;
  used: boolean;
  usedByEmail: string | null;
  usedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export default function ConvitesPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  async function fetchInvites() {
    try {
      const response = await fetch("/api/invites");
      if (response.ok) {
        const data = await response.json();
        setInvites(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createInvite() {
    setIsCreating(true);
    try {
      const response = await fetch("/api/invites", {
        method: "POST",
      });

      if (response.ok) {
        const newInvite = await response.json();
        setInvites((prev) => [newInvite, ...prev]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }

  async function deleteInvite(id: string) {
    if (!confirm("Deseja realmente excluir este convite?")) return;

    try {
      const response = await fetch(`/api/invites/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInvites((prev) => prev.filter((inv: InviteCode) => inv.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function copyToClipboard(invite: InviteCode) {
    const inviteUrl = `${window.location.origin}/convite/${invite.code}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const pendingInvites = invites.filter((i: InviteCode) => !i.used);
  const usedInvites = invites.filter((i: InviteCode) => i.used);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/professor"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Convites</h1>
            <p className="text-zinc-400 mt-1">
              Gere códigos de convite para seus alunos se cadastrarem
            </p>
          </div>
          <Button
            onClick={createInvite}
            disabled={isCreating}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Gerar Convite
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      ) : invites.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <UserPlus className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Nenhum convite criado
            </h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Gere um código de convite e compartilhe com seus alunos para que eles se cadastrem automaticamente.
            </p>
            <Button
              onClick={createInvite}
              disabled={isCreating}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Gerar Primeiro Convite
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending invites */}
          {pendingInvites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Convites Pendentes ({pendingInvites.length})
              </h2>
              {pendingInvites.map((invite: InviteCode) => (
                <Card key={invite.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-lg text-white bg-zinc-800 px-3 py-1 rounded">
                              {invite.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(invite)}
                              className="text-zinc-400 hover:text-white"
                            >
                              {copiedId === invite.id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            Criado em {new Date(invite.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                          Aguardando
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteInvite(invite.id)}
                          className="text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Used invites */}
          {usedInvites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-400">
                Convites Utilizados ({usedInvites.length})
              </h2>
              {usedInvites.map((invite: InviteCode) => (
                <Card key={invite.id} className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <Check className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div>
                          <code className="font-mono text-zinc-500">
                            {invite.code}
                          </code>
                          <div className="text-sm text-zinc-600 mt-1">
                            Usado por {invite.usedByEmail} em{" "}
                            {invite.usedAt && new Date(invite.usedAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                        Utilizado
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
