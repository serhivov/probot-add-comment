import Joi = require("joi");

export interface IComment {
  comment: string;
  label: string;
}

export interface IConfig {
  comments?: IComment[];
}

//
// comments:
// - label: needs-area
//   comment: |
//     There is no area label added to this issue/PR.
//     Please add an area:<team> label
export const schema = Joi.object().keys({
  comments: Joi.array().items(
    Joi.object().keys({
      comment: Joi.string(),
      label: Joi.string(),
    }),
  ),
});
