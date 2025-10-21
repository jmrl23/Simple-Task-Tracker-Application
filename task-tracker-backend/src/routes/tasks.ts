import { FastifyInstance, FastifyRequest } from "fastify";
import { prisma } from "../common/prisma";
import { bindUserId } from "../prehandlers/bind-user-id";

export function tasksRoute(app: FastifyInstance) {
  app

    .route({
      method: "GET",
      url: "/",
      preHandler: [bindUserId],
      async handler(request) {
        const tasks = await prisma.task.findMany({
          where: {
            user_id: request.userId,
          },
        });

        return {
          tasks,
        };
      },
    })

    .route({
      method: "POST",
      url: "/",
      schema: {
        body: {
          type: "object",
          additionalProperties: false,
          required: ["content"],
          properties: {
            content: {
              type: "string",
            },
          },
        },
      },
      preHandler: [bindUserId],
      async handler(
        request: FastifyRequest<{
          Body: {
            content: string;
          };
        }>
      ) {
        const content = request.body.content;
        const task = await prisma.task.create({
          data: {
            content,
            status: "pending",
            user_id: request.userId,
          },
        });

        return {
          task,
        };
      },
    })

    .route({
      method: "PATCH",
      url: "/:taskId",
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          properties: {
            taskId: {
              type: "string",
            },
          },
        },
        body: {
          type: "object",
          additionalProperties: false,
          properties: {
            content: {
              type: "string",
            },
            status: {
              type: "string",
            },
          },
        },
      },
      preHandler: [bindUserId],
      async handler(
        request: FastifyRequest<{
          Params: {
            taskId: string;
          };
          Body: {
            content?: string;
            status?: string;
          };
        }>
      ) {
        const taskId = request.params.taskId;
        const body = request.body;

        const task = await prisma.task.update({
          where: { id: taskId },
          data: body,
        });

        return {
          task,
        };
      },
    })

    .route({
      method: "DELETE",
      url: "/:taskId",
      preHandler: [bindUserId],
      async handler(
        request: FastifyRequest<{
          Params: {
            taskId: string;
          };
        }>
      ) {
        await prisma.task.delete({
          where: {
            id: request.params.taskId,
          },
        });
      },
    });
}
