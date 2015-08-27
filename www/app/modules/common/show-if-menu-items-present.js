
angular.module('openspecimen')
  .directive('osShowIfMenuItemsPresent', function($timeout) {
    function isElementDisplayed(item) {
      if(item.style.display == 'none' || item.style.visibility == 'hidden' || parseInt(item.style.opacity) <= 0) {
        return false;
      } else {
        return true;
      }
    }
        
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        $timeout(function() {
          var menuItems = element.find("ul.dropdown-menu li");
          var displayMenu = false;
          for (var i = 0; i < menuItems.length; i++) {
            if (isElementDisplayed(menuItems[i])) {
              displayMenu = true;
              break;
            }
          }
          
          if (!displayMenu) {
            element.hide();
          }
        });
      }
    }
  });
