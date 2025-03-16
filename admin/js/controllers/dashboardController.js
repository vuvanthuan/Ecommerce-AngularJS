app.controller("DashboardController", function ($scope) {
  $scope.totalCustomers = 200;
  $scope.totalProducts = 150;
  $scope.totalOrders = 75;

  const ctx = document.getElementById("orderChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["January", "February", "March", "April", "May"],
      datasets: [
        {
          label: "Orders",
          data: [10, 20, 30, 40, 50],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
