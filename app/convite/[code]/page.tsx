import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { JoinWithInviteForm } from "./join-form";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ConvitePage({ params }: PageProps) {
  const { code } = await params;
  const session = await auth();

  // Find the invite code
  const invite = await prisma.inviteCode.findUnique({
    where: { code },
    include: {
      teacher: {
        select: { id: true, name: true, image: true },
      },
      course: {
        select: { id: true, name: true, description: true },
      },
    },
  });

  if (!invite) {
    notFound();
  }

  if (invite.used) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Convite já utilizado</h1>
          <p className="text-zinc-400">Este código de convite já foi usado.</p>
        </div>
      </div>
    );
  }

  // If user is logged in, process the invite
  if (session?.user) {
    // If invite is linked to a course, enroll user
    if (invite.courseId) {
      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: invite.courseId,
            userId: session.user.id,
          },
        },
      });

      if (!existingEnrollment) {
        // Create enrollment
        await prisma.enrollment.create({
          data: {
            courseId: invite.courseId,
            userId: session.user.id,
            isPaid: true, // Invites give free access
          },
        });
      }
    }

    // Mark invite as used
    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: {
        used: true,
        usedAt: new Date(),
        usedByEmail: session.user.email,
      },
    });

    // Redirect to course if linked, otherwise to dashboard
    if (invite.courseId) {
      redirect(`/aluno/cursos/${invite.courseId}`);
    }
    redirect("/aluno");
  }

  // Show form to login and accept invite
  return (
    <JoinWithInviteForm
      invite={invite}
      teacher={invite.teacher}
      course={invite.course}
    />
  );
}
