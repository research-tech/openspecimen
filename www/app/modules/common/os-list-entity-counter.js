
angular.module('openspecimen')
  .directive('osEntityCounter', function() {
    function linker(scope, element, attrs) {
      scope.model = attrs.model;
      scope.opts = attrs.filterOpts;
    }
    
    return {
      restrict: 'E',
      replace: true,
      scope: {
        list: '='
      },
      controller: function($scope, osModel) {
        $scope.$watch('list', function(newVal, oldVal) {
          checkCount();
        });
        
        function checkCount() {
          $scope.totalRecords = undefined;
          if ($scope.list.length <= 100) {
            $scope.moreRecords = false;
            return;
          }
          
          $scope.moreRecords = true;
          $scope.list.splice(-1);
        }
         
        $scope.getCount = function() {
          var filterOpts = $scope.$parent[$scope.opts];
          var model = osModel($scope.model);
          model.getCount(filterOpts).then(
            function(result) {
              $scope.totalRecords = result;
              $scope.moreRecords = false;
            }
          );
        }
      },
      link: linker,
      template: '<div class="os-counter">' +
                '  <span translate="common.counter.showing"> Showing </span> {{list.length}}' +
                '  <span translate="common.counter.of" ng-if="totalRecords || moreRecords"> of </span>' + 
                '  <span ng-if="moreRecords"> <a translate="common.counter.many_more" ng-click="getCount()"> </a> </span>' +
                '  {{totalRecords}} <span translate="common.counter.records"> records </span>' +
                '</div>'
    }
  });
