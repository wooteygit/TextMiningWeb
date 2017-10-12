app.controller("setSubject", function($scope, $http, $window, $location, myutils, $rootScope
, fileUpload, configpath, $state, $stateParams, SktService, dialogFac, $interval
, uiGridGroupingConstants, dialogYN, Datatable, CallWebAPI, MysqlScriptNonResponse
) {
  $rootScope.titel = "จัดการวิชาเรียน";
  $rootScope.dt = [];
  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }
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
      name: 'sj_id',
      displayName: 'sj_id',
      cellClass: 'cell_sj_id',
      headerCellClass: 'header_sj_id',
      visible: false
    }, {
      name: 'sj_code',
      displayName: 'รหัสวิชา',
      cellClass: 'cell_sj_code',
      headerCellClass: 'header_sj_code'
    }, {
      name: 'sj_name',
      displayName: 'ชื่อวิชา',
      cellClass: 'cell_sj_name',
      headerCellClass: 'header_sj_name'
    }, {
      name: 'inactive',
      displayName: 'ใช้งาน',
      cellClass: 'cell_inactive',
      headerCellClass: 'header_inactive',
      visible:false
    }, {
      name: 'inac',
      displayName: 'ไม่ใช้งาน',
      cellClass: 'cell_inactive',
      headerCellClass: 'header_inactive'
    } ],
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25
  };

  $rootScope.conpath = configpath.content;
  $scope.$on('$viewContentLoaded', function() {
    $http.get('config/config.json').then(function(data) {
      $rootScope.conpath = data[0].host;
    });
    $rootScope.loadSubject();
  });

  $rootScope.clearData = function() {
    $scope.sj_id = '';
    $scope.sj_code = '';
    $scope.sj_name = '';
    $scope.inactive = false;
    $rootScope.loadSubject();
  }

  $rootScope.loadSubject = function() {
    var sql = 'SELECT m_subjects.* '
    +' ,CASE WHEN m_subjects.inactive = 0 '
    +' THEN "ใช้งาน" ' 
    +' ELSE "ไม่ใช้งาน" END AS inac '
    +' FROM m_subjects ORDER BY m_subjects.sj_code ASC';
    $rootScope.gridOptionsHead.data = Datatable(sql);
  }

  $rootScope.selectData = function(row) {
    $scope.sj_id = row[0].sj_id;
    $scope.sj_code = row[0].sj_code;
    $scope.sj_name = row[0].sj_name;
    $scope.inactive = (row[0].inactive == 1 ? true : false);
  }
  
  $rootScope.addData = function() {
    swal({
      title: "ยืนยัน?",
      text: (($('#sj_id').val()) ? "ท่านต้องการแก้ไขข้อมูลใช่หรือไม่" : "ท่านต้องการเพิ่มข้อมูลใช่หรือไม่"),
      type: "warning",
      showCancelButton: true
    }, function() {
      if ($('#sj_id').val()) {
        var sql = "sql=UPDATE m_subjects SET " + " sj_code='" + $('#sj_code').val() + "',sj_name='" + $('#sj_name').val() + "',inactive=" + (($("#inactive").is(':checked')) ? 1 : 0) + " WHERE sj_id=" + $('#sj_id').val();
        $rootScope.dt = CallWebAPI("excsql", sql)
        console.log($rootScope.dt);
        myutils.showWait();
        $rootScope.loadSubject();
        myutils.hideWait();
      } else {
        $rootScope.dt = MysqlScriptNonResponse("UP_M_SUBJECTS('" + $('#sj_code').val() + "','" + $('#sj_name').val() + "'," + (($("#inactive").is(':checked')) ? 1 : 0) + ")")
        console.log($rootScope.dt);
        myutils.showWait();
        $rootScope.loadSubject();
        myutils.hideWait();
      }
    });
  };
});
