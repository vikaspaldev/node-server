import http, {
  Server,
  ServerOptions,
  IncomingMessage,
  ServerResponse,
} from 'http';
import Pino, { Logger, LoggerOptions } from 'pino';
import { Key, pathToRegexp } from 'path-to-regexp';
import { getLocalHostName, normalizeServerAddress } from './helpers';

export type MyServerRequestHandler = (req: any, res: any) => Promise<any>;
export type MyServerOptions = ServerOptions & { logger?: LoggerOptions };

export class MyServer {
  private static _instance: MyServer;

  private readonly server: Server;

  private readonly logger: Logger;

  public get log(): Logger {
    return this.logger;
  }

  private readonly handlers: NodeJS.Dict<NodeJS.Dict<MyServerRequestHandler>>;

  private constructor(options: MyServerOptions) {
    const { logger: loggerOptions, ...serverOptions } = options;

    this.server = http.createServer(serverOptions, this.requestListener);
    this.logger = Pino(loggerOptions);
    this.handlers = {};
  }

  static instance = (options: MyServerOptions): MyServer => {
    if (!MyServer._instance) {
      MyServer._instance = new MyServer(options);
    }
    return MyServer._instance;
  };

  private requestListener = async (
    req: IncomingMessage,
    res: ServerResponse,
  ) => {
    try {
      const { method, url } = req;
      if (!url || !method) {
        throw new Error('throw from internal url cannot be undefined');
      }

      const entry = Object.entries(this.handlers).find(([path]) => {
        const regex = pathToRegexp(path);
        return regex.test(url);
      });

      if (entry === undefined) {
        throw new Error('No routes found throw 404');
      }

      const keys: Key[] = [];
      const [path, handlerWithMethod] = entry;
      const handler = handlerWithMethod && handlerWithMethod[method];
      if (handler === undefined) {
        throw new Error(
          JSON.stringify({
            statusCode: 405,
            msg: 'Method not allowed throw 405',
          }),
        );
      }

      const regex = pathToRegexp(path, keys);
      const values = regex.exec(url);
      if (!values) {
        throw new Error('');
      }
      const params = values
        .slice(1)
        .reduce<NodeJS.Dict<string>>((acc, val, index) => {
          return {
            ...acc,
            [keys[index].name]: val,
          };
        }, {});

      const response = await handler(
        {
          ...req,
          params,
        },
        res,
      );
      res.writeHead(200, 'OK');
      res.write(JSON.stringify(response));
    } catch (err) {
      const { statusCode, msg } = JSON.parse(err.message);
      res.writeHead(statusCode, 'Internal Server Error');
      res.write(JSON.stringify(msg));
    } finally {
      res.end();
    }
  };

  listen = (port?: number, host?: string): Promise<void> => {
    return new Promise(resolve => {
      const hostname = host || getLocalHostName();

      this.server.listen(port, hostname, () => {
        const address = normalizeServerAddress(this.server.address());
        this.logger.info(`Server listening on ${address}`);
        resolve();
      });
    });
  };

  get = (path: string, callbackHandler: MyServerRequestHandler): void => {
    this.handlers[path] = {
      GET: callbackHandler,
    };
  };
}
