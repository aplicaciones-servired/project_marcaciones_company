import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthProvider';
import { Outlet } from 'react-router-dom';
import { LoginForm } from '@/app/Login';
import { Suspense } from 'react';

export const Root = () => {
  const { user } = useAuth();

  if (!user) {
    return <Suspense fallback={<div>Loading...</div>}><LoginForm /></Suspense>
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full h-screen'>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarProvider>
      <Toaster />
    </>
  )

}