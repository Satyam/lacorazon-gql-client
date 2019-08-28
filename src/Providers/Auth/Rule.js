/*

// This Rule is expected to be active in the Auth0 dashboard rules for this app

// NAMESPACE is expected to be the same as the `audience` argument passed to the provider


function (user, context, callback) {
  var map = require('array-map');
  var ManagementClient = require('auth0@2.17.0').ManagementClient;
  var management = new ManagementClient({
    token: auth0.accessToken,
    domain: auth0.domain
  });

  var params = { id: user.user_id, page: 0, per_page: 50, include_totals: true };
  management.getUserPermissions(params, function (err, permissions) {
    if (err) {
      // Handle error.
      console.log('err: ', err);
      callback(err);
    } else {
      var permissionsArr = map(permissions.permissions, function (permission) {
        return permission.permission_name;
      });
      context.idToken[configuration.NAMESPACE + 'user_authorization'] = {
        permissions: permissionsArr
      };
    }
    callback(null, user, context);
  });
}
*/