import { ObjectId } from 'mongodb';

export default {
  'collection': 'source',

  'attributes': {
    '_id': {
        'type': ObjectId,
        'unique': true,
        'validators': [
          { 'fct': 'isMongoId', 'skipIfEmpty': true, 'msg': 'module.source.validation.error.mongoid'}
        ]
      },
    'created_at': {
        'type': Date,
        'validators': [{'fct': 'isDate', 'skipIfEmpty': true, 'msg': 'module.source.validation.error.created_at.format'}],
        'default': null,
      },
    'updated_at': {
        'type': Date,
        'validators': [{'fct': 'isDate',  'skipIfEmpty': true, 'msg': 'module.source.validation.error.updated_at.format'}],
        'default': null,
      },
    'title': {
        'type': String,
        'unique': true,
        'required': true,
        'validators': [
          { 'fct': 'required',
            'msg': 'module.source.validation.error.title.required',
          },
        ],
      },
    'description': {
        'type': String,
        'required': true,
        'validators': [
          { 'fct': 'required',
            'msg': 'module.source.validation.error.description.required',
          },
        ],
      },
    'url': {
        'type': String,
        'unique': true,
        'validators': [
          { 'fct': 'isURL',
            'args': {
              'protocols': ['http','https'],
              'require_tld': true,
              'require_protocol': true,
              'require_valid_protocol': true,
              'allow_underscores': false,
              'host_whitelist': false,
              'host_blacklist': false,
              'allow_trailing_dot': false,
              'allow_protocol_relative_urls': false
            },
            'skipIfEmpty': true,
          }
        ],
      },
    'rss': {
        'type': String,
        'unique': true,
        'required': true,
        'validators': [
          { 'fct': 'required',
            'msg': 'module.source.validation.error.rss.required',
          },
          { 'fct': 'isURL',
            'args': {
              'protocols': ['http','https'],
              'require_tld': true,
              'require_protocol': true,
              'require_valid_protocol': true,
              'allow_underscores': false,
              'host_whitelist': false,
              'host_blacklist': false,
              'allow_trailing_dot': false,
              'allow_protocol_relative_urls': false
            },
            'skipIfEmpty': true,
          }
        ],
      },
    'online': {
        'type': Boolean,
        'required': true,
        'default': true,
        'validators': []
      }
  }
};
