import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const aiRouter = createTRPCRouter({
  post: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const model = openai.chat("gpt-4o-mini");
      return generateObject({
        model,
        schema: z.object({
          itinerary: z.array(
            z.object({
              activity: z.string(),
              time: z.string(),
              details: z.string(),
            }),
          ),
        }),
        mode: "json",
        messages: [
          {
            role: "system",
            content:
              "You are a master itinerary planner specialized in Mauritius. You come up with creative, fun, exciting activities based on the requirements of the user. You output the detailed itinerary in JSON format. You only return just the JSON with no additional description or context.",
          },
          {
            role: "user",
            content:
              "A family of four, including two kids, want to visit the west coast of Mauritius. They want you to plan their day from morning till evening, including breakfast, lunch and dinner. They want to explore local delights and have ample time at the beach. Throw in some interesting activities you feel like recommending.",
          },
        ],
      });
    }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //     });
  //   }),

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });

  //   return post ?? null;
  // }),
});
