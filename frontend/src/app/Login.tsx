import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { URL_API_LOGIN } from '@/utils/constants';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from "@/context/AuthProvider";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FormEvent, useState } from "react";
import { cn } from '@/lib/utils';
import axios from "axios";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setIsAuthenticated, fetchUser } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setLoading(true)

    try {
      const res = await axios.post(`${URL_API_LOGIN}/login`, { username, password })
      
      if (res.status === 200) {

        // Obtener el perfil del usuario
        await fetchUser()
        setIsAuthenticated(true)
      }
    } catch (error: unknown) {
      console.log(error)
      
      const err = error as { message?: string; response?: { status?: number; data?: { message?: string; description?: string } } }
      
      if (err.message === 'Network Error') {
        toast({ title: 'Error', description: 'No se pudo conectar al servidor' })
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        toast({ 
          title: err.response.data?.message || 'Error', 
          description: err.response.data?.description || 'Credenciales inválidas' 
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='w-screen h-screen flex items-center justify-center'>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese su usuario y contraseña para acceder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col gap-6'>
                <div className='grid gap-2'>
                  <Label htmlFor='username'>Usuario:</Label>
                  <Input
                    id='username'
                    type='text'
                    placeholder='CP1118*******'
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    required
                  />
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Contraseña:</Label>
                  </div>
                  <Input
                    id='password'
                    type='password'
                    placeholder='•••••••••'
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    required
                  />
                </div>
                <Button
                  disabled={loading}
                  type='submit'
                >
                  {
                    loading ? <div className='flex items-center justify-center gap-2'>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"></path>
                      </svg>
                      Iniciando ...</div> : 'Iniciar Sesion'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </section>
  )
}