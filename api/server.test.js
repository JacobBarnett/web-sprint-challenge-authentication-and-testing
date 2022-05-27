// Write your tests here

const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server.js");

afterAll(async () => {
  await db.destroy();
});
beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

describe("server.js", () => {
  describe("auth/register", () => {
    it("should return an OK status code when credentials present", async () => {
      const expectedStatusCode = 200;

      const response = await request(server).post("/api/auth/register").send({
        username: "Jacob",
        password: "test1234",
      });

      expect(response.status).toEqual(expectedStatusCode);
    });
    it("should return bad request when credentials are not present ", async () => {
      const expectedStatusCode = 400;

      const response = await request(server)
        .post("/api/auth/register")
        .send({});

      expect(response.status).toEqual(expectedStatusCode);
    });
  });
  describe("auth/login", () => {
    it("should return an OK status code when credentials valid", async () => {
      const expectedStatusCode = 200;
      await request(server).post("/api/auth/register").send({
        username: "Jacob",
        password: "test1234",
      });

      const response = await request(server).post("/api/auth/login").send({
        username: "Jacob",
        password: "test1234",
      });

      expect(response.status).toEqual(expectedStatusCode);
    });
    it("should return bad request when credentials are not present ", async () => {
      const expectedStatusCode = 403;
      await request(server).post("/api/auth/register").send({
        username: "Jacob",
        password: "test1234",
      });

      const response = await request(server).post("/api/auth/login").send({
        username: "Jacob",
        password: "test789",
      });

      expect(response.status).toEqual(expectedStatusCode);
    });
  });
  describe("jokes", () => {
    it("should return jokes with valid token", async () => {
      const expectedStatusCode = 200;
      await request(server).post("/api/auth/register").send({
        username: "Jacob",
        password: "test1234",
      });
      const loginResponse = await request(server).post("/api/auth/login").send({
        username: "Jacob",
        password: "test1234",
      });
      const response = await request(server)
        .get("/api/jokes")
        .set("Authorization", "Bearer " + loginResponse.body.token);

      expect(response.status).toEqual(expectedStatusCode);
    });
    it("should return bad request when credentials are not present ", async () => {
      const expectedStatusCode = 403;
      const response = await request(server)
        .get("/api/jokes")
        .set("Authorization", "asdf");

      expect(response.status).toEqual(expectedStatusCode);
    });
  });
});
