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

interface TemplateModel extends Model<ITemplate> {
  isUniqueTitle(val: string): boolean;
}

const TemplateSchema = new Schema<ITemplate, TemplateModel>({
  author: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: [String],
    required: true,
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

TemplateSchema.static(
  'isUniqueTitle',
  async function isUniqueTitle(val: string) {
    const result = await this.find({ title: val });
    if (result.length) {
      throw new Error();
    } else {
      return true;
    }
  }
);

const Template = model<ITemplate, TemplateModel>(
  'CustomTemplate',
  TemplateSchema
);
export default Template;
