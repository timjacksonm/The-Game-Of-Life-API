import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { convertJSONToObject } from '../../helpers';
import { validateAndSanitize } from '../validateandsanitize';
import customtemplate from '../../models/customtemplate';
import { IQuery } from '../interfaces';
const { decode } = require('rle-decoder');

const router = express.Router();

//**GET** patterns from customcollection sorted small -> large -- options { select: JSON Array, count: num }
router.get(
  '/customcollection/patterns',
  validateAndSanitize('list'),
  async (req: Request, res: Response) => {
    try {
      const { limit = 100, select } = req.query as unknown as IQuery;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors });
      }

      const projection = select ? convertJSONToObject(select) : { throw: 0 };

      const response = await customtemplate.aggregate([
        { $sort: { 'size.x': 1, 'size.y': 1 } },
        { $project: projection },
        { $limit: Number(limit) },
      ]);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//**GET** customcollection pattern by :id -- options { select: JSON Array }
router.get(
  '/customcollection/patterns/:id',
  validateAndSanitize('byid'),
  async (req: Request, res: Response) => {
    try {
      console.log('asdf');
      const { select } = req.query as unknown as IQuery;
      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors });
      }

      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const response = await customtemplate.findById(id, projection);

      if (response) {
        response.rleString = decode(response.rleString, response.size);
        res.status(200).json(response);
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);
// TODO: refactor POST/DELETE routes
//**Post** save new pattern to CustomTemplates in db
router.post(
  '/customcollection/patterns',
  validateAndSanitize('create'),
  async (req: Request, res: Response) => {
    try {
      const { author, title, description, size, rleString } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors });
      }

      const pattern = await customtemplate.create({
        author,
        title,
        description,
        size,
        rleString,
      });
      res.status(201).json(pattern);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//**Post** delete a pattern in CustomTemplates db
router.delete(
  '/customcollection/patterns/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const found = await customtemplate.findById({ _id: id });
      if (!found) {
        res.status(404).json({ message: 'Pattern id not found.' });
      }

      const response = await customtemplate.findByIdAndDelete({
        _id: id,
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

export default router;
