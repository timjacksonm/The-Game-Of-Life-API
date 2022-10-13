import debug from 'debug';

export const logError = debug('routes:error');
logError.log = console.error.bind(console);
