angular.module('smartFeed.controllers', ['ionic.cloud'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$location,$ionicPush,CommonService,$ionicPopup,$state,$timeout) {
	angular.element($('[nav-view="cached"]')).remove();  /* for remove cache of template */
	$scope.logout = function() {
		var currentUserId = localStorage.getItem("user_id");
		CommonService.deleteloggedOffUser(currentUserId);
		
		localStorage.setItem("username", "");
		localStorage.setItem("email", "");
		localStorage.setItem("fullname", "");
		localStorage.setItem("user_id", "");
		localStorage.setItem("db_name", "");
		localStorage.setItem("site_name", "");
		localStorage.setItem("site_url", "");
		localStorage.setItem("db_id", "");
		
		$state.go('app.login', null, {reload: true}); 
	}  
	
	$scope.logoff = function() {
		var currentUserId = localStorage.getItem("user_id");
		/* var currentUrl = $location.absUrl(); */
		var currentUrl    =  $location.path();
		CommonService.setloggedOffUser(currentUserId,currentUrl);
		
		/* $state.go('app.logOff', {'user_id':currentUserId,'current_url':currentUrl,reload: true});  */
		$state.go('app.logOff', null, {reload: true});  
	}  
	
	/* for subscribe for notification and send notification */
	$scope.register = function(){
	   $ionicPush.register().then(function(t) {
			return $ionicPush.saveToken(t);
		}).then(function(t){
			localStorage.setItem("device_token", t.token);
			if(t.token!==''){
				$ionicPopup.alert({
					title: 'Success!',
					template: "You're successfully subscribed for order notification."
				});
			}
			CommonService.saveDeviceToken(t.token);
		}); 
 
 
		/* $scope.deviceInformation = ionic.Platform.device();
		$scope.currentPlatform = ionic.Platform.platform();
		$scope.currentPlatformVersion = ionic.Platform.version();

  
		var deviceInformation = ionic.Platform.device(); */
		/* alert('platform: ' +  deviceInformation.platform);
		alert('udid: ' + deviceInformation.uuid);
		alert('model: ' + deviceInformation.model); */
 
		/* CommonService.enablePushNotification($scope.currentPlatform,$scope.currentPlatformVersion,deviceInformation.model);   */
		 
	}
	  
	
	$scope.$on('cloud:push:notification', function(event, data) {
		var msg = data.message;
		$location.path('/app/orderList=pending');
	});
	 
	 /*for unregister from push notifications*/
	$scope.unregister = function(){
		var dvice_tkn = localStorage.getItem("device_token");
		CommonService.unregisterDeviceToken(dvice_tkn);
		localStorage.setItem("device_token", "");
		$ionicPush.unregister();
	}  

	/* end for subscribe for notification and send notification */
 
	var currentUsrId = localStorage.getItem("user_id");
	if(currentUsrId!=""){
		CommonService.getUserPrivileges(currentUsrId);  /*  for get assigned privileges to add checks on tabs  */
		console.log('if currentUsrId '+currentUsrId);
	}else{
		console.log('else currentUsrId '+currentUsrId);
	}
	
	 /* console.log('user_id '+localStorage.getItem('user_id')); */
	/* if(localStorage.getItem('user_id')!=null && localStorage.getItem('user_id')!=undefined && localStorage.getItem('user_id')!=''){
		CommonService.getNewOrders(); 
		setInterval(function () { 
			 if(localStorage.getItem("unread_orders") && localStorage.getItem("unread_orders") !="" ){
				CommonService.getNewOrders(localStorage.getItem("unread_orders")); 
			}else{
				CommonService.getNewOrders(localStorage.getItem("unread_orders")); 
			} 
			
		 CommonService.getNewOrders(localStorage.getItem("unread_orders")); 
		}, 2000);
	}else{
		 console.log('else user_id '+localStorage.getItem('user_id'));
	} */
	 
})
 
.controller('LoginCtrl', function($scope, $http, $ionicPopup, $state, $ionicModal,CommonService) { 
	$scope.loginForm = function(form) {	
		if(form.$valid ) { 
			CommonService.login($scope.username,$scope.password,$scope.login_type,'pending'); 
		}
		else {  
			$ionicPopup.alert({
				title: 'Login failed!',
				template: 'All Fields are required!'
			});
		}
    }
})
 
.controller('orderListCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams, $ionicGesture) {
	$scope.$on('$ionicView.beforeEnter', function(){  
	 /* for loading every time when view load  */
		var orderSrtBy = "24_hours"; 
		if(angular.element(document.getElementById("orderStBy")).val()!=""){ 
			orderSrtBy = angular.element(document.getElementById("orderStBy")).val();	
		} 
	 
	 	var api_url = localStorage.getItem('api_url'); 
 
		$scope.user_id = localStorage.getItem('user_id');   // get local storage
		var order_type = $stateParams.order_type; 
		var dbName     = localStorage.getItem("db_name");
		  
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$scope.ord_sts = order_type; 
			$http.get(api_url+'/mobileapp/orders_listing.php?page='+1+'&order_status='+order_type+'&db_name='+dbName+'&sort_by='+orderSrtBy).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.id!=null && value.id!=undefined && value.id!=''){  
						/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,msg: items.msg});   */
						/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg}); */
    
							ordrClass = "";
							if(angular.lowercase(value.status) == "pending"){
								ordrClass = "pending-ordr";
							}
							if(angular.lowercase(value.status) == "confirmed"){
								ordrClass = "confirmed-ordr";
							}
							if(angular.lowercase(value.status) == "cancelled"){
								ordrClass = "cancelled-ordr";
							}
							
							$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass}); 
					}
					else{
						if(items.msg=="no record found"){
							$scope.no_record = items.msg;			
						} 
					}
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/orders_listing.php?page='+$scope.page+'&order_status='+order_type+'&db_name='+dbName+'&sort_by='+orderSrtBy).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.id!=null && value.id!=undefined && value.id!=''){  
							/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,msg: items.msg});  */
						
							ordrClass = "";
							if(angular.lowercase(value.status) == "pending"){
								ordrClass = "pending-ordr"
							}
							if(angular.lowercase(value.status) == "confirmed"){
								ordrClass = "confirmed-ordr"
							}
							if(angular.lowercase(value.status) == "cancelled"){
								ordrClass = "cancelled-ordr"
							}
							$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass});  
						}else{
							if(items.msg=="no record found"){
								$scope.no_record = items.msg;			
							} 
						}
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.orderdetail = function(orderID) {
			$state.go('app.orderDetail',{'order_id': orderID}); 
		}  
		
		/* code for get swipe gesture ( left,right,up,down )*/
		$scope.gesture = {
			used: ''
		};  

		$scope.onGesture = function(gesture,ord_sts) {
			 $scope.gesture.used = gesture;
		}

		/* var element = angular.element(document.querySelector('#content')); 

		$ionicGesture.on('tap', function(e){
			$scope.$apply(function() {
				console.log('Tap');
				$scope.gesture.used = 'Tap';
			})    
		}, element); */
		
		/* end code for get swipe gesture*/

		$scope.mySelect = "24_hours";
		$scope.order_sort_by =function(mySelect){
			/* alert(mySelect); */
			$scope.ord_sts = order_type; 
			$http.get(api_url+'/mobileapp/orders_listing.php?page='+1+'&order_status='+order_type+'&db_name='+dbName+'&sort_by='+mySelect).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.id!=null && value.id!=undefined && value.id!=''){  
						/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,msg: items.msg});   */
						/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg}); */
    
							ordrClass = "";
							if(angular.lowercase(value.status) == "pending"){
								ordrClass = "pending-ordr";
							}
							if(angular.lowercase(value.status) == "confirmed"){
								ordrClass = "confirmed-ordr";
							}
							if(angular.lowercase(value.status) == "cancelled"){
								ordrClass = "cancelled-ordr";
							}
							
							$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass}); 
					}
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/orders_listing.php?page='+$scope.page+'&order_status='+order_type+'&db_name='+dbName+'&sort_by='+mySelect).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.id!=null && value.id!=undefined && value.id!=''){  
							/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,msg: items.msg});  */
						
							ordrClass = "";
							if(angular.lowercase(value.status) == "pending"){
								ordrClass = "pending-ordr"
							}
							if(angular.lowercase(value.status) == "confirmed"){
								ordrClass = "confirmed-ordr"
							}
							if(angular.lowercase(value.status) == "cancelled"){
								ordrClass = "cancelled-ordr"
							}
							$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass});  
						}
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
		};
   }) 
})

.controller('orderDetailCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$cordovaPrinter,$ionicPopup,$window,$cordovaDevice) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		/* for loading every time when view load  */
		
		var api_url = localStorage.getItem('api_url');

		$scope.user_id = localStorage.getItem('user_id');   // get local storage
		var site_name  = localStorage.getItem('site_name');  
		var site_url   = localStorage.getItem('site_url');  
		var orderID    = $stateParams.order_id;
		var dbName     = localStorage.getItem("db_name");
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			CommonService.orderDetail(orderID);
		}else{
			$state.go('app.login');
		}
		
		$scope.orderstatus = function(orderStatus,orderID) {
			if(orderStatus == "accept"){ 
				$state.go('app.acceptOrder',{'order_status':'accept','order_id': orderID});
			}
			if(orderStatus == "decline"){ 
				$state.go('app.declineOrder',{'order_status':'decline','order_id': orderID});
			}  
		}   
		 
		/* code for print order details */
		$scope.print = function() { 
			if($cordovaPrinter.isAvailable()) {
				 $cordovaPrinter.print(api_url+"/mobileapp/print_order_detail.php?order_id="+orderID+"&site_name="+site_name+"&site_url="+site_url+"&db_name="+dbName);
			} else {
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Printing is not available on device'
				});
			}
		} 
	 
		 
		/* end print order details */	
 
		$scope.updateOrder = function(orderID) {
			 $state.go('app.updateOrder',{'order_id': orderID});
		} 
			
		$scope.updateAddress = function(orderID){ 
			$state.go('app.updateAddress',{'order_id': orderID});
		}	 
   }) 
})


.controller('updateOrderCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	 $scope.$on('$ionicView.beforeEnter', function(){
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var api_url = localStorage.getItem('api_url');
		
		var orderID 	 = $stateParams.order_id;
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){		
			$scope.fullname = localStorage.getItem('fullname'); 
			$scope.email    = localStorage.getItem('email');  
			
			CommonService.editOrder(orderID)
		}else{
			$state.go('app.login'); 
		} 
		
		 
	   $scope.ordrtypes = [
		{value:'pickup', name:'Pick-up'},
		{value:'delivery', name:'Delivery'}
	  ];
	  
	  $scope.orderStatus = [
		{value:'pending', name:'Pending'},
		{value:'confirmed', name:'Confirmed'},
		{value:'cancelled', name:'Cancelled'}
	  ];
	  
	  $scope.isPaid = [
		{value:'0', name:'No'},
		{value:'1', name:'Yes'}
	  ]; 
	    
	  $scope.paymentmethod = [
		{value:'paypal', name:'PayPal'},
		{value:'stx', name:'Debit/Credit Card'},
		{value:'authorize', name:'Authorize.NET'},
		{value:'creditcard', name:'Credit Card'},
		{value:'cash', name:'Cash'},
		{value:'none', name:'None'}
	  ]; 
	  
	  
	  $scope.updateOrder=function(){ 
			var ordr_types 			= angular.element(document.getElementById("ordr_types")).val();  
			var order_status 		= angular.element(document.getElementById("order_status")).val();  
			var order_is_paid		= angular.element(document.getElementById("order_is_paid")).val();  
			var paymentmethod		= angular.element(document.getElementById("paymentmethod")).val();  
			var customer_name 		= angular.element(document.getElementById("customer_name")).val();  
			var customer_email 		= angular.element(document.getElementById("customer_email")).val();  
			var c_phone 			= angular.element(document.getElementById("contact_number")).val();  
			var c_address_1 		= angular.element(document.getElementById("customer_address1")).val();  
			var c_address_2 		= angular.element(document.getElementById("customer_address2")).val();  
			var c_state 			= angular.element(document.getElementById("state")).val();  
			var c_city 				= angular.element(document.getElementById("city")).val();  
			var c_zip 				= angular.element(document.getElementById("postal")).val();  
			var subtotalPrice 		= angular.element(document.getElementById("subtotal")).val();  
			var price_delivery 		= angular.element(document.getElementById("delivery")).val();  
			var price_total 		= angular.element(document.getElementById("ordertotal")).val();  
			var voucher_code 		= angular.element(document.getElementById("voucher_code")).val(); 
			
			if(ordr_types==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please select order type.'
				});
			}
			else if(order_status==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please select order status.'
				});
			}
			else if(order_is_paid==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please select order paid.'
				});
			}
			else if(paymentmethod==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please select payment_method.'
				});
			}
			else if(customer_name==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter name.'
				});
			}
			else if(customer_email==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter email.'
				});
			}
			else if(c_phone==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter phone number.'
				});
			}
			else if(c_address_1==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter address 1.'
				});
			}
			else if(c_city==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter city.'
				});
			}
			else if(c_zip==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter postal code.'
				});
			}
			else{
				 CommonService.updateOrder(orderID,ordr_types,order_status,order_is_paid,paymentmethod,customer_name,customer_email,c_phone,c_address_1,c_address_2,c_state,c_city,c_zip,subtotalPrice,price_delivery,price_total,voucher_code);
				 $timeout(function() {
					$state.go('app.orderDetail',{'order_id': orderID});
				}, 2000); 
			} 
	  }
	})
})

.controller('updateAddressCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	 $scope.$on('$ionicView.beforeEnter', function(){
		$scope.user_id = localStorage.getItem('user_id');   // get local storage
		var orderID    = $stateParams.order_id;
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){		
			$scope.fullname = localStorage.getItem('fullname'); 
			$scope.email    = localStorage.getItem('email');  
			CommonService.editAddress(orderID); 
			
			var locations = [];
			var location_options = '';
			var location_options1 = [];
			 /* $http.get('http://www.comparethecab.co.uk/mobileapp/order_api.php?action=get_locations&db_name='+dbName).success(function(items) { */
			 $http.get(api_url+'/mobileapp/order_api.php?action=get_locations&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) { 
					if(value.id!=null && value.id!=undefined && value.id!=''){
						location_options1.push({value: value.id, name:value.name});
					}
				 });
			 
				$scope.locations = location_options1; 
			}); 
			
			
			var locations = [];
			var country_options = [];
			/* $http.get('http://www.comparethecab.co.uk/mobileapp/order_api.php?action=get_countries&db_name='+dbName).success(function(items) { */
			$http.get(api_url+'/mobileapp/order_api.php?action=get_countries&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) { 
					if(value.id!=null && value.id!=undefined && value.id!=''){
						country_options.push({value: value.id, name:value.country_title});
					}
				 });
			 
				$scope.countries = country_options;  
			}); 
		}else{
			$state.go('app.login'); 
		}  
		
		
			$scope.updtPickAddrs=function(){ 
				var locations		= angular.element(document.getElementById("all_locations")).val();  
				var pickup_date 	= angular.element(document.getElementById("pickup_date")).val();  
				var pickup_time		= angular.element(document.getElementById("pickup_time")).val();  

				CommonService.updateAddressPickup(orderID,locations,pickup_date,pickup_time);
					$timeout(function() {
					$state.go('app.orderDetail',{'order_id': orderID});
				}, 2000);
			} 
		  
		  $scope.updtDelivryAddrs=function(){
			    var del_locations		= angular.element(document.getElementById("del_locations")).val();  
				var del_address_1 		= angular.element(document.getElementById("del_address_1")).val();  
				var del_address_2		= angular.element(document.getElementById("del_address_2")).val();  
				var del_city			= angular.element(document.getElementById("del_city")).val();  
				var del_state			= angular.element(document.getElementById("del_state")).val();  
				var del_postal_code		= angular.element(document.getElementById("del_postal_code")).val();  
				var del_country		    = angular.element(document.getElementById("del_country")).val();  
				var del_special_note	= angular.element(document.getElementById("del_special_note")).val();  
				var delivery_date		= angular.element(document.getElementById("delivery_date")).val();  
				var delivery_time		= angular.element(document.getElementById("delivery_time")).val();  
			 
				CommonService.updateDelivryAddress(orderID,del_locations,del_address_1,del_address_2,del_city,del_state,del_postal_code,del_country,del_special_note,delivery_date,delivery_time); 
				 $timeout(function() {
					$state.go('app.orderDetail',{'order_id': orderID});
				}, 2000);
		  }
	}) 
}) 

/* .controller('userProfileCtrl', function($scope,$state,CommonService, ionicTimePicker) { */
.controller('userProfileCtrl', function($scope,$state,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){		
			$scope.fullname = localStorage.getItem('fullname'); 
			$scope.email    = localStorage.getItem('email');  
		}else{
			$state.go('app.login'); 
		} 
		
		$scope.logout = function() { 
			var currentUserId = localStorage.getItem("user_id");
			CommonService.deleteloggedOffUser(currentUserId);
		
			localStorage.setItem("username", '');
			localStorage.setItem("email", '');
			localStorage.setItem("fullname", '');
			localStorage.setItem("user_id", '');
			localStorage.setItem("db_name", '');
			localStorage.setItem("site_name", '');
			localStorage.setItem("site_url", '');
			localStorage.setItem("db_id", '');
			
			$state.go('app.login'); 
		}
	}) 
}) 

.controller('orderAcceptCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope,$cordovaPrinter) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   /* get local storage */
		var orderID 	 = $stateParams.order_id;
		var order_status = $stateParams.order_status;
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			$state.go('app.acceptOrder');
			$rootScope.items5 = '';
		}else{
			$state.go('app.login');
		} 
		
		$scope.saveEstimateTime = function(form){	
			if(form.$valid ){
				var estimate_time = angular.element(document.getElementById("estimate_time"));  
				
				var estimate_time1 = $scope.textbox = estimate_time.val();
				
				CommonService.saveEstimateTime(orderID,order_status,estimate_time1,$cordovaPrinter,$ionicPopup);
				$timeout(function() {
					$state.go('app.orderDetail',{'order_id': orderID});
				}, 2000);
			}
			else{ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter order estimate time.'
				});
			}
		}
   }) 
})
 
.controller('orderDeclineCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$location,$rootScope) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var orderID 	 = $stateParams.order_id;
		var order_status = $stateParams.order_status;
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			$rootScope.items6 = '';
			$state.go('app.declineOrder');
		}else{
			$state.go('app.login');
		} 
		   
		$scope.saveDeclineReason=function(decline){  
			var declineReason = decline.reason ; 
			var declineReason1 = decline.reason1 ; 
		
			if(declineReason==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please select any one reason.'
				});
			}
			else if(declineReason == "Custom"){
				if(declineReason1 == "" || declineReason1==undefined){ 
					$ionicPopup.alert({
						title: 'Error!',
						template: 'Please enter decline reason.'
					});					
				}
				else{ 
					CommonService.saveDeclineReason(orderID,order_status,declineReason1);
					$timeout(function(){
						$state.go('app.orderDetail',{'order_id': orderID});
					}, 2000);
				}
			}
			else{
				CommonService.saveDeclineReason(orderID,order_status,declineReason);
				$timeout(function(){
					$state.go('app.orderDetail',{'order_id': orderID});
				}, 2000);
			}
		}
		 
		$scope.isShowHide=function(param){  
			if(param == "show"){
				$scope.showval = true;  
			} else{
				$scope.showval = false;  
			}
		} 
   }) 
})


.controller('dashBoardCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout) { 
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id=localStorage.getItem('user_id');
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */

			CommonService.dashboardService($scope.user_id);
		}else{
			$state.go('app.login');
		} 
   })
})

.controller('businessReportsCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) { 
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.orderSortBy = "24_hours";
		var orderSortBy = "24_hours"; 
		if(angular.element(document.getElementById("ordrSortBy")).val()!=""){ 
			orderSortBy = angular.element(document.getElementById("ordrSortBy")).val();	
		} 
			
		$scope.user_id = localStorage.getItem('user_id');
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){ 
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */ 
			/* $http.get('http://www.comparethecab.co.uk/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=businessReports').success(function(items) { */
			/* $http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=businessReports').success(function(items) { 
				angular.forEach(items, function(value, key) {
					$scope.total_ordrs   = items.total_orders;
					$scope.total_price   = items.total_price;
					$scope.cash_orders   = items.cash_orders; 
					$scope.cash_prcntage = items.cash_prcntage;
					$scope.cash_price    = items.cash_price;
					
					$scope.stx_orders    = items.stx_orders;
					$scope.stx_price     = items.stx_price;
					$scope.stx_prcntage  = items.stx_prcntage;
					 
					$scope.items.push({ id: value.id,price_total: value.price_total,order_date:value.created_date,msg: items.msg});
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});  */
			
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=businessReports'+'&sort_by='+orderSortBy).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.id!=null && value.id!=undefined && value.id!=''){  
						$scope.total_ordrs   = items.total_orders;
						$scope.total_price   = items.total_price;
						$scope.cash_orders   = items.cash_orders; 
						$scope.cash_prcntage = items.cash_prcntage;
						$scope.cash_price    = items.cash_price;
						
						$scope.stx_orders    = items.stx_orders;
						$scope.stx_price     = items.stx_price;
						$scope.stx_prcntage  = items.stx_prcntage;
						
						/* $scope.items.push({ id: value.id,price_total: value.price_total,msg: items.msg}); */
						$scope.items.push({ id: value.id,price_total: value.price_total,order_date:value.created_date,msg: items.msg});
					}else{
						if(items.msg=="no record found"){
							$scope.no_record = items.msg;			
						} 
					}
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				/* $http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=businessReports').success(function(items) { */
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=businessReports'+'&sort_by='+orderSortBy).success(function(items) {
					angular.forEach(items, function(value, key) {
						/* $scope.items.push({ id: value.id,price_total: value.price_total,msg: items.msg}); */
						if(value.id!=null && value.id!=undefined && value.id!=''){  
							$scope.items.push({ id: value.id,price_total: value.price_total,order_date:value.created_date,msg: items.msg});
						}else{
							if(items.msg=="no record found"){
								$scope.no_record = items.msg;			
							} 
						}
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		}
		
		$ionicModal.fromTemplateUrl('templates/modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});
		
		
		
		$scope.order_sort_by_dashboard =function(orderSortBy){  
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=businessReports'+'&sort_by='+orderSortBy).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.total_ordrs   = items.total_orders;
					$scope.total_price   = items.total_price;
					$scope.cash_orders   = items.cash_orders; 
					$scope.cash_prcntage = items.cash_prcntage;
					$scope.cash_price    = items.cash_price;
					
					$scope.stx_orders    = items.stx_orders;
					$scope.stx_price     = items.stx_price;
					$scope.stx_prcntage  = items.stx_prcntage;
					
					$scope.items.push({ id: value.id,price_total: value.price_total,order_date:value.created_date,msg: items.msg});
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=businessReports'+'&sort_by='+orderSortBy).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,price_total: value.price_total,order_date:value.created_date,msg: items.msg});
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = []; 
		};
   }) 
})

.controller('graphicalReportCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id=localStorage.getItem('user_id');   /* get local storage */
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			
			var total = "";
			var total1 = "";
			var cntt=1;
			
			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=graphicalReportBusiness').success(function(items) {
				angular.forEach(items, function(value, key) {
					 $scope.series = ['Series A', 'Series B', 'Series C', 'Series D']; 
					 if(value.total!=null && value.total!=undefined && value.total!=''){  
						if(cntt>1){
							total  = total+","+value.total;
						  } else{
							  total  = value.total;
						  }
					} 
					cntt++; 
				});
				
				/* for trim comma from last of zip */
				 var lastChar = total.slice(-1);
				 if (lastChar == ',') {
					total = total.slice(0, -1);
				 }
				
				total1 = [];
				total1 = total.split(','); 
				/*  $scope.colors1 = ['#4D5360', '#48BF46', '#F7464A', '#46BFBD'];  
				
				/* for show value on top of each bar in graph */
				   $scope.labels1 = ['Today','This Week','This Month','This Year'];
				      $scope.data1 = [
					 total1
				   ];  
				   /*  $scope.data1 = [
					 20,25,30,35
				   ];  */
				   
				   $scope.options1 = {
					  legend: {
						 display: true,
					  },
					  tooltips: {
						enabled: false
						},
					 hover: {
						animationDuration: 0,
					 },
					  animation: {
						duration: 1,
						onComplete: function () {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;
							ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'bottom';

							this.data.datasets.forEach(function (dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function (bar, index) {
									var data = '£'+dataset.data[index];      
									ctx.fillText(data, bar._model.x, bar._model.y);
								});
							});
						}
					},
					  scales: {
						xAxes: [{
								gridLines: {
									display:false
								},
								ticks: {
									display: true,
									beginAtZero:true
								}
							}],
						yAxes: [{
								gridLines: {
									display:false
								} ,
								ticks: {
									display: true,
									beginAtZero:true
								}  
							}]
					}
				   }
				   $scope.datasetOverride1 = [{
					  label: 'Business Overview'
				   }];
				/* end show value on top of each bar in graph */
				 
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}else{
			$state.go('app.login');
		}
   }) 
   
    $ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
})

.controller('customerOverviewCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){ 
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			var total1 = "";
			
			var cntt=1;
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=graphicalReportCustomer').success(function(items) {
				angular.forEach(items, function(value, key) {
					 if(value.total!=null && value.total!=undefined && value.total!=''){  
						  if(cntt>1){
							total1  = total1+","+value.total;
						  } else{
							  total1 = value.total;
						  }
					}
					 cntt++; 
				});
				 
				/* for trim comma from last of zip */
				var lastChar = total1.slice(-1);
				if(lastChar == ',') {
					total1 = total1.slice(0, -1);
				}
				
				total2 = [];
				total2 = total1.split(','); 
				 
			 
				  
				  $scope.labels = ['Today','This Week','This Month','This Year']; 
			  	  $scope.data = [
					 total2
				   ]; 
				   /* $scope.data = [
					 20,25,30,35
				   ]; */
				   
				   $scope.options = {
					  legend: {
						 display: true
					  },
					  tooltips: {
						enabled: false
						},
					 hover: {
						animationDuration: 0,
					 },
					  animation: {
						duration: 1,
						onComplete: function () {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;
							ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'bottom';

							this.data.datasets.forEach(function (dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function (bar, index) {
									var data = '£'+dataset.data[index];      
									ctx.fillText(data, bar._model.x, bar._model.y);
								});
							});
						}
					},
					  scales: {
						xAxes: [{
								gridLines: {
									display:false
								},
								ticks: {
									display: true,
									beginAtZero:true
								}
							}],
						yAxes: [{
								gridLines: {
									display:false
								} ,
								ticks: {
									display: true,
									beginAtZero:true
								}  
							}]
					}
				   }
				   $scope.datasetOverride = [{
					  label: 'Customer Overview'
				   }];
				/* end show value on top of each bar in graph */
				 
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}); 
		}else{
			$state.go('app.login');
		}
   }) 
   
   $ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})


.controller('topBuyersCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');   // get local storage
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000);  
			
			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=topBuyers').success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,name: value.name,total_orders:value.total_orders,total_business:value.total_business,msg: items.msg});
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=topBuyers').success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,total_orders:value.total_orders,total_business:value.total_business,msg: items.msg});
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		}
		
		$scope.customerOrders = function(id,ordrStatus){
			$state.go('app.customerOrderList',{'customer_id': id,'status':ordrStatus});
		}
   }) 
   
	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})

.controller('topDishesCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=topDishes').success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,name: value.name,unit_sold:value.total_sold,total_price:value.total_price,total_business:value.total_business,msg: items.msg});
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page = 2;
			
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=topDishes').success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,unit_sold:value.total_sold,total_price:value.total_price,total_business:value.total_business,msg: items.msg});
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
			
			$scope.viewProduct=function(product_id){
				$state.go('app.updateProducts',{'product_id': product_id});
			}
		}else{
			$state.go('app.login');
		}
   }) 
   
	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})


.controller('topPromosCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=topPromos').success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,voucher_code: value.voucher_code,total:value.total,total_business:value.total_business,msg: items.msg});
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=topPromos').success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,voucher_code: value.voucher_code,total:value.total,total_business:value.total_business,msg: items.msg});
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
			
			$scope.viewProduct=function(product_id){
				$state.go('app.updateProducts',{'product_id': product_id});
			}
		}else{
			$state.go('app.login');
		}
   }) 
   
   $ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})


.controller('refundClaimsCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
	
			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=refundClaims').success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,c_name: value.c_name,created_date:value.created,order_status:value.status,order_type:value.type,payment_method:value.payment_method,price_total:value.price_total,refund_status:value.refund_status,refund_amount:value.refund_amount,refund_reason:value.refund_reason,msg: items.msg});
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=refundClaims').success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,c_name: value.c_name,created_date:value.created,order_status:value.status,order_type:value.type,payment_method:value.payment_method,price_total:value.price_total,refund_status:value.refund_status,refund_amount:value.refund_amount,refund_reason:value.refund_reason,msg: items.msg});
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
			
			$scope.viewProduct=function(product_id){
				$state.go('app.updateProducts',{'product_id': product_id});
			}
			
			$scope.refundDetail=function(order_id){
				$state.go('app.refundDetail',{'order_id': order_id});
			}
		}else{
			$state.go('app.login');
		}
		
		$scope.orderDetail= function(orderId){  
		   $state.go('app.orderDetail',{'order_id': orderId});
	    }
   }) 
   
    $ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})
 
.controller('refundDetailCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var order_id   = $stateParams.order_id;
		  
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			CommonService.refundDetail(order_id);   
			 
		}else{
			$state.go('app.login');
		}
			  
	  $scope.orderDetail= function(){  
		   $state.go('app.orderDetail',{'order_id': order_id});
	  }
	  
	 $scope.refund_status = [
		{value:'pending', name:'Pending'},
		{value:'approved', name:'Approved'},
		{value:'declined', name:'Declined'}
	  ];
	  
	  
	  $scope.updateRefund = function(){  
			 var refund_status              = angular.element(document.getElementById("refund_status")).val();  
			 var refund_approved_amount     = angular.element(document.getElementById("refund_approved_amount")).val(); 
			 var refund_message  			= angular.element(document.getElementById("refund_message")).val(); 
			 var order_id  			        = angular.element(document.getElementById("order_id")).val(); 
			 var customer_reason  			= angular.element(document.getElementById("customer_reason")).text(); 
			 var amount  			        = angular.element(document.getElementById("amount")).text(); 
			 
			 CommonService.updateRefund(refund_status,refund_approved_amount,refund_message,order_id,customer_reason,amount);
			 $timeout(function(){
				$state.go('app.refundClaims');
			 }, 2000); 
		}
   }) 
}) 

.controller('topAreasCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			 
			var zip 	= "";
			var zipData = "";
			var cntt    = 1;
			
			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+1+'&db_name='+dbName+'&get_list=topAreas').success(function(items) {
				
				angular.forEach(items, function(value, key) {
					$scope.items.push({ d_zip: value.d_zip,total_price:value.total_price,total:value.total,msg: items.msg});
					if(value.d_zip!=null && value.d_zip!=undefined && value.d_zip!=''){  
						zip = value.d_zip+","+zip;			
					 }  
					 
					  if(value.total!=null && value.total!=undefined && value.total!=''){   
						zipData = value.total+","+zipData;
					 }  
				});
				
				/* for trim comma from last of zip */
				 var lastChar = zip.slice(-1);
				 if (lastChar == ',') {
					zip = zip.slice(0, -1);
				 }
				 
				 /* for trim comma from last of zipData */
				  var lastChar1 = zipData.slice(-1);
				 if (lastChar1 == ',') {
					zipData = zipData.slice(0, -1);
				 }
				 
				 zip1 = [];
				 zip1 = zip.split(',');
				 
				 zipData1 = [];
				 zipData1 = zipData.split(',');
				
				 $scope.labels = zip1;  
				 $scope.data =zipData1;
				
				
				/* for show value on top of each bar in graph */
			/* 	var opt = {
					events: false,
					tooltips: {
						enabled: false
					},
					hover: {
						animationDuration: 0
					},
					animation: {
						duration: 1,
						onComplete: function () {
							var chartInstance = this.chart,
							ctx = chartInstance.ctx;
							ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'bottom';

							this.data.datasets.forEach(function (dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function (bar, index) { */
									/* var data = 'Â£'+dataset.data[index];       */
									/* var data = '£'+dataset.data[index];      
									ctx.fillText(data, bar._model.x, bar._model.y - 0);
								});
							});
						}
					},
					scales: {
						xAxes: [{
								gridLines: {
									display:false
								}
							}],
						yAxes: [{
								gridLines: {
									display:false
								}   
							}]
					}
				};
				
				$scope.options =  opt ; 
				 */
				
				 $scope.labels2 = zip1;  
				 $scope.data2 =[zipData1];
				 /* $scope.labels2 = ['Today','This Week','This Month','This Year']; */
				  /*     $scope.data1 = [
					 total1
				   ];  */ 
				   /*  $scope.data1 = [
					 20,25,30,35
				   ];  */
				   
				   $scope.options2 = {
					  legend: {
						 display: true,
					  },
					  tooltips: {
						enabled: false
						},
					 hover: {
						animationDuration: 0,
					 },
					  animation: {
						duration: 1,
						onComplete: function () {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;
							ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'bottom';

							this.data.datasets.forEach(function (dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function (bar, index) {
									var data = dataset.data[index];      
									ctx.fillText(data, bar._model.x, bar._model.y);
								});
							});
						}
					},
					  scales: {
						xAxes: [{
								gridLines: {
									display:false
								},
								ticks: {
									display: true,
									beginAtZero:true
								}
							}],
						yAxes: [{
								gridLines: {
									display:false
								} ,
								ticks: {
									display: true,
									beginAtZero:true
								}  
							}]
					}
				   }
				   $scope.datasetOverride2 = [{
					  label: 'Top Areas(Orders)'
				   }];
				/* end show value on top of each bar in graph */
						  
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=topAreas').success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ d_zip: value.d_zip,total_price:value.total_price,total:value.total,msg: items.msg});
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
			
			$scope.viewProduct=function(product_id){
				$state.go('app.updateProducts',{'product_id': product_id});
			}
			
			$scope.refundDetail=function(order_id){
				$state.go('app.refundDetail',{'order_id': order_id});
			}
		}else{
			$state.go('app.login');
		}
		
		$scope.orderDetail= function(orderId){  
		   $state.go('app.orderDetail',{'order_id': orderId});
	    }
		
		$scope.getOrders= function(zipCode){ 
		   $state.go('app.topAreaOrderList',{'zip_code':zipCode});
	    }

		$scope.getAreaWiseOrders= function(zipCode){ 
			$state.go('app.getAreaWiseOrdersList',{'zip_code':zipCode});
	    }
   })
   
     $ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
})

 
.controller('topAreaOrderListCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams, $ionicGesture) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		var dbName     = localStorage.getItem("db_name");
		$scope.user_id = localStorage.getItem('user_id');
		var zip_code   = $stateParams.zip_code; 
		var additional_condition = '';
		var api_url    = localStorage.getItem('api_url');
		
		if(zip_code!=null && zip_code!=undefined && zip_code!=''){
			zip_code = $stateParams.zip_code;
			additional_condition = '&zip_code='+zip_code;
		}
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/orders_listing.php?page='+1+'&order_status=confirmed&db_name='+dbName+additional_condition).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,msg: items.msg});  
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/orders_listing.php?page='+$scope.page+'&order_status=confirmed&db_name='+dbName+additional_condition).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,msg: items.msg}); 
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.orderdetail = function(orderID) {
			$state.go('app.orderDetail',{'order_id': orderID});
		}
   }) 
}) 

.controller('getAreaWiseOrdersListCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams, $ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		var dbName = localStorage.getItem("db_name");
		$scope.user_id=localStorage.getItem('user_id');
		var zip_code = $stateParams.zip_code; 
		var additional_condition = '';
		var api_url    = localStorage.getItem('api_url');
		
		if(zip_code!=null && zip_code!=undefined && zip_code!=''){
			zip_code = $stateParams.zip_code;
			additional_condition = '&zip_code='+zip_code;
		}
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */ 
			$http.get(api_url+'/mobileapp/dasbhboard_api.php?page=1&db_name='+dbName+'&get_list=getAreaWiseOrders'+additional_condition).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ postal_code: value.postal_code,total: value.total,total_price: value.total_price,count_result:items.count_result,msg: items.msg});  
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/dasbhboard_api.php?page='+$scope.page+'&db_name='+dbName+'&get_list=getAreaWiseOrders'+additional_condition).success(function(items) {
					if(items.count_result >0){
						angular.forEach(items, function(value, key) {
							$scope.items.push({ postal_code: value.postal_code,total: value.total,total_price: value.total_price,msg: items.msg});  
						});
						if ( items.msg == "no record found" ) {
							$scope.noMoreItemsAvailable = true;
						}
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}else{
						$scope.noMoreItemsAvailable = true;
					}
					
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.orderdetail = function(orderID) {
			$state.go('app.orderDetail',{'order_id': orderID});
		}

		$scope.getOrders= function(zipCode){ 
		   $state.go('app.topAreaOrderList',{'zip_code':zipCode});
	    }		
		 
   }) 
   
     $ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope
	  }).then(function(modal) {
		$scope.modal = modal;
	  });
})
  
.controller('cutomersCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams) {
   $scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');
		var order_type = $stateParams.order_type;
		var dbName     = localStorage.getItem("db_name");
		var api_url    = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$scope.ord_sts = order_type; 
			$http.get(api_url+'/mobileapp/customers_listing.php?page='+1+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,name: value.name,price_total: value.price_total,msg: items.msg});  
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/customers_listing.php?page='+$scope.page+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,price_total: value.price_total,msg: items.msg}); 
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.orderdetail = function(orderID) {
			$state.go('app.orderDetail',{'order_id': orderID});
		} 
		
		$scope.viewCustomersOrders = function(customerId) {
			$state.go('app.customerOrderList',{'customer_id': customerId});
		}  
			
		$scope.customerDetail = function(customerId) {
			$state.go('app.customerDetail',{'customer_id': customerId});
		} 
   }) 
})

.controller('cutomersOrderCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams) {
   $scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id=localStorage.getItem('user_id');
		var customer_id  = $stateParams.customer_id;
		var order_status = $stateParams.status;
		var dbName       = localStorage.getItem("db_name");
		var api_url      = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$http.get(api_url+'/mobileapp/customer_orders.php?page='+1+'&customer_id='+customer_id+'&db_name='+dbName+'&status='+order_status).success(function(items) {
				angular.forEach(items, function(value, key) {
					/* $scope.items_orders.push({ id: value.id,order_status: value.status,price_total: value.price_total,msg: items.msg});  */
					/* $scope.items_orders.push({ id: value.id,order_status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg});  */
					
					ordrClass = "";
					if(angular.lowercase(value.status) == "pending"){
						ordrClass = "pending-ordr";
					}
					if(angular.lowercase(value.status) == "confirmed"){
						ordrClass = "confirmed-ordr";
					}
					if(angular.lowercase(value.status) == "cancelled"){
						ordrClass = "cancelled-ordr";
					}  
					
					$scope.items_orders.push({ id: value.id,order_status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass}); 					
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/customer_orders.php?page='+$scope.page+'&customer_id='+customer_id+'&db_name='+dbName+'&status='+order_status).success(function(items) {
					angular.forEach(items, function(value, key) {
						/* $scope.items_orders.push({ id: value.id,order_status: value.status,price_total: value.price_total,msg: items.msg});  */
						/* $scope.items_orders.push({ id: value.id,order_status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg});  */
						
						ordrClass = "";
						if(angular.lowercase(value.status) == "pending"){
							ordrClass = "pending-ordr";
						}
						if(angular.lowercase(value.status) == "confirmed"){
							ordrClass = "confirmed-ordr";
						}
						if(angular.lowercase(value.status) == "cancelled"){
							ordrClass = "cancelled-ordr";
						} 
						 
						$scope.items_orders.push({ id: value.id,order_status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass}); 
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items_orders = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.customerOrderDetail = function(orderID) {
			$state.go('app.customerOrderDetail',{'order_id': orderID});
		}
   }) 
})

.controller('cutomersOrderDetailCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$window) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id = localStorage.getItem('user_id');
		var site_name  = localStorage.getItem('site_name');  
		var site_url   = localStorage.getItem('site_url');  
		var orderID    = $stateParams.order_id;
		var api_url    = localStorage.getItem('api_url');
		var dbName     = localStorage.getItem("db_name");
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			CommonService.customerOrderDetail(orderID);
		}else{
			$state.go('app.login');
		}
		
		$scope.orderstatus = function(orderStatus,orderID) {
			if(orderStatus == "accept"){ 
				$state.go('app.acceptOrder',{'order_status':'accept','order_id': orderID});
			}
			if(orderStatus == "decline"){ 
				$state.go('app.declineOrder',{'order_status':'decline','order_id': orderID});
			}  
		}   
		 
		/* code for print order details */
		$scope.print = function() {
			if($cordovaPrinter.isAvailable()) {
				$cordovaPrinter.print(api_url+"/mobileapp/print_order_detail.php?order_id="+orderID+"&site_name="+site_name+"&site_url="+site_url+'&db_name='+dbName);
			} else {
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Printing is not available on device'
				});
			} 
		}
		/* end print order details */	
   }) 
})

.controller('customerDetailCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams) {
	$scope.$on('$ionicView.beforeEnter', function() { 
		$scope.user_id=localStorage.getItem('user_id');
		var customerId = $stateParams.customer_id;
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			CommonService.customerDetailService(customerId);
		}else{
			$state.go('app.login');
		}
   }) 
})
 
.controller('productsCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout) {
   $scope.$on('$ionicView.beforeEnter', function(){
		$scope.user_id=localStorage.getItem('user_id');
		var api_url = localStorage.getItem('api_url');
		
		var dbName = localStorage.getItem("db_name");
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$http.get(api_url+'/mobileapp/products_listing.php?page='+1+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,name: value.name,product_price: value.price,featured:value.is_featured,msg: items.msg});  
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/products_listing.php?page='+$scope.page+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,product_price: value.price,featured:value.is_featured,msg: items.msg});  
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.productDetail = function(productID) {
			$state.go('app.productDetail',{'product_id': productID});
		} 
		
		$scope.addProducts = function() {
			$state.go('app.addProducts');
		}  
   }) 
})
 
.controller('productsDetailCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams, $ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id=localStorage.getItem('user_id');
		var productId = $stateParams.product_id;
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			CommonService.productDetailService(productId);
		}else{
			$state.go('app.login');
		}
	}) 
	
	$scope.addProducts = function() {
		$state.go('app.addProducts');
	}  
	 
	$scope.updateProducts = function(product_id){ 
		$state.go('app.updateProducts',{'product_id': product_id});
	}	
	  
	/* end for show extra products on modal popup */
})

.controller('addProductsCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope, $ionicModal) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage 
		var dbName = localStorage.getItem("db_name");
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
		}else{
			$state.go('app.login');
		} 
	  
		$scope.saveProducts = function(form){  
			 var product_name              = angular.element(document.getElementById("product_name")).val();  
			 var product_description       = angular.element(document.getElementById("product_description")).val(); 
			 var product_description_show  = angular.element(document.getElementById("product_description_show")).val(); 
			 var product_price             = angular.element(document.getElementById("product_price")).val();
			 var product_is_featured       = angular.element(document.getElementById("product_is_featured")).val();
			 var product_is_open           = angular.element(document.getElementById("product_is_open")).val();
			 var product_order             = angular.element(document.getElementById("product_order")).val();
			 
			 if(form.$valid ){
				CommonService.saveProducts(product_name,product_description,product_description_show,product_price,product_is_featured,product_is_open,product_order);
				$timeout(function(){
					$state.go('app.productsList');
				}, 2000); 
			}
		}
		
		$scope.order={};
		$scope.format=function(){ 
			$scope.modifiedOrder=[];
			angular.forEach($scope.order, function(value, key) {
				if(value){
					$scope.modifiedOrder.push(parseInt(key));
				}
			});
		} 
		 
		$scope.totalCount = 0;
		$scope.countInit = function() {
		   return $scope.totalCount++;
		}
   }) 
})

.controller('updateProductsCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var product_id 	 = $stateParams.product_id; 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			 CommonService.editProducts(product_id);
		}else{
			$state.go('app.login');
		} 
		
		$scope.updateProducts = function(form){ 
			 var product_is_single         = "";
			 var product_name              = angular.element(document.getElementById("product_name")).val();  
			 var product_description       = angular.element(document.getElementById("product_description")).val(); 
			 var product_description_show  = angular.element(document.getElementById("product_description_show")).val(); 
			 var product_price             = angular.element(document.getElementById("product_price")).val();
			 var product_is_featured       = angular.element(document.getElementById("product_is_featured")).val();
			 var product_is_open           = angular.element(document.getElementById("product_is_open")).val();
			 var product_order             = angular.element(document.getElementById("product_order")).val();
			  
			if(product_name.trim()==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter product name.'
				}); 
			}
			else if(product_price.trim()==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter product price.'
				}); 
			}
			else{
				 CommonService.updateProducts(product_id,product_name,product_description,product_description_show,product_price,product_is_featured,product_is_open,product_order);  
				 $timeout(function(){
					$state.go('app.productsList');
				 }, 2000); 
			}
		} 
		
		$scope.fetaured = [
			{value:'0', name:'No'},
			{value:'1', name:'Yes'}
		];
		  
		$scope.descOnreceipt = [
			{value:'0', name:'No'},
			{value:'1', name:'Yes'}
		];
		  
		$scope.isOpen = [
			{value:'0', name:'No'},
			{value:'1', name:'Yes'}
		]; 
   }) 
})

.controller('extrasCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout) {
   $scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id=localStorage.getItem('user_id');   // get local storage
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$http.get(api_url+'/mobileapp/extras_listing.php?page='+1+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,name: value.name,extras_price: value.price,msg: items.msg});  
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/extras_listing.php?page='+$scope.page+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,extras_price: value.price,msg: items.msg});  
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		}

		$scope.addExtras = function(){
			$state.go('app.addExtras');
		}	
		
		$scope.updateExtras = function(extra_id){ 
			$state.go('app.updateExtras',{'extra_id': extra_id});
		}			
   }) 
})

.controller('addExtrasCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id = localStorage.getItem('user_id');   // get local storage 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
		}else{
			$state.go('app.login');
		} 
		
		$scope.saveExtras = function(form){
			var extra_name   = angular.element(document.getElementById("extra_name"));  
			var extra_price  = angular.element(document.getElementById("extra_price"));  
			var extra_name1  = extra_name.val();
			var extra_price1 = extra_price.val(); 
			 
			if(extra_name1.trim()==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter name.'
				});
			}
			else if(extra_price1==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter price.'
				});
			}else{
				 CommonService.saveExtras(extra_name1,extra_price1);
			 $timeout(function() {
				$state.go('app.extras');
			 }, 2000); 
			} 
		}
   }) 
})
 
.controller('updateExtrasCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var extra_id 	 = $stateParams.extra_id; 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			 CommonService.editExtras(extra_id);
		}else{
			$state.go('app.login');
		} 
		
		$scope.updateExtras = function(form){
			var extra_name  = angular.element(document.getElementById("extra_name")).val();  
			var extra_price = angular.element(document.getElementById("extra_price")).val();
			if(extra_name.trim()==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter name.'
				});
			}
			else if(extra_price.trim()==""){
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter price.'
				});
			}else if(extra_name.trim()=="" && extra_price.trim()=="") {
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter name and price.'
				});
			}else{
				CommonService.updateExtras(extra_id,extra_name,extra_price);
				$timeout(function() {
					$state.go('app.extras');
				 }, 2000); 
			}
		} 
   }) 
})
 
.controller('categoriesCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout) {
   $scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id=localStorage.getItem('user_id');
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$http.get(api_url+'/mobileapp/categories_listing.php?page='+1+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					$scope.items.push({ id: value.id,name: value.name,is_open: value.is_open,msg: items.msg});  
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/categories_listing.php?page='+$scope.page+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,is_open: value.is_open,msg: items.msg});  
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
   }) 
   
	$scope.addCategory = function(){
		$state.go('app.addCategory');
	}	
	
	$scope.updateCategory = function(category_id){ 
		$state.go('app.updateCategory',{'category_id': category_id});
	}	 
})


.controller('addCategoryCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope, $cordovaCamera,$cordovaFile) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
		}else{
			$state.go('app.login');
		} 
		
		$scope.saveCategory = function(form){
			var category_name 			= angular.element(document.getElementById("category_name")).val();  
			var category_description 	= angular.element(document.getElementById("category_description")).val(); 
			var category_order 			= angular.element(document.getElementById("category_order")).val(); 
			var category_is_open 		= angular.element(document.getElementById("category_is_open")).val(); 
			var upload_image 		    = angular.element(document.getElementById("upload_image")).val(); 
			
			if(category_name.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter name.'
				});
			}else{
				 CommonService.saveCategory(category_name,category_description,category_order,category_is_open);
			 $timeout(function() {
				$state.go('app.categories');
			 }, 2000); 
			} 
		}  
   })  
})
 
.controller('updateCategoryCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var category_id 	 = $stateParams.category_id; 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			 CommonService.editCategory(category_id);
		}else{
			$state.go('app.login');
		} 
		
		$scope.updateCategory = function(form){
			var category_name 			= angular.element(document.getElementById("category_name")).val();  
			var category_description 	= angular.element(document.getElementById("category_description")).val(); 
			var category_order 			= angular.element(document.getElementById("category_order")).val(); 
			var category_is_open 		= angular.element(document.getElementById("category_is_open")).val(); 
			  
			if(category_name.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter name.'
				});
			}else{
				 CommonService.updateCategory(category_id,category_name,category_description,category_order,category_is_open);
				 $timeout(function() {
					$state.go('app.categories');
				 }, 2000); 
			}
		} 
   }) 
   
    $scope.isOpen = [
		{value:'0', name:'No'},
		{value:'1', name:'Yes'}
	  ]; 
}) 

.controller('allLocationsCtrl', function($scope,$http,$rootScope,$state,CommonService,$ionicLoading,$timeout,$location,$ionicPopup,$window) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=get_locations&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.id!='' && value.id!=null && value.id!=undefined ){
						$scope.items.push({ id: value.id,name: value.name,address: value.address,add_latitude:value.lat,add_longitude:value.lng,msg: items.msg});  
					}
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/locations_api.php?page='+$scope.page+'&action=get_locations&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						$scope.items.push({ id: value.id,name: value.name,address: value.address,msg: items.msg});  
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
	 
		$scope.addLocations = function() { 
			$state.go('app.addLocations');  
		}
		
		$scope.editLocation = function(locationId,latitude,longitude) { 
			$state.go('app.editLocation',{'location_id':locationId,'latitude':latitude,'longitude':longitude});  
		}  
		
		$scope.showPopup = function(locationId) {
		   var confirmPopup = $ionicPopup.confirm({
			 title: 'Confirmation',
			 template: 'Are you sure you want to delete this location?'
		   });

		   confirmPopup.then(function(res) {
			 if(res) {
			   $http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=delete_location&location_id='+locationId+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.msg=="success"){
							$ionicPopup.alert({
								title: 'success!',
								template: 'Location deleted successfully.'
							});
						}
						/* 
						$timeout(function() {
							$window.location.reload(true)
						 }, 2000);  
						  */
						 $state.go('app.allLocations', null, {reload: true}); 
					});
				});
			 } else {
			   console.log('You are not sure');
			 }
		   }); 	
	   }
   })   
}) 

.controller('addLocationCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage 
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
		}else{
			$state.go('app.login');
		} 
		
		  $scope.saveLocation = function(form){
			var location_name 		= angular.element(document.getElementById("location_name1")).val();  
			var location_address 	= angular.element(document.getElementById("location_address1")).val();
			var location_latitude 	= angular.element(document.getElementById("location_latitude1")).val();
			var location_logitude 	= angular.element(document.getElementById("location_logitude1")).val();
			var phone_number 	    = angular.element(document.getElementById("phone_number1")).val();
			
			/*  alert('name '+location_name+' location_address '+location_address+' location_latitude '+location_latitude+' location_logitude '+location_logitude);  */
			
			if(location_name.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter location name.'
				});
			}
			else if(location_address.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter address.'
				});
			} 
			else{
				 CommonService.saveLocation(location_name,location_address,location_latitude,location_logitude,phone_number);
				 $timeout(function() {
					$state.go('app.allLocations');
				 }, 2000); 
			} 
		}

		$scope.custom = true;
		 $scope.toggleCustom = function() {
			 var location_address = angular.element(document.getElementById("location_address1")).val();  
			 if(location_address.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter address.'
				});
			}
			else{
				/* for get latitude and logitude of entered address */
				var latitde = "";
				var longitde = "";
				$http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=get_lat_long&location_address='+location_address+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						latitde  = value.lat;
						longitde = value.lng;
						
						$scope.latitud  = latitde;
						$scope.longitud = longitde;
						
						/* for show address on google map */
						var myCenter = new google.maps.LatLng(latitde,longitde); 
					    /* var myCenter = new google.maps.LatLng(52.5888364,-0.2499739);  */
						var mapCanvas = document.getElementById("map");
						var mapOptions = {center: myCenter, zoom: 17};
						var map = new google.maps.Map(mapCanvas, mapOptions);
						var marker = new google.maps.Marker({position:myCenter});
						marker.setMap(map);
						/* end show address on google map */
					});
				});
			}
        };
	})  
})

.controller('updateLocationCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	var get_latitude  = $stateParams.latitude; 
	var get_longitude = $stateParams.longitude; 
	
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var dbName = localStorage.getItem("db_name");
		var location_id  = $stateParams.location_id; 
		var api_url = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			CommonService.editLocation(location_id); 
			  
		}else{
			$state.go('app.login');
		} 
		
		  
		 $scope.updateLocation = function(){
			var location_name 		= angular.element(document.getElementById("location_name")).val();  
			var location_address 	= angular.element(document.getElementById("location_address")).val();
			var location_latitude 	= angular.element(document.getElementById("hidden_latitude")).val();
			var location_logitude 	= angular.element(document.getElementById("hidden_logitude")).val();
			var phone_number 	    = angular.element(document.getElementById("phone_number")).val();
			
			if(location_latitude =="" && location_logitude==""){
				location_latitude = angular.element(document.getElementById("location_latitude")).val();
				location_logitude = angular.element(document.getElementById("location_logitude")).val();
			} 
			
			if(location_name.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter location name.'
				});
			}
			else if(location_address.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter address.'
				});
			} 
			else{
				 CommonService.updateLocation(location_id,location_name,location_address,location_latitude,location_logitude,phone_number);
				 $timeout(function() {
					$state.go('app.allLocations');
				 }, 2000); 
			} 
		}
		
		 $scope.toggleCustom = function() {
			 var location_address = angular.element(document.getElementById("location_address")).val();  
			 if(location_address.trim()==""){ 
				$ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter address.'
				});
			}
			else{
				/* for get latitude and logitude of entered address */
				var latitde = "";
				var longitde = "";
				$http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=get_lat_long&location_address='+location_address+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						latitde  = value.lat;
						longitde = value.lng;
						
						$scope.latitud  = latitde;
						$scope.longitud = longitde;
						
						/* for show address on google map */
						var myCenter = new google.maps.LatLng(latitde,longitde); 
					    /* var myCenter = new google.maps.LatLng(52.5888364,-0.2499739);  */
						var mapCanvas = document.getElementById("map");
						var mapOptions = {center: myCenter, zoom: 17};
						var map = new google.maps.Map(mapCanvas, mapOptions);
						var marker = new google.maps.Marker({position:myCenter});
						marker.setMap(map);
						/* end show address on google map */
					});
				});
			}
        };
		
		$scope.workingTimePickup = function(){
			$state.go('app.workingTimePickup',{'location_id':location_id});
		}	

		$scope.deliveryCharges = function(){
			$state.go('app.deliveryCharges',{'location_id':location_id});
		}	
		
		$scope.addDeliveryCharges = function(){
			$state.go('app.addDeliveryCharges');
		}

		$scope.postCodeExc = function(){ 
			$state.go('app.postCodeExc',{'location_id':location_id});
		}			

   }) 
   		 
	 /* for show google map */
	 if(get_latitude!='' && get_longitude!=''){
		var myCenter = new google.maps.LatLng(get_latitude,get_longitude);
		var mapCanvas = document.getElementById("map");
		var mapOptions = {center: myCenter, zoom: 17};
		var map = new google.maps.Map(mapCanvas, mapOptions);
		var marker = new google.maps.Marker({position:myCenter});
		marker.setMap(map);
	 }
	/* end show google map */
	   
    $scope.isOpen = [
		{value:'0', name:'No'},
		{value:'1', name:'Yes'}
	  ]; 
})


.controller('workingTimePickupCtrl', function($scope,$http,$rootScope,$state,$ionicLoading,$timeout,$location,$ionicPopup,$window,$stateParams,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName = localStorage.getItem("db_name");
		var location_id  = $stateParams.location_id; 
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			CommonService.getWorikingTime(location_id,'pickup');
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.wrkingTimePickup = function(){
			$state.go('app.workingTimePickup',{'location_id':location_id});
		}	
		
		$scope.wrkingTimeDelivery = function(){
			$state.go('app.workingTimeDelivery',{'location_id':location_id});
		}
		
		$scope.viewPickupTimeDetail = function(locationId,time_from,time_to,day_off,day_name){
			$state.go('app.viewPickupTimeDetail',{'location_id':locationId,'time_from':time_from,'time_to':time_to,'day_off':day_off,'day_name':day_name});
		} 
   })   
}) 


.controller('workingTimeDeliveryCtrl', function($scope,$http,$rootScope,$state,$ionicLoading,$timeout,$location,$ionicPopup,$window,$stateParams,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName = localStorage.getItem("db_name");
		var location_id  = $stateParams.location_id; 
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			CommonService.getWorikingTime(location_id,'delivery');
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.wrkingTimePickup = function(){
			$state.go('app.workingTimePickup',{'location_id':location_id});
		}	
		
		$scope.wrkingTimeDelivery = function(){
			$state.go('app.workingTimeDelivery',{'location_id':location_id});
		} 
		
		$scope.viewDeliveryTimeDetail = function(locationId,time_from,time_to,day_off,day_name){
			$state.go('app.viewDeliveryTimeDetail',{'location_id':locationId,'time_from':time_from,'time_to':time_to,'day_off':day_off,'day_name':day_name});
		}
   })   
}) 

.controller('viewPickupTimeDetailCtrl', function($scope,$http,$rootScope,$state,$ionicLoading,$timeout,$location,$ionicPopup,$window,$stateParams,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');
		var dbName       = localStorage.getItem("db_name");
		var location_id  = $stateParams.location_id; 
		var time_from    = $stateParams.time_from; 
		var time_to      = $stateParams.time_to; 
		var day_off      = $stateParams.day_off;  
		var day_name     = $stateParams.day_name;  
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			CommonService.getWorikingTimeDetail(location_id,time_from,time_to,day_off,day_name);
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.wrkingTimePickup = function(){ 
			$state.go('app.workingTimePickup',{'location_id':location_id});
		}
		
		$scope.wrkingTimeDelivery = function(){ 
			$state.go('app.workingTimeDelivery',{'location_id':location_id});
		}
		   
		$scope.updatePikupTime = function(){
			var day_name 		    = angular.element(document.getElementById("day_name")).val();  
			var start_time_hours 	= angular.element(document.getElementById("start_time_hours")).val();
			var start_time_minutes 	= angular.element(document.getElementById("start_time_minutes")).val();
			var end_time_hours 	    = angular.element(document.getElementById("end_time_hours")).val();
			var end_time_minutes    = angular.element(document.getElementById("end_time_minutes")).val();
			var day_off_value 		= angular.element(document.getElementById("day_off_value")).val();  
			
			 if(day_off_value == "true"){
				 start_time_hours   = "00";
				 start_time_minutes = "00";
				 end_time_hours     = "00";
				 end_time_minutes   = "00";
			 }
		  
			CommonService.updatePikupTime(location_id,day_name,start_time_hours,start_time_minutes,end_time_hours,end_time_minutes,day_off_value);
			 $timeout(function() {
				$state.go('app.workingTimePickup',{'location_id':location_id});
			 }, 2000); 
		}
		   
		$scope.timeHours = [
			{value:'00', name:'00'},
			{value:'01', name:'01'},
			{value:'02', name:'02'},
			{value:'03', name:'03'},
			{value:'04', name:'04'},
			{value:'05', name:'05'},
			{value:'06', name:'06'},
			{value:'07', name:'07'},
			{value:'08', name:'08'},
			{value:'09', name:'09'},
			{value:'10', name:'10'},
			{value:'11', name:'11'},
			{value:'12', name:'12'},
			{value:'13', name:'13'},
			{value:'14', name:'14'},
			{value:'15', name:'15'},
			{value:'16', name:'16'},
			{value:'17', name:'17'},
			{value:'18', name:'18'},
			{value:'19', name:'19'},
			{value:'20', name:'20'},
			{value:'21', name:'21'},
			{value:'22', name:'22'},
			{value:'23', name:'23'}
		  ];
		  
		$scope.timeSeconds = [
			{value:'00', name:'00'},
			{value:'05', name:'05'},
			{value:'10', name:'10'},
			{value:'15', name:'15'},
			{value:'20', name:'20'},
			{value:'25', name:'25'},
			{value:'30', name:'30'},
			{value:'35', name:'35'},
			{value:'40', name:'40'},
			{value:'45', name:'45'},
			{value:'50', name:'50'},
			{value:'55', name:'55'}
		  ];
   })   
}) 


.controller('viewDeliveryTimeDetailCtrl', function($scope,$http,$rootScope,$state,$ionicLoading,$timeout,$location,$ionicPopup,$window,$stateParams,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');   // get local storage
		var dbName       = localStorage.getItem("db_name");
		var location_id  = $stateParams.location_id; 
		var time_from    = $stateParams.time_from; 
		var time_to      = $stateParams.time_to; 
		var day_off      = $stateParams.day_off;  
		var day_name      = $stateParams.day_name;  
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			CommonService.getWorikingTimeDetail(location_id,time_from,time_to,day_off,day_name);
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
		
		$scope.wrkingTimePickup = function(){ 
			$state.go('app.workingTimePickup',{'location_id':location_id});
		}
		
		$scope.wrkingTimeDelivery = function(){ 
			$state.go('app.workingTimeDelivery',{'location_id':location_id});
		}
		 
		$scope.updateDeliverytime = function(){
			var day_name 		    = angular.element(document.getElementById("day_name")).val();  
			var start_time_hours 	= angular.element(document.getElementById("start_time_hours")).val();
			var start_time_minutes 	= angular.element(document.getElementById("start_time_minutes")).val();
			var end_time_hours 	    = angular.element(document.getElementById("end_time_hours")).val();
			var end_time_minutes    = angular.element(document.getElementById("end_time_minutes")).val();
			var day_off_value 		= angular.element(document.getElementById("day_off_value")).val();  
			
			 if(day_off_value == "true"){
				 start_time_hours   = "00";
				 start_time_minutes = "00";
				 end_time_hours     = "00";
				 end_time_minutes   = "00";
			 }
		  
			CommonService.updateDeliveryTime(location_id,day_name,start_time_hours,start_time_minutes,end_time_hours,end_time_minutes,day_off_value);
			 $timeout(function() {
				$state.go('app.workingTimeDelivery',{'location_id':location_id});
			 }, 2000);
		} 
		   
		$scope.timeHours = [
			{value:'00', name:'00'},
			{value:'01', name:'01'},
			{value:'02', name:'02'},
			{value:'03', name:'03'},
			{value:'04', name:'04'},
			{value:'05', name:'05'},
			{value:'06', name:'06'},
			{value:'07', name:'07'},
			{value:'08', name:'08'},
			{value:'09', name:'09'},
			{value:'10', name:'10'},
			{value:'11', name:'11'},
			{value:'12', name:'12'},
			{value:'13', name:'13'},
			{value:'14', name:'14'},
			{value:'15', name:'15'},
			{value:'16', name:'16'},
			{value:'17', name:'17'},
			{value:'18', name:'18'},
			{value:'19', name:'19'},
			{value:'20', name:'20'},
			{value:'21', name:'21'},
			{value:'22', name:'22'},
			{value:'23', name:'23'}
		  ];
		  
		$scope.timeSeconds = [
			{value:'00', name:'00'},
			{value:'05', name:'05'},
			{value:'10', name:'10'},
			{value:'15', name:'15'},
			{value:'20', name:'20'},
			{value:'25', name:'25'},
			{value:'30', name:'30'},
			{value:'35', name:'35'},
			{value:'40', name:'40'},
			{value:'45', name:'45'},
			{value:'50', name:'50'},
			{value:'55', name:'55'}
		  ];
   })   
}) 
  
.controller('deliveryChargesCtrl', function($scope,$http,$rootScope,$state,$ionicLoading,$timeout,$location,$ionicPopup,$window,$stateParams,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		 /* for loading every time when view load  */
		$scope.user_id  = localStorage.getItem('user_id');   /* get local storage */
		var dbName      = localStorage.getItem("db_name");
		var location_id = $stateParams.location_id;  
		var api_url     = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$scope.errMsg = "";
			$http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=get_delivery_charges&location_id='+location_id+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.id!='' && value.id!=null && value.id!=undefined ){
						$scope.items.push({ id: value.id,location_id: value.location_id,total_from: value.total_from,total_to:value.total_to,price:value.price,total_amount:value.total_amount,msg: items.msg});  
					}
				});
				
				if ( items.msg == "no record found" ) {
					$scope.errMsg = items.msg;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/locations_api.php?page='+$scope.page+'&action=get_delivery_charges&location_id='+location_id+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.id!='' && value.id!=null && value.id!=undefined ){
							$scope.items.push({ id: value.id,location_id: value.location_id,total_from: value.total_from,total_to:value.total_to,price:value.price,total_amount:value.total_amount,msg: items.msg});  
						} 					
					});
					if ( items.msg == "no record found" ) { 
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		}  
	 
		$scope.deleteDeliveryCharge =function(del_id,locId){ 
			var confirmPopup = $ionicPopup.confirm({
			 title: 'Confirmation',
			 template: 'Are you sure you want to delete this delivery charges?'
		   });

		   confirmPopup.then(function(res) {
			 if(res) {
			   $http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=delete_delivery_charges&del_id='+del_id+'&location_id='+locId+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.msg=="success"){
							$ionicPopup.alert({
								title: 'success!',
								template: 'Deleted successfully.'
							});
						} 
						/* $window.location.reload(true) */
					});
				}); 
				 $timeout(function() {
					 $state.go('app.deliveryCharges', null, {'location_id':locId,reload: true}); 
				  }, 2000);				
			 } else {
			   console.log('You are not sure');
			 }
		   }); 
		}
		  
		$scope.editDeliveryCharge = function(del_Id,loc_id){
			$state.go('app.editDeliveryCharge',{'del_id':del_Id,'location_id':location_id});
		}
		 	  
		$scope.addDeliveryCharges = function(){
			$state.go('app.addDeliveryCharges',{'location_id':location_id});
		}
   })   
}) 

.controller('addDeliveryChargesCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage 
		var dbName = localStorage.getItem("db_name");
		var location_id  = $stateParams.location_id;  
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
		}else{
			$state.go('app.login');
		} 
		
		  $scope.saveDeliveryCharges = function(form){
			var distance_from 	= angular.element(document.getElementById("distance_from")).val().trim();  
			var distance_to 	= angular.element(document.getElementById("distance_to")).val().trim();
			var delivery_price 	= angular.element(document.getElementById("delivery_price")).val().trim();
			var delivery_free 	= angular.element(document.getElementById("delivery_free")).val().trim(); 
			
			/* alert('location_id '+location_id+' distance_from '+distance_from+' distance_to '+distance_to+' delivery_price '+delivery_price+' delivery_free '+delivery_free);  */
			
			if(distance_from == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter distance(From)."
				});
			}else if(distance_to == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter distance(To)."
				});
			}
			else if(delivery_price == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter delivery price."
				});
			}
			else{ 
				CommonService.saveDeliveryCharges(location_id,distance_from,distance_to,delivery_price,delivery_free);
				 $timeout(function() {
					$state.go('app.deliveryCharges',{'location_id':location_id});
				 }, 2000); 
			}  
		} 
	})  
}) 

.controller('updateDeliveryChargeCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   /* get local storage */
		var del_id 	     = $stateParams.del_id; 
		var location_id  = $stateParams.location_id; 
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
  
			 CommonService.editDeliveryCharge(del_id,location_id);
		}else{
			$state.go('app.login');
		}  
		  
		$scope.updateDeliveryCharge = function(form){ 
			var distance_from 	= angular.element(document.getElementById("distance_from")).val().trim();  
			var distance_to 	= angular.element(document.getElementById("distance_to")).val().trim();
			var delivery_price 	= angular.element(document.getElementById("delivery_price")).val().trim();
			var delivery_free 	= angular.element(document.getElementById("delivery_free")).val().trim(); 
			
			if(distance_from == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter distance(From)."
				});
			}else if(distance_to == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter distance(To)."
				});
			}
			else if(delivery_price == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter delivery price."
				});
			}
			else{  
				CommonService.updateDeliveryCharge(del_id,location_id,distance_from,distance_to,delivery_price,delivery_free);  
				$timeout(function(){
					$state.go('app.deliveryCharges',{'location_id':location_id});
				}, 2000);  
			}
		} 
   }) 
})

.controller('postCodeExcCtrl', function($scope,$http,$rootScope,$state,$ionicLoading,$timeout,$location,$ionicPopup,$window,$stateParams,CommonService) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id  = localStorage.getItem('user_id');
		var dbName      = localStorage.getItem("db_name");
		var location_id = $stateParams.location_id;  
		var api_url     = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$scope.errMsg = "";
			var checkRecord = "";
			$http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=get_post_code_exc&location_id='+location_id+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.id!='' && value.id!=null && value.id!=undefined ){
						checkRecord =1;
						
						$scope.items.push({ id: value.id,location_id: value.location_id,postcode_part1: value.postcode_part1,postcode_part2:value.postcode_part1,price:value.price,total_amount:value.total_amount,msg: items.msg});  
					}
				});
				if ( items.msg == "no record found" ) {
					$scope.errMsg = items.msg;
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){ 
				$http.get(api_url+'/mobileapp/locations_api.php?page='+$scope.page+'&action=get_post_code_exc&location_id='+location_id+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.id!='' && value.id!=null && value.id!=undefined ){
							$scope.items.push({ id: value.id,location_id: value.location_id,postcode_part1: value.postcode_part1,postcode_part2:value.postcode_part1,price:value.price,total_amount:value.total_amount,msg: items.msg});   
						}
					});
					
					if ( items.msg == "no record found" ) { 
						$scope.noMoreItemsAvailable = true;
					} 
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 
	 
	 
		$scope.deletePostCodeExc =function(del_id,locId){ 
		   var confirmPopup = $ionicPopup.confirm({
			 title: 'Confirmation',
			 template: 'Are you sure you want to delete this delivery charges?'
		   });

		   confirmPopup.then(function(res) {
			 if(res) {
			   $http.get(api_url+'/mobileapp/locations_api.php?page='+1+'&action=delete_post_code_exec&del_id='+del_id+'&location_id='+locId+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.msg=="success"){
							$ionicPopup.alert({
								title: 'success!',
								template: 'Deleted successfully.'
							});
						} 
						/* $window.location.reload(true) */
					});
				}); 
				 $timeout(function() {
					 $state.go('app.postCodeExc', null, {'location_id':locId,reload: true}); 
				  }, 2000);	
			 } else {
			   console.log('You are not sure');
			 }
		   }); 
		}
		  
		$scope.editPostCodeExec = function(del_Id,loc_id){
			$state.go('app.editPostCodeExc',{'del_id':del_Id,'location_id':location_id});
		}
		 	  
		$scope.addPostCodeExec = function(){
			$state.go('app.addPostCodeExec',{'location_id':location_id});
		}	  
   })   
}) 

.controller('addPostCodeExecCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope) { 
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id = localStorage.getItem('user_id');   /* get local storage  */
		var dbName = localStorage.getItem("db_name");
		var location_id = $stateParams.location_id;  
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
		}else{
			$state.go('app.login');
		} 
		
		  $scope.savePostCodeExec = function(){
			var postcode_part1 	= angular.element(document.getElementById("postcode_part1")).val().trim();  
			var postcode_part2 	= angular.element(document.getElementById("postcode_part2")).val().trim();
			var delivery_price 	= angular.element(document.getElementById("delivery_price")).val().trim();
			var delivery_free 	= angular.element(document.getElementById("delivery_free")).val().trim(); 
			
			if(postcode_part1 == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter postcode part1"
				});
			}else if(postcode_part2 == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter postcode part2"
				});
			}
			else if(delivery_price == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter delivery price"
				});
			}
			else{
				CommonService.savePostCodeExec(location_id,postcode_part1,postcode_part2,delivery_price,delivery_free);  
				 $timeout(function(){
					$state.go('app.postCodeExc',{'location_id':location_id});
				 }, 2000);  
			} 
		} 
	})  
}) 
 
.controller('updatePostCodeExecCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');
		var del_id 	     = $stateParams.del_id; 
		var location_id  = $stateParams.location_id; 
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
  
			 CommonService.editPostCodeExec(del_id,location_id);
		}else{
			$state.go('app.login');
		}  
		  
		$scope.updatePostCodeExec = function(form){ 
			var postcode_part1 	= angular.element(document.getElementById("postcode_part1")).val();  
			var postcode_part2 	= angular.element(document.getElementById("postcode_part2")).val();
			var delivery_price 	= angular.element(document.getElementById("delivery_price")).val();
			var delivery_free 	= angular.element(document.getElementById("delivery_free")).val(); 
			
			if(postcode_part1.trim() == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter postcode part1"
				});
			}else if(postcode_part2.trim() == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter postcode part2"
				});
			}
			else if(delivery_price.trim() == ""){
				$ionicPopup.alert({
					title: 'Error!',
					template: "Please enter delivery price"
				});
			}
			else{
				CommonService.updatePostCodeExec(del_id,location_id,postcode_part1,postcode_part2,delivery_price,delivery_free);  
				 $timeout(function(){
					$state.go('app.postCodeExc',{'location_id':location_id});
				 }, 2000);  
			} 
		}  
   }) 
})

.controller('addUserCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope,$window) {
	$scope.$on('$ionicView.beforeEnter', function() {
		var api_url    = localStorage.getItem('api_url');
		$scope.user_id = localStorage.getItem('user_id');
		var dbName = localStorage.getItem("db_name");
		var dbId   = localStorage.getItem("db_id");
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			 CommonService.removePresetPrivileges();  
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			
			CommonService.getUserCount(); /* for check admin has added 3 users or not */
			CommonService.getPrivileges(); /* for get privileges assigned by user admin to tao admin */
		}else{
			$state.go('app.login');
		} 
		 
		var selected_privileges = "";
		var selected_privileges_arr = []; 
		$scope.addPrivileges = function(event,privileges_name,original_name) {
		  if(event.target.checked == true){ 
				 selected_privileges = selected_privileges+original_name+', ';
			}else{
				selected_privileges = selected_privileges+original_name+', ';
				
				var find_value = original_name;
				
				if(selected_privileges.includes(find_value) ==  true){
					var new_array = "";
					selected_privileges_arr = selected_privileges.split(', '); 
					
					angular.forEach(selected_privileges_arr, function(value, key){
						 if(value.trim()!="" && value != find_value){
							new_array =  new_array+value+', ';
						 }
					 });
				   selected_privileges = "";
				   selected_privileges = new_array;
				   console.log('new_array '+selected_privileges);
				}
			}
		};
		
		 
		/* var selected_privileges = "";
		$http.get(api_url+'/mobileapp/user_api.php?page='+1+'&action=get_user_privileges&user_id='+editUserId+'&db_id='+dbId+'&db_name='+db_name).success(function(items) {
			angular.forEach(items, function(value, key) { 
				selected_privileges = selected_privileges+value;
			});
			
			var selected_privileges_arr = []; 
			$scope.addPrivileges = function(event,privileges_name,original_name){
				if(event.target.checked == true){ 
					  selected_privileges = selected_privileges+original_name+', ';
					  console.log('add '+selected_privileges);
				}else{
					selected_privileges = selected_privileges+original_name+', ';
					var find_value = original_name;
					
					if(selected_privileges.includes(find_value) ==  true){
						var new_array = "";
						selected_privileges_arr = selected_privileges.split(', '); 
						angular.forEach(selected_privileges_arr, function(value, key){
							 if(value.trim()!="" && value != find_value){
								new_array =  new_array+value+', ';
							 }
						 });
					   selected_privileges = "";
					   selected_privileges = new_array;
					}
				}
			};
		}); */
		
		/* var preset_privileges = "";
		var preset_privileges_arr = []; 
		$scope.selectPresetPrivileges = function(event,privileges_name,original_name) { 
			if(event.target.checked == true){ 
				console.log('checked');
				CommonService.getPresetPrivileges();
			}else{
				CommonService.removePresetPrivileges();
			}
		}; */
		
		 $timeout(function() {
			   /* console.log('sdad selectPreset1 '+$scope.selectPreset1.checked);  */
			   CommonService.removePresetPrivileges();  
				/*  if($scope.selectPreset1.checked == true){ 
				    CommonService.getPresetPrivileges(); 
					   $scope.selected_privileges = selected_privileges+$scope.presetPrivileges; 
					
					  	 console.log('checked true selected_privileges '+$scope.selected_privileges);
					  	 console.log('checked true presetPrivileges '+$scope.presetPrivileges); 
				 }else{
					  $scope.selected_privileges = selected_privileges; 
					 
					
					 console.log('false checked true  '+$scope.selected_privileges);
					 
					 $timeout(function() {
						CommonService.removePresetPrivileges();  
						console.log('checked timeout '+$scope.selected_privileges);
						
						$ionicLoading.show({
							content: 'Loading',
							animation: 'fade-in',
							showBackdrop: true,
							maxWidth: 200,
							showDelay: 0
						  });
						$timeout(function () {
							$ionicLoading.hide();
						}, 1000); 
					  }, 1000);  
				 } 
				 */
			}, 1000);  
			
		 
		$scope.selectPresetPrivileges = function() {
			/* console.log('Push Notification Change', $scope.pushNotification.checked); */
			
			if($scope.selectPreset.checked == true){ 
				/* console.log('checked '+$scope.pushNotification.checked); */
				CommonService.getPresetPrivileges(); 
				 
			}else{
				CommonService.removePresetPrivileges();
                /* console.log('else checked '+$scope.pushNotification.checked); */
			}
		  };
		  
		$scope.selectPreset = { checked: false };
		/* $scope.emailNotification = 'Subscribed'; */
  
  
	/* 	 $scope.toggleChange = function(item) {
			  if (item.checked == true) {
				  for(var index = 0; index < $scope.item.length; ++index)
					  $scope.item[index].checked = false;
				  item.checked = true;
				  console.log('item.checked '+item.checked);
			  } else {
				item.checked = false
				 console.log('item.checked '+item.checked);
			  }
		}; */
		
		
			
		$scope.saveUser = function(form){
			var user_name      = angular.element(document.getElementById("user_name")).val().trim();
			var user_password  = angular.element(document.getElementById("user_password")).val().trim();
			var email_address  = angular.element(document.getElementById("email_address")).val().trim(); 
			 
			  /* angular.forEach($scope.items, function(item) {
					console.log('item '+item.checked);
				});
				 */
 
 	 
				$scope.errMsg ="";
				var presetOption = "";		 
				if($scope.selectPreset.checked == true){ 
					$http.get(api_url+'/mobileapp/user_api.php?action=get_preset_privileges&db_name='+dbName+'&db_id='+dbId).success(function(items) {
						angular.forEach(items, function(value, key) {
							 /* console.log('msg '+value);   */
							if(value!='' && value!=null && value!=undefined ){
								/* $scope.items.push({ selected_options:value}); */
								presetOption += value;
								
							} 
							
						}); 
						 /* console.log('presetOption '+presetOption);   */
						 /* console.log('new_array '+selected_privileges+presetOption); */
						 /* selected_privileges+presetOption; */
						console.log('presetOption '+selected_privileges+presetOption);
						presetOption = selected_privileges+presetOption;
						console.log('  ---  presetOption '+presetOption);
						if(form.$valid ) {
							/* if(selected_privileges.trim()==""){
								$ionicPopup.alert({
									title: 'Error!',
									template: 'Please select atleast one option from privileges.'
								});
							}else{ */
								  console.log(' if presetOption '+presetOption); 
								  
								 CommonService.saveUser(user_name,user_password,email_address,presetOption,$scope.selectPreset.checked);
								    
								 $timeout(function() {
									 $state.go('app.getUsers', null, {reload: true}); 
								  }, 2000);	 		  
							/* } */
						}

					});
					
				}else{
					if(form.$valid ) {
						if(selected_privileges.trim()==""){
							$ionicPopup.alert({
								title: 'Error!',
								template: 'Please select atleast one option from privileges.'
							});
						}else{
							console.log('else presetOption '+selected_privileges);
							CommonService.saveUser(user_name,user_password,email_address,selected_privileges);
							  
							 $timeout(function() {
								 $state.go('app.getUsers', null, {reload: true}); 
							  }, 2000);		 		  
						}
					}
				}
				
				
				
				
				
				/*  var modelNames = [];
				 var aletrMsg= '';
				 angular.forEach($scope.item, function(itm) {
					  console.log('angular '+$scope.item);
					if (itm.selected) {
						modelNames.push(itm);
						aletrMsg += 'Brand : '+ itm.name;
					}
				 }); */
				/* alert(modelNames.length ? aletrMsg : 'No phones selected!'); */
				
				/* 
				var message = "";
				console.log('length '+$scope.slectdItems.length);
                for (var i = 0; i < $scope.slectdItems.length; i++) {
					 console.log('for ');
                    if ($scope.item[i].Selected) {
						 console.log('Selected ');
                        var fruitId = $scope.item[i].id;
                        var fruitName = $scope.item[i].itm.name;
                        message += "Value: " + fruitId + " Text: " + fruitName + "\n";
                    }
                }
					console.log('message '+message);
				*/
 
	
			 
			 
			 	/* selected_privileges = $scope.presetPrivileges; */
				   /* console.log('form selected_privileges '+presetOption);  */
		 /* 	if(form.$valid ) {
				if(selected_privileges.trim()=="" && $scope.selectPreset.checked == false){
					$ionicPopup.alert({
						title: 'Error!',
						template: 'Please select atleast one option from privileges.'
					});
				}else{
					 CommonService.saveUser(user_name,user_password,email_address,selected_privileges); 
					  
					 $timeout(function() {
						 $state.go('app.getUsers', null, {reload: true}); 
					  }, 2000);					  
				}
			}  */
		}
		
		$scope.getUsers = function(){
			$state.go('app.getUsers');
		};
	})  
})

.controller('getUsersCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$rootScope,$window) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id  = localStorage.getItem('user_id');
		var dbName      = localStorage.getItem("db_name");
		var dbId        = localStorage.getItem("db_id");
		var location_id = $stateParams.location_id;  
		var api_url     = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
			 
			 
			/* for fetch orders on load page */
			$scope.errMsg ="";
			$http.get(api_url+'/mobileapp/user_api.php?action=get_users&db_name='+dbName+'&db_id='+dbId).success(function(items) {
				angular.forEach(items, function(value, key) {
					 console.log('msg '+items.msg);  
					if(value.id!='' && value.id!=null && value.id!=undefined ){
						$scope.items.push({ id:value.id,user_id:value.user_id,privileges:value.privileges,user_name:value.user_login,user_email:value.user_email,msg: items.msg});
					}else{
						$scope.errMsg = items.msg;
					}
				}); 
			});
			
			$scope.items = []; 
			
			/* end fetch orders on load page */
			
				$scope.showPopup = function(usrId) {
				   var confirmPopup = $ionicPopup.confirm({
					 title: 'Confirmation',
					 template: 'Are you sure you want to delete this user?'
				   });

				   confirmPopup.then(function(res) {
					 if(res) {
					   $http.get(api_url+'/mobileapp/user_api.php?page='+1+'&action=delete_user&user_id='+usrId+'&db_name='+dbName+'&db_id='+dbId).success(function(items) {
							angular.forEach(items, function(value, key) {
								if(value.msg=="success"){
									$ionicPopup.alert({
										title: 'success!',
										template: 'User deleted successfully.'
									});
								} 
							});
						});
						
						 
						 $timeout(function() {
							 $state.go('app.getUsers', null, {reload: true}); 
						 }, 2000);
					 } else {
					   console.log('You are not sure');
					 }
				   }); 	
			   }
			   
			   $scope.editUser=function(eId,userId){
				  /* $state.go('app.editUser',{'uId':userId});  */
				  $state.go('app.editUser',{'uId':userId,reload: true});
			   }
			   
			    $scope.addUser = function(){
					/* $state.go('app.addUser'); */
					 $state.go('app.addUser', null, {reload: true}); 
				};
		}else{
			$state.go('app.login');
		}  
   })   
})

.controller('updateUsersCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$window) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var location_id  = $stateParams.location_id; 
		var editUserId   = $stateParams.uId;
		var dbId  		 = localStorage.getItem("db_id"); 
		var db_name  	 = localStorage.getItem("db_name");  
		var api_url      = localStorage.getItem('api_url');
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
   
			CommonService.getPrivileges(); /* for get privileges assigned by user admin to tao admin */
			CommonService.editUser(editUserId); 
		}else{
			$state.go('app.login');
		}  
		 
		var selected_privileges = "";
		$http.get(api_url+'/mobileapp/user_api.php?page='+1+'&action=get_user_privileges&user_id='+editUserId+'&db_id='+dbId+'&db_name='+db_name).success(function(items) {
			angular.forEach(items, function(value, key) { 
				selected_privileges = selected_privileges+value;
			});
			
			if(selected_privileges.trim()!=""){
				 selected_privileges = selected_privileges+', ';  
			}
			
			var selected_privileges_arr = []; 
			$scope.addPrivileges = function(event,privileges_name,original_name){
				if(event.target.checked == true){ 
					  selected_privileges = selected_privileges+original_name;
					  console.log('add '+selected_privileges);
				}else{
					selected_privileges = selected_privileges+original_name;
					var find_value = original_name;
					
					 console.log(' remove '+find_value+' selected_privileges '+selected_privileges.includes(find_value));
					if(selected_privileges.includes(find_value) ==  true){
						var new_array = "";
						selected_privileges_arr = selected_privileges.split(', '); 
						angular.forEach(selected_privileges_arr, function(value, key){
							 if(value.trim()!="" && value != find_value){
								new_array =  new_array+value+', ';
							 }
						 });
					   selected_privileges = "";
					   selected_privileges = new_array;
					   
					   console.log('remove '+selected_privileges);
					}
				}
			};
			
			$scope.selected_privileges = selected_privileges+$scope.presetPrivileges;
			 
			     console.log('timeout selectPreset1 '+$scope.selectPreset1.checked);  
			     console.log('timeout presetCheck '+$scope.presetCheck);  
				 if($scope.presetCheck == 0 ||  $scope.presetCheck == "" || $scope.presetCheck==null || $scope.presetCheck==undefined){
					 console.log('if presetCheck '+$scope.presetCheck);
					 $scope.selectPreset1 = {checked : false};
				 }
				 if($scope.selectPreset1.checked == true){ 
				  console.log('timeout true ');  
				    CommonService.getPresetPrivileges(); 
					   $scope.selected_privileges = selected_privileges+$scope.presetPrivileges;
					  	 console.log('checked true selected_privileges '+$scope.selected_privileges);
					  	 console.log('checked true presetPrivileges '+$scope.presetPrivileges); 
				 }else{
					  $scope.selected_privileges = selected_privileges; 
					 console.log('false checked '+$scope.selected_privileges);
					 CommonService.removePresetPrivileges();  
					 $timeout(function() {
						CommonService.removePresetPrivileges();  
						console.log('checked timeout '+$scope.selected_privileges);
						
						$ionicLoading.show({
							content: 'Loading',
							animation: 'fade-in',
							showBackdrop: true,
							maxWidth: 200,
							showDelay: 0
						  });
						$timeout(function () {
							$ionicLoading.hide();
						}, 1000); 
					  }, 1000);  
				  
				 }
			
			console.log('preeeeeeee '+$scope.selectPreset1.checked);
			if($scope.selectPreset1.checked == false){
				$scope.selectPreset1 = { checked: false };
				console.log('preeeeeeee falseddd '+$scope.selectPreset1);
			}else{
				$scope.selectPreset1 = { checked: true };
				console.log('preeeeeeee trueddd '+$scope.selectPreset1);
			}
		}); 
		
		
		CommonService.getPresetPrivileges(); 
		
		$scope.selectPresetPrivileges1 = function() {
			/* console.log('Push Notification Change', $scope.pushNotification.checked); */
			var presetOptns_arr = []; 
			var new_array1 = ''; 
			/* console.log('asdsada '+$scope.selectPreset1); */
			if($scope.selectPreset1.checked == true){ 
				/* console.log('checked '+$scope.pushNotification.checked); */
				CommonService.getPresetPrivileges(); 
				$timeout(function() {
					$scope.selected_privileges = selected_privileges+$scope.presetPrivileges;
					console.log('checked  selected_privileges '+$scope.selected_privileges);
					
					$ionicLoading.show({
							content: 'Loading',
							animation: 'fade-in',
							showBackdrop: true,
							maxWidth: 200,
							showDelay: 0
						  });
						$timeout(function () {
							$ionicLoading.hide();
						}, 1500); 
				  }, 1500);
			}else{ 
				/* console.log('presetPrivileges '+$scope.presetPrivileges);  */
				/* console.log('selected_privileges '+selected_privileges);  */
				var presetOptns = $scope.presetPrivileges;
				presetOptns_arr = presetOptns.split(', '); 
				selected_privileges_Arry = selected_privileges.split(', '); 
				angular.forEach(selected_privileges_Arry, function(value, key){ 
					  /* console.log('value '+value+' presetOptns '+presetOptns+' includes '+presetOptns.includes(value));  */
					  if(presetOptns.includes(value) ==  true){  
						  /* console.log('found '+value);   */ 
					 }else{
						  new_array1 =  new_array1+value+', '; 
					 } 
				 });
				 
				 console.log('new_array1 '+new_array1);  
				  
				 $scope.selected_privileges = "";
				 $scope.selected_privileges = new_array1;
				 selected_privileges  = new_array1;
				  
				 console.log(' new selected_privileges '+ $scope.selected_privileges); 
				 CommonService.removePresetPrivileges();  
				/* console.log('removePresetPrivileges '+selected_privileges);  */
                /* console.log('else checked '+$scope.pushNotification.checked); */
				
				 
			}
		  };
		  
		$scope.updateUser = function(form){ 
			var user_name      = angular.element(document.getElementById("user_name1")).val().trim();
			var user_password  = angular.element(document.getElementById("user_password1")).val().trim();
			var email_address  = angular.element(document.getElementById("email_address1")).val().trim(); 
			var EMAIL_REGEXP   = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
			/* console.log('presetOption '+selected_privileges);  */
			/* console.log('presetOption '+selected_privileges+$scope.presetPrivileges);  */
			var privlegs_options = "";
			 /* alert('updateUser '+' email_address '+email_address+' validat '+EMAIL_REGEXP.test(email_address)); */
			 if(user_name.trim()==""){
				 $ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter username.'
				});
			 }else if(email_address.trim()==""){
				 $ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter email address.'
				});
			 }
			else if(email_address.trim()!="" && EMAIL_REGEXP.test(email_address)== false){
				 $ionicPopup.alert({
					title: 'Error!',
					template: 'Please enter valid email address.'
				});
			 }   
			 else{
				if(selected_privileges!=""){
					privlegs_options = selected_privileges+', '+$scope.presetPrivileges;
				}else{
					privlegs_options = selected_privileges+$scope.presetPrivileges;
				}
				
				var lastChar = privlegs_options.slice(-1);
				if (lastChar == ', ') {
					privlegs_options = privlegs_options.slice(0, -1);
					console.log('lastChar '+privlegs_options);  
				}
					 
				/*  console.log('update '+selected_privileges);  
				  console.log('presetPrivileges '+privlegs_options);   */
				 /* alert('privlegs_options '+privlegs_options) */
				  
				 if(privlegs_options.trim()=="" && $scope.selectPreset1.checked==false){
					$ionicPopup.alert({
						title: 'Error!',
						template: 'Please select atleast one option from privileges.'
					});
				}else{
					 console.log(' selectPreset1 '+$scope.selectPreset1.checked+' privlegs_options '+privlegs_options); 
					 CommonService.updateUser(editUserId,user_name,user_password,email_address,privlegs_options,$scope.selectPreset1.checked); 
					 $timeout(function() {
						 $state.go('app.getUsers', null, {reload: true}); 
					  }, 2000);
				}  
			} 
		}
   }) 
})

.controller('userLogOffCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$window,$location) { 
	$scope.$on('$ionicView.beforeEnter', function(){ 
		$scope.user_id = localStorage.getItem('user_id');   // get local storage 
		var dbId       = localStorage.getItem("db_id"); 
		var db_name    = localStorage.getItem("db_name");  
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
   
			CommonService.getloggedOffUser(); 
			  
			$scope.switchUser = function() {
				 $state.go('app.switchUser', null, {reload: true}); 
			} 
			  
			$scope.switchWithPassword = function(user_id,user_name) {
				 $state.go('app.switchWithPassword', {'user_id':user_id,'user_name':user_name,reload: true});  
			} 
			
			/*  $scope.loginswitchUser = function(form) {	
				alert('loginswitchUser');
				if(form.$valid ) { 
					console.log('u name '+$scope.switch_username+' up '+$scope.switch_password);
					CommonService.login($scope.switch_username,$scope.switch_password,$scope.login_type,'pending'); 
				}
				else {  
					$ionicPopup.alert({
						title: 'Login failed!',
						template: 'All Fields are required!'
					});
				}
			}	 	 */
		}else{
			$state.go('app.login');
		} 
   }) 
}) 

.controller('switchLogOffCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$window) {
	$scope.$on('$ionicView.beforeEnter', function(){
		document.getElementById("lognswitchusr").reset();
		
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage 
		var dbId  		 = localStorage.getItem("db_id"); 
		var db_name  	 = localStorage.getItem("db_name");  
		var user_id      = $stateParams.user_id; 
		var user_name    = $stateParams.user_name; 
		
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			$scope.swtchUsrName = user_name;
			$scope.switchusr_password = "";
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
   
			$scope.loginswitchUser = function(form) {
				if(form.$valid ) { 
					var user_name      = angular.element(document.getElementById("switch_user_name")).val().trim();
					var user_password  = angular.element(document.getElementById("switch_user_password")).val().trim(); 
					
					CommonService.login(user_name,user_password,'','pending'); 
				}
				else {  
					$ionicPopup.alert({
						title: 'Login failed!',
						template: 'All Fields are required!'
					});
				}
			} 			
		}else{
			$state.go('app.login');
		} 
   }) 
}) 
 

.controller('switchUsrPswdCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) { 
	$scope.$on('$ionicView.beforeEnter', function(){
		/* document.getElementById("switch_pswd_password1").reset(); */
		document.getElementById('switch_pswd_password1').value = '';
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage 
		var dbId  		 = localStorage.getItem("db_id"); 
		var db_name  	 = localStorage.getItem("db_name");  
		var user_id      = $stateParams.user_id; 
		var user_name    = $stateParams.user_name; 
		 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			console.log('dduser_name '+user_name); 
			$scope.swtchUsrName = user_name;
			$scope.swtchusrpass = "";
			 
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			  });
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 
    
		 
			$scope.switchUsrPswd = function(form) {	
				angular.element($('[nav-view="cached"]')).remove();  /* for remove cache of template */
				if(form.$valid ) {
					var user_name1      = $scope.swtchUsrName;
					var user_password1  = angular.element(document.getElementById("switch_pswd_password1")).val().trim();
					
					CommonService.login(user_name1,user_password1,'','pending');  
				 }
				else {  
					$ionicPopup.alert({
						title: 'Login failed!',
						template: 'All Fields are required!'
					});
				} 
			}	
		 			
		}else{
			$state.go('app.login');
		} 
   }) 
}) 
 
.controller('allSitesCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup) {
	 $scope.$on('$ionicView.beforeEnter', function(){  
	 /* for loading every time when view load  */
	 
	 	var api_url = localStorage.getItem('api_url'); 
 
		$scope.user_id = localStorage.getItem('user_id'); // get local storage
		var order_type = $stateParams.order_type; 
		var dbName     = localStorage.getItem("db_name");
		
		/* console.log('dbName '+dbName); */
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /* for get assigned privileges to add checks on tabs */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$scope.ord_sts = order_type; 
			$http.get(api_url+'/mobileapp/get_all_sites.php?page='+1).success(function(items) {
				angular.forEach(items, function(value, key) {
					if(value.db_id!=null && value.db_id!=undefined && value.db_id!=''){
						console.log('site name '+ value.site_name)						
						$scope.items.push({ id: value.db_id,site_name: value.site_name,db_name: value.db_name,site_url: value.site_url,msg: items.msg});  
					}
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/get_all_sites.php?page='+$scope.page).success(function(items) {
					angular.forEach(items, function(value, key) {
						if(value.db_id!=null && value.db_id!=undefined && value.db_id!=''){  
							$scope.items.push({ id: value.db_id,site_name: value.site_name,db_name: value.db_name,site_url: value.site_url,msg: items.msg});  
						}
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			
			$scope.managesite =function(dbID){
				alert('db '+dbID);
				/* $state.go('app.switchSite', {'dbId':dbID,reload: true}); */
				
				CommonService.getSingleSiteDetail(dbID);  
				
			}
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		}  
   }) 
}) 


.controller('homeCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams, $ionicGesture) {
	$scope.$on('$ionicView.beforeEnter', function(){  
	 /* for loading every time when view load  */
	  
		$scope.user_id = localStorage.getItem('user_id');   // get local storage
		var api_url    = localStorage.getItem('api_url');  
		var order_type = $stateParams.order_type; 
		var dbName     = localStorage.getItem("db_name");
	 
		if($scope.user_id!=null && $scope.user_id!=undefined && $scope.user_id!=''){
			CommonService.getUserPrivileges($scope.user_id);  /*  for get assigned privileges to add checks on tabs  */
			
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
				maxWidth: 200,
				showDelay: 0
			});
			$timeout(function () {
				$ionicLoading.hide();
			}, 1000); 

			/* for fetch orders on load page */
			$scope.ord_sts = order_type; 
			$http.get(api_url+'/mobileapp/home_api.php?page='+1+'&db_name='+dbName).success(function(items) {
				angular.forEach(items, function(value, key) { 
					if(value.id!=null && value.id!=undefined && value.id!=''){  
						/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg}); */

							ordrClass = "";
							if(angular.lowercase(value.status) == "pending"){
								ordrClass = "pending-ordr";
							}
							if(angular.lowercase(value.status) == "confirmed"){
								ordrClass = "confirmed-ordr";
							}
							if(angular.lowercase(value.status) == "cancelled"){
								ordrClass = "cancelled-ordr";
							} 
							$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass});							
					}else{
						if(items.msg=="no record found"){
							$scope.no_record = items.msg;			
						} 
					}
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
			
			/* for fetch orders on scroll page */
			$scope.noMoreItemsAvailable = false;
			$scope.page=2;
			$scope.loadMore = function(){
				$http.get(api_url+'/mobileapp/home_api.php?page='+$scope.page+'&db_name='+dbName).success(function(items) {
					angular.forEach(items, function(value, key) { 
						if(value.id!=null && value.id!=undefined && value.id!=''){  
							/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg});   */
							
							ordrClass = "";
							if(angular.lowercase(value.status) == "pending"){
								ordrClass = "pending-ordr";
							}
							if(angular.lowercase(value.status) == "confirmed"){
								ordrClass = "confirmed-ordr";
							}
							if(angular.lowercase(value.status) == "cancelled"){
								ordrClass = "cancelled-ordr";
							}
							 
							$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass});  
							
						}else{
							if(items.msg=="no record found"){
								$scope.no_record = items.msg;			
							} 
						}
					});
					if ( items.msg == "no record found" ) {
						$scope.noMoreItemsAvailable = true;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
				$scope.page +=1;
			};
			  
			$scope.items = [];
			
			$scope.orderdetail = function(orderID) {
				$state.go('app.orderDetail',{'order_id': orderID}); 
			}  
			/* end fetch orders on load page */
		}else{
			$state.go('app.login');
		} 


		$scope.sortHmOrdr = "24_hours";
				$scope.order_sort_by_hm =function(sortHmOrdr){
					/* alert(mySelect); */
					/* for fetch orders on load page */
					$scope.ord_sts = order_type; 
					$http.get(api_url+'/mobileapp/home_api.php?page='+1+'&db_name='+dbName+'&sort_by='+sortHmOrdr).success(function(items) {
						angular.forEach(items, function(value, key) { 
							if(value.id!=null && value.id!=undefined && value.id!=''){  
								/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg}); */

									ordrClass = "";
									if(angular.lowercase(value.status) == "pending"){
										ordrClass = "pending-ordr";
									}
									if(angular.lowercase(value.status) == "confirmed"){
										ordrClass = "confirmed-ordr";
									}
									if(angular.lowercase(value.status) == "cancelled"){
										ordrClass = "cancelled-ordr";
									} 
									$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass});							
							}else{
								if(items.msg=="no record found"){
									$scope.no_record = items.msg;			
								} 
							}
						});
						$scope.$broadcast('scroll.infiniteScrollComplete');
					});
					
					/* for fetch orders on scroll page */
					$scope.noMoreItemsAvailable = false;
					$scope.page=2;
					$scope.loadMore = function(){
						$http.get(api_url+'/mobileapp/home_api.php?page='+$scope.page+'&db_name='+dbName+'&sort_by='+sortHmOrdr).success(function(items) {
							angular.forEach(items, function(value, key) { 
								if(value.id!=null && value.id!=undefined && value.id!=''){  
									/* $scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg});   */
									
									ordrClass = "";
									if(angular.lowercase(value.status) == "pending"){
										ordrClass = "pending-ordr";
									}
									if(angular.lowercase(value.status) == "confirmed"){
										ordrClass = "confirmed-ordr";
									}
									if(angular.lowercase(value.status) == "cancelled"){
										ordrClass = "cancelled-ordr";
									}
									 
									$scope.items.push({ id: value.id,status: value.status,price_total: value.price_total,order_date: value.created_date,msg: items.msg,ordercls:ordrClass});  
									
								}else{
									if(items.msg=="no record found"){
										$scope.no_record = items.msg;			
									} 
								}
							});
							if ( items.msg == "no record found" ) {
								$scope.noMoreItemsAvailable = true;
							}
							$scope.$broadcast('scroll.infiniteScrollComplete');
						});
						$scope.page +=1;
					};
					  
					$scope.items = [];
				};		
   }) 
})