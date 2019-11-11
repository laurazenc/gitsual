// @flow

export const pick = (obj: T, paths: K[]): Pick<T, K> => {
  return {
    ...paths.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {})
  };
};
