/*
Name: Robert King
Date: February 23, 2025
File Name: app.spec.js
Description:  API PUT Endpoint and Error Handling Using TDD Principles.
Tests for Chapter 6: 1. Should log a user in and return a 200-status with 'Authentication Successful.
2. Should return a 401-status code with 'Unauthorized' message when logging in with incorrect credentials.
3. Should return a 400-status code with 'Bad Request' when missing email or password.
*/

const app = require("../src/app");
const request = require("supertest");
const bcrypt = require("bcryptjs")


jest.mock("../database/users", () => ({
  findOne: jest.fn()
}));
const mockedUsers = require("../database/users");

// Hands-On 6.1: Implementing User Authentication (Assignment 7.2)
describe("Chapter 6 POST /api/login Test", () => {
  beforeEach(() => {
    mockedUsers.findOne.mockReset();
  });

  it("Should log a user in and return 200-status with 'Authentication successful'", async () => {
    mockedUsers.findOne.mockResolvedValue({
      email: "test@example.com",
      password: bcrypt.hashSync("password123", 10)
    });
    
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Authentication successful");
  });

  it("Should return a 401-status code with 'Unauthorized' message when logging in with incorrect credentials", async () => {
    mockedUsers.findOne.mockResolvedValue({
      email: "test@example.com",
      password: bcrypt.hashSync("password123", 10)
    });
    
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "wrongpassword" });
    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  it("Should return a 400-status code with 'Bad Request' when missing email or password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com" });
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual("Email and password are required.");
  });
});

module.exports = app;
