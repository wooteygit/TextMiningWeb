app.controller("kmeans", function($scope, $http, $window, $location, myutils, $rootScope, fileUpload
  , configpath, singletonService, ngDialog, dialogFac
) {
  $rootScope.titel = " การประมวลเบื้องตน (Preprocessing)";
  $scope.sj_id = -1;
  $scope.p_sj_id = 1;
  $scope.seq = 1;

  $scope.$on('$viewContentLoaded', function() {
    $http.get('config/config.json').then(function(data) {
      $rootScope.conpath = data[0].host;
    });
    $scope.comboSubject();
  });

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

  console.log("path service on loadpage : " + singletonService.getText());
  $rootScope.df = [];
  $rootScope.data_combo = [];
  for(var i = 0; i <= 20; i++) {
    if (i == 0) {
      $rootScope.data_combo.push({ 'value': -1, 'name': ' กรุณาเลือก' });
    } else {
      $rootScope.data_combo.push({ 'value': i, 'name': i });
    }
  }

  $scope.optionsSubj = {
    availableOptions: [{
      name: "กรุณาเลือก",
      value: '-1'
    }, ],
    selectedOption: {
      name: "กรุณาเลือก",
      value: '-1'
    }
  };

  $scope.comboSubject = function() {
    var sqlsubject = "SELECT sj_id AS VALUE,CONCAT(sj_code,' : ',sj_name) AS NAME FROM m_subjects WHERE INACTIVE = 0 ORDER BY sj_name ASC";
    console.log($rootScope.conpath + "MysqlCombo?str=" + sqlsubject);
    $scope.returnComboSubj = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlsubject);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnComboSubj.then(function(data, status, headers, config) {
          var data = data.data;
          console.log(data);
          if (data.errCode == 1) {
            for (var i = 0; i < data.map.length; i++) {
              $scope.optionsSubj.availableOptions.push(data.map[i]);
            }
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
          }
        });
      });
    }, 1000);
    // console.log($scope.optionsSubj);
    $scope.hideloading();
  }

  $rootScope.cal_kmeans = function(){
    $scope.showloading();
    var file = $scope.myFile;
    console.log(file);
    if ($("#optionsSubj").val() != -1 && $("#p_sj_id").val() && $("#seq").val() && file) {
        var sqlApprove = "UP_APPROVE_MODEL_SJ("+$("#optionsSubj").val()+","+$("#p_sj_id").val()+","+$("#seq").val()+")";
        $scope.returnApprove = $http.get($rootScope.conpath + "MysqlScriptNonResponse?str=" + sqlApprove);
        setTimeout(function() {
          $rootScope.$apply(function() {
            $scope.returnApprove.then(function(data, status, headers, config) {
              var data = data.data;
              if (data.errCode == 1) {
                $rootScope.getTempTable();
              } else {
                console.log(data.errCode + ' : ' + data.errDesc);
                swal("ผิดพลาด", data.errDesc, "error");
              }
            });
          });
        }, 1000);
    } else {
      var str = "";
      if ($("#optionsSubj").val() == -1) {
        str = "กรุณาเลือกวิชา";
      } else if (!$("#p_sj_id").val()) {
        str = "กรุณาเลือกแบบฝึกหัดที่";
      } else if (!$("#seq").val()) {
        str = "กรุณาเลือกข้อที่";
      }else if (!file) {
        str = "กรุณาเลือกไฟล์";
      }
      swal("ผิดพลาด", str, "error");
      $scope.hideloading();
    }
  }

  $rootScope.getTempTable = function() {
    var file = $scope.myFile;
    console.dir(file);
    setTimeout(function() {
      $rootScope.$apply(function() {
        var uploadUrl = $rootScope.conpath + "upload";
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).then(function(data, status, headers, config) {
          console.log(data);
          if(data.data.errCode == 1) {
            console.log('Upload file success');
            $scope.CalCluster = $http.get($rootScope.conpath + "word?w=" + file.name + "&g=1");
            console.log($rootScope.conpath + "word?w=" + file.name + "&g=" + $('#combo_g').val());
            setTimeout(function() {
              $rootScope.$apply(function() {
                $scope.CalCluster.then(function(data, status, headers, config) {
                  console.log(data);
                  if(data.data.errCode == 1) {
                    $scope.AddTempTable = $http.get($rootScope.conpath + "group/-1");
                    setTimeout(function() {
                      $rootScope.$apply(function() {
                        $scope.AddTempTable.then(function(data, status, headers, config) {
                          console.log(data);
                          if (data.data.errCode == 1) {
                            $rootScope.df = data.data.map;
                            swal("เรียบร้อย!", "", "success");
                            $scope.hideloading();
                          } else {
                            $scope.hideloading();
                            console.log(data.errCode + ' : ' + data.errDesc);
                            swal("ผิดพลาด", data.errDesc, "error");
                            $rootScope.df = [];
                          }
                        });
                      });
                    }, 10000);
                  } else {
                    $scope.hideloading();
                    console.log(data.errCode + ' : ' + data.errDesc);
                    swal("ผิดพลาด", data.errDesc, "error");
                    $rootScope.df = [];
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
  }  
});
