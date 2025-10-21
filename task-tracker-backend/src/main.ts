import dotenv from "dotenv";
import fastify from "fastify";
import { tasksRoute } from "./routes/tasks";

dotenv.config();

async function main() {
  const app = fastify();

  await app.register(tasksRoute, {
    prefix: "/tasks",
  });

  app.listen({
    port: 3001,
    host: "0.0.0.0",
  });
}

void main();
