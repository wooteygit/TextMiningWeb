app.controller("TestSVM", function($scope, $http, $window, $location, myutils, $rootScope
  , fileUpload, configpath, $state, $stateParams, SktService, dialogFac, $interval
  , uiGridGroupingConstants, Datatable
) {
  $rootScope.titel = 'Training & Testing';
  $rootScope.conpath = configpath.content;
  $scope.num_att = 1;
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
     //$scope.loadBestParam();
     $scope.getAtt();
     $scope.hideloading();
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
    }
    ,
     columnDefs: [{
       name: 'bm_id',
       displayName: 'bm_id',
       cellClass: 'cell_bm_id',
       headerCellClass: 'header_bm_id',
       width: '10%', 
       visible:false
     }, {
       name: 'k',
       displayName: 'k',
       cellClass: 'cell_k',
       headerCellClass: 'header_k',
       width: '15%'
     }, {
       name: 'param',
       displayName: 'param',
       cellClass: 'cell_param',
       headerCellClass: 'header_param',
       width: '40%'
     }, {
       name: 'correct',
       displayName: '% correct',
       cellClass: 'cell_correct',
       headerCellClass: 'header_correct',
       width: '20%'
     }, {
       name: 'wrong',
       displayName: '% wrong',
       cellClass: 'cell_wrong',
       headerCellClass: 'header_wrong',
       width: '20%'
     }, {
       name: 'wrong',
       displayName: '% wrong',
       cellClass: 'cell_wrong',
       headerCellClass: 'header_wrong',
       width: '20%'
     }]
  };

  $rootScope.TrainTestModel = function() {
    $rootScope.gridOptionsHead.data = [];
    $scope.showloading();
    // $rootScope.trainModel();
    $rootScope.testModel();
  }

   $scope.getAtt = function() {
    //$scope.showloading();
    var att = 1;
    var sqlsubject = "SELECT param_val AS VALUE,'' AS NAME FROM center_param WHERE ID = 10 LIMIT 1";
    $scope.returnComboSubj = $http.get($rootScope.conpath + "MysqlCombo?str=" + sqlsubject);
    setTimeout(function() {
      $rootScope.$apply(function() {
        $scope.returnComboSubj.then(function(data, status, headers, config) {
          var data = data.data;
          console.log(data);
          if (data.errCode == 1) {
            console.log(data.map.length);
            for (var i = 0; i < data.map.length; i++) {
              $scope.num_att = data.map[i].value;
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
    // return att;
   }

  $rootScope.testModel = function() {
    var looppam =  $rootScope.loopParam();
    $scope.rs = $http.post($rootScope.conpath + "multiparam",looppam);
      setTimeout(function() {
        $rootScope.$apply(function() {
          $scope.rs.then(function(data, status, headers, config) {
            var data = data.data;
            if (data.errCode == 1) {
              console.log(data);
              var sql = "SELECT bm.* FROM ( "
              +" SELECT bm_id,k,bm_param as param,correct,wrong "
              +" FROM model_temp )bm "
              +" ORDER BY bm.correct DESC ";
              $rootScope.gridOptionsHead.data = Datatable(sql);
               $scope.hideloading();
            } else {
              swal("ผิดพลาด", data.errDesc, "error");
              console.log(data.errCode + ' : ' + data.errDesc);
              $scope.hideloading();
            }
          });
        });
      }, 1000);
  };

  $rootScope.loadBestParam = function() {
    var sql = 'SELECT CASE WHEN c_svc = 1 THEN "C-SVC" WHEN nu_svc = 1 THEN "nu-SVC" ELSE "No" END AS SVM_Type ,'
    +' CASE WHEN linear_svm = 1 THEN "Linear" WHEN polynomial = 1 THEN "polynomial" '
    +' WHEN radialbasis = 1 THEN "radialbasis" WHEN sigmoid = 1 THEN "sigmoid" ELSE "No" END AS Kernel_Type ,'
    +' degree,coef0,gamma,cost,nu,epsilon,p,cachsize,correct,wrong'
    +' FROM best_svm_param ';
    $rootScope.gridOptionsHead.data = Datatable(sql);
    $scope.hideloading();
  }

  $rootScope.dis11 = false;
  $rootScope.dis22 = false;
  $rootScope.dis33 = false;
  $rootScope.dis44 = true;
  $rootScope.checkdis2 = function() {
    var c_svc = (($("#c_svc").is(':checked')) ? 1 : 0);
    var nu_svc = (($("#nu_svc").is(':checked')) ? 1 : 0);
    if(c_svc == 1) {
      $rootScope.dis11 = false;
      $rootScope.dis22 = false;
      $rootScope.dis33 = false;
      $rootScope.dis44 = true;
    }else if(nu_svc == 1) { 
      $rootScope.dis11 = true;
      $rootScope.dis22 = true;
      $rootScope.dis33 = false;
      $rootScope.dis44 = false;
    }
  }

  $rootScope.dis1 = true;
  $rootScope.dis2 = true;
  $rootScope.dis3 = true;
  $rootScope.checkdis = function() {
    var linear = (($("#linear").is(':checked')) ? 1 : 0);
    var polynomial = (($("#polynomial").is(':checked')) ? 1 : 0);
    var radial_basis = (($("#radial_basis").is(':checked')) ? 1 : 0);
    var sigmoid = (($("#sigmoid").is(':checked')) ? 1 : 0);
    if(linear == 1) {
      $rootScope.dis1 = true;
      $rootScope.dis2 = true;
      $rootScope.dis3 = true;
    }else if(radial_basis == 1) { 
        $rootScope.dis1 = false;
        $rootScope.dis2 = true;
        $rootScope.dis3 = true;
    }else if(sigmoid == 1) {
      $rootScope.dis1 = false;
      $rootScope.dis2 = false;
      $rootScope.dis3 = true;
    }else if(polynomial == 1){ 
      $rootScope.dis1 = false;
      $rootScope.dis2 = false;
      $rootScope.dis3 = false;
    }
  }

  $rootScope.defaultValKernel = function() {}

  $rootScope.defaultValSVM = function() {}

  $rootScope.loopParam = function() {
    var arrloopParam = [];
 
      var c_svc = (($("#c_svc").is(':checked')) ? 1 : 0)
      var nu_svc = (($("#nu_svc").is(':checked')) ? 1 : 0)
      var linear = (($("#linear").is(':checked')) ? 1 : 0)
      var polynomial = (($("#polynomial").is(':checked')) ? 1 : 0)
      var radial_basis = (($("#radial_basis").is(':checked')) ? 1 : 0)
      var sigmoid = (($("#sigmoid").is(':checked')) ? 1 : 0)
      var degree = {
        "start": parseFloat($("#degree").val()),
        "step": parseFloat($("#degreeStep").val()),
        "stop": parseFloat($("#degreeStop").val())
      }
      var coef0 = {
        "start": parseFloat($("#coef0").val()),
        "step": parseFloat($("#coef0Step").val()),
        "stop": parseFloat($("#coef0Stop").val())
      }
      var gamma = {
        "start": parseFloat($("#gamma").val()),
        "step": parseFloat($("#gammaStep").val()),
        "stop": parseFloat($("#gammaStop").val())
      }
      var cost = {
        "start": parseFloat($("#cost").val()),
        "step": parseFloat($("#costStep").val()),
        "stop": parseFloat($("#costStop").val())
      }
      var nu = {
        "start": parseFloat($("#nu").val()),
        "step": parseFloat($("#nuStep").val()),
        "stop": parseFloat($("#nuStop").val())
      }
      var weight = {
        "start": parseFloat($("#weight").val()),
        "step": parseFloat($("#weightStep").val()),
        "stop": parseFloat($("#weightStop").val())
      }
      var prob = {
        "start": parseFloat($("#prob").val()),
        "step": parseFloat($("#probStep").val()),
        "stop": parseFloat($("#probStop").val())
      }

      var str = "";
      var strF = "";
      
      if(c_svc == 1){
        str = "-s,0";
        for(var i=cost.start;i<=cost.stop;i = (((parseFloat(i).toPrecision(15))*100)/100) +cost.step){
          var str1 = str + ",-c,"+(((parseFloat(i).toPrecision(15))*100)/100);
          for(var j=weight.start;j<=weight.stop;j = (((parseFloat(j).toPrecision(15))*100)/100)+weight.step){
            var str2 = str1 + ",-wi,"+(((parseFloat(j).toPrecision(15))*100)/100);
            for(var k=prob.start;k<=prob.stop;k = (((parseFloat(k).toPrecision(15))*100)/100)+prob.step){
              var str3 = str2 + ",-b,"+(((parseFloat(k).toPrecision(15))*100)/100);
            
              if(polynomial == 1 || radial_basis == 1 || sigmoid == 1){
                var str4 = str3 + ",-t,1";
                for(var l=gamma.start;l<=gamma.stop;l = (((parseFloat(l).toPrecision(15))*100)/100)+gamma.step){
                  var str5 = str4 + ",-g,"+(((parseFloat(l).toPrecision(15))*100)/100);
                  if(polynomial == 1 ||  sigmoid == 1){
                    for(var m=coef0.start;m<=coef0.stop;m = (((parseFloat(m).toPrecision(15))*100)/100)+coef0.step){
                      var str6  =  str5 + ",-r,"+(((parseFloat(m).toPrecision(15))*100)/100);
                      if(polynomial == 1 ){
                        for(var n=degree.start;n<=degree.stop;n = (((parseFloat(n).toPrecision(15))*100)/100)+degree.step){
                          var str7 = str6 + ",-d,"+(((parseFloat(n).toPrecision(15))*100)/100);
                          //console.log(str7);
                          strF = str7;
                           console.log(strF);
                           arrloopParam.push(strF);
                        }
                      }else{
                        //console.log(str6);
                         strF = str6;
                          console.log(strF);
                          arrloopParam.push(strF);
                      }
                    }
                  }else{
                   // console.log(str5);
                    strF = str5;
                     console.log(strF);
                     arrloopParam.push(strF);
                  }
                }
              }else{
               // console.log(str3);
                strF = str3;
                 console.log(strF);
                 arrloopParam.push(strF);
              }
            }
          }
          
        }
      }
       if(nu_svc == 1){
        str = "-s,1";
        for(var j=prob.start;j<=prob.stop;j = (((parseFloat(j).toPrecision(15))*100)/100)+prob.step){
          var str2 = str + ",-b,"+(((parseFloat(j).toPrecision(15))*100)/100);
          for(var k=nu.start;k<=nu.stop;k = (((parseFloat(k).toPrecision(15))*100)/100)+nu.step){
            var str3 = str2 + ",-n,"+(((parseFloat(k).toPrecision(15))*100)/100);
          
            if(polynomial == 1 || radial_basis == 1 || sigmoid == 1){
              var str4 = str3 + ",-t,1";
              for(var l=gamma.start;l<=gamma.stop;l = (((parseFloat(l).toPrecision(15))*100)/100)+gamma.step){
                var str5 = str4 + ",-g,"+(((parseFloat(l).toPrecision(15))*100)/100);
                if(polynomial == 1 || sigmoid == 1){
                  for(var m=coef0.start;m<=coef0.stop;m = (((parseFloat(m).toPrecision(15))*100)/100)+coef0.step){
                    var str6  =  str5 + ",-r,"+(((parseFloat(m).toPrecision(15))*100)/100);
                    if(polynomial == 1){
                      for(var n=degree.start;n<=degree.stop;n = (((parseFloat(n).toPrecision(15))*100)/100)+degree.step){
                        var str7 = str6 + ",-d,"+(((parseFloat(n).toPrecision(15))*100)/100);
                       // console.log(str7);
                         strF = str7;
                          console.log(strF);
                          arrloopParam.push(strF);
                      }
                    }else{
                     // console.log(str6);
                       strF = str6;
                        console.log(strF);
                        arrloopParam.push(strF);
                    }
                  }
                }else{
                 // console.log(str5);
                   strF = str5;
                    console.log(strF);
                    arrloopParam.push(strF);
                }
              }
            }else{
             // console.log(str3);
               strF = str3;
                console.log(strF);
                arrloopParam.push(strF);
            }
          }
          // console.log(strF);
        }
      }
      return arrloopParam;
    };
});
