app.controller(
  "NewsDetailController",
  function ($scope, $routeParams, apiService, $sce) {
    $scope.newsDetail = {};

    function fetchNewsDetail() {
      var newsId = $routeParams.id;
      apiService
        .get(`/api/blogs/${newsId}`)
        .then(function (response) {
          if (response.data) {
            $scope.newsDetail = {
              ...response.data,
              safeContent: $sce.trustAsHtml(response.data.content),
            };
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tải chi tiết tin tức:", error);
        });
    }

    $scope.formatDate = function (dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    fetchNewsDetail();
  }
);
