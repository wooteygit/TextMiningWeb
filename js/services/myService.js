app.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    ck = 0;
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    }).success(function(){
       ck = 1;
       console.log('Upload file success');
       console.log(file);
    }).error(function(){
       console.log('Upload file faile');
       ck = 0;
    });
     return ck;
  }
  
}]).service('singletonService', function ($http,$rootScope) {
  this.text = "First Text";
  var self = this;
  self.obj = {content:null};
  $http.get('./config/config.json').then(function(data) {
    self.obj.content = data[0].host;
    this.text = data[0].host;
    console.log(this.text);
  }); 
  this.text = self.obj.content; 

  this.setText = function (text) {
    this.text = text;
  };
  this.getText = function () {
    console.log(this.text);
    return this.text;
  };
});