export const clientLogger = ({ msgClient }) => {
  if (!self) return;

  const loggerSocket = msgClient.ws(`ws://${typeof self === 'undefined' || self.location.hostname}:3300/logger`);

  self.onerror = (message, source, lineno, colno, error) => loggerSocket.do('storeLog', { type: 'error', message, source, lineno, colno, error, stack: error.stack });
  self.addEventListener('error', (e) => {
    loggerSocket.do('storeLog', { type: 'error', message: e.error.message, stack: e.error.stack });
  });
  self.addEventListener('unhandledrejection', (e) => {
    loggerSocket.do('storeLog', { type: 'error', message: e.reason.message, stack: e.reason.stack });
  });

  const logger = (...args) => {
    loggerSocket.do('storeLog', { type: 'info', message: args[0], arguments: args });
  };

  logger.info = (...args) => {
    loggerSocket.do('storeLog', { type: 'info', message: args[0], arguments: args });
  };

  logger.error = (...args) => {
    const error = args.find(a => typeof a === 'object' && a.message) || new Error(args[0]);
    loggerSocket.do('storeLog', { type: 'error', message: error.message, stack: error.stack, arguments: args });
  };

  logger.warning = (...args) => {
    loggerSocket.do('storeLog', { type: 'warning', message: args[0], arguments: args });
  };

  logger.warn = logger.warning;
  
  return logger;
};

