app.controller("ClassificationSVM", function($scope, $http, $window, $location, myutils, $rootScope
  , fileUpload, configpath, $state, $stateParams, SktService, dialogFac, $interval, uiGridGroupingConstants
) {
  $rootScope.titel = 'การให้คะแนนในแต่ละกลุ่ม';
  
  $scope.datafile = [];
  $scope.mf = [];
  $scope.mtd = {};
  $rootScope.conpath = configpath.content;

  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }

  $scope.$on('$viewContentLoaded', function() {
    $http.get('config/config.json').then(function(data) {
        $rootScope.conpath = data[0].host;
    });
  });

  $rootScope.gridOptionsHead = {
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
      displayName: 'รหัส',
      cellClass: 'cell_name',
      headerCellClass: 'header_name',
      width: '15%'
    }, {
      name: 'des',
      displayName: 'คำตอบ',
      cellClass: 'cell_des',
      headerCellClass: 'header_des',
      width: '70%'
    }, {
      name: 'value',
      displayName: 'คะแนน',
      cellClass: 'cell_value',
      headerCellClass: 'header_value',
      width: '15%'
    }]
  };

  $rootScope.trainModel = function() {
    SktService.svm_kernel_type = {
      "c_svc": (($("#c_svc").is(':checked')) ? 1 : 0),
      "one_class_svm": (($("#one_class_svm").is(':checked')) ? 1 : 0),
      "nu_svc": (($("#nu_svc").is(':checked')) ? 1 : 0),
      "epsilon_svr": (($("#epsilon_svr").is(':checked')) ? 1 : 0),
      "nu_svr": (($("#nu_svr").is(':checked')) ? 1 : 0),
      "linear": (($("#linear").is(':checked')) ? 1 : 0),
      "polynomial": (($("#polynomial").is(':checked')) ? 1 : 0),
      "radial_basis": (($("#radial_basis").is(':checked')) ? 1 : 0),
      "sigmoid": (($("#sigmoid").is(':checked')) ? 1 : 0),
      "degree": {
        "start": $("#degree").val(),
        "step": $("#degreeStep").val(),
        "stop": $("#degreeStop").val()
      },
      "coef0": {
        "start": $("#coef0").val(),
        "step": $("#coef0Step").val(),
        "stop": $("#coef0Stop").val()
      },
      "gamma": {
        "start": $("#gamma").val(),
        "step": $("#gammaStep").val(),
        "stop": $("#gammaStop").val()
      },
      "cost": {
        "start": $("#cost").val(),
        "step": $("#costStep").val(),
        "stop": $("#costStop").val()
      },
      "nu": {
        "start": $("#nu").val(),
        "step": $("#nuStep").val(),
        "stop": $("#nuStop").val()
      },
      "epsilon": {
        "start": $("#epsilon").val(),
        "step": $("#epsilonStep").val(),
        "stop": $("#epsilonStop").val()
      },
      "p": {
        "start": $("#p").val(),
        "step": $("#pStep").val(),
        "stop": $("#pStop").val()
      },
      "cachsize": $("#cachsize").val(),
      "scoreFile": ""
    };
    console.log(SktService.svm_kernel_type);
    swal("เรียบร้อย!", "ฝึกฝนระบบเรียบร้อย", "then");
    //$state.go('TestSVM');
  };

  $rootScope.testModel = function() {
    console.log('trainModel');
    console.log(SktService.svm_kernel_type);
    var file = $scope.scoreFile;
    if(file){
      console.dir(file);
      console.log(file.name);
      $scope.showloading();
      setTimeout(function() {
        $rootScope.$apply(function() {
          var uploadUrl = $rootScope.conpath + "upload";
          var fd = new FormData();
          fd.append('file', file);
          $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
          }).then(function(data, status, headers, config) {
            var data = data.data;
            console.log(data);
            if (data.errCode == 1) {
              var urls = $rootScope.conpath + "train_test";
              SktService.svm_kernel_type.scoreFile = file.name;
              var parameter = JSON.stringify(SktService.svm_kernel_type);
              console.log(angular.toJson(parameter));
              $scope.returnDataTest = $http.post(urls, parameter, { headers: { 'Content-Type': 'application/json' } });
              setTimeout(function() {
                $rootScope.$apply(function() {
                  $scope.returnDataTest.then(function(data, status, headers, config) {
                    var data = data.data;
                    console.log(data);
                    if (data.errCode == 1) {
                      console.log(data);
                      $scope.mf = data.mf;
                      $scope.mtd = data.mtd;
                      for (var i = 0; i < data.mf.length; i++) {
                        var mftemp = data.mf[i];
                        for (var j = 0; j < mftemp.length; j++) {
                          $rootScope.gridOptionsHead.data.push(mftemp[j]);
                        }
                      }
                      swal("เรียบร้อย!", "Train & Test Model เสร็จสิ้น", "เรียบร้อย");
                      $scope.hideloading();
                    } else {
                      console.log(data.errCode + ' : ' + data.errDesc);
                      $scope.hideloading();
                      swal("ผิดพลาด", data.errDesc, "error");
                    }
                  });
                });
              }, 1000);
              $scope.hideloading();
            } else {
              console.log(data.errCode + ' : ' + data.errDesc);
              swal("ผิดพลาด", data.errDesc, "error");
              $scope.hideloading();
            }
          });
        });
      }, 1000);
    } else {
      dialogFac('กรุณาเลือกไฟล์เฉลย');
      $scope.hideloading();
    }
  };
});
