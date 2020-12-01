import { MyServer, MyServerOptions } from './lib/server';

export const CustomServer = (options: MyServerOptions) =>
  MyServer.instance(options);
