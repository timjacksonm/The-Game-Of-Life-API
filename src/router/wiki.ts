import express from 'express';
import { validateAndSanitize } from '../utils/validateandsanitize';
import { getAllPatterns, getPatternById } from '../controllers/wikiPatterns';
import { authcheck } from '../utils/authcheck';

// eslint has issues with async Promise<void> being returned on the router. This is a workaround https://stackoverflow.com/questions/67114152/typescript-eslint-throwing-a-promise-returned-error-on-a-express-router-async/69860515#69860515
import expressAsyncHandler from 'express-async-handler';

export default (router: express.Router) => {
  router.get(
    '/wikicollection/patterns',
    expressAsyncHandler(authcheck),
    validateAndSanitize('list'),
    expressAsyncHandler(getAllPatterns),
  );
  router.get(
    '/wikicollection/patterns/:id',
    expressAsyncHandler(authcheck),
    validateAndSanitize('byid'),
    expressAsyncHandler(getPatternById),
  );
};
