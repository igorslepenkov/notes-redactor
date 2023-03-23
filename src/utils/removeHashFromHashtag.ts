export const removeHashFromHashtag = (hashtag: string) => {
  return hashtag.replace(/#/, "").trim().toLowerCase();
};
