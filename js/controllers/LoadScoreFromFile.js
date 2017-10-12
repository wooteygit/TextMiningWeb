app.controller("LoadScoreFromFile", function($scope, $http, $window, $location, myutils, $rootScope, fileUpload
  , configpath, $state, $stateParams, SktService, dialogFac, $interval, uiGridGroupingConstants, dialogYN
  ,Datatable
) {
  $rootScope.titel = "กำหนดคะแนนจากไฟล์เฉลย";
  $rootScope.conpath = configpath.content;
  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }

  $scope.gridOptions = {
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
      name: 'sj_code',
      displayName: 'รหัสนักศึกษา',
      cellClass: 'cell_sj_code',
      headerCellClass: 'header_sj_code',
      width: '15%'
    }, {
      name: 'sd_ans',
      displayName: 'คำตอบ',
      cellClass: 'cell_sd_ans',
      headerCellClass: 'header_sd_ans',
      width: '60%'
    }, {
      name: 'sd_score',
      displayName: 'คะแนน',
      cellClass: 'cell_sd_score',
      headerCellClass: 'header_sd_score',
      width: '25%'
    }]
  };
  $rootScope.saveScore = function(){
    var file = $scope.myFile;
    console.dir(file);
    setTimeout(function() {
      $scope.showloading();
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
            $scope.CalCluster = $http.get($rootScope.conpath + "loadScoreFromFile?fileName=" + file.name);
            setTimeout(function() {
              $rootScope.$apply(function() {
                $scope.CalCluster.then(function(data, status, headers, config) {
                  console.log(data);
                  if(data.data.errCode == 1) {
                    swal("เรียบร้อย!", "ให้คะแนนเรียบร้อย", "success");
                    $scope.hideloading();
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