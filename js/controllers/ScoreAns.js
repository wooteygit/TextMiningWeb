app.controller("scoreans", function($scope, $http, $window, $location, myutils, $rootScope, fileUpload, configpath
  , $state, ngDialog, dialogFac
) {

  $rootScope.titel = 'การให้คะแนนในแต่ละกลุ่ม';
  $rootScope.conpath = configpath.content;
  
  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }

  $http.get('config/config.json').then(function(data) {
    $rootScope.conpath = data[0].host;
  });
  console.log("path service on loadpage:  " + $rootScope.conpath);
  $scope.combo_k = [];
  var sqlscriptcombo = 'SELECT group_k AS VALUE,group_k AS NAME FROM tfidfnormalized WHERE group_k IS NOT NULL AND SCORE IS NULL GROUP BY group_k ORDER BY group_k ASC';
  $scope.returnComboGroup = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlscriptcombo);
  $scope.showloading();
  setTimeout(function() {
    $rootScope.$apply(function() {
      $scope.returnComboGroup.then(function(data, status, headers, config) {
        var data = data.data;
        if (data.errCode == 1) {
          $scope.combo_k = data.map;
          console.log($scope.combo_k);
          $scope.hideloading();
        } else {
          console.log(data.errCode + ' : ' + data.errDesc);
          $scope.combo_k = [];
          $scope.hideloading();
        }
      });
    });
  }, 1000);
  $scope.hideloading();
  $rootScope.dt_words = [];

  $rootScope.filter_group = function() {
    if ($('#combo_k').val()) {
      $scope.showloading();
      var sqlwords = 'SELECT group_k AS VALUE,group_k AS NAME FROM tfidfnormalized WHERE group_k IS NOT NULL AND SCORE IS NULL GROUP BY group_k ORDER BY group_k ASC';
      $scope.returnSqlwords = $http.get($rootScope.conpath + "wordsDetail?group=" + $('#combo_k').val());
      setTimeout(function() {
        $rootScope.$apply(function() {
          $scope.returnSqlwords.then(function(data, status, headers, config) {
            var data = data.data;
            console.log(data);
            if (data.errCode == 1) {
              $rootScope.dt_words = data.map;
              console.log($rootScope.dt_words);
              $scope.hideloading();
            } else {
              console.log(data.errCode + ' : ' + data.errDesc);
              swal("ผิดพลาด", data.errDesc, "error");
              $rootScope.dt_words = [];
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
  };

  $rootScope.save_ans = function() {
    if ($('#combo_k').val() && $rootScope.dt_words.length > 0) {
      $scope.showloading();
      $scope.returnAns = $http.get($rootScope.conpath + "answer?group=" + $('#combo_k').val() + "&ans=" + $('#txtScore').val());
      setTimeout(function() {
        $rootScope.$apply(function() {
          $scope.returnAns.then(function(data, status, headers, config) {
            var data = data.data;
            if (data.errCode == 1) {
              $rootScope.dt_words = [];
              var sqlscriptcombo = 'SELECT group_k AS VALUE,group_k AS NAME FROM tfidfnormalized WHERE group_k IS NOT NULL AND SCORE IS NULL GROUP BY group_k ORDER BY group_k ASC';
              $scope.returnComboGroup = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlscriptcombo);
              setTimeout(function() {
                $rootScope.$apply(function() {
                  $scope.returnComboGroup.then(function(data, status, headers, config) {
                    var data = data.data;
                    if (data.errCode == 1) {
                      console.log(data);
                      $rootScope.combo_k = data.map;
                      console.log($scope.combo_k);
                      var sqlscriptcombo = 'SELECT group_k AS VALUE,group_k AS NAME FROM tfidfnormalized WHERE group_k IS NOT NULL AND SCORE IS NULL GROUP BY group_k ORDER BY group_k ASC';
                      $scope.returnComboGroup = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlscriptcombo);
                      setTimeout(function() {
                        $rootScope.$apply(function() {
                          $scope.returnComboGroup.then(function(data, status, headers, config) {
                            var data = data.data;
                            if (data.errCode == 1) {
                              $scope.combo_k = data.map;
                              console.log($scope.combo_k);
                              dialogFac('<p>เรียบร้อย</p>');
                            } else {
                              console.log(data.errCode + ' : ' + data.errDesc);
                              swal("ผิดพลาด", data.errDesc, "error");
                              $scope.combo_k = [];
                              $scope.hideloading();
                            }
                          });
                        });
                      }, 1000);
                      $scope.hideloading();
                    } else {
                      console.log(data.errCode + ' : ' + data.errDesc);
                      swal("ผิดพลาด", data.errDesc, "error");
                      $scope.combo_k = [];
                      $scope.hideloading();
                    }
                  });
                });
              }, 1000);
            } else {
              console.log(data.errCode + ' : ' + data.errDesc);
              swal("ผิดพลาด", data.errDesc, "error");
              $rootScope.dt_words = [];
              $scope.hideloading();
            }
          });
        });
      }, 1000);
    } else {
      dialogFac('<p>ไม่พบค่า k หรือ ยังไม่มีรายการ</p>');
      $scope.hideloading();
    }
  };
});
