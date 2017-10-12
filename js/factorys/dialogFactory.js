app.factory('dialogFac', function(ngDialog) {
  return function(msg) {
    ngDialog.openConfirm({
      template: '\
        <p>' + msg + '</p>\
        <div class="ngdialog-buttons">\
            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
        </div>',
      plain: true
    });
  }
}).factory('dialogYN', function(ngDialog) {
  return function(msg) {
    return ngDialog.openConfirm({
      template: '\
        <p>' + msg + '</p>\
        <div class="ngdialog-buttons">\
            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(0)">No</button>\
        </div>',
      plain: true,
      className: 'ngdialog-theme-default'
    });
  }
});
