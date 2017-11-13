angular.module('smartFeed', ['ionic', 'smartFeed.controllers', 'smartFeed.services', 'ngMessages','onezone-datepicker','initialValue','ngCordova'])

.run(function($ionicPlatform,$cordovaSQLite,$rootScope,$anchorScroll) { 
	$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
		// org.apache.cordova.statusbar required
		StatusBar.styleDefault();
    }

	db = $cordovaSQLite.openDB("my.db");
	$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS picture (id integer primary key, image text)");

  });
  
	/* for redirect to orerlist page if user is logged in and user has reopened app after closing app */
	/* $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams,$scope) { */
	$rootScope.$on('$stateChangeStart', function (event,$scope,$http,$state,CommonService,$ionicLoading,$timeout) {
		alert('stateChangeStart');
		logdUserId = localStorage.getItem('user_id');
		if(logdUserId!=null && logdUserId!=undefined && logdUserId!=''){
			alert('if stateChangeStart');
			$state.go('app.orderList');
		}else{
			alert('else stateChangeStart');
			$state.go('app.login');
		}
    });
	
	/* end redirect to orerlist page if user is logged in and user has reopened app after closing app */
	
	$rootScope.$on("$locationChangeSuccess", function(){
        $anchorScroll();
    });
})


.config(function($stateProvider, $urlRouterProvider) {
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
		url: '/orderList',
		views: {
			'menuContent': {
				templateUrl: 'templates/orders/orderList.html',
				controller: 'orderListCtrl',
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
 
	$urlRouterProvider.otherwise('/app/login'); 

});