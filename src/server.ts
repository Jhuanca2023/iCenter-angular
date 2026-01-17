import {
  createNodeRequestHandler,
  isMainModule,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

export const reqHandler = createNodeRequestHandler(app);

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.use('*', reqHandler);
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
