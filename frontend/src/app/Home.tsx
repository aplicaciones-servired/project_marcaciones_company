import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ChartDonutMar } from '@/components/Chart-circle';
import { InfoMarcacion } from '@/types/interfaces';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { URL_API } from '@/utils/constants';
import { Users } from 'lucide-react';
import axios from 'axios';

function Home() {
  const [infoMarcacion, setInfoMarcacion] = useState<InfoMarcacion>()
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    axios.get(`${URL_API}/infoMarcacion`, { params: { fecha: date } })
      .then(res => setInfoMarcacion(res.data))
      .catch(err => console.error(err))
  }, [date])

  console.log('infoMarcacion', infoMarcacion)

  return (
    <main className='grid grid-rows-3 grid-flow-col gap-1'>

      <Card className='row-span-3 flex flex-col'>
        <Input type='date' className='w-36 m-2' value={date} onChange={ev => setDate(ev.target.value)} />
        <ChartDonutMar items={infoMarcacion?.marcaciones} count={infoMarcacion?.count} />
      </Card>

      <Card className='row-span-2 col-span-2 p-4'>
        <div className='flex justify-between px-6 font-semibold'>
          <h1>Descripción Áreas</h1>
          <h1>Empleados</h1>
        </div>

        <CardContent className='flex flex-col items-center justify-center h-full gap-2 px-8'>
          {
            infoMarcacion?.areas && infoMarcacion.areas.length > 0 ? (
              infoMarcacion.areas.map((a, i) => (
                <div className='flex w-full justify-between' key={i} >
                  {
                    a.des === null
                      ? (
                        <span className='bg-yellow-100 px-2 py-1 rounded-md text-red-600 '>
                          Sin área asignada
                        </span>
                      )
                      : <span className='bg-indigo-100 px-2 py-1 rounded-md text-indigo-800'>
                        {a.des}
                      </span>
                  }
                  <h1>{a.cant}</h1>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No hay datos disponibles</p>
            )
          }

        </CardContent>
      </Card>

      <Card className='col-span-2 flex items-center justify-around gap-2 p-4'>
        <CardTitle className='text-center py-1'>
          N° Empleados Activos:
        </CardTitle>

        <span className='bg-indigo-100 px-2 py-1 rounded-md text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 text-xl'>
          {infoMarcacion?.totalPersona}
        </span>
        <Users size={60} />

      </Card>

    </main >
  )
}

export default Home;