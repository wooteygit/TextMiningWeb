app.factory('SktService', function() {
  return {
      svm_kernel_type : {}
  };
}).factory('configpath', function ($http,$rootScope) {
  var self = this;
  self.obj = {content:"http://127.0.0.1:8383/ClassifyWithoutClusteringV1/api/data/"};
  // var a = $http.get('config/config.json').then(function(data) {
  //     self.obj.content = data[0].host;
  // }); 
  return self.obj; 
}).factory('MysqlScriptNonResponse', function ($http,$rootScope,dialogFac,configpath) {
  return function (sql){
    var sqlApprove = sql;
    var returnApprove = $http.get($rootScope.conpath+"MysqlScriptNonResponse?str="+sqlApprove);
    var dt = [];
    setTimeout(function(){
        $rootScope.$apply(function () {
        returnApprove.then(function(data, status, headers, config) {
          var data = data.data;
          dt.push(data.map);
        });
      });
    },1000);
    return dt;
  } 
}).factory('CallWebAPI', function ($http,$rootScope,dialogFac,configpath) {
  return function (Path,QueryParam){
    var urls = configpath.content+Path+"?"+QueryParam;
    var returnDatasql = $http.get(urls);
    var dt=[];
    setTimeout(function(){
      $rootScope.$apply(function () {
        returnDatasql.then(function(data, status, headers, config) {
          var dat = data.data;
          if(dat.errCode > 0){
            dt.push(dat.map);
          }else{
            swal("ผิดพลาด", dat.errDesc, "error");
            console.log(dat);
            dt.push(dat);
          }
        });
      });
    },1000);
    return dt;
  } ;
}).factory('Datatable', function ($http,$rootScope,dialogFac,configpath,myutils) {
  return function (sql){
    var urls = configpath.content+"datasql?sql="+sql;
    var returnDatasql = $http.get(urls);
    var dt = [];
    setTimeout(function(){
      $rootScope.$apply(function () {
        returnDatasql.then(function(data, status, headers, config) {
          var data = data.data;
          console.log(data);
          if(data.errCode == 1){
            var arr_i = data.map;
            var objstr = "";
            for(i=0;i<arr_i.length;i++){
              var arr_j = arr_i[i];
              objstr = "{";
              for(j=0;j<arr_j.length;j++){
                var obj = arr_j[j];
                var field,value;
                for(var name in obj) {
                  if(name.trim() == 'field'){
                    field = obj[name];
                  } 
                  if(name.trim() == 'value'){
                    if(!obj[name]){
                      value = "";
                    }else{
                      value = obj[name];
                    }
                  }
                }
                objstr += '"'+field+'" : "'+value+'",';
              }
              objstr = objstr.substr(0,objstr.length-1);
              objstr += "}";
              // console.log(objstr);
              dt.push(JSON.parse(objstr));
            };
          }else{
            console.log(data.errCode + ' : ' + data.errDesc);
            swal("ผิดพลาด", data.errDesc, "error");
          }
        });
      });
    },1000);
    return dt;
  };
});