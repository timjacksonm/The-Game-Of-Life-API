import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { convertJSONToObject } from '../../helpers';
import { validateAndSanitize } from '../validateandsanitize';
import { IQuery } from '../interfaces';
import wikitemplate from '../../models/wikitemplate';
const { decode } = require('rle-decoder');

const router = express.Router();

//**GET** patterns from wikicollection sorted small -> large -- options { select: JSON Array, count: num }
router.get(
  '/wikicollection/patterns',
  validateAndSanitize('list'),
  async (req: Request<{}, {}, {}, IQuery>, res: Response) => {
    try {
      const { limit = 100, select } = req.query as unknown as IQuery;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors });
      }

      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const response = await wikitemplate.aggregate([
        { $sort: { 'size.x': 1, 'size.y': 1 } },
        { $project: projection },
        { $limit: Number(limit) },
      ]);
      console.log(response);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//**GET** wikicollection pattern by :id -- options { select: JSON Array }
router.get(
  '/wikicollection/patterns/:id',
  validateAndSanitize('byid'),
  async (req: Request, res: Response) => {
    try {
      const { select } = req.query as unknown as IQuery;
      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors });
      }

      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const response = await wikitemplate.findById(id, projection);

      if (response) {
        response.rleString = decode(response.rleString, response.size);
        res.status(200).json(response);
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//**GET** all wikicollection patterns by search -- options { select: JSON Array, count: num }
router.get(
  '/wikicollection/search/:path',
  validateAndSanitize('bysearch'),
  async (req: Request, res: Response) => {
    try {
      const { value, limit = 100, select } = req.query as unknown as IQuery;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors });
      }
      if (!value) {
        return res.status(400).json({ message: 'Invalid search parameters' });
      }

      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const response = await wikitemplate.aggregate([
        {
          $search: {
            index: 'custom',
            text: {
              query: value,
              path: req.params.path,
            },
          },
        },
        { $project: projection },
        { $limit: Number(limit) },
      ]);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

export default router;
