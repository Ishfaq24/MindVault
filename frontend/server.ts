/**
 * MindVault frontend server.
 *
 * Serves the Vite app and forwards API traffic to the real backend so the UI
 * uses the same GraphQL and REST contracts in local and production-style runs.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BACKEND_URL = process.env.VITE_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:4000';

const hopByHopHeaders = new Set([
  'connection',
  'content-length',
  'expect',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const readRequestBody = async (req: Request): Promise<Buffer | undefined> => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
};

const proxyToBackend = async (req: Request, res: Response) => {
  const targetUrl = new URL(req.originalUrl, BACKEND_URL);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (!value || hopByHopHeaders.has(key.toLowerCase())) {
      continue;
    }

    headers.set(key, Array.isArray(value) ? value.join(',') : value);
  }

  try {
    const body = await readRequestBody(req);
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    res.status(backendResponse.status);
    backendResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseBody = Buffer.from(await backendResponse.arrayBuffer());
    res.send(responseBody);
  } catch (error) {
    console.error('Backend proxy failed:', error);
    res.status(502).json({
      success: false,
      message: `Unable to reach backend at ${BACKEND_URL}`,
    });
  }
};

app.all('/graphql', proxyToBackend);
app.all('/api', proxyToBackend);
app.all('/api/*', proxyToBackend);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MindVault frontend running at http://localhost:${PORT}`);
    console.log(`Forwarding API requests to ${BACKEND_URL}`);
  });
}

startServer();
