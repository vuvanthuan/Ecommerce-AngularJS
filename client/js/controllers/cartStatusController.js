// CartStatusController.js
app.controller("CartStatusController", function ($scope, CartService) {
  $scope.cartItemCount = CartService.getCartItemCount();

  $scope.$on("cartUpdated", function () {
    $scope.cartItemCount = CartService.getCartItemCount();
  });
});
