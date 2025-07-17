# Bitte AI Agent Template

A template repository for building and deploying AI agents on the Bitte Protocol.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or npm/yarn
- [Vercel CLI](https://vercel.com/cli) - Install globally: `bun i -g vercel`
- Bitte Protocol account

### 1. Setup

Clone this template and install dependencies:

```bash
# Setup environment variables
cp .env.example .env

# Install dependencies
bun install
```

### 2. Local Development

Start the development server:

```bash
bun run vercel:dev
```

Your agent will be available at `http://localhost:3000`

### 3. Deploy to Vercel

Deploy your agent to Vercel:

```bash
bun run vercel:deploy
```

### 4. Register with Bitte Protocol

After deployment, register your agent with Bitte Protocol:

```bash
# Validate your agent spec
bun run validate https://your-agent.vercel.app

# Deploy to Bitte Protocol
bun run deploy https://your-agent.vercel.app
```

### 5. Test Your Agent

Visit your agent at: `https://bitte.ai/chat?mode=debug&agentid=your-agent.vercel.app`

## 📖 Detailed Guide

### Environment Configuration

Copy `.env.example` to `.env` and configure your environment variables as needed.

### Package Manager

This project works with any package manager, but **Bun is recommended** for better performance.

### Development Workflow

1. **Local Development**: Use `bun run vercel:dev` to test locally
2. **Deploy**: Use `bun run vercel:deploy` to deploy to Vercel
3. **Validate**: Use `bun run validate` to check your agent spec
4. **Register**: Use `bun run deploy` to register with Bitte Protocol

## 🔧 Advanced Configuration

### Automatic URL Detection

Scripts can automatically detect your agent URL:

```bash
# These work without specifying URL
bun run validate
bun run deploy
```

URL detection priority:
1. `BITTE_AGENT_URL` environment variable
2. Vercel deployment URL (auto-detected)

### Custom Agent URL

Set a custom URL via environment variable:

```bash
export BITTE_AGENT_URL=https://your-custom-domain.com
bun run validate
bun run deploy
```

## 🛠 Troubleshooting

### "No agent URL found" Error

If automatic detection fails:

1. Ensure you've deployed to Vercel first
2. Run commands from your project root directory
3. Manually specify the URL: `bun run deploy https://your-agent.vercel.app`

### Agent ID Format

Your agent ID is the hostname from your deployment URL:
- URL: `https://my-agent.vercel.app` → Agent ID: `my-agent.vercel.app`

## 📚 Resources

- [Bitte Protocol Documentation](https://docs.bitte.ai)
- [Agent Testing Interface](https://bitte.ai/chat?mode=debug&agentid=micro-agent-vercel.app)