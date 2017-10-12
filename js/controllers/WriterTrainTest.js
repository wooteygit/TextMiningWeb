app.controller("WriterTrainTest", function($scope, $http, $window, $location, myutils, $rootScope
, fileUpload, configpath, $state, $stateParams, SktService, dialogFac, $interval
, uiGridGroupingConstants, dialogYN, Datatable, CallWebAPI, MysqlScriptNonResponse
) {
	$rootScope.titel = "Create Train file & Test file";
	$scope.combo_k2 = [];
	$rootScope.conpath = configpath.content;
	
  $scope.$on('$viewContentLoaded', function() {
    $http.get('config/config.json').then(function(data) {
        $rootScope.conpath = data[0].host;
    });
    $rootScope.comboK();
  });
  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }
  $scope.comboTrainTest = [{
    ID: 1,
    VALUE: '10:90'
  }, {
    ID: 2,
    VALUE: '20:80'
  }, {
    ID: 3,
    VALUE: '30:70'
  }, {
    ID: 4,
    VALUE: '40:60'
  }, {
    ID: 5,
    VALUE: '50:50'
  }, {
    ID: 6,
    VALUE: '60:40'
  }, {
    ID: 7,
    VALUE: '70:30'
  }, {
    ID: 8,
    VALUE: '80:20'
  }, {
    ID: 9,
    VALUE: '90:10'
  }];

  $rootScope.comboK = function() {
    var sqlscriptcombo = 'SELECT group_k AS VALUE,group_k AS NAME FROM tfidfnormalized WHERE group_k IS NOT NULL GROUP BY group_k ORDER BY group_k ASC';
    $scope.returnComboGroup = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlscriptcombo);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnComboGroup.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            $scope.combo_k2 = data.map;
            console.log($scope.combo_k2);
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
            $scope.combo_k2 = [];
          }
        });
      });
    }, 1000);
  }

  $rootScope.getDataFile = function() {
    $scope.datafile = [];
    $scope.showloading();
    var strwriterclassify = "?pertext=" + $('#comboTrainTest').val();
    $scope.returnWriterclassify = $http.get($rootScope.conpath + "writerPretextOnly" + strwriterclassify);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnWriterclassify.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            var sqldatafile = '-1';
            $scope.returnDataFile = $http.get($rootScope.conpath + "datafile?sql=" + sqldatafile);
            setTimeout(function() {
              $rootScope.$apply(function() {
                $scope.returnDataFile.then(function(data, status, headers, config) {
                  var data = data.data;
                  if (data.errCode == 1) {
                    $scope.datafile = data.map;
                    console.log($scope.datafile);
                    $scope.hideloading();
                  } else {
                    console.log(data.errCode + ' : ' + data.errDesc);
                    swal("ผิดพลาด", data.errDesc, "error");
                    $scope.datafile = [];
                    $scope.hideloading();
                  }
                });
              });
            }, 1000);
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
            $scope.hideloading();
          }
        });
      });
    }, 1000);
  };
});