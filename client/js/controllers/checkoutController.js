app.controller(
  "CheckoutController",
  function ($scope, apiService, CartService, $location) {

    $scope.order = {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      note: "",
      products: CartService.getCartItems(), // Lấy sản phẩm từ CartService
      total: CartService.getCartTotal(), // Lấy tổng tiền từ CartService
      orderNumber: "#" + Math.floor(10000 + Math.random() * 90000), // Tạo mã ngẫu nhiên
      orderDate: new Date().toLocaleDateString("en-GB"), // Ngày hiện tại (dd/mm/yyyy)
      shippingMethod: "Giao hàng tiêu chuẩn - Miễn phí",
      paymentMethod: "Thanh toán khi nhận hàng (COD)",
    };

    $scope.submitOrder = function () {
      if ($scope.orderForm.$valid) {
        // Kiểm tra lại userId trước khi gửi đơn hàng
        const userId = localStorage.getItem("userId");

        const orderData = {
          userId: userId, // Thêm userId vào orderData
          fullName: $scope.order.fullName,
          phone: $scope.order.phone,
          email: $scope.order.email,
          address: $scope.order.address,
          note: $scope.order.note || "",
          products: $scope.order.products.map((item) => ({
            productId: item._id, // Sử dụng _id từ CartService
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: $scope.order.total,
          orderNumber: $scope.order.orderNumber,
          orderDate: $scope.order.orderDate,
          shippingMethod: $scope.order.shippingMethod,
          paymentMethod: $scope.order.paymentMethod,
        };

        apiService
          .post("/api/orders", orderData)
          .then(function (response) {
            alert(
              "Đặt hàng thành công! Mã đơn hàng: " + response.data.orderNumber
            );
            CartService.clearCart();
            $location.path("/");
          })
          .catch(function (error) {
            alert(
              "Có lỗi xảy ra khi đặt hàng: " +
                (error.data?.message || error.message || "Lỗi không xác định")
            );
          });
      } else {
        alert("Vui lòng điền đầy đủ thông tin khách hàng trước khi đặt hàng!");
      }
    };
  }
);
