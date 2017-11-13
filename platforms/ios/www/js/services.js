var app = angular.module('smartFeed.services', [])

.service('CommonService', function ($rootScope,$http,$state,$ionicPopup,$ionicLoading) {
	/* ============================login function service =========================*/ 
	this.login = function (username,password,login_type) {
		$http({  
			method: 'POST',
			url: 'http://www.comparethecab.co.uk/mobile_login.php',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			dataType: 'jsonp',
			data: $.param({
				log: username,
				pwd: password,
				username: username,
				password: password,
				/* login_type: login_type, */
			})
		}).then(function successCallback(response) {
			/* console.log(response); */
			if(response.data.msg=="matched"){ 
				localStorage.setItem("username", response.data.data.user_login);
				localStorage.setItem("email", response.data.data.user_email);
				localStorage.setItem("fullname", response.data.data.display_name);
				localStorage.setItem("user_id", response.data.data.ID);
				localStorage.setItem("db_name", response.data.db_name);

				$state.go('app.orderList');
			}
			else{
				$ionicPopup.alert({
					title: 'Login failed!',
					template: response.data
				});
			}
		}, function errorCallback(response) {}
		)	
	};

   /* ============================END login function service =========================*/ 
	 	
	this.orderList = function (user_id) {
		$rootScope.items='';
		$http({   
			method: 'POST', 
			url: 'http://www.comparethecab.co.uk/mobileapp/orders_listing.php',  
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			 /* data: $.param({ 
				db_name :'demo1' 
			})  */
			data: $.param({ 
				u_id :user_id 
			})
		}).then(function successCallback(response) {
			/* console.log(response.data);  */
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt) 
			$rootScope.items = json_obj;
		}, function errorCallback(response) {})
	}
  
	this.orderDetail = function (user_id) {
		$rootScope.items4='';
		$http({   
			method: 'POST', 
			url: 'http://www.comparethecab.co.uk/mobileapp/order_details.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :'demo1',
				order_id :user_id 
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt) 
			/* console.log(json_obj);  */
			$rootScope.items4 = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.saveEstimateTime = function(order_id,order_status,estimateTime){
		$rootScope.items5='';
		var dbName = localStorage.getItem("db_name");
		console.log('dbName '+dbName);
		$http({   
			method: 'POST', 
			url: 'http://www.comparethecab.co.uk/mobileapp/save_estimate_time.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				status :order_status,
				order_id :order_id,
				estimate_time :estimateTime,
				db_name :dbName
			})
		}).then(function successCallback(response){  
			console.log('response '+response.data);
			var titlemsg='';
			if(response.data =="success"){
				titlemsg = "Order updated successfully.";
			}
			if(response.data =="norecord"){
				titlemsg = "No record found.";
			}
			$rootScope.items5 = titlemsg;
			
		}, function errorCallback(response) {})
	}
	
	this.saveDeclineReason = function(order_id,order_status,declineReason){
		$rootScope.items6='';
		var dbName = localStorage.getItem("db_name");
		console.log('dbName '+dbName);
		$http({   
			method: 'POST', 
			url: 'http://www.comparethecab.co.uk/mobileapp/save_decline_reason.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				status :'cancelled',
				order_id :order_id,
				reasn :declineReason,
				db_name :dbName
			})
		}).then(function successCallback(response){  
			console.log('response '+response.data);
			var titlemsg='';
			if(response.data =="success"){
				titlemsg = "Order has been declined successfully.";
			}
			if(response.data =="norecord"){
				titlemsg = "No record found.";
			}
			$rootScope.items6 = titlemsg;
			 
		}, function errorCallback(response) {})
	}
});



