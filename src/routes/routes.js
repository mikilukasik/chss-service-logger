import { storeLogHandler } from './loggerSocket/storeLogHandler';

export const initRoutes = ({ msg }) => {
  const loggerSocket = msg.ws('/logger');
  loggerSocket.on(...storeLogHandler);
};
