export const formatTime = (date: Date, locale: string = 'pt-BR'): string => {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isRouteActive = (currentPath: string, path: string): boolean => {
  return currentPath === path;
};

export const buildRoute = (base: string, path: string): string => {
  return `${base}${path}`;
};
