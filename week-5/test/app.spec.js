/*
Name: Robert King
Date: February 9, 2025
File Name: app.spec.js
Description:  API PUT Endpoint and Error Handling Using TDD Principles.
Tests for Chapter 5: 1. Should update a book and return a 204-status code.
2. Should return a 400-status code when using a non-numeric id.
3. Should return a 400-status code when updating a book with a missing title.
*/

const app = require("../src/app");
const request = require("supertest");
const books = require("../database/books")

jest.mock("../database/books");

// Hands-On 4.1: Manipulating Data in Your Web Service Tests(Assignment 5.2)
describe("Chapter 4: API Tests", () => {
  test("Should return a 201 status code when adding a new book", async () => {
  
    const response = await request(app)
      .post("/api/books")
      .send({ id: 6, title: "Dragons of Autumn Twilight", author: "Margret Weis and Tracy Hickman"});
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Dragons of Autumn Twilight");
  });

  test("Should return a 400 status code when adding a new book with missing title", async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ id: 2, author: "Margaret Weis and Tracy Hickman" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title is required.");
  })

  test("Should return a 204 status code when book is successfully deleted", async () => {
    books.deleteOne.mockResolvedValue({ deletedCount: 1 });
    await request(app).post("/api/books").send({ id: 5, title: "The Return of the King", author: "J.R.R. Tolkien" });
    const response = await request(app).delete("/api/books/5");
    expect(response.status).toBe(204);
  });
});

// Hands-On 5.1: Manipulating Data in Your Web Service Tests(Assignment 6.2)
describe("Chapter 5: API Tests", () => {
  test("Should update a book and return a 204 status code", async () => {
    books.updateOne.mockResolvedValue({ id: 1, title: "Dragons of Autumn Twilight", author: "Margaret Weis and Tracy Hickman" });

    const response = await request(app)
      .put("/api/books/1")
      .send({ title: "Dragons of Autumn Twilight", author: "Margaret Weis and Tracy Hickman" });

    expect(response.status).toBe(204);
  });

  test("Should return a 400 status code when using a non-numeric id", async () => {
    const response = await request(app)
      .put("/api/books/foo")
      .send({ title: "Dragons of Autumn Twilight" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book ID must be a number.");
  });

  test("Should return a 400 status code when updating a book with a missing title", async () => {
    const response = await request(app)
      .put("/api/books/1")
      .send({ author: "Margaret Weis and Tracy Hickman" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Book title is required.");
  });
}); 