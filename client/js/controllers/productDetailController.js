app.controller(
  "ProductDetailController",
  function ($scope, $routeParams, apiService, $location, CartService) {
    $scope.selectedProduct = {};
    $scope.relatedProducts = [];

    // Hàm fetch sản phẩm chi tiết
    function fetchProductDetail() {
      const productId = $routeParams.id; // Lấy ID từ route params
      if (!productId) {
        console.warn("Không tìm thấy ID sản phẩm!");
        return Promise.reject("No product ID provided");
      }

      return apiService
        .get(`/api/products/${productId}`)
        .then(function (response) {
          if (response.data) {
            $scope.selectedProduct = response.data;
            return response.data;
          } else {
            console.error("Không tìm thấy sản phẩm!");
            throw new Error("Product not found");
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tải chi tiết sản phẩm:", error);
          throw error;
        });
    }

    // Hàm fetch sản phẩm liên quan
    function fetchRelatedProducts() {
      const productId = $routeParams.id;
      if (
        !$scope.selectedProduct.categories ||
        !$scope.selectedProduct.categories.length
      ) {
        console.warn("Không tìm thấy danh mục để lấy sản phẩm liên quan!");
        return;
      }

      apiService
        .get(
          `/api/products/related?category=${$scope.selectedProduct.categories[0]}&exclude=${productId}&limit=3`
        )
        .then(function (response) {
          if (response.data && Array.isArray(response.data)) {
            $scope.relatedProducts = response.data;
          } else {
            console.warn("Không tìm thấy sản phẩm liên quan!");
            $scope.relatedProducts = [];
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tải sản phẩm liên quan:", error);
          $scope.relatedProducts = [];
        });
    }

    // Hàm thêm vào giỏ hàng sử dụng CartService
    $scope.addToCart = function (productId) {
      // Kiểm tra xem sản phẩm đã được tải chưa
      if (!$scope.selectedProduct || $scope.selectedProduct._id !== productId) {
        console.warn("Sản phẩm chưa được tải hoặc ID không khớp!");
        alert("Sản phẩm chưa được tải hoặc ID không khớp!");
        return;
      }

      // Tạo đối tượng sản phẩm để thêm vào giỏ hàng
      const productToAdd = {
        _id: $scope.selectedProduct._id, // Sử dụng _id thay vì id
        name: $scope.selectedProduct.name,
        price: $scope.selectedProduct.price,
        image: $scope.selectedProduct.image,
      };

      // Thêm vào giỏ hàng bằng CartService
      CartService.addToCart(productToAdd, 1); // Thêm 1 sản phẩm
      alert(`Đã thêm "${productToAdd.name}" vào giỏ hàng!`);
      console.log("Đã thêm sản phẩm vào giỏ hàng:", productToAdd);
    };

    // Chuyển đến chi tiết sản phẩm khác
    $scope.goToProductDetail = function (productId) {
      $location.path(`/product-detail/${productId}`);
    };

    // Gọi API khi controller khởi động
    fetchProductDetail().then(() => {
      fetchRelatedProducts();
    });
  }
);
