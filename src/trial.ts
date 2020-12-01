import { CustomServer } from './index';

(async function start() {
  const server = CustomServer({
    logger: {
      level: 'info',
      prettyPrint: true,
    },
  });
  await server.listen(3000);

  server.get(
    '/',
    async (): Promise<any> => {
      server.log.info('called from /');
      return 'from /';
    },
  );

  server.get('/hello', async () => {
    server.log.info('called from /hello');
    return 'from hello';
  });

  server.get('/world/:id', async req => {
    server.log.info('called from /world/:id');
    return req.params;
  });
})();
