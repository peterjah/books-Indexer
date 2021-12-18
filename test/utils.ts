export const createBookContent = (nbWords: number = 10000): string => {
  let n = 0;
  let content: string = "";
  while (n < nbWords) {
    const wordLength = (n % 15) + 1;
    if (n) {
      content = content.concat(" ");
    }
    content = content.concat(
      Buffer.from(`a random word ${Date.now() + n}`, "utf8")
        .toString("hex")
        .substring(0, wordLength)
    );
    ++n;
  }
  return content;
};
