import ModuleFactory from './ModuleFactory';
import ValidationError from 'piggy-module/lib/ValidationError';
import sweetalert from 'sweetalert/dist/sweetalert.min.js';

let userService = ModuleFactory.getServiceInstance('user');

function showUserList() {
  userService.get({}, {limit: 100, sort: [['created_at', 'desc']]})
    .then( users => {
      let result = '';
      if (users.length === 0) {
        result = '<tr><td>Aucun résultat</td></tr>';
      }
      else {
        users.forEach( user => {
          result += '<tr>';
          result += '<td>' + user.username + '</td>';
          result += '<td>' + (user.firstname ? user.firstname : '-') + '</td>';
          result += '<td>' + (user.lastname ? user.lastname : '-') + '</td>';
          result += '<td>' + (user.email ? user.email : '-') + '</td>';
          result += '</tr>';
        });
      }
      document.getElementById('user-list').innerHTML = result;
    }) .catch(err => {
      console.log(err);
    });
}

showUserList();

var form = document.getElementById('user-create-form');
form.onsubmit = function() {
  let itemData = {};
  ['username', 'firstname', 'lastname', 'email'].forEach( key => {
    itemData[key] = document.getElementsByName(key)[0].value;
  });
  userService.createNewOne(itemData)
    .catch(errors => {
      if(errors instanceof ValidationError) {
        var errorMessage = '';
        Object.keys(errors.validation).forEach( property => {
          errorMessage += errors.validation[property].message + "\n";
        });
        sweetalert('Error', errorMessage, 'error');
      }
      else {
        sweetalert('Error', 'Internal server error: ' + errors.message, 'error');
      }
      return false;
    })
    .then( user => {
      if(user) {
        sweetalert('User created!', 'User with username "' + user.username + '" has been created', 'success');
        ['username', 'firstname', 'lastname', 'email'].forEach( key => {
          document.getElementsByName(key)[0].value = '';
        });
        showUserList();
      }
    })
  return false;
};

/*
// Get one user
userService.getOneByUsername('jlavinh')
  .then( user => {
    if(user) {
      console.log('getOneByUsername => ' + user.username);
    }
    else {
      console.log('getOneByUsername => No user found with unique username');
    }

  }) .catch(err => {
    console.log(err);
  });
*/

