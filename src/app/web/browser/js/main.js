import $ from 'jquery';

import sweetalert from 'sweetalert/dist/sweetalert.min.js';

import ModuleFactory from './ModuleFactory';
import ValidationError from 'piggy-module/lib/ValidationError';

let userService = ModuleFactory.getServiceInstance('user');


if (!self.fetch) {
  sweetalert('Your browser is too old school', 'Your browser does not support fetch', 'error');
}

let form = document.getElementById('user-create-form');
let $table = $('#user-list');

function showUserList() {
  userService.get({}, {'limit': 100, 'sort': [['created_at', 'desc']]})
    .then( users => {
      let result = '';
      if (users.length === 0) {
        result = '<tr><td>Aucun résultat</td></tr>';
      } else {
        users.forEach( user => {
          result += '<tr>';
          result += '<td>' + user.id + '</td>';
          result += '<td>' + user.username + '</td>';
          result += '<td>' + (user.firstname ? user.firstname : '-') + '</td>';
          result += '<td>' + (user.lastname ? user.lastname : '-') + '</td>';
          result += '<td>' + (user.email ? user.email : '-') + '</td>';
          result += '<td><a data-delete="' + user._id + '">Supprimer</a></td>';
          result += '</tr>';
        });
      }
      $table.html(result);
      initDelete();
    }) .catch(err => {
      console.error(err);
    });
}

function initDelete() {
  $table.find('[data-delete]').click( function() {
    let id = $(this).data('delete');
    userService.delete({ '_id': id }).then( itemDeletedCountResult => {
      if (itemDeletedCountResult.data && itemDeletedCountResult.data.deleted && itemDeletedCountResult.data.deleted === 1) {
        sweetalert('User successfully deleted');
      } else {
        sweetalert('Error occured while user deletion');
      }
      showUserList();
    });
    return false;
  });
}

if (form) {
  initDelete();

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
        if (errors instanceof ValidationError) {
          var errorMessage = '';
          Object.keys(errors.validation).forEach( property => {
            errorMessage += errors.validation[property].message + "\n";
          });
          sweetalert('Error', errorMessage, 'error');
        } else {
          sweetalert('Error', 'Internal server error: ' + errors.message, 'error');
        }
        return false;
      });
    return false;
  };
}
