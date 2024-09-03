export default function useEncoder() {
  const key = "framedle";
  const xorEncrypt = (data: string, key: string) => {
    return data
      .split("")
      .map((char, i) =>
        String.fromCharCode(
          char.charCodeAt(0) ^ key.charCodeAt(i % key.length),
        ),
      )
      .join("");
  };

  const encode = (text: string) => {
    const encrypted = xorEncrypt(text, key);
    return encodeURI(btoa(encrypted));
  };

  const decode = (text: string) => {
    const decoded = decodeURI(atob(text));
    return xorEncrypt(decoded, key);
  };

  return { encode, decode };
}
