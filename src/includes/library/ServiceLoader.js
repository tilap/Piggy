/**
 * Get a business module service class
 * Front and Back working
 */

// {BACK}
import Storage from 'piggy-module/lib/Storage/Mongo';
// {/BACK}

// {FRONT}
import Storage from 'piggy-module/lib/Storage/Api';
// {/FRONT}

import SourceService from './../../modules/source/Service';
import SourceManager from './../../modules/source/Manager';
import UserService from './../../modules/user/Service';
import UserManager from './../../modules/user/Manager';

let moduleClasses = {
  'source': {
    'service': SourceService,
    'manager': SourceManager,
  },
  'user': {
    'service': UserService,
    'manager': UserManager,
  },
};

export default function loadService(module, storageOption) {
  let Service = moduleClasses[module].service;
  let Manager = moduleClasses[module].manager;

  let storage = new Storage(storageOption, module);
  let manager = new Manager(storage);
  let service = new Service(manager);
  return service;
}
