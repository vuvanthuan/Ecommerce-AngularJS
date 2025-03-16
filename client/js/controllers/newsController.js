app.controller(
  "NewsController",
  function ($scope, $sce, $location, apiService) {
    $scope.newsList = [];
    $scope.selectedNews = {};

    function fetchNews() {
      apiService
        .get("/api/blogs")
        .then(function (response) {
          if (response.data && Array.isArray(response.data)) {
            $scope.newsList = response.data.map((news) => {
              const shortContent =
                news.content.length > 300
                  ? news.content.substring(0, 300) + "..."
                  : news.content;
              return {
                ...news,
                safeContent: $sce.trustAsHtml(shortContent),
              };
            });

            if ($scope.newsList.length > 0) {
              $scope.selectNews($scope.newsList[0]._id);
            }
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tải danh sách tin tức:", error);
        });
    }

    // Các hàm khác giữ nguyên
    $scope.selectNews = function (id) {
      const selected = $scope.newsList.find((news) => news.id === id);
      if (selected) {
        $scope.selectedNews = selected;
      }
    };

    $scope.goToDetail = function (newsId) {
      $location.path("/tin-tuc-chi-tiet/" + newsId);
    };

    $scope.prevNews = function () {
      const currentIndex = $scope.newsList.findIndex(
        (news) => news.id === $scope.selectedNews.id
      );
      if (currentIndex > 0) {
        $scope.selectNews($scope.newsList[currentIndex - 1].id);
      } else {
        $scope.selectNews($scope.newsList[$scope.newsList.length - 1].id);
      }
    };

    $scope.nextNews = function () {
      const currentIndex = $scope.newsList.findIndex(
        (news) => news.id === $scope.selectedNews.id
      );
      if (currentIndex < $scope.newsList.length - 1) {
        $scope.selectNews($scope.newsList[currentIndex + 1].id);
      } else {
        $scope.selectNews($scope.newsList[0].id);
      }
    };

    $scope.formatDate = function (dateString) {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    fetchNews();
  }
);
