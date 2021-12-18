import { Injectable } from "@nestjs/common";

export const DEFAULT_PAGE_SIZE: number = 10;

@Injectable()
export class AppService {
  private books: Record<BookTitle, BookContent> = {};
  private booksByWords: Record<string, BookTitle[]> = {};

  public addBook(title: BookTitle, content: string): void {
    const words: BookContent = content.split(" ");
    this.books[title] = words;
    // basic by-word indexation
    for (let word of words) {
      if (this.booksByWords[word]) {
        this.booksByWords[word].push(title);
      } else {
        this.booksByWords[word] = [title];
      }
    }
  }

  public getBookByTitle(title: BookTitle): BookContent | undefined {
    return this.books[title];
  }

  public getAll(): BookTitle[] {
    return Object.keys(this.books);
  }

  public searchBooks(words: string[]): BookTitle[] {
    let books: BookTitle[];
    let idx = 0;
    for (let word of words) {
      if (this.booksByWords[word]) {
        if (words.length === 1) {
          return this.booksByWords[word];
        }
        if (!idx) {
          // only first elt
          books = this.booksByWords[word];
        } else {
          // get books array intersection
          books = books.filter((book) =>
            this.booksByWords[word].includes(book)
          );
        }
      }
      ++idx;
    }
    return books;
  }

  public toPagination(
    content: BookContent,
    fromPage?: string
  ): BookContent | undefined {
    let from: number;
    if (fromPage) {
      from = parseInt(fromPage);
    } else {
      from = 0;
    }
    return content.slice(
      from * DEFAULT_PAGE_SIZE,
      (from + 1) * DEFAULT_PAGE_SIZE
    );
  }
}
