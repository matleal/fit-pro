import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { MobileHeader } from '@/components/dashboard/mobile-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = session.user.role;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Desktop Sidebar */}
      <Sidebar role={role} />

      {/* Mobile Header */}
      <MobileHeader role={role} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
