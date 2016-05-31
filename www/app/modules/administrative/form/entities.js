angular.module('os.administrative.form.entities', [])
  .factory('FormEntityReg', function($translate) {
    var entities = [];
    var inited = false;

    function getEntities() {
      return $translate('common.none').then(
        function() {
          if (inited) {
            return entities;
          }

          entities = entities.map(
            function(entity) {
              entity.caption = $translate.instant(entity.key);
              return entity;
            }
          );

          inited = true;
          return entities;
        }
      );
    }

    function addEntity(entity) {
      var existing = undefined;
      for (var i = 0; i < entities.length; ++i) {
        if (entities[i].name == entity.name) {
          existing = entities[i];
          break;
        }
      }

      if (!existing) {
        entities.push(entity);
      }
    }

    function init() {
      addEntity({name: 'Participant', key: 'entities.participant', caption: ''});
      addEntity({name: 'SpecimenCollectionGroup', key: 'entities.visit', caption: ''});
      addEntity({name: 'Specimen', key: 'entities.specimen', caption: ''});
      addEntity({name: 'SpecimenEvent', key: 'entities.specimen_event', caption: '', allCps: true});
      addEntity({name: 'ParticipantExtension', key: 'entities.participant_extension', caption: '', allCps: true});
      addEntity({name: 'VisitExtension', key: 'entities.visit_extension', caption: '', allCps: true});
      addEntity({name: 'SpecimenExtension', key: 'entities.specimen_extension', caption: '', allCps: true});
    }

    init();

    return {
      getEntities: getEntities,

      addEntity: addEntity
    }
  });
