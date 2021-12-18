import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AppService, DEFAULT_PAGE_SIZE } from "../src/app.service";
import { createBookContent } from "./utils";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let bookService: AppService;
  let randomBookContent: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    bookService = app.get<AppService>(AppService);

    randomBookContent = createBookContent();
  });

  it("/books (POST)", async () => {
    const title = "MyBook";
    await request(app.getHttpServer())
      .post("/books")
      .send({ title, content: randomBookContent })
      .expect(201);

    const content = bookService.getBookByTitle(title);
    expect(content.join(" ")).toEqual(randomBookContent)

  });

  it("/books/:title (GET)", () => {
    const title = "MyAwesomeBook";
    bookService.addBook(title, randomBookContent);

    return request(app.getHttpServer())
      .get(`/books/${title}`)
      .expect(200)
      .expect(randomBookContent.split(" ").slice(0, DEFAULT_PAGE_SIZE).join(" "));
  });

  it("/books/:title (GET) with pagination", () => {
    const title = "MyAwesomeBook";
    bookService.addBook(title, randomBookContent);
    const fromPage = 2;
    return request(app.getHttpServer())
      .get(`/books/${title}`)
      .query({ fromPage })
      .expect(200)
      .expect(
        randomBookContent
          .split(" ")
          .slice(
            DEFAULT_PAGE_SIZE * fromPage,
            (fromPage + 1) * DEFAULT_PAGE_SIZE
          )
          .join(" ")
      );
  });

  it("/books (GET) - get all books titles", () => {
    const book1 = "MyAwesomeBook";
    bookService.addBook(book1, randomBookContent);
    const book2 = "AnotherAwesomeBook";
    bookService.addBook(book2, randomBookContent);

    return request(app.getHttpServer())
      .get(`/books`)
      .expect(200)
      .expect([book1, book2]);
  });

  it("/search (GET) - search book by single word", async () => {
    const book1 = "MyAwesomeBook";
    bookService.addBook(book1, "this is my story");

    const book2 = "AnotherAwesomeBook";
    bookService.addBook(book2, "this is my tralala");

    await request(app.getHttpServer())
      .get(`/search`)
      .query({ words: "story" })
      .expect(200)
      .expect([book1]);

    await request(app.getHttpServer())
      .get(`/search`)
      .query({ words: "this" })
      .expect(200)
      .expect([book1, book2]);
  });

  it("/search (GET) - search book by multiple words", () => {
    const book1 = "MyAwesomeBook";
    bookService.addBook(book1, "the is my story");

    const book2 = "MyAwesomeBook";
    bookService.addBook(book1, "the is my tralala");

    return request(app.getHttpServer())
      .get(`/search`)
      .query({ words: "story,my" })
      .expect(200)
      .expect([book1]);
  });
});
