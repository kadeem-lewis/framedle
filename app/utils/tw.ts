export const tw = (strings: TemplateStringsArray, ...vals: string[]) =>
  String.raw({ raw: strings }, ...vals);
