app.controller("BlogController", [
  "$scope",
  "apiService",
  function ($scope, apiService) {
    $scope.blogs = [];
    $scope.formData = {};
    $scope.modalTitle = "";

    $scope.closeModal = function () {
      $("#blogModal").modal("hide");
    };

    // Fetch blogs
    $scope.fetchBlogs = function () {
      apiService.get("/api/blogs").then(function (response) {
        $scope.blogs = response.data;
      });
    };

    // Open create modal
    $scope.openCreateBlogModal = function () {
      $scope.modalTitle = "Thêm bài viết";
      $scope.formData = {};
      $("#blogModal").modal("show");
      setTimeout(function () {
        CKEDITOR.replace("content");
      }, 0);
    };

    // Open edit modal
    $scope.openEditBlogModal = function (id) {
      $scope.modalTitle = "Sửa bài viết";
      apiService.get("/api/blogs/" + id).then(function (response) {
        $scope.formData = response.data;
        $("#blogModal").modal("show");

        $("#blogModal").on("shown.bs.modal", function () {
          if (CKEDITOR.instances.content) {
            CKEDITOR.instances.content.destroy();
          }
          CKEDITOR.replace("content");
          CKEDITOR.instances.content.setData($scope.formData.content);
        });
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

            $scope.formData.thumbnail = fullUrl;
          });
        })
        .catch((error) => {
          console.error("Upload Error:", error);
          alert("Có lỗi xảy ra khi upload ảnh.");
        });
    };

    // Save blog (create or update)
    $scope.saveBlog = function ($event) {
      $event.preventDefault(); // Ngăn reload trang
      $event.stopPropagation();

      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Không tìm thấy userId, vui lòng đăng nhập lại!");
        return;
      }

      $scope.formData.author = userId;
      $scope.formData.content = CKEDITOR.instances.content.getData();

      if ($scope.formData._id) {
        // Update
        apiService
          .put("/api/blogs/" + $scope.formData._id, $scope.formData)
          .then(function () {
            $scope.fetchBlogs();
            $("#blogModal").modal("hide");
          })
          .catch((error) => {
            console.error("Update Error:", error);
            alert("Có lỗi khi cập nhật bài viết.");
          });
      } else {
        // Create
        apiService
          .post("/api/blogs", $scope.formData)
          .then(function () {
            $scope.fetchBlogs();
            $("#blogModal").modal("hide");
          })
          .catch((error) => {
            console.error("Create Error:", error);
            alert("Có lỗi khi tạo bài viết.");
          });
      }
    };

    // Delete blog
    $scope.deleteBlog = function (id) {
      if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
        apiService.delete("/api/blogs/" + id).then(function () {
          $scope.fetchBlogs();
        });
      }
    };

    // Initial fetch
    $scope.fetchBlogs();
  },
]);
