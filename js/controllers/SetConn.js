app.controller("SetConn", function($scope, $http, $window, dialogFac
, myutils, $rootScope, fileUpload, configpath
) {
  $rootScope.titel = "การตั้งค่าการเชื่อมต่อ";
  $rootScope.conpath = configpath.content;
  $http.get('config/config.json').then(function(data) {
    $rootScope.conpath = data[0].host;
  });
  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }
  $scope.conn = {};
  $scope.returnConn = $http.get($rootScope.conpath + "config");
  setTimeout(function() {
    $rootScope.$apply(function() {
      $scope.returnConn.then(function(data, status, headers, config) {
        $scope.conn = data;
      });
    });
  }, 1000);

  $rootScope.saveConn = function() { 
    dialogFac('อยู่ระหว่างพัฒนา');
  };
});
