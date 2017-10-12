app.controller("LoadModel", function($scope, $http, $window, $location, myutils, $rootScope, fileUpload
  , configpath, $state, $stateParams, SktService, dialogFac, $interval, uiGridGroupingConstants, dialogYN
  ,CallWebAPI,Datatable
) {
  $rootScope.titel = "Load Model & Scoring";
  $rootScope.conpath = configpath.content;
  $scope.correct = 0.0;
  $scope.wrong = 0.0;

  $scope.showloading = function(){
    wrapper();
    myutils.showWait();
  }
  $scope.hideloading = function(){
    wrapper();
    myutils.hideWait();
  }
  $scope.cbSJ_ID = {
    availableOptions: [
      { name: "กรุณาเลือก", value: '-1' },
    ],
    selectedOption: { name: "กรุณาเลือก", value: '-1' }
  };

  $scope.cbP_SJ_ID = {
    availableOptions: [
      { name: "กรุณาเลือก", value: '-1' },
    ],
    selectedOption: { name: "กรุณาเลือก", value: '-1' }
  };

  $scope.cbSEQ = {
    availableOptions: [
      { name: "กรุณาเลือก", value: '-1' },
    ],
    selectedOption: { name: "กรุณาเลือก", value: '-1' }
  };

  $scope.cbNUM_K = {
    availableOptions: [
      { name: "กรุณาเลือก", value: '-1' },
    ],
    selectedOption: { name: "กรุณาเลือก", value: '-1' }
  };

  $scope.cbPerc = {
    availableOptions: [
      { name: "10", value: '10' },
    ],
    selectedOption: { name: "10", value: '10' }
  };

  for(var i = 20;i<=100;i=i+10){
    $scope.cbPerc.availableOptions.push({name: ""+i, value: ""+i });
  }

  $scope.gridOptionsHead = {
    data: [],
    enableFiltering: true,
    treeRowHeaderAlwaysVisible: false,
    modifierKeysToMultiSelect: false,
    noUnselect: true,
    enableRowHeaderSelection: false,
    showGridFooter: true,
    //showColumnFooter: true,
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
        console.log( 'edited row id:' + rowEntity.sd_id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue );
        console.log("edit cell");
        var reSC = $scope.editGrid(newValue,rowEntity.sd_id);
        if(reSC == true){
          console.log('error')
          rowEntity.new_num_score = oldValue;
          
        }else{
          rowEntity.num_score = newValue;
          rowEntity.new_num_score = '';
        }
        $scope.$apply();
      });
    },
    enableCellSelection: true ,
    enableCellEditOnFocus: true ,
    columnDefs: [{
      name: 'sd_id',
      displayName: 'รหัส',
      cellClass: 'cell_sd_id',
      headerCellClass: 'header_sd_id',
      width: '20%',
      enableCellEdit: false
    }, {
      name: 'ans',
      displayName: 'คำตอบ',
      cellClass: 'cell_ans',
      headerCellClass: 'header_ans',
      width: '50%',
      enableCellEdit: false
    }, {
      name: 'num_score',
      displayName: 'คะแนน',
      cellClass: 'cell_num_score',
      headerCellClass: 'header_num_score',
      width: '10%',
      enableCellEdit: false
    }, {
      name: 'new_num_score',
      displayName: 'แก้คะแนน',
      cellClass: 'cell_new_num_score',
      headerCellClass: 'header_new_num_score',
      width: '20%', enableCellEdit: false
    }] 
  };

  $rootScope.scoreFile = "score.csv";
  $http.get('config/config.json').then(function(data) {
      $rootScope.conpath = data[0].host;
  });

  var sqlsubject = "SELECT sj_id AS VALUE,CONCAT(sj_code,' : ',sj_name) AS NAME FROM m_subjects WHERE INACTIVE = 0 ORDER BY sj_name ASC";
  $scope.returnComboSubj = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlsubject);
  setTimeout(function() {
    $rootScope.$apply(function() {
      $scope.returnComboSubj.then(function(data, status, headers, config) {
        var data = data.data;
        if (data.errCode == 1) {
          for (var i = 0; i < data.map.length; i++) {
            $scope.cbSJ_ID.availableOptions.push(data.map[i]);
          }
        } else {
          console.log(data.errCode + ' : ' + data.errDesc);
          swal("ผิดพลาด", data.errDesc, "error");
        }
      });
    });
  }, 1000);
  $scope.hideloading();
  console.log($scope.cbSJ_ID);

  $scope.setP_SJ_ID = function(sj_id) {
    $scope.cbP_SJ_ID.availableOptions = [];
    $scope.cbP_SJ_ID.availableOptions.push({ name: "กรุณาเลือก", value: '-1' });
    $scope.cbP_SJ_ID.selectedOption = { name: "กรุณาเลือก", value: '-1' };

    $scope.cbSEQ.availableOptions = [];
    $scope.cbSEQ.availableOptions.push({ name: "กรุณาเลือก", value: '-1' });
    $scope.cbSEQ.selectedOption = { name: "กรุณาเลือก", value: '-1' };

    $scope.cbNUM_K.availableOptions = [];
    $scope.cbNUM_K.availableOptions.push({ name: "กรุณาเลือก", value: '-1' });
    $scope.cbNUM_K.selectedOption = { name: "กรุณาเลือก", value: '-1' };

    var sql = "SELECT IFNULL(p_sj_id,-1) AS value,IFNULL(p_sj_id,'') AS name FROM best_model WHERE sj_id = " + sj_id + " GROUP BY p_sj_id";
    $scope.returnNumSj = $http.get($rootScope.conpath + "MysqlCombo?str=" + sql);
    setTimeout(function() {
      $scope.showloading();
      $rootScope.$apply(function() {
        $scope.returnNumSj.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            for (var i = 0; i < data.map.length; i++) {
              $scope.cbP_SJ_ID.availableOptions.push(data.map[i]);
            }
            $scope.hideloading();
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
            $scope.hideloading();
          }
        });
      });
    }, 1000);
  }

  $scope.setSEQ = function(sj_id, p_sj_id) {
    $scope.cbSEQ.availableOptions = [];
    $scope.cbSEQ.availableOptions.push({ name: "กรุณาเลือก", value: '-1' });
    $scope.cbSEQ.selectedOption = { name: "กรุณาเลือก", value: '-1' };

    $scope.cbNUM_K.availableOptions = [];
    $scope.cbNUM_K.availableOptions.push({ name: "กรุณาเลือก", value: '-1' });
    $scope.cbNUM_K.selectedOption = { name: "กรุณาเลือก", value: '-1' };

    var sqlCluster = "SELECT IFNULL(sj_seq,-1) AS value,IFNULL(sj_seq,'') AS name FROM best_model WHERE sj_id = " + sj_id + " AND p_sj_id = " + p_sj_id + " GROUP BY sj_seq";
    console.log(sqlCluster);
    $scope.returnCluster = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlCluster);
    setTimeout(function() {
      $scope.showloading();
      $rootScope.$apply(function() {
        $scope.returnCluster.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            for(var i = 0; i < data.map.length; i++) {
              $scope.cbSEQ.availableOptions.push(data.map[i]);
            }
            $scope.hideloading();
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
            $scope.hideloading();
          }
        });
      });
    }, 1000);
  }

  $scope.setNUM_K = function(sj_id, p_sj_id, seq) {
    $scope.cbNUM_K.availableOptions = [];
    $scope.cbNUM_K.availableOptions.push({ name: "กรุณาเลือก", value: '-1' });
    $scope.cbNUM_K.selectedOption = { name: "กรุณาเลือก", value: '-1' };
    var sqlCluster = "SELECT IFNULL(num_k,-1) AS value,IFNULL(num_k,'') AS name FROM best_model WHERE sj_id = " + sj_id + " AND p_sj_id = " + p_sj_id + " AND sj_seq = " + seq;
    console.log(sqlCluster);
    $scope.returnCluster = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlCluster);
    setTimeout(function() {
      $scope.showloading();
      $rootScope.$apply(function() {
        $scope.returnCluster.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            for (var i = 0; i < data.map.length; i++) {
              $scope.cbNUM_K.availableOptions.push(data.map[i]);
            }
            $scope.hideloading();
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
            $scope.hideloading();
          }
        });
      });
    }, 1000);
  }

  $rootScope.preScore = function() {
    var sql = "CALL UP_PER_SCORE()";
    console.log(sql);
    $scope.rs = $http.get($rootScope.conpath + "perscore?sql=" + sql);
    setTimeout(function() {
      $scope.showloading();
      $rootScope.$apply(function() {
        $scope.rs.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {
            $scope.tmp = angular.fromJson(data.errDesc);
            $scope.correct = $scope.tmp.dataset[0].v_CORRECT;
            $scope.wrong = $scope.tmp.dataset[0].v_WRONG;
            //swal("ผิดพลาด", data.errDesc, "error");
            $scope.hideloading();
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
            $scope.hideloading();
          }
        });
      });
    }, 1000);
  }
  $rootScope.showAns = function() {
    var sql_detail = " select * from veiw_report_score ";
    $scope.gridOptionsHead.data = Datatable(sql_detail);
    $rootScope.preScore();
  }
  $rootScope.checkAns = function() {
    if($("#cbSJ_ID").val() != -1 && $("#cbP_SJ_ID").val() != -1 && $("#cbSEQ").val() != -1 && $scope.fileAns) {
      swal({
        title: "ยืนยัน?",
        text: "วิชา " + $("#sj_id").val() + " แบบฝึกหัดที่ = " + $("#cbP_SJ_ID").val() + " ข้อที่ = " + $("#cbSEQ").val(),
        type: "warning",
        showCancelButton: true
      }, function() {
        $scope.showloading();
        setTimeout(function() {
          $rootScope.$apply(function() {
            var uploadUrl1 = $rootScope.conpath + "upload";
            var fd1 = new FormData();
            fd1.append('file', $scope.fileAns);
            $http.post(uploadUrl1, fd1, {
              transformRequest: angular.identity,
              headers: { 'Content-Type': undefined }
            }).then(function(data, status, headers, config) {
              console.log($rootScope.conpath + "clustering?fileAns=" + $scope.fileAns.name);
              var data = data.data;
              if(data.errCode == 1) {
                console.log('Upload file sucess');
                $scope.CalCluster = $http.get($rootScope.conpath + "clustering?fileAns=" + $scope.fileAns.name+"&k=1");
                setTimeout(function() {
                  $rootScope.$apply(function() {
                    $scope.CalCluster.then(function(data, status, headers, config) {
                      var data = data.data;
                      console.log(data);
                      if (data.errCode == 1) {
                        console.log('cluster sucess');
                        setTimeout(function() {
                          $rootScope.$apply(function() {
                            var str = $rootScope.conpath + "classify?sj_id=" + $("#cbSJ_ID").val() 
                            + "&p_sj_id=" + $("#cbP_SJ_ID").val() 
                            + "&sj_seq=" + $("#cbSEQ").val() 
                            + "&num_k=1"
                            + "&perc=100";
                           // + "&perc=" + $("#perc").val();
                            $scope.CalClassify = $http.get(str);
                            $scope.CalClassify.then(function(data, status, headers, config) {
                              var data = data.data;
                              if (data.errCode == 1) {
                                $rootScope.showAns();
                                swal("เรียบร้อย!", "ตรวจคำตอบเสร็จสิ้น", "success");
                                $scope.hideloading();
                                console.log(data);
                              } else {
                                console.log(data.errCode + ' : ' + data.errDesc);
                                swal("ผิดพลาด", data.errDesc, "error");
                                $rootScope.df = [];
                                $scope.hideloading();
                              }
                            });
                          });
                        }, 1000);
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
        });
      });
    } else {
      swal("ผิดพลาด", "กรุณาเลือกระบุข้อมูลให้ครบถ้วน", "error");
      $scope.hideloading();
    }
  }

  $rootScope.editGrid = function(newSC,sdid) { 
    if(newSC && sdid){
      var sql = "sql=UPDATE t_answer SET num_score=" + newSC + ",IS_USE = 1 WHERE sd_id=" + sdid;
      var test = false;
      $rootScope.dt = CallWebAPI("excsql", sql);
      console.log($rootScope.dt);
      console.log(newSC+' '+sdid);
      setTimeout(function() {
        if($rootScope.dt.length > 0 && $rootScope.dt[0].errDesc){
          swal("ผิดพลาด", $rootScope.dt[0].errDesc, "error");
          test = true;
        }
      },1000);
    }
    return test;
  };

  $rootScope.retraining = function() { 
    setTimeout(function() {
      $rootScope.$apply(function() {
        var str = $rootScope.conpath + "retraining?sj_id=" + $("#cbSJ_ID").val() 
        + "&p_sj_id=" + $("#cbP_SJ_ID").val() 
        + "&sj_seq=" + $("#cbSEQ").val() 
        + "&num_k=1";
        $scope.CalClassify = $http.get(str);
        $scope.showloading();
        $scope.CalClassify.then(function(data, status, headers, config) {
          var data = data.data;
          if (data.errCode == 1) {      
            $rootScope.showAns();      
            swal("เรียบร้อย!", "Retraining เสร็จสิ้น", "success");
            $scope.hideloading();
            console.log(data);
          } else {
            console.log(data.errCode + ' : ' + data.errDesc);
            $scope.hideloading();
            swal("ผิดพลาด", data.errDesc, "error");
          }
        });
      });
    }, 1000);
  }
});
