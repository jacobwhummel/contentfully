import { useQuery } from 'react-query';
import { BASE_URL } from '../constants/constants';
import { useAppSelector } from '../storage/store';
import { LocaleCode } from '../typings/locale';

export type Locale = {
  name?: string;
  internal_code?: string;
  code?: LocaleCode;
  fallbackCode?: string;
  default?: false;
  contentManagementApi?: true;
  contentDeliveryApi?: true;
  optional?: true;
  sys?: {
    type?: string;
    id?: string;
    version?: number;
    space?: {
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
    };
    environment?: {
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
        uuid?: string;
      };
    };
    createdBy?: {
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
    };
    createdAt?: string;
    updatedBy?: {
      sys?: {
        type?: string;
        linkType?: string;
        id?: string;
      };
    };
    updatedAt?: string;
  };
};

type Response = {
  sys?: {
    type?: 'Array';
  };
  total?: number;
  skip?: number;
  limit?: number;
  items?: Locale[];
};

export const useLocales = () => {
  const {
    tokens: { selected },
    space: { space, environment },
  } = useAppSelector(state => state);

  return useQuery<Response, Error>(
    ['locales', space, environment],
    async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/spaces/${space}/environments/${environment}/locales`,
          {
            headers: {
              Authorization: `Bearer ${selected?.content}`,
            },
          },
        );

        return response.json();
      } catch (error) {
        return error;
      }
    },
    { enabled: !!space && !!environment && !!selected },
  );
};

export const useLocale = () => {
  const {
    tokens: { selected },
    space: { space, environment },
  } = useAppSelector(state => state);

  return useQuery<Locale, Error>(
    ['locale', space, environment],
    async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/spaces/${space}/environments/${environment}/locales`,
          {
            headers: {
              Authorization: `Bearer ${selected?.content}`,
            },
          },
        );

        return response.json();
      } catch (error) {
        return error;
      }
    },
    { enabled: !!space && !!environment && !!selected },
  );
};

export const useDefaultLocale = () => {
  const {
    tokens: { selected },
    space: { space, environment },
  } = useAppSelector(state => state);

  return useQuery<Response, Error, Locale | undefined>(
    ['locales', 'default', space, environment],
    async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/spaces/${space}/environments/${environment}/locales`,
          {
            headers: {
              Authorization: `Bearer ${selected?.content}`,
            },
          },
        );

        return response.json();
      } catch (error) {
        return error;
      }
    },
    {
      enabled: !!space && !!environment,
      select: data => data?.items?.find(item => item.default),
    },
  );
};
