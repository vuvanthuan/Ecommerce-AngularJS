app.service("LoginService", function () {
  var phoneNumber = "";

  return {
    getPhoneNumber: function () {
      return phoneNumber;
    },
    setPhoneNumber: function (number) {
      phoneNumber = number;
    },
  };
});
