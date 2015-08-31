import $ from 'jquery';
import sweetalert from 'sweetalert/dist/sweetalert.min.js';
import ValidationError from 'piggy-module/lib/ValidationError';
import {UnreachableStorage} from 'piggy-module/lib/Storage/Errors';

import Context from './includes/Context';
let context = new Context();
if(currentContext) {
  Object.keys(currentContext).forEach(k => {
    context.set(k, currentContext[k]);
  });
}

import initializeService from './includes/library/ServiceInitializer';
function getModuleService(module) {
  return initializeService(module, context);
};

let form = document.getElementById('user-create-form');
let $table = $('#user-list');

let userService = getModuleService('user');

function showUserList() {
  userService.get({}, {'limit': 100, 'sort': [['created_at', 'desc']]})
    .then( users => {
      let result = '';
      if (users.length === 0) {
        result = '<tr><td>Aucun résultat</td></tr>';
      } else {
        users.forEach( user => {
          result += '<tr>';
          result += '<td><a href="/user/view/' + user.id + '/" title="' + user.id + '">' + user.username + '</a></td>';
          result += '<td>' + (user.firstname || '') + '</td>';
          result += '<td>' + (user.lastname || '') + '</td>';
          result += '<td>' + (user.email || '') + '</td>';
          result += '<td>';
            result += '<a class="btn btn-default btn-xs" href="/user/edit/' + user.id + '/">Edit</a> ';
            result += '<a class="btn btn-default btn-xs" data-delete="' + user.id + '">Delete</a>';
          result += '</td>';
        });
      }
      $table.html(result);
      initTableActions();
    }) .catch(err => {
      console.error(err);
    })
    .catch(errors => {
      serviceError(errors);
    });
}

function initTableActions() {
  $table.find('[data-delete]').click( function() {
    let id = $(this).data('delete');
    userService.delete({ '_id': id })
      .then( itemDeletedCountResult => {
        if (itemDeletedCountResult === 1) {
          sweetalert('User deleted', 'The user has been removed', 'success');
        } else {
          sweetalert('Error occured', 'The user has not been deleted', 'error');
          return false;
        }
        showUserList();
      })
      .catch(errors => {
        serviceError(errors);
      });
    return false;
  });
}

if (form) {
  initTableActions();

  form.onsubmit = function() {
    let itemData = {};
    ['username', 'firstname', 'lastname', 'email'].forEach( key => {
      itemData[key] = document.getElementsByName(key)[0].value;
    });


    userService.insertOne(itemData)
      .then( user => {
        if (user) {
          sweetalert('User created!', 'User with username "' + user.username + '" has been created', 'success');
          ['username', 'firstname', 'lastname', 'email'].forEach( key => {
            document.getElementsByName(key)[0].value = '';
          });
          showUserList();
        }
      })
      .catch(errors => {
        serviceError(errors);
      });

    return false;
  };
}

function serviceError(error) {
  if (error instanceof ValidationError) {
    var errorMessage = '';
    Object.keys(error.validation).forEach( property => {
      errorMessage += error.validation[property].message + "\n";
    });
    sweetalert('Validation error', errorMessage, 'error');
  } else if(error instanceof UnreachableStorage) {
    sweetalert('Server unavailable', 'The server is not available. Please try again or contact support', 'error');
  } else {
    sweetalert('Error', 'Internal server error: ' + error.message, 'error');
  }
}
