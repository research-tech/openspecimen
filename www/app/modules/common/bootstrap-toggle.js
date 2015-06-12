angular.module('openspecimen')
  .directive('osToggle', function() {
    return {
      restrict: 'A',
      
      link: function(scope, element, attrs) {
        var option = (attrs.osToggle) ? scope.$eval(attrs.osToggle) : {};
        element.bootstrapToggle(option);
      }
    }
  });