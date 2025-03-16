app.controller("ProductController", function ($scope, $location, apiService) {
  $scope.selectedCategory = "";
  $scope.products = {};
  $scope.displayedProducts = [];

  function fetchCategories() {
    apiService
      .get("/api/categories")
      .then(function (response) {
        if (response.data && Array.isArray(response.data)) {
          $scope.categories = response.data;
          fetchProducts();
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi tải danh mục sản phẩm:", error);
      });
  }

  function fetchProducts() {
    apiService
      .get("/api/products")
      .then(function (response) {
        if (response.data && Array.isArray(response.data)) {
          $scope.products = response.data.reduce((acc, product) => {
            const category = product.category || "khac";
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
          }, {});

          const firstCategory = Object.keys($scope.products)[0] || "";
          $scope.selectedCategory = firstCategory;
          $scope.displayedProducts = $scope.products[firstCategory] || [];
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      });
  }

  $scope.selectCategory = function (categoryId) {
    $scope.selectedCategory = categoryId;
    apiService
      .get("/api/products?category=" + categoryId)
      .then(function (response) {
        $scope.displayedProducts = response.data;
      })
      .catch(function (error) {
        console.error("Lỗi khi lọc sản phẩm:", error);
      });
  };

  $scope.goToProductDetail = function (productId) {
    $location.path("/san-pham-chi-tiet/" + productId);
  };

  fetchProducts();
  fetchCategories();
});
