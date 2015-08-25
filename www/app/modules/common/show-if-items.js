
angular.module('openspecimen')
  .directive('osShowIfItems', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        $timeout(function() {
          var showMoreButton = false;
          var items = element.find("ul.dropdown-menu li");
          
          for (var i=0; i<items.length; i++) {
            if(items[i].style.display != 'none') { 
              showMoreButton = true;
              break;
            }
          }
          if(showMoreButton == false) {
            element.hide();
          }
        });
      }
    }
  });
