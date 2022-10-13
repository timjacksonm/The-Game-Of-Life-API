import { Document, Model, model, Schema } from 'mongoose';

interface ITemplate extends Document {
  author: string;
  title: string;
  description: string[];
  size: {
    x: number;
    y: number;
  };
  rleString: string;
  date: Date;
}

const TemplateSchema = new Schema<ITemplate>({
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
  date: { type: Date, default: Date.now },
});

const Template = model<ITemplate>('WikiTemplates', TemplateSchema);
export default Template;
