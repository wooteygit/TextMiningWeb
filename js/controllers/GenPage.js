app.controller("genPage",function($scope,$http,$window,$location,$rootScope,dialogAlert
	,dialogYN,dialoglogin
){
	$rootScope.titel = 'สร้างหน้าใหม่';
    $rootScope.genScript = function(){
    	if($('#tb_name').val() && $('#strScriptIn').val()){
	    	$scope.ScriptIn = "";
	    	$scope.ScriptOut = "";
	    	$scope.str = $("#strScriptIn").val();
		    $scope.strScript = $http.get("js/service/test_php.php?str="+$scope.str);
		    setTimeout(function(){
	        	$rootScope.$apply(function () {
		            $scope.strScript.then(function(data, status, headers, config) {
		            	console.log(data.data);
		            	var loop = data.data;
		            	var cu = 1;
		            	var str = "";
		            	var field = [];
		            	var columnDefsHead = "[";
		            	for(var i=0;i<loop.length;i++){
		            		var dataType = loop[i].Type;
							var chkBox = '';
		            		if(dataType.indexOf("int") > -1 && loop[i].Field != "inactive"){
		            			dataType = 'text';
		            		}
							if(dataType.indexOf("int") > -1 && loop[i].Field == "inactive"){
		            			dataType = 'checkbox';
								chkBox = 'ng-checked="inactive"';
		            		}
		            		if(dataType.indexOf("char") > -1){
		            			dataType = 'text';
		            		}
		            		if(cu == 1){
		            			str += '<div class="row">';
		            		}

		            		str += ''
		            		+'<div class="col-md-6">'
				                +'<label class="control-label">'+loop[i].Field+'</label>'
				                +'<input type="'+dataType+'" class="form-control" '+chkBox+' id = "'+loop[i].Field+'" ng-model = "'+loop[i].Field+'" value = "{{'+loop[i].Field+'}}" placeholder="'+loop[i].Field+'">'
	              			+'</div>';
	              			if(cu == 2 || i == loop.length-1){
	              				str += '</div>\
	              				<br>';
	              				cu = 0;
	              			}
	              			field.push({fd : loop[i].Field,key : loop[i].Key,type : loop[i].Type});
	              			columnDefsHead += "	{name: '"+loop[i].Field+"', displayName : '"+loop[i].Field+"',cellClass: 'cell_"+loop[i].Field+"',headerCellClass: 'header_"+loop[i].Field+"',visible: true},\n";
	              			cu++;
		            	}

		            	columnDefsHead = columnDefsHead.substring(columnDefsHead.length-1,1);

		            	$scope.ScriptOut = str.trim();
		            	$scope.ScriptOut += "<div ui-grid='gridOptionsHead' ui-grid-selection ui-grid-pagination class='grid'></div>\n<br>";
		                
		            	//columnDefsHead += "]\n";
		            	$scope.scriptHead = ""
		            	+" $rootScope.gridOptionsHead = {\n"	            		            	
		            	+"	data: [], \n"
				        +"  enableFiltering: true, \n"
				        +"  treeRowHeaderAlwaysVisible: false, \n" 
						+"  enableRowSelection: true, \n"
						+"  enableFullRowSelection: true, \n"
						+"  multiSelect: false, \n"
						+"  modifierKeysToMultiSelect : false, \n"
						+"  noUnselect : true, \n"
						+"  enableRowHeaderSelection: false, \n"
				        +"  onRegisterApi: function(gridApi) { \n"
				        +"       $scope.gridApi = gridApi; \n"
         				+"  	 gridApi.selection.on.rowSelectionChanged($scope, function(row){ \n"
          				+"    		$scope.countRows = $scope.gridApi.selection.getSelectedRows(); \n"
						+"  		console.log($scope.countRows); \n"
						+"			$scope.selectData($scope.countRows); \n"			
            			+"  	 });\n"
				        +"  },\n"
				        +"  columnDefs: ["+columnDefsHead+"],\n"
						+"  paginationPageSizes: [25, 50, 75], \n"
						+"  paginationPageSize: 25 \n"
			        	+" }; \n"
						+" var sqlHead = '"+$("#strScriptIn").val().trim()+"';\n"
			        	+" var pathHead = configPath() + 'ServiceController.php?sql=' + sqlHead; \n"
			        	+" var serv = $http.get(pathHead); \n"
			        	+" serv.then(function(response) { \n"
						+"		if(response.data.ErrorCode == 1){ \n"
						+"			console.log(response.data.Data); \n"
						+"			$rootScope.gridOptionsHead.data = response.data.Data; \n"
						+"		}else{ \n"
						+"			dialogAlert(response.data.ErrorDesc); \n"
						+"		}        \n"
				        +" });\n".trim();

				        var strField = "";
				        for(var i=0;i<field.length;i++){
				        	strField += "{'ParamName' : '"+field[i].fd+"',\n"
				        	+"'ParamValue' : ''+$('#"+field[i].fd+"').val()+'',\n"
				        	+"},";
				        }
				        strField = strField.substring(strField.length-1,1);
						$scope.scriptHead +="\n$scope.dataSave = {"
			        	+"TBHead : [{"
			        	+" TBName : '',"
			        	+" DataSave : [],"
			        	+"}],"
			        	+"TBDetail : [{"
			        	+" TBName : '',"
			        	+" DataSave : [],"
			        	+"}],"
						+"ISGenPK : true"
			        	+"}\n"
				        +"\n$rootScope.saveHead = function(){\n"
				        +"	$scope.dataSave.TBHead[0].TBName = '"+$('#tb_name').val()+"'; \n"
						+"  $scope.dataSave.TBHead[0].DataSave = [];  \n"
				        +"	$scope.dataSave.TBHead[0].DataSave.push({"+strField+");\n"
						+"	$scope.dataSave.ISGenPK = (($('#"+field[0].fd+"').val()) ? false : true);\n"
				        +"}\n";
 						
						 $scope.scriptHead +=	"$rootScope.selectData = function(row) { \n";

       					var strField2 = "";
				        for(var i=0;i<field.length;i++){
							if(field[i].fd != "inactive"){
				        		strField2 += "	$scope."+field[i].fd+" = row[0]."+field[i].fd+";\n";
							}else{
								strField2 += "	$scope."+field[i].fd+" = (row[0]."+field[i].fd+" == 1 ? true : false);\n";
							}
				        }
 						$scope.scriptHead += strField2+"}\n";

						var strAddSave = "$rootScope.addData = function() {\n"
						+"	$rootScope.saveHead(); \n"
						+"	var n = $rootScope.gridOptionsHead.data.length + 1; \n"
						+"	var datas =	$scope.dataSave; \n"
						+"	if(datas){ \n"
						+"		$http.post( configPath()+'SaveTBAllController.php',datas, \n"
						+"    		{headers:{'Content-Type':'application/json'}} \n"
						+" 		).then(function(response) { \n"
						+"			if(response.data.ErrorCode == 1){ \n"
						+"				dialogAlert(response.data.ErrorDesc); \n"
						+"				$window.location.reload(); \n"
						+"			}else{ \n"
						+"				dialogAlert(response.data.ErrorDesc); \n"
						+"			}    \n"   
						+"		});\n"
						+"	} \n"
						+"}; \n";

						$scope.scriptHead += strAddSave;

		            });
		        });
		    },1000);
		}else{
			dialogAlert("กรุณาระบุชื่อ Table และชื่อ script text");
		}
    }
});