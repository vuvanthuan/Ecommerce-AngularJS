app.controller("HistoryController", [
  "$scope",
  "$sce",
  "$location",
  "apiService",
  function ($scope, $sce, $location, apiService) {
    $scope.orderList = [];
    $scope.selectedOrder = {};

    // Lấy userId từ localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("Không tìm thấy userId trong localStorage");
      return;
    }

    function fetchOrders() {
      // Gọi API để lấy danh sách đơn hàng dựa trên userId
      apiService
        .get(`/api/orders?userId=${userId}`)
        .then(function (response) {
          if (response.data && Array.isArray(response.data)) {
            $scope.orderList = response.data.map((order) => {
              // Tạo mô tả ngắn gọn từ danh sách sản phẩm
              const productDescription = order.products
                .map((p) => `${p.name} x ${p.quantity}`)
                .join(", ");
              const shortDescription =
                productDescription.length > 100
                  ? productDescription.substring(0, 100) + "..."
                  : productDescription;

              return {
                ...order,
                safeDescription: $sce.trustAsHtml(shortDescription),
                date: $scope.formatDate(order.orderDate), // Định dạng ngày
                total: order.totalAmount.toLocaleString("vi-VN"), // Định dạng tiền tệ
                product: productDescription, // Danh sách sản phẩm đầy đủ
              };
            });

            if ($scope.orderList.length > 0) {
              $scope.selectOrder($scope.orderList[0].orderNumber); // Chọn đơn hàng đầu tiên
            }
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tải danh sách đơn hàng:", error);
        });
    }

    // Hàm chọn đơn hàng
    $scope.selectOrder = function (orderNumber) {
      const selected = $scope.orderList.find(
        (order) => order.orderNumber === orderNumber
      );
      if (selected) {
        $scope.selectedOrder = selected;
      }
    };

    // Chuyển đến trang chi tiết đơn hàng
    $scope.goToOrderDetail = function (orderNumber) {
      $location.path("/don-hang-chi-tiet/" + orderNumber);
    };

    // Chuyển đến đơn hàng trước
    $scope.prevOrder = function () {
      const currentIndex = $scope.orderList.findIndex(
        (order) => order.orderNumber === $scope.selectedOrder.orderNumber
      );
      if (currentIndex > 0) {
        $scope.selectOrder($scope.orderList[currentIndex - 1].orderNumber);
      } else {
        $scope.selectOrder(
          $scope.orderList[$scope.orderList.length - 1].orderNumber
        );
      }
    };

    // Chuyển đến đơn hàng tiếp theo
    $scope.nextOrder = function () {
      const currentIndex = $scope.orderList.findIndex(
        (order) => order.orderNumber === $scope.selectedOrder.orderNumber
      );
      if (currentIndex < $scope.orderList.length - 1) {
        $scope.selectOrder($scope.orderList[currentIndex + 1].orderNumber);
      } else {
        $scope.selectOrder($scope.orderList[0].orderNumber);
      }
    };

    // Định dạng ngày tháng
    $scope.formatDate = function (dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    // Gọi hàm lấy danh sách đơn hàng
    fetchOrders();

    // Dữ liệu mẫu mặc định (nếu API chưa sẵn sàng)
    $scope.defaultOrder = {
      orderNumber: "#86353",
      date: "16 Tháng 3, 2025",
      total: "100,000",
      paymentMethod: "Thanh toán khi nhận hàng (COD)",
      product: "Demo lần 2 x 2",
    };

    // Nếu không có dữ liệu từ API, sử dụng dữ liệu mặc định
    if ($scope.orderList.length === 0) {
      $scope.orderList.push($scope.defaultOrder);
      $scope.selectOrder($scope.defaultOrder.orderNumber);
    }
  },
]);
