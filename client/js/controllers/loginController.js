app.controller("LoginController", [
  "$scope",
  "apiService",
  "$timeout",
  "LoginService",
  "$location",
  function ($scope, apiService, $timeout, LoginService, $location) {
    $scope.phoneNumber = "";
    $scope.password = "";

    // Hàm khởi tạo để kiểm tra trạng thái đăng nhập
    function init() {
      var userId = localStorage.getItem("userId");
      var userName = localStorage.getItem("userName");
      $scope.displayText = userId
        ? "Xin chào " + (userName || "Khách hàng")
        : "Tài khoản";
    }

    // Gọi hàm init khi controller khởi tạo
    init();

    // Hàm xử lý click vào nút tài khoản
    $scope.handleAccountClick = function () {
      var userId = localStorage.getItem("userId");
      if (userId) {
        $location.path("/history");
      } else {
        var accountModal = document.getElementById("accountModal");
        if (accountModal) {
          var bsAccountModal = new bootstrap.Modal(accountModal);
          bsAccountModal.show();
        }
      }
    };

    // Hàm bắt đầu đăng nhập
    $scope.initiateLogin = function () {
      if (!$scope.phoneNumber) {
        $scope.phoneError = true;
        $timeout(function () {
          $scope.phoneError = false;
        }, 3000);
        return;
      }
      LoginService.setPhoneNumber($scope.phoneNumber);

      var accountModal = document.getElementById("accountModal");
      var passwordModal = document.getElementById("passwordModal");
      if (accountModal && passwordModal) {
        var bsAccountModal = bootstrap.Modal.getInstance(accountModal);
        bsAccountModal.hide();

        $timeout(function () {
          var bsPasswordModal = new bootstrap.Modal(passwordModal);
          bsPasswordModal.show();
        }, 500);
      }
    };

    // Hàm gửi thông tin đăng nhập
    $scope.submitLogin = function () {
      if (!$scope.password) {
        $scope.passwordError = true;
        $timeout(function () {
          $scope.passwordError = false;
        }, 3000);
        return;
      }

      apiService
        .post("/api/auth/login", {
          phoneNumber: LoginService.getPhoneNumber(),
          password: $scope.password,
        })
        .then(function (response) {
          var passwordModal = document.getElementById("passwordModal");
          if (passwordModal) {
            var bsPasswordModal = bootstrap.Modal.getInstance(passwordModal);
            bsPasswordModal.hide();
          }

          // Lưu dữ liệu người dùng vào localStorage
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("userName", response.data.name || "Khách hàng");

          // Cập nhật displayText sau khi đăng nhập thành công
          $scope.displayText =
            "Xin chào " + (response.data.name || "Khách hàng");

          // Điều hướng sau khi đăng nhập thành công
          $timeout(function () {
            $scope.handleAccountClick(); // Điều hướng sang /history
          }, 500);
        })
        .catch(function (error) {
          $scope.loginError = true;
          $scope.errorMessage = "Sai mật khẩu, vui lòng thử lại.";

          $timeout(function () {
            $scope.loginError = false;
          }, 3000);
        });
    };
  },
]);
