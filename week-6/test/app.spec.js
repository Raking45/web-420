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