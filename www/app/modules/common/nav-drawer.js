angular.module('openspecimen')
  .directive('osNavDrawer', function($compile, $translate, osNavDrawerSvc) {
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.find('ul').addClass('os-menu-items');
        element.find('ul').on('click', function() {
          osNavDrawerSvc.toggle();
        });
        element.find('li').on('click', function() {
          element.find('li.active').removeClass('active');
          angular.element(this).addClass('active');
        });
        element.find('div.os-home-nav').on('click', function() {
          osNavDrawerSvc.toggle();
        });

        element.addClass('os-nav-drawer');

        var overlay = angular.element('<div/>').addClass('os-nav-drawer-overlay');
        element.after(overlay);
        overlay.on('click', function() {
          osNavDrawerSvc.toggle();
        });

        element.removeAttr('os-nav-drawer');
        osNavDrawerSvc.setDrawer(element);
        $compile(element)(scope);
      }
    };
  })
  .directive('osNavButton', function(osNavDrawerSvc) {
    return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          osNavDrawerSvc.toggle();
        });
      }
    };
  })
  .factory('osNavDrawerSvc', function() {
    var drawerEl = undefined;
    return {
      setDrawer: function(drawer) {
        drawerEl = drawer;
      },

      toggle: function() {
        drawerEl.toggleClass('active');
        angular.element('.os-nav-button').toggleClass('active');
      }
    }
  });
