import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { DEPLOYMENT_URL } from "vercel-url";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const AGENT_URL = process.env.BITTE_AGENT_URL || DEPLOYMENT_URL;

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = (file: string) => join(__dirname, '..', 'public', file);


const readFile = (file: string) => readFileSync(publicPath(file));
const readFileWithEncoding = (file: string, encoding: BufferEncoding) => readFileSync(publicPath(file), encoding);

const app = new Hono();

app.get("/favicon.ico", () => new Response(readFile("favicon.ico"), {
  headers: { "Content-Type": "image/x-icon" }
}));

app.get("/logo.png", () => new Response(readFile("logo.png"), {
  headers: { "Content-Type": "image/png" }
}));

app.get("/", (c) => c.html(readFileWithEncoding("page.html", "utf-8")));

app.get("/.well-known/ai-plugin.json", (c) => c.json({
  openapi: "3.0.0",
  info: {
    title: "Bitte Docs Agent",
    description: "Bitte Docs Agent Specification. https://docs.bitte.ai",
    version: "1.0.0",
  },
  servers: [{ url: AGENT_URL }],
  "x-mb": {
    "account-id": ACCOUNT_ID,
    assistant: {
      name: "Bitte Docs AI",
      description: "Bitte Protocol Knowledge Assistant. Ask anything about Bitte Protocol. https://docs.bitte.ai",
      instructions: `You are a helpful assistant that provides accurate information about Bitte protocol. You use the Bitte docs to answer questions, encouraging exploration, learning, and development with the Bitte protocol.  The Bitte docs are available at https://docs.bitte.ai.  Use the data-retrieval tool to fetch the most relevant information from the docs based on the user's query.  When responding, be concise, include links to relevant source material, and be adaptive to the user's domain knowledge.`,
      tools: [{ type: "data-retrieval" }],
      image: `${AGENT_URL}/logo.png`,
    },
  },
  paths: {},
}));

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;