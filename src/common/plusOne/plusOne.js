angular.module('plusOne', [])

  .directive('plusOne', function () {
    return {
      link: function (scope, element) {
        /* globals gapi */
        gapi.plusone.render(element[0], {
          "size": "medium",
          "href": "https://github.com/row1/ngbpgp"
        });
      }
    };
  });
