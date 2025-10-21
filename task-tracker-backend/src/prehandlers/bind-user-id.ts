import KeyvRedis from "@keyv/redis";
import { createCache } from "cache-manager";
import { FastifyRequest } from "fastify";
import { Unauthorized } from "http-errors";
import Keyv from "keyv";
import ms from "ms";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

const cache = createCache({
  ttl: ms("5m"),
  stores: [
    new Keyv({
      store: new KeyvRedis(process.env.REDIS_URL),
    }),
  ],
});

export async function bindUserId(request: FastifyRequest) {
  try {
    const [, sessionId] = request.headers.authorization?.split(" ") ?? [];
    if (!sessionId) throw new Unauthorized();
    const response = await fetch(
      `https://api.clerk.com/v1/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.errors) throw new Unauthorized();

    request.userId = data.user_id;
    await cache.set(`session:${sessionId}`, request.userId);
  } catch (error) {
    throw new Unauthorized();
  }
}
