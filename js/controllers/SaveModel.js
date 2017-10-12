app.controller("saveModel", function($scope, $http, $window, $location, myutils, $rootScope, fileUpload, configpath
  , $state, $stateParams, SktService, dialogFac, $interval, uiGridGroupingConstants, dialogYN
) {
  $rootScope.titel = "บันทึก Model";
  $rootScope.conpath = configpath.content;

  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }

  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }

  $scope.totalCluster = 0;
  $scope.sj_name = "";
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

  $scope.gridOptionsHead = {
    data: [],
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    enableRowSelection: true,
    enableFullRowSelection: true,
    multiSelect: false,
    modifierKeysToMultiSelect: false,
    noUnselect: true,
    enableRowHeaderSelection: false,
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row) {
        $scope.countRows = $scope.gridApi.selection.getSelectedRows();
        console.log($scope.countRows);
        $scope.selectData($scope.countRows);
      });
    },
    columnDefs: [{
      name: 'name',
      displayName: 'Model',
      cellClass: 'cell_name',
      headerCellClass: 'header_name',
      width: '70%'
    }, {
      name: 'value',
      displayName: 'Cluster',
      cellClass: 'cell_des',
      headerCellClass: 'header_value',
      width: '30%'
    }]
  };

  $scope.$on('$viewContentLoaded', function() {
    $http.get('config/config.json').then(function(data) {
      $rootScope.conpath = data[0].host;
    });
    $scope.comboSubject();
    $scope.setTotalCluster();
    $scope.gridBestModel();
    $scope.setSubject();
  });

  $scope.setTotalCluster = function() {
    var sqlTotalCluster = "SELECT IFNULL(param_val,0) AS VALUE,IFNULL(param_name,'NON GROUP') AS NAME FROM center_param WHERE ID = 9";
    $scope.returnTotalCluster = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlTotalCluster);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnTotalCluster.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            for (var i = 0; i < data.map.length; i++) {
              $scope.totalCluster = data.map[i].value;
            }
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
          }
        });
      });
    }, 1000);
  }

  $scope.setSubject = function() {
    var sql = "SELECT sj.sj_code AS value,sj_name AS name"
      +" FROM m_model_subject msj "
      +" LEFT JOIN m_subjects sj ON msj.sj_id = sj.sj_id "
      +" WHERE msj.edit_date = (SELECT MAX(edit_date) FROM m_model_subject) ";
    $scope.rs = $http.get($rootScope.conpath + "MysqlCombo?str=" + sql);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.rs.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            for (var i = 0; i < data.map.length; i++) {
              $scope.sj_name = data.map[i].name;
            }
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
          }
        });
      });
    }, 1000);
  }

  $scope.comboSubject = function() {
    var sqlsubject = "SELECT sj_id AS VALUE,CONCAT(sj_code,' : ',sj_name) AS NAME FROM m_subjects ORDER BY sj_name ASC";
    $scope.returnComboSubj = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlsubject);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnComboSubj.then(function(data, status, headers, config) {
          var data = data.data;
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
    console.log($scope.optionsSubj);
    $scope.hideloading();
  }

  $scope.gridBestModel = function() {
    var sqlBestModel = "SELECT k AS VALUE,bm_des AS NAME FROM model_temp WHERE edit_date = (SELECT MAX(edit_date) FROM  model_temp) LIMIT 1";
    $scope.returnBestModel = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlBestModel);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnBestModel.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            for (var i = 0; i < data.map.length; i++) {
              $scope.gridOptionsHead.data.push(data.map[i]);
            }
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
          }
        });
      });
    }, 1000);
    $scope.hideloading();
  }

  $scope.saveModel = function() {
    swal({
      title: "ยืนยันการบันทึก?",
      text: "ท่านต้องการบันทึก Model ของวิชา " + $scope.sj_name ,
      type: "warning",
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonText: "ใช่, ฉันยอมรับ",
      confirmButtonColor: "#ec6c62"
    }, function() {
      $scope.showloading();
      var sqlApprove = "UP_APPROVE_MODEL()";
      $scope.returnApprove = $http.get($rootScope.conpath + "MysqlScriptNonResponse?str=" + sqlApprove);
      setTimeout(function() {
        $rootScope.$apply(function() {
          $scope.returnApprove.then(function(data, status, headers, config) {
            var data = data.data;
            if (data.errCode == 1) {
              swal("เรียบร้อย!", "บันทึกข้อมูลเรียบร้อย", "success");
            } else {
              console.log(data.errCode + ' : ' + data.errDesc);
              swal("ผิดพลาด", data.errDesc, "error");
            }
            $scope.hideloading();
          });
        });
      }, 1000);
    });
  }
});