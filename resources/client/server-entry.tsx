import {renderToPipeableStream} from 'react-dom/server';
import {BootstrapData} from '@common/core/bootstrap-data/bootstrap-data';
import process from 'process';
import {
  createServer as createHttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import {setBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';
import {StaticRouter} from 'react-router-dom/server';
import {CommonProvider} from '@common/core/common-provider';
import {AppRoutes} from '@app/app-routes';
import {queryClient} from '@common/http/query-client';

let port = 13714;
process.argv.forEach(value => {
  if (value.startsWith('port=')) {
    port = parseInt(value.substring('port='.length));
  }
});

interface Data {
  bootstrapData: BootstrapData;
  url: string;
}

const readableToString: (
  readable: IncomingMessage,
) => Promise<string> = readable => {
  return new Promise((resolve, reject) => {
    let data = '';
    readable.on('data', chunk => (data += chunk));
    readable.on('end', () => resolve(data));
    readable.on('error', err => reject(err));
  });
};

const getPayload = async (request: IncomingMessage) => {
  const payload = await readableToString(request);
  return payload ? JSON.parse(payload) : {};
};

createHttpServer(async (request, response) => {
  if (request.url === '/render') {
    return render(request, response);
  } else {
    return handleOtherRoutes(request, response);
  }
}).listen(port, () => console.log('SSR server started.'));

async function render(request: IncomingMessage, response: ServerResponse) {
  const data = (await getPayload(request)) as Data;

  setBootstrapData(data.bootstrapData);

  const {pipe, abort} = renderToPipeableStream(
    <StaticRouter location={data.url}>
      <CommonProvider>
        <AppRoutes />
      </CommonProvider>
    </StaticRouter>,
    {
      onAllReady() {
        response.setHeader('content-type', 'text/html');
        pipe(response);
        // clear query client to avoid memory leaks and to avoid data from being shared between requests
        queryClient.clear();
        response.end();
      },
    },
  );

  // abort after 2 seconds, if rendering takes longer than that
  setTimeout(() => {
    abort();
  }, 2000);
}

async function handleOtherRoutes(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (request.url === '/screenshot') {
    takeScreenshot(request, response);
  } else if (request.url === '/health') {
    writeJsonResponse(response, {status: 'OK', timestamp: Date.now()});
  } else if (request.url === '/shutdown') {
    response.end();
    process.exit();
  } else {
    writeJsonResponse(response, {status: 'NOT_FOUND', timestamp: Date.now()});
  }
}

function writeJsonResponse(response: ServerResponse, data: object) {
  try {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });
    response.write(JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }

  response.end();
}

async function getDataFromRedis() {
  //@ts-ignore
  const {Redis} = await import('ioredis');
  const redis = new Redis();
  return redis.get('bemusic_database_bootstrap_data');
}

async function takeScreenshot(
  request: IncomingMessage,
  response: ServerResponse,
) {
  try {
    const payload = await getPayload(request);
    // @ts-ignore
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({
      executablePath: '/snap/bin/chromium',
      headless: 'new',
      defaultViewport: {
        width: 800,
        height: 600,
      },
    });
    const page = await browser.newPage();
    await page.goto(payload.url);
    const image = await page.screenshot({
      type: 'jpeg',
      optimizeForSpeed: true,
      quality: 40,
      encoding: 'binary',
    });
    await browser.close();

    response.writeHead(200, {
      'Content-Type': 'image/jpeg',
    });
    response.write(image);
    response.end();
  } catch (e) {
    console.error(e);
  }

  // abort after 3 seconds, if rendering takes longer than that
  setTimeout(() => {
    response.end();
  }, 3000);
}

console.log(`Starting SSR server on port ${port}...`);
