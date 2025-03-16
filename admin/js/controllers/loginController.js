app.controller('LoginController', function ($scope, apiService, $location) {
    $scope.user = {};
    $scope.errorMessage = '';

    $scope.login = function () {
      apiService.post('/api/auth/login', $scope.user)
        .then(function (response) {
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('loggedIn', 'true');
          $location.path('/products');
        })
        .catch(function (err) {
          $scope.errorMessage = err.data.message;
        });
    };

    $scope.logout = function () {
      localStorage.removeItem('userId');
      $location.path('/login');
    };
  });
