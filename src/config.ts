import Joi = require("joi");
import { Context } from "probot";

export class ConfigManager<T> {
  private filename: string;
  private config: T;
  private schema: Joi.Schema;

  constructor(filename: string, defaultConfig: T, schema: Joi.Schema) {
    this.filename = filename;
    this.config = defaultConfig;
    this.schema = schema;
  }

  public async getConfig(context: Context): Promise<T> {
    return context.config(this.filename, this.config).then((newConfig) => {
      const result = this.validateConfig(newConfig);
      if (result.error) {
        const annotation = result.error.annotate();
        throw new Error(`Invalid Config: ${annotation}`);
      } else {
        this.config = newConfig;
      }
      return this.config;
    });
  }

  private validateConfig(config: any): ({ value: T, error?: Joi.ValidationError }) {
    return Joi.validate(config, this.schema);
  }
}
