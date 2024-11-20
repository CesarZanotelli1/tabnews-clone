import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  const migrationsExecuted = await database.query(
    "SELECT count(*) FROM public.pgmigrations;",
  );

  expect(migrationsExecuted.rows.length).toBeGreaterThan(0);
  expect(response.status).toBe(201);
  expect(response2.status).toBe(200);

  const responseBody = await response.json();
  const response2Body = await response2.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(Array.isArray(response2Body)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  expect(response2Body.length).toBe(0);
});
