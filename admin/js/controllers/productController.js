app.controller("ProductController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.products = [];
    $scope.categories = [];
    $scope.formData = {};
    $scope.modalTitle = "";

    $scope.closeModal = function () {
      $("#productModal").modal("hide");
    };

    // Fetch products
    $scope.fetchProducts = function () {
      apiService.get("/api/products").then(function (response) {
        $scope.products = response.data;
      });
    };

    $scope.fetchCategories = function () {
      apiService
        .get("/api/categories")
        .then(function (response) {
          $scope.categories = response.data;
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy danh sách danh mục:", error);
          alert("Không thể tải danh sách danh mục!");
        });
    };

    // Open create modal
    $scope.openCreateProductModal = function () {
      $scope.modalTitle = "Thêm sản phẩm";
      $scope.formData = {}; // Reset form data
      $("#productModal").modal("show");
    };

    // Open edit modal
    $scope.openEditProductModal = function (id) {
      $scope.modalTitle = "Sửa sản phẩm";
      apiService.get("/api/products/" + id).then(function (response) {
        $scope.formData = response.data; // Gán dữ liệu hiện tại vào form
        $("#productModal").modal("show");
      });
    };

    $scope.onFileSelect = function (files) {
      if (files && files.length > 0) {
        $scope.uploadImage(files[0]);
      } else {
        console.log("Không có file nào được chọn.");
      }
    };

    $scope.uploadImage = function (file) {
      if (!file) {
        alert("Vui lòng chọn một file ảnh!");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      apiService
        .post("/api/upload", formData, {
          headers: { "Content-Type": undefined },
          transformRequest: angular.identity,
        })
        .then((response) => {
          $scope.$applyAsync(() => {
            const relativeUrl = response.data.url;
            const fullUrl = `http://127.0.0.1:3001${relativeUrl}`;
            $scope.formData.image = fullUrl;
          });
        })
        .catch((error) => {
          console.error("Upload Error:", error);
          alert("Có lỗi xảy ra khi upload ảnh.");
        });
    };

    // Save product (create or update)
    $scope.saveProduct = function ($event) {
      if ($event) {
        $event.preventDefault();
      }
      if ($scope.formData._id) { //Bấm sửa
        // Update existing product
        apiService
          .put("/api/products/" + $scope.formData._id, $scope.formData)
          .then(function () {
            $scope.fetchProducts(); // Reload danh sách sản phẩm
            $("#productModal").modal("hide");
          });
      } else {
        // Create new product
        apiService.post("/api/products", $scope.formData).then(function () {
          $scope.fetchProducts(); // Reload danh sách sản phẩm
          $("#productModal").modal("hide");
        });
      }
    };

    // Delete product
    $scope.deleteProduct = function (id) {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        apiService.delete("/api/products/" + id).then(function () {
          $scope.fetchProducts(); // Reload danh sách sản phẩm
        });
      }
    };

    // Initial fetch
    $scope.fetchProducts();
    $scope.fetchCategories();
  },
]);
