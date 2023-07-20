import mongoose, { Document, Model, model, Schema } from "mongoose";

interface IWikiTemplate extends Document {
  author: string;
  title: string;
  description: string[];
  size: {
    x: number;
    y: number;
  };
  rleString: string;
  createdAt: Date;
  modifiedAt: Date;
}

const wikiTemplateSchema = new Schema({
  author: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: [String],
  },
  size: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  rleString: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWikiTemplate>(
  "WikiTemplate",
  wikiTemplateSchema
);
