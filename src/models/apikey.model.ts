import mongoose, { Document, Model, model, Schema } from "mongoose";

export enum environment {
  production = "production",
  development = "development",
}

export interface IApiKey extends Document {
  apiKey: string;
  createdAt: Date;
  expiresAt: Date;
  environment: environment;
  usageCount: number;
  isActive: boolean;
}

const apiKeySchema = new Schema({
  apiKey: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  environment: {
    type: String,
    enum: Object.values(environment),
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model<IApiKey>("ApiKey", apiKeySchema);
