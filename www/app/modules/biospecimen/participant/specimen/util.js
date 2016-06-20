angular.module('os.biospecimen.specimen')
  .factory('SpecimenUtil', function($modal, Specimen, PvManager, Alerts, Util) {

    function collectAliquots(scope) {
      var spec = scope.aliquotSpec;
      var parent = scope.parentSpecimen;
      var extensionDetail = getExtensionDetail(scope);
      if (!extensionDetail) {
        extensionDetail = scope.aliquotSpec.extensionDetail;
      }

      if (!!spec.qtyPerAliquot && !!spec.noOfAliquots) {
        var requiredQty = spec.qtyPerAliquot * spec.noOfAliquots;
        if (requiredQty > parent.availableQty) {
          Alerts.error("specimens.errors.insufficient_qty");
          return;
        }
      } else if (!!spec.qtyPerAliquot) {
        spec.noOfAliquots = Math.floor(parent.availableQty / spec.qtyPerAliquot);
      } else if (!!spec.noOfAliquots) {
        spec.qtyPerAliquot = Math.round(parent.availableQty / spec.noOfAliquots * 10000) / 10000;
      }

      if (scope.aliquotSpec.createdOn.getTime() < scope.parentSpecimen.createdOn) {
        Alerts.error("specimens.errors.created_on_lt_parent");
        return;
      } else if (scope.aliquotSpec.createdOn > new Date()) {
        Alerts.error("specimens.errors.created_on_gt_curr_time");
        return;
      }

      parent.isOpened = parent.hasChildren = true;
      parent.depth = 0;
      parent.closeAfterChildrenCreation = spec.closeParent;

      var aliquot = new Specimen({
        lineage: 'Aliquot',
        specimenClass: parent.specimenClass,
        type: parent.type,
        parentId: parent.id,
        initialQty: spec.qtyPerAliquot,
        storageLocation: {name: '', positionX:'', positionY: ''},
        status: 'Pending',
        children: [],
        cprId: scope.cpr.id,
        visitId: parent.visitId,
        createdOn: spec.createdOn,
        freezeThawCycles: spec.freezeThawCycles,
        incrParentFreezeThaw: spec.incrParentFreezeThaw,

        selected: true,
        parent: parent,
        depth: 1,
        isOpened: true,
        hasChildren: false,
        labelFmt: scope.cpr.aliquotLabelFmt
      });

      var aliquots = [];
      for (var i = 0; i < spec.noOfAliquots; ++i) {
        var clonedAlqt = angular.copy(aliquot);
        clonedAlqt.extensionDetail = extensionDetail;
        aliquots.push(clonedAlqt);
      }

      parent.children = [].concat(aliquots);
      var specimens = aliquots;
      specimens.unshift(parent);
      return specimens;
    }

    function createDerivatives(scope) {
      var extensionDetail = getExtensionDetail(scope);
      if (extensionDetail) {
        scope.derivative.extensionDetail = extensionDetail;
      }

      var closeParent = scope.derivative.closeParent;
      delete scope.derivative.closeParent;

      if (scope.derivative.createdOn.getTime() < scope.parentSpecimen.createdOn) {
        Alerts.error("specimens.errors.created_on_lt_parent");
        return;
      } else if (scope.derivative.createdOn > new Date()) {
        Alerts.error("specimens.errors.created_on_gt_curr_time");
        return;
      }

      var specimensToSave = undefined;
      if (closeParent) {
        specimensToSave = [new Specimen({
          id: scope.parentSpecimen.id,
          lineage: scope.parentSpecimen.lineage,
          visitId: scope.visit.id,
          closeAfterChildrenCreation: true,
          children: [scope.derivative]
        })];
      } else {
        specimensToSave = [scope.derivative];
      }

      return Specimen.save(specimensToSave).then(
        function(result) {
          if (closeParent) {
            scope.parentSpecimen.children.push(result[0].children[0]);
            scope.parentSpecimen.activityStatus = 'Closed';
          } else {
            scope.parentSpecimen.children.push(result[0]);
          }

          if (scope.derivative.incrParentFreezeThaw) {
            scope.parentSpecimen.freezeThawCycles++;
          }

          scope.revertEdit();
        }
      );
    }

    function getNewDerivative(scope) {
      return new Specimen({
        parentId: scope.parentSpecimen.id,
        lineage: 'Derived',
        storageLocation: {},
        status: 'Collected',
        visitId: scope.visit.id,
        cpId: scope.visit.cpId,
        pathology: scope.parentSpecimen.pathology,
        closeParent: false,
        createdOn : new Date(),
        incrParentFreezeThaw: 1,
        freezeThawCycles: scope.parentSpecimen.freezeThawCycles + 1
      });
    }

    function loadSpecimenClasses(scope) {
      if (scope.classesLoaded) {
        return;
      }

      scope.specimenClasses = PvManager.getPvs('specimen-class');
      scope.classesLoaded = true;
    }

    function loadSpecimenTypes(scope, specimenClass, notClear) {
      if (!notClear) {
        scope.derivative.type = '';
      }

      if (!specimenClass) {
        scope.specimenTypes = [];
        return;
      }

      if (!scope.specimenClasses[specimenClass]) {
        scope.specimenClasses[specimenClass] = PvManager.getPvsByParent('specimen-class', specimenClass);
      }

      scope.specimenTypes = scope.specimenClasses[specimenClass];
    }

    function loadPathologyStatuses(scope) {
      if (scope.pathologyLoaded) {
        return;
      }

      scope.pathologyStatuses = PvManager.getPvs('pathology-status');
      scope.pathologyLoaded = true;
    }

    function getExtensionDetail(scope) {
      var formCtrl = scope.deFormCtrl.ctrl;
      if (!formCtrl || !formCtrl.validate()) {
        return;
      }

      return formCtrl.getFormData();
    }

    function copyContainerName(src, array) {
      if (!src.storageLocation || !src.storageLocation.name) {
        return;
      }

      var containerName = src.storageLocation.name;
      angular.forEach(array,
        function(dst) {
          if (src == dst || src.specimenClass != dst.specimenClass || src.type != dst.type) {
            return;
          }

          if (!dst.storageLocation || containerName != dst.storageLocation.name) {
            dst.storageLocation = {name: containerName};
          }
        }
      );
    }

    function getSpecimens(labels) {
      return Specimen.listByLabels(labels).then(
        function(specimens) {
          return resolveSpecimens(labels, specimens);
        }
      );
    }

    function resolveSpecimens(labels, specimens) {
      var specimensMap = {};
      angular.forEach(specimens, function(spmn) {
        if (!specimensMap[spmn.label]) {
          specimensMap[spmn.label] = [spmn];
        } else {
          specimensMap[spmn.label].push(spmn);
        }
      });

      //
      // {label: label, specimens; [s1, s2], selected: s1}
      //
      var labelsInfo = [];
      var dupLabels = [], notFoundLabels = [];

      angular.forEach(labels, function(label) {
        var labelInfo = {label: label};
        var spmns = specimensMap[label];
        if (!spmns) {
          notFoundLabels.push(label);
          return;
        }

        labelInfo.specimens = spmns;
        if (spmns.length > 1) {
          dupLabels.push(labelInfo);
        } else {
          labelInfo.selected = spmns[0];
        }

        labelsInfo.push(labelInfo);
      });

      if (notFoundLabels.length != 0) {
        Alerts.error('specimens.specimen_not_found', {label: notFoundLabels.join(', ')});
        return undefined;
      }

      if (dupLabels.length == 0) {
        return specimens;
      }

      var modalInstance = $modal.open({
        templateUrl: 'modules/biospecimen/participant/specimen/resolve-specimens.html',
        controller: 'ResolveSpecimensCtrl',
        resolve: {
          labels: function() {
            return dupLabels;
          }
        }
      });

      return modalInstance.result.then(
        function(spmns) {
          //
          // Duplicate labels info passed to modal is a sub-view of labelsInfo list;
          // therefore any updates/selection done in modal are visible in labelsInfo
          // list as well
          //
          return labelsInfo.map(
            function(labelInfo) {
              return labelInfo.selected;
            }
          );
        }
      );
    }

    return {
      collectAliquots: collectAliquots,

      createDerivatives: createDerivatives,

      getNewDerivative: getNewDerivative,

      loadSpecimenClasses: loadSpecimenClasses,

      loadSpecimenTypes: loadSpecimenTypes,

      loadPathologyStatuses: loadPathologyStatuses,

      copyContainerName: copyContainerName,

      getSpecimens: getSpecimens
    };
  })
  .controller('ResolveSpecimensCtrl', function($scope, $modalInstance, labels, Alerts) {
    function init() {
      $scope.labels = labels;
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.done = function() {
      var selectedSpmns = $scope.labels.map(
        function(label) {
          return label.selected;
        }
      );

      $modalInstance.close(selectedSpmns);
    }

    init();
  });
