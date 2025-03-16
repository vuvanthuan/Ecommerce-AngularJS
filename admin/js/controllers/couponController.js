app.controller("CouponController", function ($scope, apiService) {
  $scope.coupons = [];
  $scope.formData = {};
  $scope.modalTitle = "";

  $scope.closeModal = function () {
    $("#couponModal").modal("hide");
  };

  $scope.getCoupons = function () {
    apiService
      .get("/api/coupons")
      .then(function (response) {
        $scope.coupons = response.data;
      })
      .catch(function (error) {
        console.error("Error fetching coupons:", error);
      });
  };

  $scope.openCreateCouponModal = function () {
    $scope.modalTitle = "Thêm khuyến mãi";
    $scope.formData = {};
    $("#couponModal").modal("show");
  };

  $scope.openEditCouponModal = function (couponId) {
    $scope.modalTitle = "Sửa khuyến mãi";
    apiService
      .get(`/api/coupons/${couponId}`)
      .then(function (response) {
        $scope.formData = response.data;
        setTimeout(() => {
          $("#couponModal").modal("show");
        }, 100);
      })
      .catch(function (error) {
        console.error("Error fetching coupon:", error);
      });
  };

  $scope.saveCoupon = function () {
    const url = $scope.formData._id
      ? `/api/coupons/${$scope.formData._id}`
      : "/api/coupons";
    const method = $scope.formData._id ? "put" : "post";

    apiService[method](url, $scope.formData)
      .then(function () {
        $scope.getCoupons();
        $("#couponModal").modal("hide");
      })
      .catch(function (error) {
        console.error("Error saving coupon:", error);
      });
  };

  $scope.deleteCoupon = function (couponId) {
    if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      apiService
        .delete(`/api/coupons/${couponId}`)
        .then(function () {
          $scope.getCoupons();
        })
        .catch(function (error) {
          console.error("Error deleting coupon:", error);
        });
    }
  };

  $scope.getCoupons();
});
