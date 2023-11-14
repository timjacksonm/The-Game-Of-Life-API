import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IQuery } from '../utils/interfaces';
import { logError } from '../utils/loggers';
import { PipelineStage } from 'mongoose';
import wikitemplate from '../models/wikitemplate';
import { QueryResponse } from '../utils/types';

export const defaultProjection = {
  author: 1,
  title: 1,
  description: 1,
  size: 1,
  rleString: 1,
};

export const getAllPatterns = async (req: Request, res: Response) => {
  try {
    const { value, offset = 0, limit = 100, select, sort } = req.query as unknown as IQuery;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logError(`Validation Error: ${JSON.stringify(errors)}`);
      res.status(400).json({ message: errors });
      return;
    }

    const baseStage: PipelineStage[] = [];

    if (value)
      baseStage.push({
        $search: {
          index: 'wiki_title_author_search_index',
          text: {
            query: value,
            path: ['title', 'author'],
          },
        },
      });

    if (sort === 'desc') {
      baseStage.push({ $sort: { 'size.x': -1, 'size.y': -1 } });
    } else {
      // defaults to ascending. smallest to largest
      baseStage.push({ $sort: { 'size.x': 1, 'size.y': 1 } });
    }

    baseStage.push({ $project: select ?? defaultProjection });

    const resultsStage = [{ $skip: offset }, { $limit: limit }];

    const countStage = [{ $count: 'count' }];

    const [{ results = [], totalCount }] = await wikitemplate.aggregate<QueryResponse>([
      ...baseStage,
      {
        $facet: {
          results: resultsStage,
          totalCount: countStage,
        },
      },
    ]);

    res.status(200).json({
      results,
      totalCount: totalCount[0]?.count ?? 0,
    });
  } catch (err: unknown) {
    logError(`Error: GET /wikicollection/patterns ${err}`);
    res.status(500).json({ message: err });
  }
};

export const getPatternById = async (req: Request, res: Response) => {
  try {
    const { select } = req.query as unknown as IQuery;
    const { id } = req.params;
    const projection = select ?? defaultProjection;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      logError(`Validation Error: ${JSON.stringify(errors)}`);
      res.status(400).json({ message: errors });
      return;
    }

    const found = await wikitemplate.findById(id, projection);

    if (!found) {
      logError(`NotFoundError: wikicollection Pattern ${id}`);
      res.status(404).json({ message: 'Pattern id not found.' });
    }

    if (found) {
      res.status(200).json({ ...found.toObject(), rleString: found.rleString });
    }
  } catch (err: unknown) {
    logError(`Error: GET /wikicollection/patterns/:id ${err}`);
    res.status(500).json({ message: err });
  }
};
