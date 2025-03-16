const app = angular.module("tinhMocVietApp", ["ngRoute"]);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/pages/home.html",
      controller: "ProductController",
    })
    .when("/gioi-thieu", {
      templateUrl: "views/pages/introduce.html",
      controller: "IntroduceController",
    })
    .when("/san-pham", {
      templateUrl: "views/pages/product.html",
      controller: "ProductController",
    })
    .when("/san-pham-chi-tiet/:id", {
      templateUrl: "views/pages/product-detail.html",
      controller: "ProductDetailController",
    })
    .when("/tin-tuc", {
      templateUrl: "views/pages/news.html",
      controller: "NewsController",
    })
    .when("/tin-tuc-chi-tiet/:id", {
      templateUrl: "views/pages/news-detail.html",
      controller: "NewsDetailController",
    })
    .when("/lien-he", {
      templateUrl: "views/pages/contact.html",
      controller: "ContactController",
    })
    .when("/gio-hang", {
      templateUrl: "views/pages/cart.html",
      controller: "CartController",
    })
    .when("/thanh-toan", {
      templateUrl: "views/pages/checkout.html",
      controller: "CheckoutController",
    })
    .when("/chinh-sach-bao-hanh", {
      templateUrl: "views/pages/policy.html",
    })
    .when("/chinh-sach-bao-mat", {
      templateUrl: "views/pages/security.html",
    })
    .when("/phuong-thuc-thanh-toan", {
      templateUrl: "views/pages/payment-method.html",
    })
    .when("/phuong-thuc-van-chuyen", {
      templateUrl: "views/pages/delivery-method.html",
    })
    .when("/dieu-khoan-dieu-kien", {
      templateUrl: "views/pages/terms-and-conditions.html",
    })
    .when("/history", {
      templateUrl: "views/pages/history.html",
      controller: "HistoryController",
    })
    .otherwise({
      redirectTo: "/",
    });
  $locationProvider.hashPrefix("");
});
