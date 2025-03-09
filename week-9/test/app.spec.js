/*
Name: Robert King
Date: March 2, 2025
File Name: app.spec.js
Description:  API POST Endpoint and Error Handling Using TDD Principles.
Tests for Chapter 7: 1. Should return a 200 status with 'Security questions successfully answered' message.
2. Should return a 400 status code with 'Bad Request' message when the request body fails ajv validation.
3. Should return a 401 status code with 'Unauthorized' message when the security questions are incorrect.
*/

const app = require("../src/app");
const request = require("supertest");

jest.mock("../database/users", () => ({
  findOne: jest.fn(),
}));
const users = require("../database/users");

describe("Chapter 7: API Tests", () => {
  const mockEmail = "test@example.com";
  const mockUser = {
    email: mockEmail,
    securityAnswers: {
      answer1: "correctAnswer1",
      answer2: "correctAnswer2",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("It should return a 200 status with 'Security questions successfully answered' message", async () => {
    users.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post(`/api/users/${mockEmail}/verify-security-question`)
      .send({ answer1: "correctAnswer1", answer2: "correctAnswer2" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Security questions successfully answered." });
  });

  test("It should return a 400 status code with 'Bad Request' message when the request body fails ajv validation", async () => {
    const res = await request(app)
      .post(`/api/users/${mockEmail}/verify-security-question`)
      .send({ invalidField: "wrong" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Invalid request format." });
  });

  test("It should return a 401 status code with 'Unauthorized' message when the security questions are incorrect", async () => {
    users.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post(`/api/users/${mockEmail}/verify-security-question`)
      .send({ answer1: "wrongAnswer1", answer2: "wrongAnswer2" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });
});


module.exports = app;
