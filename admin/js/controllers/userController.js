app.controller("UserController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.users = [];
    $scope.formData = {};
    $scope.modalTitle = "";

    $scope.closeModal = function () {
      $("#userModal").modal("hide");
    };

    // Fetch users
    $scope.fetchUsers = function () {
      apiService.get("/api/users").then(function (response) {
        $scope.users = response.data;
      });
    };

    // Open create modal
    $scope.openCreateUserModal = function () {
      $scope.modalTitle = "Thêm người dùng";
      $scope.formData = {};
      $("#userModal").modal("show");
    };

    // Open edit modal
    $scope.openEditUserModal = function (id) {
      $scope.modalTitle = "Sửa người dùng";
      apiService.get("/api/users/" + id).then(function (response) {
        $scope.formData = response.data;
        $("#userModal").modal("show");
      });
    };

    // Save user (create or update)
    $scope.saveUser = function () {
      if ($scope.formData._id) {
        // Update existing user
        apiService
          .put("/api/users/" + $scope.formData._id, $scope.formData)
          .then(function () {
            $scope.fetchUsers();
            $("#userModal").modal("hide");
          });
      } else {
        // Create new user
        apiService.post("/api/users", $scope.formData).then(function () {
          $scope.fetchUsers();
          $("#userModal").modal("hide");
        });
      }
    };

    // Delete user
    $scope.deleteUser = function (id) {
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        apiService.delete("/api/users/" + id).then(function () {
          $scope.fetchUsers();
        });
      }
    };

    // Initial fetch
    $scope.fetchUsers();
  },
]);
