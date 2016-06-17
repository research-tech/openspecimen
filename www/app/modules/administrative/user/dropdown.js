
angular.module('os.administrative.user.dropdown', ['os.administrative.models'])
  .directive('osUsers', function(User) {
    function loadUsers(scope, searchTerm) {
      var opts = angular.extend({searchString : searchTerm}, scope.filterOpts || {});
      User.query(opts).then(
        function(result) {
          scope.users = result;
        }
      );
    };

    return {
      restrict: 'AE',

      scope: {
        ngModel: '=ngModel',
        placeholder: '@',
        onSelect: '=onSelect',
        filterOpts: '=',
        defaultList: '='
      },

      replace: true,

      controller: function($scope) {
        $scope.searchUsers = function(searchTerm) {
          if (!searchTerm && $scope.defaultList) {
            $scope.users = $scope.defaultList;
            return;
          }
          loadUsers($scope, searchTerm);
        };

        $scope.$watch('filterOpts', function(newVal, oldVal) {
          if (newVal == oldVal) {
            return;
          }

          loadUsers($scope);
        });
      },
  
      link: function(scope, element, attrs, ctrl) {
        if (!scope.ngModel && angular.isDefined(attrs.multiple)) {
          scope.ngModel = [];
        }
      },

      template: function(tElem, tAttrs) {
        var bodyAppend = angular.isDefined(tAttrs.appendToBody) ? tAttrs.appendToBody : "true";
        var tabable = angular.isDefined(tAttrs.osTabable) ? tAttrs.osTabable : "false";
        var selection = angular.isDefined(tAttrs.selectProp) ? "user." + tAttrs.selectProp + " as user in users" : "user in users";
        
        return angular.isDefined(tAttrs.multiple) ?
              '<div>' +
                '<ui-select multiple ng-model="$parent.ngModel" reset-search-input="true"' +
                  ' append-to-body="' + bodyAppend + '" os-tabable="' + tabable + '">' +
                  '<ui-select-match placeholder="{{$parent.placeholder}}">' +
                    '{{$item.lastName}}, {{$item.firstName}}' +
                  '</ui-select-match>' +
                  '<ui-select-choices repeat="' + selection +'" refresh="searchUsers($select.search)" refresh-delay="750">' +
                    '<span ng-bind-html="user.lastName + \', \' + user.firstName | highlight: $select.search"></span>' +
                  '</ui-select-choices>' +
                '</ui-select>' +
              '</div>'

              :

              '<div>' +
                '<ui-select ng-model="$parent.ngModel" reset-search-input="true"' + 
                  ' append-to-body="' + bodyAppend + '" os-tabable="' + tabable + '">' +
                  '<ui-select-match placeholder="{{$parent.placeholder}}" allow-clear="'+ (tAttrs.required == undefined) +'">' +
                    '{{$select.selected.lastName}}, {{$select.selected.firstName}}' +
                  '</ui-select-match>' +
                  '<ui-select-choices repeat="' + selection +'" refresh="searchUsers($select.search)" refresh-delay="750">' +
                    '<span ng-bind-html="user.lastName + \', \' + user.firstName | highlight: $select.search"></span>' +
                  '</ui-select-choices>' + 
                '</ui-select>' +
              '</div>';
      }
    };
  });
