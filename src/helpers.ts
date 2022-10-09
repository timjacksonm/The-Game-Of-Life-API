export const convertJSONToObject = (value: string) => {
  return JSON.parse(value).reduce(
    (acc: { [x: string]: number }, curr: string | number) => (
      (acc[curr] = 1), acc
    ),
    {}
  );
};
