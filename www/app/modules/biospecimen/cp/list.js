
angular.module('os.biospecimen.cp.list', ['os.biospecimen.models'])
  .controller('CpListCtrl', 
    function($scope, $state, cpList, CollectionProtocol, Util, PvManager, AuthorizationService) {

    function init() {
      $scope.cpFilterOpts = {};
      $scope.cpList = cpList;
      $scope.sites = PvManager.getSites();
      Util.filter($scope, 'cpFilterOpts', loadCollectionProtocols);

      $scope.allowReadJobs = AuthorizationService.isAllowed($scope.participantResource.createOpts) ||
        AuthorizationService.isAllowed($scope.participantResource.updateOpts) ||
        AuthorizationService.isAllowed($scope.specimenResource.updateOpts);
    }

    function loadCollectionProtocols(filterOpts) {
      CollectionProtocol.list(filterOpts).then(
        function(cpList) {
          $scope.cpList = cpList;
        }
      );
    };

    $scope.showParticipants = function(cp) {
      $state.go('participant-list', {cpId: cp.id});
    };

    $scope.viewCatalog = function(cp) {
      cp.getCatalogQuery().then(
        function(query) {
          $state.go('query-results', {queryId: query.id, cpId: cp.id});
        }
      );
    }

    init();
  });
