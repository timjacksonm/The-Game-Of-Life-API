// import { validationResult } from "express-validator";
// import { convertJSONToObject } from "../../helpers";
// import { validateAndSanitize } from "../../utils/validateandsanitize";
// import customtemplate from "../../models/customtemplate";
// import { IQuery } from "../../utils/interfaces";
// import { logError } from "../../utils/loggers";

// //**Post** save new pattern to CustomTemplates in db
// router.post(
//   "/customcollection/patterns",
//   validateAndSanitize("create"),
//   async (req: Request, res: Response) => {
//     try {
//       const { author, title, description, size, rleString } = req.body;
//       const errors = validationResult(req);

//       if (!errors.isEmpty()) {
//         logError(`Validation Error: ${JSON.stringify(errors)}`);
//         return res.status(400).json({ message: errors });
//       }

//       const pattern = await customtemplate.create({
//         author,
//         title,
//         description,
//         size,
//         rleString,
//       });

//       res.status(201).json(pattern);
//     } catch (err: any) {
//       logError(`Error: POST /customcollection/patterns ${err.message}`);
//       res.status(500).json({ message: err });
//     }
//   }
// );

// //**Post** delete a pattern in CustomTemplates db
// router.delete(
//   "/customcollection/patterns/:id",
//   async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;

//       const found = await customtemplate.findById({ _id: id });
//       if (!found) {
//         logError(`NotFoundError: Pattern ${id}`);
//         res.status(404).json({ message: "Pattern id not found." });
//       }

//       const deleted = await customtemplate.findByIdAndDelete({
//         _id: id,
//       });

//       if (deleted) {
//         res.status(200).json({ message: `The pattern ${id} has been deleted` });
//       }
//     } catch (err: any) {
//       logError(`Error: DELETE /customcollection/patterns/:id ${err.message}`);
//       res.status(500).json({ message: err });
//     }
//   }
// );
