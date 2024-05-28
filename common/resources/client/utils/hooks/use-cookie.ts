import {useCallback, useEffect, useState} from 'react';
import {isSsr} from '@common/utils/dom/is-ssr';

interface Options {
  days?: number;
  path?: string;
  domain?: string;
  SameSite?: 'None' | 'Lax' | 'Strict';
  Secure?: boolean;
  HttpOnly?: boolean;
}

// used to notify different instances of useCookie hook about cookie changes
const listeners = new Set<{name: string; callback: any}>();
const listenForCookieChange = (
  name: string,
  callback: (value: string) => void,
) => {
  if (isSsr()) return () => {};
  const listener = {name, callback};
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function stringifyOptions(options: Options) {
  return Object.keys(options).reduce((acc, _key) => {
    const key = _key as keyof Options;
    if (key === 'days') {
      return acc;
    } else {
      if (options[key] === false) {
        return acc;
      } else if (options[key] === true) {
        return `${acc}; ${key}`;
      } else {
        return `${acc}; ${key}=${options[key]}`;
      }
    }
  }, '');
}

export const setCookie = (name: string, value: string, options?: Options) => {
  if (isSsr()) return;

  const optionsWithDefaults = {
    days: 7,
    path: '/',
    ...options,
  };

  const expires = new Date(
    Date.now() + optionsWithDefaults.days * 864e5,
  ).toUTCString();

  document.cookie =
    name +
    '=' +
    encodeURIComponent(value) +
    '; expires=' +
    expires +
    stringifyOptions(optionsWithDefaults);

  listeners.forEach(listener => {
    if (listener.name === name) {
      listener.callback(value);
    }
  });
};

export function getCookie(name: string, initialValue = '') {
  return (
    (!isSsr() &&
      document.cookie &&
      document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
      }, '')) ||
    initialValue
  );
}

export function useCookie(key: string, initialValue?: string) {
  const [item, setItem] = useState(() => {
    return getCookie(key, initialValue);
  });

  useEffect(() => {
    return listenForCookieChange(key, value => {
      setItem(value);
    });
  }, [key]);

  const updateItem = useCallback(
    (value: string, options?: Options) => {
      setItem(value);
      setCookie(key, value, options);
    },
    [key],
  );

  return [item, updateItem] as const;
}
