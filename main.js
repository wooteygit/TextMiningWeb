(function(){
	angular.module('TextMining').controller('main', function($rootScope){
		$rootScope.titel = "หน้าหลัก";
	});
})();

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    var thday = new Array ("อาทิตย์","จันทร์",
      "อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"); 
    var thmonth = new Array ("มกราคม","กุมภาพันธ์","มีนาคม",
      "เมษายน","พฤษภาคม","มิถุนายน", "กรกฎาคม","สิงหาคม","กันยายน",
      "ตุลาคม","พฤศจิกายน","ธันวาคม");
    var dt = new Date();
    var dtStr = "วัน "+thday[dt.getDay()]+" ที่ "+dt.getDate()+" เดือน "+thmonth[dt.getMonth()]+" "+(dt.getFullYear()+543);
      
    document.getElementById('footer-nav').innerHTML =
    "<span class='glyphicon glyphicon-time'></span> "+h + ":" + m + ":" + s+" <span class='glyphicon glyphicon-calendar'></span> "+dtStr+" | Service Version 1.0.0 Build 1 DB MySql | Core Version 1.0.0";
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}