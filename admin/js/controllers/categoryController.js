app.controller("CategoryController", function ($scope, apiService) {
  // Khởi tạo dữ liệu
  $scope.categories = [];
  $scope.formData = {};
  $scope.modalTitle = "";

  $scope.closeModal = function () {
    $("#categoryModal").modal("hide");
  };

  // Lấy danh sách danh mục
  $scope.getCategories = function () {
    apiService
      .get("/api/categories")
      .then(function (response) {
        $scope.categories = response.data;
      })
      .catch(function (error) {
        console.error("Error fetching categories:", error);
      });
  };

  // Mở modal để thêm danh mục
  $scope.openCreateCategoryModal = function () {
    $scope.modalTitle = "Thêm danh mục";
    $scope.formData = {}; // Reset form data
    $("#categoryModal").modal("show");
  };

  // Mở modal để sửa danh mục
  $scope.openEditCategoryModal = function (categoryId) {
    $scope.modalTitle = "Sửa danh mục";
    apiService
      .get(`/api/categories/${categoryId}`)
      .then(function (response) {
        $scope.formData = response.data;
        $scope.formData.tag = response.data.tag.join(", ");
        setTimeout(() => {
          $("#categoryModal").modal("show");
        }, 100);
      })
      .catch(function (error) {
        console.error("Error fetching category:", error);
      });
  };

  // Lưu danh mục
  $scope.saveCategory = function () {
    const url = $scope.formData._id
      ? `/api/categories/${$scope.formData._id}`
      : "/api/categories";
    const method = $scope.formData._id ? "put" : "post";

    // Chuyển tags từ chuỗi thành mảng
    if (typeof $scope.formData.tag === "string") {
      $scope.formData.tag = $scope.formData.tag
        .split(",")
        .map((tag) => tag.trim());
    } else {
      $scope.formData.tag = []; // Nếu không có tag thì set là mảng rỗng
    }

    apiService[method](url, $scope.formData)
      .then(function (response) {
        $scope.getCategories(); // Cập nhật danh sách danh mục
        $("#categoryModal").modal("hide"); // Đóng modal
      })
      .catch(function (error) {
        console.error("Error saving category:", error);
      });
  };

  // Xóa danh mục
  $scope.deleteCategory = function (categoryId) {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      apiService
        .delete(`/api/categories/${categoryId}`)
        .then(function () {
          $scope.getCategories(); // Cập nhật danh sách danh mục
        })
        .catch(function (error) {
          console.error("Error deleting category:", error);
        });
    }
  };

  // Khởi tạo
  $scope.getCategories();
});
