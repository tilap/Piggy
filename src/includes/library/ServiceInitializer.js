import loadService from './ServiceLoader';
import Context from '../Context';

// {FRONT}
let storageOption = 'http://localhost:2223/';
// {/FRONT}
// {BACK}
import storageOption from 'database';
// {/BACK}

export default function initializeService(module, context = null) {
  let service = loadService(module, storageOption);
  if (context && context instanceof Context) {
    service.setContext(context);
  }
  return service;
}
