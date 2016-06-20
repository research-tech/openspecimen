
angular.module('os.administrative.order.addedit', ['os.administrative.models', 'os.biospecimen.models'])
  .controller('OrderAddEditCtrl', function(
    $scope, $state, $translate, order, spmnRequest, Institute,
    Specimen, SpecimensHolder, Site, DistributionProtocol, DistributionOrder, Alerts, Util, SpecimenUtil) {
    
    function init() {
      $scope.order = order;

      order.request = spmnRequest;
      if (!!spmnRequest) {
        order.requester = spmnRequest.requestor;
        order.instituteName = spmnRequest.requestorInstitute;
      }

      $scope.dpList = [];
      $scope.instituteNames = [];
      $scope.siteList = [];
      $scope.userFilterOpts = {};

      $scope.input = {allItemStatus: false};

      if (!spmnRequest) {
        loadDps();
        loadInstitutes();
      }

      setUserAndSiteList(order);

      if (!!spmnRequest) {
        order.orderItems = getOrderItemsFromReq(spmnRequest.items, order.orderItems);
      } else if (!order.id && angular.isArray(SpecimensHolder.getSpecimens())) {
        order.orderItems = getOrderItems(SpecimensHolder.getSpecimens());
        SpecimensHolder.setSpecimens(null);
      }
      
      if (!order.executionDate) {
        order.executionDate = new Date();
      }
      
      setHeaderStatus();
    }

    function loadDps(name) {
      var filterOpts = {activityStatus: 'Active', query: name};
      if (!!spmnRequest) {
        filterOpts.receivingInstitute = spmnRequest.requestorInstitute;
      }

      DistributionProtocol.query(filterOpts).then(
        function(dps) {
          $scope.dpList = dps;
        }
      );
    }
    
    function loadInstitutes () {
      Institute.query().then(
        function (institutes) {
          $scope.instituteNames = Institute.getNames(institutes);
        }
      );
    }

    function loadSites(instituteName) {
      Site.listForInstitute(instituteName, true).then(
        function(sites) {
          $scope.siteList = sites;
        }
      );    
    }
    
    function setUserFilterOpts(institute) {
      $scope.userFilterOpts = {institute: institute};
    }

    function setUserAndSiteList(order) {
      var instituteName = order.instituteName;
      setUserFilterOpts(instituteName);
      loadSites(instituteName);
    }

    function getOrderItems(specimens) {
      return specimens.map(
        function(specimen) {
          return {
            specimen: specimen,
            quantity: specimen.availableQty,
            status: 'DISTRIBUTED_AND_CLOSED'
          }
        }
      );
    }

    function getOrderItemsFromReq(reqItems, orderItems) {
      var orderItemsMap = {};
      angular.forEach(orderItems,
        function(orderItem) {
          orderItemsMap[orderItem.specimen.id] = orderItem;
        }
      );

      var items = [];
      angular.forEach(reqItems,
        function(reqItem) {
          var orderItem = orderItemsMap[reqItem.specimen.id];
          if (orderItem) {
            orderItem.specimen.selected = true;
          } else if (reqItem.status == 'PENDING') {
            orderItem = {
              specimen: reqItem.specimen,
              quantity: reqItem.specimen.availableQty,
              status: reqItem.selected ? 'DISTRIBUTED_AND_CLOSED' : 'DISTRIBUTED',
            }

            reqItem.specimen.selected = reqItem.selected;
          }

          if (orderItem) {
            items.push(orderItem);
          }
        }
      );

      return items;
    }

    function saveOrUpdate(order) {
      order.siteId = undefined;

      var orderClone = angular.copy(order);
      if (!!spmnRequest) {
        var items = [];
        angular.forEach(orderClone.orderItems,
          function(item) {
            if (!item.specimen.selected) {
              return;
            }

            delete item.specimen.selected;
            items.push(item);
          }
        );
        orderClone.orderItems = items;
      }

      orderClone.$saveOrUpdate().then(
        function(savedOrder) {
          $state.go('order-detail.overview', {orderId: savedOrder.id});
        }
      );
    };
    
    function setHeaderStatus() {
      var isOpenPresent = false;
      angular.forEach($scope.order.orderItems,
        function(item) {
          if (item.status == 'DISTRIBUTED') {
            isOpenPresent = true;
          }
        }
      );

      if (isOpenPresent) {
        $scope.input.allItemStatus = false;
      } else {
        $scope.input.allItemStatus = true;
      }
    }

    $scope.onDpSelect = function() {
      if (!!spmnRequest) {
        return;
      }

      $scope.order.instituteName = $scope.order.distributionProtocol.instituteName;
      $scope.order.siteName = $scope.order.distributionProtocol.defReceivingSiteName;
      $scope.order.requester = $scope.order.distributionProtocol.principalInvestigator;
      setUserAndSiteList($scope.order);
    }
    
    $scope.onInstSelect = function () {
      var instName = $scope.order.instituteName;
      loadSites(instName);
      setUserFilterOpts(instName);
      $scope.order.siteName = '';
      $scope.order.requester = '';
    }

    $scope.addSpecimens = function(labels) {
      return SpecimenUtil.getSpecimens(labels).then(
        function (specimens) {
          if (!specimens) {
            return false;
          }

          Util.mergeArray($scope.order.orderItems, getOrderItems(specimens), 'specimen.id');
          return true;
        }
      );
    }

    $scope.removeOrderItem = function(orderItem) {
      var idx = order.orderItems.indexOf(orderItem);
      if (idx != -1) {
        order.orderItems.splice(idx, 1);
      }
    }

    $scope.distribute = function() {
      $scope.order.status = 'EXECUTED';
      saveOrUpdate($scope.order);
    }

    $scope.saveDraft = function() {
      $scope.order.status = 'PENDING';
      saveOrUpdate($scope.order);
    }

    $scope.passThrough = function() {
      return true;
    }
    
    $scope.setStatus = function(item) {
      var selected = !spmnRequest ? true : item.specimen.selected;

      if (item.quantity == item.specimen.availableQty && selected) {
        item.status = 'DISTRIBUTED_AND_CLOSED';
      } else {
        item.status = 'DISTRIBUTED';
      }
      
      setHeaderStatus();
    }
    
    $scope.setHeaderStatus = setHeaderStatus;

    $scope.toggleAllItemStatus = function() {
      var allStatus;
      if ($scope.input.allItemStatus) {
        allStatus = 'DISTRIBUTED_AND_CLOSED';
      } else {
        allStatus = 'DISTRIBUTED';
      }
      
      angular.forEach($scope.order.orderItems,
        function(item) {
          if (item.quantity != item.specimen.availableQty) {
            item.status = allStatus;
          }
        }
      );
    }
    
    $scope.searchDp = loadDps;

    $scope.toggleAllSpecimensSelect = function() {
      angular.forEach($scope.order.orderItems,
        function(item) {
          item.specimen.selected = $scope.input.allSelected;
        }
      );
    }

    $scope.toggleSpecimenSelect = function(item) {
      if (!item.specimen.selected) {
        $scope.input.allSelected = false;
      } else {
        var allNotSelected = $scope.order.orderItems.some(
          function(item) {
            return !item.specimen.selected;
          }
        );

        $scope.input.allSelected = !allNotSelected;
      }

      $scope.setStatus(item);
    }
    
    init();
  });
