import { ObjectId } from 'mongodb';

export default {
  collection: '{{collection}}',

  attributes: {
    _id: {
      type: ObjectId,
      unique: true,
      validators: [
        { fct: 'isMongoId', skipIfEmpty: true, msg: 'module.user.validation.error.mongoid'}
      ]
    }
  }
};
