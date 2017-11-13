angular.module('smartFeed.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {})
 
/*  .controller('smartFeed', function($scope, $ionicModal, $timeout,$ionicSideMenuDelegate) {
	 $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.changeState = function(page) {
    $state.go(page);
  }
	
}) */
.controller('LoginCtrl', function($scope, $http, $ionicPopup, $state, $ionicModal,CommonService) { 
	$scope.loginForm = function(form) {	
		if(form.$valid ) {
			CommonService.login($scope.username,$scope.password,$scope.login_type);		
		}
		else { 
			$ionicPopup.alert({
				title: 'Login failed!',
				template: 'All Fields are required!'
			});
		}
    }
	
	$ionicModal.fromTemplateUrl('templates/reset-password.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
})
 
.controller('orderListCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout) {
	$scope.$on('$ionicView.beforeEnter', function(){ 
		// for loading every time when view load 

		$scope.user_id=localStorage.getItem('user_id');   // get local storage
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

			CommonService.orderList($scope.user_id);
		}else{
			$state.go('app.login');
		} 
		
		$scope.orderdetail = function(orderID) {
			$state.go('app.orderDetail',{'order_id': orderID});
		}  
   }) 
})

.controller('orderDetailCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams) {
/* .controller('orderDetailCtrl', function($scope,$stateParams,$http, $ionicPopup, $state,CommonService) { */
	$scope.$on('$ionicView.beforeEnter', function() { 
		// for loading every time when view load 

		$scope.user_id=localStorage.getItem('user_id');   // get local storage
		var orderID = $stateParams.order_id;
		/* console.log('order_iD '+$stateParams.order_id); */
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

			CommonService.orderDetail(orderID);
		}else{
			$state.go('app.login');
		}
		
		$scope.orderstatus = function(orderStatus,orderID) {
			console.log('orderStatus '+orderStatus);
			/* $state.go('app.orderStatus',{'order_status':orderStatus,'order_id': orderID}); */
			
			if(orderStatus == "accept"){ 
				$state.go('app.acceptOrder',{'order_status':'accept','order_id': orderID});
			}
			if(orderStatus == "decline"){ 
				$state.go('app.declineOrder',{'order_status':'decline','order_id': orderID});
			}  
		}  
   }) 
})

.controller('userProfileCtrl', function($scope,$state) { 
	$scope.$on('$ionicView.enter', function(){ 
		$scope.fullname = localStorage.getItem('fullname'); 
		$scope.email = localStorage.getItem('email'); 
		$scope.logout = function() { 
			localStorage.setItem("username", ''); 
			localStorage.setItem("user_id", ''); 
			$state.go('app.login'); 
		}  
	}) 
}) 

.controller('orderAcceptCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$location,$rootScope) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var orderID 	 = $stateParams.order_id;
		var order_status = $stateParams.order_status;
		/* console.log('accept me '+$stateParams.order_id+' order_status '+$stateParams.order_status);  */
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
		 
		$scope.saveEstimateTime = function(estimateTime){
			/* console.log('scope.textbox'); */
			$scope.saveEstimateTime = function(form){	
				if(form.$valid ){
					var estimate_time = angular.element(document.getElementById("estimate_time"));      
					var estimate_time1 = $scope.textbox = estimate_time.val();
					
					CommonService.saveEstimateTime(orderID,order_status,estimate_time1);
					$timeout(function() { 
						/* $location.path('/app/orderDetail='+orderID);  */
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
		}		
   }) 
})
 
.controller('orderDeclineCtrl', function($scope,$http,$state,CommonService,$ionicLoading,$timeout,$stateParams,$ionicPopup,$location,$rootScope) {
	$scope.$on('$ionicView.beforeEnter', function() {
		$scope.user_id	 = localStorage.getItem('user_id');   // get local storage
		var orderID 	 = $stateParams.order_id;
		var order_status = $stateParams.order_status;
		/* console.log('accept me '+$stateParams.order_id+' order_status '+$stateParams.order_status);  */
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
						/* $location.path('/app/orderDetail='+orderID);  */
						$state.go('app.orderDetail',{'order_id': orderID});
					}, 2000);
				}
			}
			else{
				CommonService.saveDeclineReason(orderID,order_status,declineReason);
				$timeout(function(){ 
					/* $location.path('/app/orderDetail='+orderID);  */
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
