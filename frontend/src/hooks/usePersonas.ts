import { useState, useEffect, useMemo } from 'react';
import { Persona } from '@/types/Persona';
import { URL_API } from '@/utils/constants';
import axios from 'axios';

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fechtDataAgain = () => {
    setIsDataLoaded(false);
  }

  useEffect(() => {
    if (!isDataLoaded) {
      setLoading(true);
      setError(null);
      axios.get(`${URL_API}/personas`)
        .then((response) => {
          setPersonas(response.data);
          setIsDataLoaded(true);
        })
        .catch(error => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isDataLoaded]);


  const personasFiltered = useMemo(() => {
    return personas.filter((p) => {
      if (!search) return personas;
      return p.identificacion.includes(search) || p.nombres.toLowerCase().includes(search.toLowerCase()) || p.apellidos.toLowerCase().includes(search.toLowerCase());
    });
  }, [personas, search]);

  return { personas: personasFiltered, search, setSearch, loading, error, fechtDataAgain };
}