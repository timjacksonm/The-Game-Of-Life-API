export const convertJSONToObject = (value: string[]) => {
  return value.reduce((acc, key) => {
    acc[key] = 1;
    return acc;
  }, {} as Record<string, number>);
};
