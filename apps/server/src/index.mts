import express from "express";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

const users: { id: string; name: string }[] = [];
let nextId = 1; // Simple ID counter

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  getUser: t.procedure.input(z.string()).query((opts) => {
    opts.input; // string
    return { id: opts.input, name: "Bilbo" };
  }),
  helloWorld: t.procedure.query(() => {
    console.log("hello worldf from backend");
    return "Hello, World!";
  }),
  createUser: t.procedure
    .input(z.object({ name: z.string().min(5) }))
    .mutation(async (opts) => {
      const newUser = {
        id: nextId.toString(),
        name: opts.input.name,
      };
      users.push(newUser); // Add new user to in-memory storage
      nextId++; // Increment ID for the next user
      return newUser; // Return the created user
    }),
});

const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

// app.get("/", (req, res) => {
//   res.send({ hello: "Hello, World!" });
// });
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
const trpcApiEndpoint = "/trpc";
const playgroundEndpoint = "/trpc-playground";

app.use(
  trpcApiEndpoint,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(
  playgroundEndpoint,
  await expressHandler({
    trpcApiEndpoint,
    playgroundEndpoint,
    router: appRouter,
    // uncomment this if you're using superjson
    // request: {
    //   superjson: true,
    // },
  })
);

export type AppRouter = typeof appRouter;
