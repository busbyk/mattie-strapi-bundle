import { useState, useEffect } from 'react';
import { request } from '@strapi/helper-plugin';

const useConfig = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({});

  const abortController = new AbortController();
  const { signal } = abortController;

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await request(`/search/config`, {
        method: 'GET',
        signal,
      });
      setConfig(config);
      setIsLoading(false);
    };

    fetchConfig();

    return () => {
      abortController.abort();
      isMounted.current = false;
    };
  }, []);

  return { isLoading, config };
};

export default useConfig;
