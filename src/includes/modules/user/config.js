import { ObjectId } from 'mongodb';

export default {
  collection: 'users',

  attributes: {
    _id: {
      type: ObjectId,
      unique: true,
      validators: [
        { fct: 'isMongoId', skipIfEmpty: true, msg: 'module.user.validation.error.mongoid'}
      ]
    },
    username: {
      type: String,
      default: '',
      unique: true,
      required: true,
      validators: [
        {
          fct: 'required',
          msg: 'module.user.validation.error.username.required'
        },
        {
          fct: value => { return value.match(/^[a-z][a-z0-9]*$/); },
          msg: 'module.user.validation.error.username.alnum'
        },
        {
          fct: 'isLength',
          args: [6, 20],
          msg: 'module.user.validation.error.username.length'
        }
      ]
    },
    firstname: {
      type: String,
      default: '',
      validators: []
    },
    lastname: {
      type: String,
      default: '',
      validators: []
    },
    email: {
      type: String,
      unique: true,
      required: false,
      validators: [
        {
          fct: 'isEmail',
          skipIfEmpty: true,
          msg: 'module.user.validation.error.email.format'
        },
        // To restrict usage of a domain name. Here protonmail.com for example
        // {
        //   fct: 'contains',
        //   args: 'protonmail.com',
        //   msg: 'must be a protonmail.com email'
        // }
      ]
    },
    birthday: {
      type: Date,
      validators: [
        {
          fct: 'isDate',
          skipIfEmpty: true,
          msg: 'module.user.validation.error.birthday.format'
        }
      ]
    },
    auths: {
      type: Object,
      default: {}
    },
    gender: {
      type: String,
      validators: [
        {
          fct: value => ['male', 'female'].indexOf(value)>-1,
          skipIfEmpty: true,
          msg: 'module.user.validation.error.gender.enum.format'
        }
      ]
    },
    source: {
      type: String,
      validators: [
        {
          fct: value => ['backoffice', 'passport'].indexOf(value)>-1,
          skipIfEmpty: true,
          msg: 'module.user.validation.error.source.enum.format'
        }
      ]
    }
  }
};
