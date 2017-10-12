(function(){
	angular.module('TextMining').service('myutils', myutils);
  myutils.$inject = ['$mdDialog', '$rootScope'];
  function myutils($mdDialog,  $rootScope){ 
      return {
       hideWait: hideWait,
       showWait: showWait
      }     
    function hideWait(){
      setTimeout(function(){
        $rootScope.$emit("hide_wait"); 
      },5);
    }
      
    function showWait(){
      $mdDialog.show({
        controller: 'waitCtrl',
        template: '<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none;overflow-y:hidden;overflow-x:hidden;">' +
                    '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                    '</div>' +
                  '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false
      })
      .then(function(answer) {
        
      });
    }
  }
})();
