/*
Name: Robert King
Date: February 2, 2025
File Name: app.spec.js
Description:  API GET endpoints and middleware error update for testing.
Tests for Chapter 4: 1. GET an Array of books.  2. GET a single book by ID.  3. 400 Error if ID is NaN.
*/

const app = require("../src/app");
const request = require("supertest");

//Test to return an Array of books
describe("Chapter 4:API Tests: Get /api/books", () => {
  it("should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

//Test to return a book by ID and return a 400 error if ID is NaN
describe("Chapter 4:API Test: GET /api/books/:id", () => {
  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title", "The Fellowship of the Ring");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
  });

  it("should return a 400 error if the id is NaN", async () => {
    const res = await request(app).get("/api/books/notanumber");
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number.");
  });
});
});

  