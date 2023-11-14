export const convertToSelectObject = (value: string[]) =>
  value.reduce(
    (acc, key) => {
      acc[key] = 1;
      return acc;
    },
    {} as Record<string, number>,
  );
