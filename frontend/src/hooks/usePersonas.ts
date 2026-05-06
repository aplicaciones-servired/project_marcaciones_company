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
          setPersonas(Array.isArray(response.data) ? response.data : []);
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
    const source = Array.isArray(personas) ? personas : [];

    return source.filter((p) => {
      if (!search) return true;
      return p.identificacion.includes(search) || p.nombres.toLowerCase().includes(search.toLowerCase()) || p.apellidos.toLowerCase().includes(search.toLowerCase());
    });
  }, [personas, search]);

  return { personas: personasFiltered, search, setSearch, loading, error, fechtDataAgain };
}