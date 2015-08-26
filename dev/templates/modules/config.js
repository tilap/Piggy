import { ObjectId } from 'mongodb';

export default {
  'collection': '{{collection}}',

  'attributes': {
    '_id': {
      'type': ObjectId,
      'unique': true,
      'validators': [
        { 'fct': 'isMongoId', 'skipIfEmpty': true, 'msg': 'module.{{collection}}.validation.error.mongoid'}
      ]
    },

    {% if example %}
    // Properties working with service createNewOne and updateOneFromData method override
    'created_at': {
      'type': Date,
      'validators': [{'fct': 'isDate', 'skipIfEmpty': true, 'msg': 'module.{{collection}}.validation.error.created_at.format'}],
      'default': null,
    },
    'updated_at': {
      'type': Date,
      'validators': [{'fct': 'isDate',  'skipIfEmpty': true, 'msg': 'module.{{collection}}.validation.error.updated_at.format'}],
      'default': null,
    },

    /*
    // Ugly Example ==============================================
    // Show all the most usefull features

    'propertyname': {
      'type': String, // ObjectId, Array, Object
      'default': '',
      'unique': true,
      'validators': [
        { // Basic required with custom message
          'fct': 'required',
          'msg': 'module.user.validation.error.itemname.required',
        },

        // Included in node validator
        // See https://github.com/chriso/validator.js for full list of included validators
        { // Date, skip if not filled (for non required properties for example)
          'fct': 'isDate',
          'skipIfEmpty': true,
          'msg': 'module.user.validation.error.birthday.format',
        },
        { // Length
          'fct': 'isLength',
          'args': [6, 20],
          'msg': 'module.user.validation.error.itemname.length',
        },

        // Sample of custom code
        { // Regex matching
          'fct': value => { return value.match(/^[a-z][a-z0-9]*$/); },
          'msg': 'module.user.validation.error.itemname.alnum',
        },
        { // Enum style
          'fct': value => ['male', 'female'].indexOf(value) > -1,
          'skipIfEmpty': true,
          'msg': 'module.user.validation.error.gender.enum.format',
        },

      ],
    },
    */
    {% endif %}

  }
};
