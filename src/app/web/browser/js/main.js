import ModuleFactory from './ModuleFactory';

ModuleFactory.getServiceInstance('user')
  .then( service => {
    service.get().then( users => {
      let result = '';
      users.forEach( user => {
        result += '<li><strong style="display:block">' + user.username + '</strong>aka ' + user.firstname + ' ' + user.lastname + '<br>email: ' + (user.email ? user.email : 'inconnu') + '</li>';
      });
      document.getElementById('user-list').innerHTML = result;
    })
    .catch(err => {
      console.log(err);
    });
  });

