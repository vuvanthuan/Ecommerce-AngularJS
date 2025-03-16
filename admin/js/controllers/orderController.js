app.controller("OrderController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.orders = [];

    // Fetch orders
    $scope.fetchOrders = function () {
      apiService
        .get("/api/orders")
        .then(function (response) {
          $scope.orders = response.data;
        })
        .catch(function (error) {
          alert(
            "Có lỗi xảy ra khi tải danh sách đơn hàng: " +
              (error.data?.message || error.message)
          );
        });
    };

    // Update order status
    $scope.updateOrderStatus = function (order) {
      apiService
        .put("/api/orders/" + order._id, { status: order.status })
        .then(function (response) {
          alert("Cập nhật trạng thái thành công!");
          $scope.fetchOrders(); // Tải lại danh sách để đảm bảo dữ liệu mới nhất
        })
        .catch(function (error) {
          alert(
            "Có lỗi xảy ra khi cập nhật trạng thái: " +
              (error.data?.message || error.message)
          );
        });
    };

    // Initial fetch
    $scope.fetchOrders();
  },
]);
