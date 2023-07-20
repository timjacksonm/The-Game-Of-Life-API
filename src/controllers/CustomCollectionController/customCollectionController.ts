import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { convertJSONToObject } from "../../helpers";
import { validateAndSanitize } from "../../utils/validateandsanitize";
import customtemplate from "../../models/customtemplate";
import { IQuery } from "../../utils/interfaces";
import { logError } from "../../utils/loggers";

const router = express.Router();

//**GET** patterns from customcollection sorted small -> large -- options { select: JSON Array, count: num }
router.get(
  "/customcollection/patterns",
  validateAndSanitize("list"),
  async (req: Request, res: Response) => {
    try {
      const {
        offset = 0,
        limit = 100,
        select,
      } = req.query as unknown as IQuery;
      const projection = select ? convertJSONToObject(select) : { throw: 0 };
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        logError(`Validation Error: ${JSON.stringify(errors)}`);
        return res.status(400).json({ message: errors });
      }

      const response = await customtemplate.aggregate([
        { $sort: { "size.x": 1, "size.y": 1, title: 1 } },
        { $skip: Number(offset) },
        { $limit: Number(limit) },
        { $project: projection },
      ]);

      if (!response) {
        logError(`NotFoundError: /customcollection/patterns No patterns found`);
        res.status(404).json({ message: "No patterns found" });
      }

      res.status(200).json(response);
    } catch (err: any) {
      logError(`Error: GET /customcollection/patterns ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

//**GET** customcollection pattern by :id -- options { select: JSON Array }
router.get(
  "/customcollection/patterns/:id",
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

      const found = await customtemplate.findById(id, projection);

      if (!found) {
        logError(`NotFoundError: customcollection Pattern ${id}`);
        res.status(404).json({ message: "Pattern id not found." });
      }

      if (found) {
        res.status(200).json({ ...found.toObject(), rleString: found });
      }
      res.status(400).send();
    } catch (err: any) {
      logError(`Error: GET /customcollection/patterns/:id ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

//**Post** save new pattern to CustomTemplates in db
router.post(
  "/customcollection/patterns",
  validateAndSanitize("create"),
  async (req: Request, res: Response) => {
    try {
      const { author, title, description, size, rleString } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        logError(`Validation Error: ${JSON.stringify(errors)}`);
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
    } catch (err: any) {
      logError(`Error: POST /customcollection/patterns ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

//**Post** delete a pattern in CustomTemplates db
router.delete(
  "/customcollection/patterns/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const found = await customtemplate.findById({ _id: id });
      if (!found) {
        logError(`NotFoundError: Pattern ${id}`);
        res.status(404).json({ message: "Pattern id not found." });
      }

      const deleted = await customtemplate.findByIdAndDelete({
        _id: id,
      });

      if (deleted) {
        res.status(200).json({ message: `The pattern ${id} has been deleted` });
      }
    } catch (err: any) {
      logError(`Error: DELETE /customcollection/patterns/:id ${err.message}`);
      res.status(500).json({ message: err });
    }
  }
);

export default router;
