app.controller(
  "CartController",
  function ($scope, $http, $location, CartService) {
    $scope.cartItems = [];

    init();

    function init() {
      $scope.cartItems = CartService.getCartItems();

      if ($scope.cartItems.length === 0) {
        $scope.cartItems = [];

        CartService.updateCart($scope.cartItems);
      }
    }
    $scope.removeItem = function (item) {
      var index = $scope.cartItems.indexOf(item);
      if (index !== -1) {
        $scope.cartItems.splice(index, 1);
        CartService.updateCart($scope.cartItems);
      }
    };

    $scope.updateCart = function () {
      $scope.cartItems.forEach(function (item) {
        if (item.quantity < 1) {
          item.quantity = 1;
        }
      });

      CartService.updateCart($scope.cartItems);
    };

    $scope.getSubtotal = function () {
      var subtotal = 0;
      for (var i = 0; i < $scope.cartItems.length; i++) {
        subtotal += $scope.cartItems[i].price * $scope.cartItems[i].quantity;
      }
      return subtotal;
    };

    $scope.getTotal = function () {
      return $scope.getSubtotal();
    };

    $scope.checkout = function () {
      if ($scope.cartItems.length === 0) {
        alert(
          "Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm trước khi thanh toán."
        );
      } else {
        $location.path("/thanh-toan");
      }
    };
  }
);
