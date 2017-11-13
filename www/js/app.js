/* angular.module('smartFeed', ['ionic', 'smartFeed.controllers', 'smartFeed.services', 'ngMessages','onezone-datepicker','initialValue','ngCordova','ionic.cloud', 'chart.js', 'ionic-timepicker']) */
angular.module('smartFeed', ['ionic', 'smartFeed.controllers', 'smartFeed.services', 'ngMessages','onezone-datepicker','initialValue','ngCordova','ionic.cloud', 'chart.js'])
 
.run(function($ionicPlatform,$cordovaSQLite,$rootScope,$anchorScroll,$ionicPush,CommonService,$location,$state,) {
	$ionicPlatform.ready(function(){ 
		 /* Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs) */
 
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

		if (window.StatusBar) {
			 /* org.apache.cordova.statusbar required */
			StatusBar.styleDefault();
		} 
	});
	
	  /* for logout on click back button from mobile if screen or page is loggoff */
	$ionicPlatform.registerBackButtonAction(function() {
      if ($location.path() === "/app/logOff") { 
         /* navigator.app.exitApp(); */  /* for exit from app */
		  
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
      
    }, 100);  
	
	  /* end logout on click back button from mobile if screen is loggoff */
    
	/* for redirect to orerlist page if user is logged in and user has reopened app after closing app */
	$rootScope.$on('$stateChangeStart', function (event,$scope,$http,$state,CommonService,$ionicLoading,$timeout) {
		logdUserId = localStorage.getItem('user_id');
		if(logdUserId!=null && logdUserId!=undefined && logdUserId!=''){
			/* $state.go('app.orderList',{'order_type': 'pending'}); */
		}else{
			/* $state.go('app.login'); */
		}
    });
	
	/* end redirect to orerlist page if user is logged in and user has reopened app after closing app */
	
	$rootScope.$on("$locationChangeSuccess", function(){
        $anchorScroll();
    }); 
	
	if(localStorage.getItem('user_id')!=null && localStorage.getItem('user_id')!=undefined && localStorage.getItem('user_id')!=''){
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
		 console.log('no user_id '+localStorage.getItem('user_id'));
	}
}) 

.config(function($stateProvider, $urlRouterProvider,$ionicCloudProvider) {
  $stateProvider

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})
	
	.state('app.login', {
		url: '/login',
		views: {
			'menuContent': {
				templateUrl: 'templates/login.html',
				controller: 'LoginCtrl'
			}
		}
	})
	
	 .state('app.orderList', {
		url: '/orderList=:order_type',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/orderList.html',
				controller: 'orderListCtrl',
			}
		}
    }) 
	
	 .state('app.updateOrder', {
		url: '/updateOrder=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/updateOrder.html',
				controller: 'updateOrderCtrl',
			}
		}
    })  
	
	 .state('app.updateAddress', {
		url: '/updateAddress=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/updateAddress.html',
				controller: 'updateAddressCtrl',
			}
		}
    })  
	
	.state('app.topAreaOrderList', {
		url: '/topAreaOrderList=:zip_code',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/orderList.html',
				controller: 'topAreaOrderListCtrl',
			}
		}
    })  
	
	.state('app.getAreaWiseOrdersList', {
		url: '/getAreaWiseOrdersList=:zip_code',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/getAreaWiseOrdersList.html',
				controller: 'getAreaWiseOrdersListCtrl',
			}
		}
    })  
	
	.state('app.orderDetail', {
		url: '/orderDetail=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/orderDetail.html',
				controller: 'orderDetailCtrl',
			}
		}
    }) 
	
	.state('app.userProfile', {
		url: '/userProfile',
		views: {
			'menuContent': {
				templateUrl: 'templates/userProfile.html',
				controller: 'userProfileCtrl'
			}
		}
	})  
	
	.state('app.acceptOrder', {
		url: '?orderAccept=:order_status&orderid=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/acceptOrder.html',
				controller: 'orderAcceptCtrl'
			}
		}
	})  
	
	.state('app.declineOrder', {
		url: '?orderDecline=:order_status&orderid=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/declineOrder.html',
				controller: 'orderDeclineCtrl'
			}
		}
	}) 
	.state('app.dashboard', {
		url: '/dashboard',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/index.html',
				controller: 'businessReportsCtrl'
			}
		}
	}) 
	 
	.state('app.graphicalReport', {
		url: '/graphicalReport',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/graphicalReport.html',
				controller: 'graphicalReportCtrl'
			}
		}
	})  
	
	.state('app.customerOverview', {
		url: '/customerOverview',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/customerOverview.html',
				controller: 'customerOverviewCtrl'
			}
		}
	})  
	
	.state('app.topBuyers', {
		url: '/topBuyers',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/topBuyers.html',
				controller: 'topBuyersCtrl'
			}
		}
	})  
	
	.state('app.topDishes', {
		url: '/topDishes',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/topDishes.html',
				controller: 'topDishesCtrl'
			}
		}
	})  
	
	.state('app.topPromos', {
		url: '/topPromos',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/topPromos.html',
				controller: 'topPromosCtrl'
			}
		}
	})  
	
	.state('app.refundClaims', {
		url: '/refundClaims',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/refundClaims.html',
				controller: 'refundClaimsCtrl'
			}
		}
	})  
	
	.state('app.refundDetail', {
		url: '/refundDetail=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/refundDetails.html',
				controller: 'refundDetailCtrl'
			}
		}
	})  
	
	.state('app.topAreas', {
		url: '/topAreas',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/topAreas.html',
				controller: 'topAreasCtrl'
			}
		}
	})   
	
	.state('app.customers', {
		url: '/customers',
		views: {
			'menuContent': {
				templateUrl: 'templates/customers/index.html',
				controller: 'cutomersCtrl'
			}
		}
	}) 
 
	.state('app.customerOrderList', {
		url: '/customers_orders=:customer_id&status=:status',
		views: {
			'menuContent': {
				templateUrl: 'templates/customers/orderList.html',
				controller: 'cutomersOrderCtrl'
			}
		}
	}) 
	
	.state('app.customerOrderDetail', {
		url: '/customer_order_detail=:order_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/customers/orderDetail.html',
				controller: 'cutomersOrderDetailCtrl'
			}
		}
	}) 
 
	.state('app.customerDetail', {
		url: '/customer_detail=:customer_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/customers/customerDetail.html',
				controller: 'customerDetailCtrl'
			}
		}
	}) 
	
	.state('app.productsList', {
		url: '/products',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/index.html',
				controller: 'productsCtrl'
			}
		}
	}) 
	
	.state('app.productDetail', {
		url: '/product_detail=:product_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/productDetail.html',
				controller: 'productsDetailCtrl'
			}
		}
	}) 
	
	.state('app.updateProducts', {
		url: '/updateProducts/product_id=:product_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/updateProducts.html',
				controller: 'updateProductsCtrl'
			}
		}
	}) 
	 
	.state('app.extras', {
		url: '/extras',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/extras.html',
				controller: 'extrasCtrl'
			}
		}
	}) 
	
	.state('app.addExtras', {
		url: '/addExtras',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/addExtras.html',
				controller: 'addExtrasCtrl'
			}
		}
	}) 
	
	.state('app.updateExtras', {
		url: '/updateExtras/extra_id=:extra_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/updateExtras.html',
				controller: 'updateExtrasCtrl'
			}
		}
	})  
	
	.state('app.addProducts', {
		url: '/addProducts',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/addProducts.html',
				controller: 'addProductsCtrl'
			}
		}
	})  
	
	.state('app.categories', {
		url: '/categories',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/categories.html',
				controller: 'categoriesCtrl'
			}
		}
	}) 
 
	 .state('app.addCategory', {
		url: '/addCategory',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/addCategory.html',
				controller: 'addCategoryCtrl'
			}
		}
	})  
		
	.state('app.updateCategory', {
		url: '/updateCategory/category_id=:category_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/products/updateCategory.html',
				controller: 'updateCategoryCtrl'
			}
		}
	})  
 	
	.state('app.allLocations', {
		url: '/allLocations',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/allLocations.html',
				controller: 'allLocationsCtrl'
			}
		}
	})  
 	
	.state('app.addLocations', {
		url: '/addLocation',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/addLocations.html',
				controller: 'addLocationCtrl'
			}
		}
	})  
	
	.state('app.editLocation', {
		url: '/editLocation=:location_id&latitude=:latitude&longitude=:longitude',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/updateLocation.html',
				controller: 'updateLocationCtrl'
			}
		}
	})  
	
	.state('app.workingTimePickup', {
		url: '/workingTimePickup=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/workingtime/workingTimePickup.html',
				controller: 'workingTimePickupCtrl'
			}
		}
	})  
	
	.state('app.workingTimeDelivery', {
		url: '/workingTimeDelivery=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/workingtime/workingTimeDelivery.html',
				controller: 'workingTimeDeliveryCtrl'
			}
		}
	})  
	
	
	.state('app.viewPickupTimeDetail', {
		url: '/viewPickupTimeDetail=:location_id&time_from=:time_from&time_to=:time_to&day_off:day_off&day_name:day_name',
		views: {
			'menuContent': {
				templateUrl: 'templates/workingtime/viewPickupTimeDetail.html',
				controller: 'viewPickupTimeDetailCtrl'
			}
		}
	})  
 
	.state('app.viewDeliveryTimeDetail', {
		url: '/viewDeliveryTimeDetail=:location_id&time_from=:time_from&time_to=:time_to&day_off:day_off&day_name:day_name',
		views: {
			'menuContent': {
				templateUrl: 'templates/workingtime/viewDeliveryTimeDetail.html',
				controller: 'viewDeliveryTimeDetailCtrl'
			}
		}
	})  
 
	.state('app.deliveryCharges', {
		url: '/deliveryCharges=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/deliveryCharges/deliveryCharges.html',
				controller: 'deliveryChargesCtrl'
			}
		}
	})  
	
	.state('app.addDeliveryCharges', {
		url: '/addDeliveryCharges=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/deliveryCharges/addDeliveryCharges.html',
				controller: 'addDeliveryChargesCtrl'
			}
		}
	})  
	
	.state('app.editDeliveryCharge', {
		url: '/editDeliveryCharge=:del_id&location_id=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/deliveryCharges/updateDeliveryCharges.html',
				controller: 'updateDeliveryChargeCtrl'
			}
		}
	})  
	 
	.state('app.postCodeExc', {
		url: '/postCodeExc=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/postCodeExlusions/postCodeExc.html',
				controller: 'postCodeExcCtrl'
			}
		}
	}) 
 
	.state('app.addPostCodeExec', {
		url: '/addPostCodeExec=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/postCodeExlusions/addPostCodeExec.html',
				controller: 'addPostCodeExecCtrl'
			}
		}
	}) 
 
	.state('app.editPostCodeExc', {
		url: '/editPostCodeExc=:del_id&location_id=:location_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/locations/postCodeExlusions/updatePostCode.html',
				controller: 'updatePostCodeExecCtrl'
			}
		}
	})   
	
	.state('app.addUser', {
		url: '/addUser',
		views: {
			'menuContent': {
				templateUrl: 'templates/userPrivileges/addUser.html',
				controller: 'addUserCtrl'
			}
		}
	})   
	
	.state('app.getUsers', {
		url: '/getUsers',
		views: {
			'menuContent': {
				templateUrl: 'templates/userPrivileges/getUsers.html',
				controller: 'getUsersCtrl'
			}
		}
	})   
	 
	.state('app.editUser', {
		url: '/editUser=:uId',
		views: {
			'menuContent': {
				templateUrl: 'templates/userPrivileges/updateUser.html',
				controller: 'updateUsersCtrl'
			}
		}
	})   
 /* 
	.state('app.logOff', {
		url: '/logOff=:user_id&current_url=:current_url',
		views: {
			'menuContent': {
				templateUrl: 'templates/logOff.html',
				controller: 'userLogOffCtrl'
			}
		}
	})   
 */
	.state('app.logOff', {
		url: '/logOff',
		views: {
			'menuContent': {
				templateUrl: 'templates/logOff.html',
				controller: 'userLogOffCtrl'
			}
		}
	})   
	
	.state('app.switchUser', {
		url: '/switchUser',
		views: {
			'menuContent': {
				templateUrl: 'templates/switchUser.html',
				controller: 'switchLogOffCtrl'
			}
		}
	})    
	
	.state('app.switchWithPassword', {
		url: '/switchWithPassword=:user_id&user_name=:user_name',
		views: {
			'menuContent': {
				templateUrl: 'templates/switchWithPassword.html',
				/* controller: 'switchLogOffCtrl' */
				controller: 'switchUsrPswdCtrl'
			}
		}
	})    
	
	.state('app.allSites', {
		url: '/allSites',
		views: {
			'menuContent': {
				templateUrl: 'templates/allSites.html', 
				controller: 'allSitesCtrl'
			}
		}
	})    
	
	.state('app.switchSite', {
		url: '/switchSite',
		views: {
			'menuContent': {
				templateUrl: 'templates/switchSite.html', 
				controller: 'allSitesCtrl'
			}
		}
	})    
	
	.state('app.home', {
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html', 
				controller: 'homeCtrl'
			}
		}
	})    
	
	
	$urlRouterProvider.otherwise('/app/orderList=pending');
	/* $urlRouterProvider.otherwise('/app/home'); */
	
	$ionicCloudProvider.init({
		"core": {
		  "app_id": "a806c3da"
		},
		"push": {
		  "sender_id": "859642630528",
		  "pluginConfig": {
			"ios": {
			  "badge": true,
			  "sound": true
			},
			"android": {
			  "iconColor": "#343434"
			}
		  }
		},
		/* "tokens": ["fajCiAgHggc:APA91bElr7w99dttL7Jq8llukV5TZOfU58KLnP1qZoIkZTalIRM8HHKlhhxZ4E9MB3oDVtbvZ666VXwoYPhml5y2w6LBxHaJRcAwxHk4fP34lmPGYKcpDO9KOWqLL64AbsyQs66HvihQ"], */
		"tokens": ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNDMxMzVkNy1kMTJlLTRlZDYtYWQ1Ny04ZjY0NWRlZTdjODQifQ.skqTb2dYyXT1XK-azoz2TdWqMRdkPqVoU3bT708pdXc"],
			"profile": "smart_feed",
			"notification": {
				"message": "Hello World!",
				"ios": {
					"message": "Hello iOS!"
				},
				"android": {
					"message": "Hello Android"
				}
			}
	}); 
});