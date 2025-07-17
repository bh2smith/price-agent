import { spawn } from "node:child_process";
import { DEPLOYMENT_URL } from "vercel-url";

const AGENT_URL = process.env.BITTE_AGENT_URL || DEPLOYMENT_URL;

export function getAgentUrl(): string {
  // 1. Check for custom URL from command line
  const urlArgIndex = process.argv.indexOf("--url");
  if (urlArgIndex !== -1 && process.argv[urlArgIndex + 1]) {
    return process.argv[urlArgIndex + 1];
  }

  // 2. Use AGENT_URL
  if (AGENT_URL) {
    return AGENT_URL;
  }

  // 3. No URL available, exit with error
  console.error(`❌ No agent URL found! Please provide one of:
  • Set BITTE_AGENT_URL environment variable
  • Deploy to Vercel (for DEPLOYMENT_URL)
  • Pass custom URL: bun run validate https://your-app.vercel.app`);
  process.exit(1);
}

const command = process.argv[2]; // 'validate' or 'deploy'

const agentUrl = getAgentUrl();
console.log(
  `🚀 ${command === "validate" ? "Validating" : "Deploying"} agent at: ${agentUrl}`,
);

// Spawn make-agent command with the specified action
const child = spawn("bun", ["make-agent", command, "--url", agentUrl], {
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code);
});
