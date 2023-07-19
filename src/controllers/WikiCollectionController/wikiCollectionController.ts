import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { convertJSONToObject } from "../../helpers";
import { validateAndSanitize } from "../../utils/validateandsanitize";
import { IQuery } from "../../utils/interfaces";
import wikitemplate from "../../models/wikitemplate";
import { logError } from "../../utils/loggers";

const router = express.Router();

//**GET** patterns from wikicollection sorted small -> large -- options { select: JSON Array, count: num }
router.get(
  "/wikicollection/patterns",
  validateAndSanitize("list"),
  async (req: Request, res: Response) => {
    try {
      const { limit = 100, select } = req.query as unknown as IQuery;
      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        logError(`Validation Error: ${JSON.stringify(errors)}`);
        return res.status(400).json({ message: errors });
      }

      const response = await wikitemplate.aggregate([
        { $sort: { "size.x": 1, "size.y": 1 } },
        { $project: projection },
        { $limit: Number(limit) },
      ]);

      if (!response) {
        logError(`NotFoundError: /wikicollection/patterns No patterns found`);
        res.status(404).json({ message: "No patterns found" });
      }

      res.status(200).json(response);
    } catch (err: any) {
      logError(`Error: GET /wikicollection/patterns ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** wikicollection pattern by :id -- options { select: JSON Array }
router.get(
  "/wikicollection/patterns/:id",
  validateAndSanitize("byid"),
  async (req: Request, res: Response) => {
    try {
      const { select } = req.query as unknown as IQuery;
      const { id } = req.params;
      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        logError(`Validation Error: ${JSON.stringify(errors)}`);
        return res.status(400).json({ message: errors });
      }

      const found = await wikitemplate.findById(id, projection);

      if (!found) {
        logError(`NotFoundError: wikicollection Pattern ${id}`);
        res.status(404).json({ message: "Pattern id not found." });
      }

      if (found) {
        res
          .status(200)
          .json({ ...found.toObject(), rleString: found.rleString });
      }
    } catch (err: any) {
      logError(`Error: GET /wikicollection/patterns/:id ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** all wikicollection patterns by search -- options { select: JSON Array, count: num }
router.get(
  "/wikicollection/search/:path",
  validateAndSanitize("bysearch"),
  async (req: Request, res: Response) => {
    try {
      const { value, limit = 100, select } = req.query as unknown as IQuery;
      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        logError(`Validation Error: ${JSON.stringify(errors)}`);
        return res.status(400).json({ message: errors });
      }
      if (!value) {
        logError(`Query Parameter Error: ${JSON.stringify(errors)}`);
        return res
          .status(400)
          .json({ message: "Invalid query for req.query.value" });
      }

      const response = await wikitemplate.aggregate([
        {
          $search: {
            index: "custom",
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
    } catch (err: any) {
      logError(`Error: GET /wikicollection/search/:path ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

export default router;
