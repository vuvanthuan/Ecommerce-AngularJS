app.directive('fileChange', function () {
    return {
      scope: {
        fileChange: "&"
      },
      link: function (scope, element) {
        element.bind('change', function (event) {
          event.preventDefault();
          scope.$apply(function () {
            scope.fileChange({ file: event.target.files[0] });
          });
        });
      }
    };
  });
