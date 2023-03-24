export const tagRegExp = /(?<=[\s,.:;"']|^)#[a-zа-я0-9]+(?=[\s,.:;"']|$)/gim;
export const regexpWordsMatchingTag = (tag: string): RegExp => {
  return new RegExp(`(?<=[\\s,.:;"']|^)(${tag})(?=[\\s,.:;"']|$)`, "gim");
};
