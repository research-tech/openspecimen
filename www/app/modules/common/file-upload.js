
angular.module('openspecimen')
  .directive('osFileUpload', function($timeout, $q, $http, Alerts) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        ctrl: '='
      },      
      controller: function() {
        this.data = null;
        this.q = null;

        this.submit = function() {
          this.q = $q.defer();
          if (this.data) {
            this.data.submit();
          } else {
            Alerts.error('common.no_file_selected');
            this.q.reject();
          }

          return this.q.promise;
        };

        this.done = function(resp) {
          this.q.resolve(resp.result);
        };

        this.fail = function(resp) {
          var xhr = resp.xhr('responseText');
          var status = Math.floor(xhr.status / 100);
          if (status == 4) {
            var responses = eval(xhr.response);
            var errMsgs = [];
            angular.forEach(responses, function(err) {
              errMsgs.push(err.message + "(" + err.code + ")");
            });
            Alerts.errorText(errMsgs);
          } else if (status == 5) {
            Alerts.error("common.server_error");
          }

          this.q.reject(resp);
        }
      },
      link: function(scope, element, attrs, ctrl) {
        $timeout(function() {
          scope.ctrl = ctrl;

          element.find('input').fileupload({
            dataType: 'json',
            beforeSend: function(xhr) {
              xhr.setRequestHeader('X-OS-API-TOKEN', $http.defaults.headers.common['X-OS-API-TOKEN']);
            },
            add: function (e, data) {
              element.find('span.name').text(data.files[0].name);
              ctrl.data = data;
            },
            done: function(e, data) {
              ctrl.done(data);
            },
            fail: function(e, data) {
              ctrl.fail(data);
            }
          });
          
          element.find('.input-group-btn > input').click(function() {
            element.find('.fileUpload').click();
          })
        });
      },
      template: 
        '<div class="input-group os-file-upload">' + 
          '<input class="fileUpload" name="file" type="file"/>' +
          '<input type="text" class="form-control"/>' +
          '<span class="input-group-btn">' + 
            '<input type="button" class="btn btn-primary" value="Browse"/>' +
          '</span>' +
          '<span class="name os-ellipsis" translate="common.no_file_selected">' +
            'No File Selected' +
          '</span>' +
        '</div>'
    };
  });
