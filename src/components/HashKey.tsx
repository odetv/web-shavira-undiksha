import CryptoJS from "crypto-js";

export const hashKey = (key: string): string => {
  const hash = CryptoJS.SHA256(key);
  return hash.toString(CryptoJS.enc.Hex);
};
