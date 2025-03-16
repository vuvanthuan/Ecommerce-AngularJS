const app = angular.module("adminApp", ["ngRoute"]);

// Cấu hình router
app.config(function ($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "login.html",
      controller: "LoginController",
    })
    .when("/dashboard", {
      templateUrl: "views/dashboard.html",
      controller: "DashboardController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/products", {
      templateUrl: "views/products.html",
      controller: "ProductController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/categories", {
      templateUrl: "views/categories.html",
      controller: "CategoryController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/coupons", {
      templateUrl: "views/coupons.html",
      controller: "CouponController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/users", {
      templateUrl: "views/users.html",
      controller: "UserController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/blogs", {
      templateUrl: "views/blogs.html",
      controller: "BlogController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/orders", {
      templateUrl: "views/orders.html",
      controller: "OrderController",
      resolve: {
        auth: function ($location) {
          if (!localStorage.getItem("loggedIn")) {
            $location.path("/login");
          }
        },
      },
    })
    .otherwise({
      redirectTo: "/login",
    });
});

app.run(function ($rootScope, $location, $window) {
  var windowElement = angular.element($window);
  windowElement.on("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = "";
  });
  $rootScope.isLogin = function () {
    return localStorage.getItem("userId") !== null;
  };

  $rootScope.$on("$routeChangeSuccess", function () {
    if (!$rootScope.isLogin()) {
      $location.path("/login");
    }
  });
});

app.controller("SidebarController", [
  "$scope",
  "$location",
  function ($scope, $location) {
    $scope.$location = $location;
  },
]);
