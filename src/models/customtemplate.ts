import mongoose, { Document, Model, Schema } from 'mongoose';

interface ICustomTemplate extends Document {
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

interface TemplateModel extends Model<ICustomTemplate> {
  isUniqueTitle(val: string): boolean;
}

const customTemplateSchema = new Schema({
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

customTemplateSchema.statics.isUniqueTitle = async function (val: string): Promise<boolean> {
  const result = (await this.findOne({ title: val })) as ICustomTemplate | null;
  return !result;
};

export default mongoose.model<ICustomTemplate, TemplateModel>(
  'CustomTemplate',
  customTemplateSchema,
);
