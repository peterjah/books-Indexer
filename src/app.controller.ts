import {
  Body,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/books")
  @Header("Content-type", "application/vnd.api+json")
  addBook(@Body() book: { title: string; content: string }): void {
    // add or update book
    this.appService.addBook(book.title, book.content);
  }

  @Get("/books/:title")
  getBook(
    @Param("title") title: BookTitle,
    @Query("fromPage") fromPage: string
  ): string {
    console.log("title", title);
    console.log("fromPage", fromPage);
    console.log("fromPage", parseInt(fromPage));
    const content = this.appService.getBookByTitle(title);
    if (!content) {
      throw new NotFoundException();
    }

    const paginated = this.appService.toPagination(content, fromPage)
    console.log("paginated content leng",paginated.length, paginated.join(" "))

    return this.appService.toPagination(content, fromPage).join(" ");
  }

  @Get("/books")
  getAll(): BookTitle[] {
    return this.appService.getAll();
  }

  @Get("/search")
  searchBooks(@Query("words") words: string): BookTitle[] {
    const search = words.split(",");
    const res = this.appService.searchBooks(search);
    if (!res.length) {
      throw new NotFoundException();
    }
    return res;
  }
}
