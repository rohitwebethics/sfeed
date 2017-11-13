var app = angular.module('smartFeed.services', [])
 
.service('CommonService', function ($rootScope,$http,$state,$ionicPopup,$ionicLoading,$location,$timeout) {
	/* ============================login function service =========================*/ 
	 /* var main_url = "http://www.smart-feed.co.uk";   */
	var main_url = "http://www.comparethecab.co.uk";
	
	this.login = function (username,password,login_type,order_status) {
		$http({  
			method: 'POST',
			url: main_url+'/mobile_login.php',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			dataType: 'jsonp',
			data: $.param({
				log: username,
				pwd: password,
				username: username,
				password: password,
			})
		}).then(function successCallback(response) {
			if(response.data.msg=="matched"){
				localStorage.setItem("username", response.data.data.user_login);
				localStorage.setItem("email", response.data.data.user_email);
				localStorage.setItem("fullname", response.data.data.display_name);
				localStorage.setItem("user_id", response.data.data.ID);
				localStorage.setItem("db_name", response.data.db_name);
				localStorage.setItem("site_name", response.data.site_name);
				localStorage.setItem("site_url", response.data.site_url);
				localStorage.setItem("db_id", response.data.db_id);
				localStorage.setItem("admin_role", response.data.admin_role);
				
				localStorage.setItem("api_url", main_url);
				  
				  var user_id = localStorage.getItem("user_id"); 
				 if(user_id!=""){
					 var dbName  = localStorage.getItem("db_name");
					 var dbId    = localStorage.getItem("db_id"); 
					 var user_id = localStorage.getItem("user_id"); 
					 var api_url = localStorage.getItem('api_url');  
					 
					 $http({   
						method: 'POST', 
						url: api_url+'/mobileapp/user_api.php',  
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
						data: $.param({ 
							db_name :dbName,
							db_id :dbId,
							user_id :user_id, 
							do_action:'get_last_url'
						})
					}).then(function successCallback(response) {
						last_url = response.data;
						if(localStorage.getItem("admin_role") == "superadmin"){
							$location.path('/app/allSites');
						}else{  
							if(last_url!=null && last_url!=undefined && last_url!=''){
								$location.path(last_url);
							}else{
								$location.path('/app/orderList=pending');
								setInterval(function () { 
									 window.location.reload(true) ;
								}, 100); 
							}
						}
						
					}, function errorCallback(response) {}) 
				 }else{
					 	if(localStorage.getItem("admin_role") == "superadmin"){
							$location.path('/app/allSites');
						}else{  
							$location.path('/app/orderList=pending');
							setInterval(function () { 
								 window.location.reload(true) ;
							}, 100); 							
						}					 
				 }
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
	 	
	this.orderList = function (user_id,page_id) {
		$rootScope.items='';
		var dbName = localStorage.getItem("db_name"); 
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/orders_listing.php',  
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				u_id :user_id,
				page :page_id
			})
		}).then(function successCallback(response) {
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			console.log('json_obj '+json_obj);
			$rootScope.items = json_obj;
		}, function errorCallback(response) {})
	}
  
	this.orderDetail = function (user_id) {
		$rootScope.items4='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/order_details.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				order_id :user_id 
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items4 = json_obj;
			
			$rootScope.order_items = json_obj.output;
		}, function errorCallback(response) {})
	}
	
		
	this.editOrder = function(orderId){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/order_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderId,
				do_action : 'editOrder'
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}	

	this.updateOrder = function(orderID,ordrTypes,orderStatus,orderIsPaid,paymentmethod,customerName,customerEmail,cPhone,cAddress_1,cAddress_2,cState,cCity,cZip,subtotalPrice,priceDelivery,priceTotal,voucherCode){
		$rootScope.items_edit='';
		var dbName  = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST',
			url: api_url+'/mobileapp/order_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderID,
				ordr_Type :ordrTypes,
				order_status :orderStatus,
				order_is_paid :orderIsPaid, 
				payment_method :paymentmethod,
				customer_name :customerName,
				customer_email :customerEmail,
				c_phone :cPhone,
				c_Address_1 :cAddress_1,
				c_Address_2 :cAddress_2,
				c_State :cState,
				c_City :cCity,
				c_Zip :cZip,
				subtotal_Price :subtotalPrice,
				price_Delivery :priceDelivery,
				price_Total :priceTotal,
				voucher_Code :voucherCode,
				do_action : 'update_order'
			})
		}).then(function successCallback(response){ 
			if(response.data.msg == "Order updated successfully.")
			$ionicPopup.alert({
				title: 'Success!',
				template: 'Order updated successfully.'
			});
		}, function errorCallback(response) {})
	}
	 
	this.updateAddressPickup = function(orderID,locations,pickupDate,pickupTime){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/order_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderID,
				p_locations :locations,
				pickup_date :pickupDate,
				pickup_time :pickupTime,
				do_action : 'update_address_pickup'
			})
		}).then(function successCallback(response){ 
			if(response.data.msg == "Order updated successfully."){
				$ionicPopup.alert({
					title: 'Success!',
					template: 'Order updated successfully.'
				});
			}
		}, function errorCallback(response) {})
	}
	
	this.updateDelivryAddress = function(orderID,del_locations,del_address_1,del_address_2,del_city,del_state,del_postal_code,del_country,del_special_note,deliveryDate,deliveryTime){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name"); 
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/order_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderID,
				locations :del_locations,
				address_1 :del_address_1,
				address_2 :del_address_2,
				city :del_city,
				state :del_state,
				postal_code :del_postal_code,
				country :del_country,
				special_note :del_special_note,
				delivery_date :deliveryDate,
				delivery_time :deliveryTime,
				do_action : 'update_delivry_address_pickup'
			})
		}).then(function successCallback(response){ 
			if(response.data.msg == "Order updated successfully."){
				$ionicPopup.alert({
					title: 'Success!',
					template: 'Order updated successfully.'
				});
			}
		}, function errorCallback(response) {})
	}
		
	this.editAddress = function(orderId){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/order_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderId,
				do_action : 'editAddress'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	} 
	
	this.saveEstimateTime = function(order_id,order_status,estimateTime,$cordovaPrinter,$ionicPopup){
		$rootScope.items5='';
		var dbName    = localStorage.getItem("db_name");
		var site_name = localStorage.getItem("site_name");
		var site_url  = localStorage.getItem('site_url');  
		var api_url   = localStorage.getItem('api_url');  
		 
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/save_estimate_time.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				status :order_status,
				order_id :order_id,
				estimate_time :estimateTime,
				db_name :dbName
			})
		}).then(function successCallback(response){ 
			var titlemsg='';
			if(response.data =="success"){
				titlemsg = "Order updated successfully."; 
				$rootScope.items5 = titlemsg;
				
				if($cordovaPrinter.isAvailable()) {
					$cordovaPrinter.print(api_url+"/mobileapp/print_order_detail.php?order_id="+order_id+"&site_name="+site_name+"&site_url="+site_url+'&db_name='+dbName);
				} else { 
					$ionicPopup.alert({
						title: 'Error!',
						template: 'Printing is not available on device'
					});
				}
			}
			if(response.data =="norecord"){
				titlemsg = "No record found.";  
				$rootScope.items5 = titlemsg;
			}  
		}, function errorCallback(response) {})
	}
	
	this.saveDeclineReason = function(order_id,order_status,declineReason){
		$rootScope.items6 = '';
		var dbName = localStorage.getItem("db_name"); 
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/save_decline_reason.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				status :'cancelled',
				order_id :order_id,
				reasn :declineReason,
				db_name :dbName
			})
		}).then(function successCallback(response){ 
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
	
	this.dashboardService = function(admin_id){
		$rootScope.items7='';
		var dbName = localStorage.getItem("db_name");
		var titlemsg='Comming Soon...';
		$rootScope.items7 = titlemsg;
	}
	
	this.cutomersService = function(admin_id){
		$rootScope.items8='';
		var dbName = localStorage.getItem("db_name");
		var titlemsg='Comming Soon...';
		$rootScope.items8 = titlemsg;
	}
	
	this.saveDeviceToken = function(tokenId){
		$rootScope.items9='';
		var dbName = localStorage.getItem("db_name");
		var userId = localStorage.getItem("user_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/save_device_token.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				device_token_id :tokenId,
				db_name :dbName,
				user_id :userId
			})
		}).then(function successCallback(response){  
			$rootScope.items9="Notification subscribred successfully.";
			console.log('response '+response.data);
		}, function errorCallback(response) {})
	}
	
	this.unregisterDeviceToken = function(tokenId){
		var dbName = localStorage.getItem("db_name");
		var userId = localStorage.getItem("user_id");
		var api_url = localStorage.getItem('api_url');  
		 
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/delete_device_token.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				device_token_id :tokenId,
				db_name :dbName,
				user_id :userId
			})
		}).then(function successCallback(response){  
			console.log('response '+response.data);
			localStorage.setItem("device_token", "");
		}, function errorCallback(response) {})
	}
	
	this.customerOrderDetail = function (order_id) {
		$rootScope.items10='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/customer_order_detail.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				order_id :order_id 
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items10 = json_obj;
			console.log('out '+json_obj.output);
			$rootScope.ordr_itmes = json_obj.output;
		}, function errorCallback(response) {})
	}
	
	this.customerDetailService = function (customerId) {
		$rootScope.items11='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/customer_details.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name  :dbName,
				customer_id :customerId 
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items11 = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.productDetailService = function (productId) {
		$rootScope.items12='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/product_details.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name  :dbName,
				product_id :productId 
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items12 = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.saveProducts = function(name,description,description_show,price,is_featured,is_open,product_order){
		$rootScope.items_save_prdct='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  		
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/products_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				product_name :name,
				product_description :description,
				product_description_show :description_show,
				product_price :price,
				product_is_featured :is_featured,
				product_is_open :is_open,
				product_order :product_order,
				do_action : 'save'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_save_prdct = json_obj;
		}, function errorCallback(response) {})
	}
	
	
	this.editProducts = function(pdct_id){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/products_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				product_id :pdct_id,
				do_action : 'edit'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	} 
	
	this.updateProducts = function(productId,name,description,description_show,price,is_featured,is_open,product_order){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/products_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				product_id :productId,
				product_name :name,
				product_description :description,
				product_description_show :description_show,
				product_price :price,
				product_is_featured :is_featured,
				product_open :is_open,
				product_order :product_order,
				do_action : 'update'
			})
		}).then(function successCallback(response){  
			$rootScope.items_edit="Extra updated successfully.";
		}, function errorCallback(response) {})
	}
	
	this.saveExtras = function(name,price){
		$rootScope.items13='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/save_extras.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				extra_name :name,
				extra_price :price,
				do_action : 'save'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items13 = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.editExtras = function(ex_id){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/save_extras.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				extra_id :ex_id,
				do_action : 'edit'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.updateExtras = function(ex_id,name,price){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/save_extras.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				extra_id :ex_id,
				extra_name :name,
				extra_price :price,
				do_action : 'update'
			})
		}).then(function successCallback(response){  
			$rootScope.items_edit="Extra updated successfully.";
		}, function errorCallback(response) {})
	}
	
	this.refundDetail = function(orderId){ 
		$rootScope.items_detail='';
		var dbName = localStorage.getItem("db_name"); 
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/refund_detail.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderId,
				do_action : 'refundDetail'
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt); 
			$rootScope.items_detail = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.updateRefund = function(refundStatus,refundApprovedAmount,refundMessage,orderId,customerReason,amount){
		$rootScope.items_detail='';
		var dbName = localStorage.getItem("db_name"); 
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/refund_detail.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				order_id :orderId,
				refund_message :refundMessage,
				refund_approved_amount :refundApprovedAmount,
				refund_status :refundStatus,
				customer_reason :customerReason,
				amount :amount,
				do_action : 'updateRefund'
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_detail = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.saveCategory = function(categoryName,categoryDescription,categoryOrder,categoryIsOpen){
		$rootScope.items13='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/products_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				category_name :categoryName,
				category_description :categoryDescription,
				category_order :categoryOrder,
				category_is_open :categoryIsOpen,
				do_action : 'save_category'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items13 = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.editCategory = function(cat_id){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/products_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				category_id :cat_id,
				do_action : 'edit_category'
			})
		}).then(function successCallback(response){  
		   console.log('response '+response.data); 
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.updateCategory = function(categoryId,categoryName,categoryDescription,categoryOrder,categoryIsOpen){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/products_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				category_id :categoryId,
				category_name :categoryName,
				category_description :categoryDescription,
				category_order :categoryOrder,
				category_is_open :categoryIsOpen,
				do_action : 'update_category'
			})
		}).then(function successCallback(response){  
			$rootScope.items_edit="Extra updated successfully.";
		}, function errorCallback(response) {})
	}
	
	this.saveLocation = function(location_name,location_address,location_latitude,location_logitude,phone_number){
		$rootScope.items = '';
		var dbName  = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				locationName :location_name,
				locationAddress :location_address,
				locationLatitude :location_latitude,
				locationLogitude :location_logitude,
				phoneNumber :phone_number,
				do_action :'save_location'
			})
		}).then(function successCallback(response){
			if(response.data.msg="success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: "Location added successfully."
				});
			}
		}, function errorCallback(response) {})
	}
		
	this.editLocation = function(location_id){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				do_action : 'edit_location'
			})
		}).then(function successCallback(response){  
		   dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt); 
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.updateLocation = function(location_id,location_name,location_address,location_latitude,location_logitude,phone_number){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				locationName :location_name,
				locationAddress :location_address,
				locationLatitude :location_latitude,
				locationLogitude :location_logitude,
				phoneNumber :phone_number,
				do_action :'update_location'
			})
		}).then(function successCallback(response){
			if(response.data.msg == "success")
			$ionicPopup.alert({
				title: 'Success!',
				template: 'Location updated successfully.'
			}); 
		}, function errorCallback(response) {})
	}
	
	this.getWorikingTime = function(location_id,tmtype){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				t_type: tmtype,
				do_action :'get_working_time'
			})
		}).then(function successCallback(response){
			dt = JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.getWorikingTimeDetail = function(location_id,time_from,time_to,day_off,day_name){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				time_from :time_from,
				time_to :time_to,
				day_off :day_off,
				dayName :day_name,
				do_action :'get_working_time_detail'
			})
		}).then(function successCallback(response){
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
			if(json_obj.day_off == "T" || json_obj.day_off == "t" || json_obj.day_off == "true"){
				$rootScope.day_off_value = true;
			}else{
				$rootScope.day_off_value = false;
			}
			
		}, function errorCallback(response) {})
	}
	 
	 this.updatePikupTime = function(location_id,day_name,start_time_hours,start_time_minutes,end_time_hours,end_time_minutes,day_off){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				day_name :day_name,
				start_time_hours :start_time_hours,
				start_time_minutes :start_time_minutes,
				end_time_hours :end_time_hours,
				end_time_minutes :end_time_minutes,
				day_off :day_off,
				do_action :'update_pikup_time'
			})
		}).then(function successCallback(response){
			if(response.data.msg == "success")
			$ionicPopup.alert({
				title: 'Success!',
				template: 'Location updated successfully.'
			}); 
		}, function errorCallback(response) {})
	}
	
	 this.updateDeliveryTime = function(location_id,day_name,start_time_hours,start_time_minutes,end_time_hours,end_time_minutes,day_off){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				day_name :day_name,
				start_time_hours :start_time_hours,
				start_time_minutes :start_time_minutes,
				end_time_hours :end_time_hours,
				end_time_minutes :end_time_minutes,
				day_off :day_off,
				do_action :'update_delivery_time'
			})
		}).then(function successCallback(response){
			if(response.data.msg == "success")
			$ionicPopup.alert({
				title: 'Success!',
				template: 'Location updated successfully.'
			}); 
		}, function errorCallback(response) {})
	}
	 
	this.saveDeliveryCharges = function(location_id,distance_from,distance_to,delivery_price,delivery_free){
		$rootScope.items = '';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				location_id :location_id,
				distance_from :distance_from,
				distance_to :distance_to,
				delivery_price :delivery_price,
				delivery_free :delivery_free,
				do_action :'save_delivery_charges'
			})
		}).then(function successCallback(response){  
			if(response.data.msg="success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: "Delivery charges added successfully."
				});
			}
		}, function errorCallback(response) {})
	}
	
	this.editDeliveryCharge = function(del_id,location_id){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				del_id :del_id,
				do_action : 'edit_delivery_charge'
			})
		}).then(function successCallback(response){
			dt = JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}
	 
	this.updateDeliveryCharge = function(del_id,location_id,distance_from,distance_to,delivery_price,delivery_free){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				location_id :location_id,
				del_id :del_id,
				distance_from :distance_from,
				distance_to :distance_to,
				delivery_price :delivery_price,
				delivery_free :delivery_free, 
				do_action :'update_delivery_charge'
			})
		}).then(function successCallback(response){
			if(response.data.msg == "success")
			$ionicPopup.alert({
				title: 'Success!',
				template: 'Location updated successfully.'
			}); 
		}, function errorCallback(response) {})
	}  
	
	this.editPostCodeExec = function(del_id,location_id){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				locationId :location_id,
				del_id :del_id,
				do_action : 'edit_post_code_exec'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.savePostCodeExec = function(location_id,postcode_part1,postcode_part2,delivery_price,delivery_free){
		$rootScope.items = '';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				location_id :location_id,
				postcode_part1 :postcode_part1,
				postcode_part2 :postcode_part2,
				delivery_price :delivery_price,
				delivery_free :delivery_free,
				do_action :'save_post_code_exec'
			})
		}).then(function successCallback(response){  
			if(response.data.msg="success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: "Post code added successfully."
				});
			}
		}, function errorCallback(response) {})
	}
	 
	this.updatePostCodeExec = function(del_id,location_id,postcode_part1,postcode_part2,delivery_price,delivery_free){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/locations_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				location_id :location_id,
				del_id :del_id,
				postcode_part1 :postcode_part1,
				postcode_part2 :postcode_part2,
				delivery_price :delivery_price,
				delivery_free :delivery_free, 
				do_action :'update_post_code_exec'
			})
		}).then(function successCallback(response){
			if(response.data.msg == "success")
			$ionicPopup.alert({
				title: 'Success!',
				template: 'Post code updated successfully.'
			}); 
		}, function errorCallback(response) {})
	} 
	
	this.saveUser = function(user_name,user_password,email_address,selected_privileges,presetStatus){
		$rootScope.items='';
		var dbName  = localStorage.getItem("db_name");
		var dbId    = localStorage.getItem("db_id"); 
		var user_id = localStorage.getItem("user_id"); 
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				db_id :dbId,
				admin_id :user_id,
				user_name :user_name,
				user_password :user_password,
				email_address :email_address,
				selected_privileges :selected_privileges,
				preset_status :presetStatus,
				do_action :'save_user'
			})
		}).then(function successCallback(response){  
			if(response.data.msg=="success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: "User added successfully."
				});
			} 
			else{
				if(response.data.msg!=""){
					$ionicPopup.alert({
						title: 'Error!',
						template: response.data.msg
					});
				}
			} 
		}, function errorCallback(response) {})
	}  
	
	this.getPrivileges = function(){
		$rootScope.items='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				do_action :'get_privileges'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items = json_obj;
			$rootScope.selectedList = json_obj;
		}, function errorCallback(response) {})
	}  
		
	this.getPresetPrivileges = function(){
		var dbName  = localStorage.getItem("db_name");
		var dbId    = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				db_id :dbId,
				do_action :'get_preset_privileges'
			})
		}).then(function successCallback(response){  
			dt =JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.presetPrivileges = response.data;
			
			if(response.data!="" && response.data!=null && response.data!=undefined){
				$rootScope.selectPreset1 = { checked: true };
			}else{
				$rootScope.selectPreset1 = { checked: false };
			}
		}, function errorCallback(response) {})
	}  	
	
	this.removePresetPrivileges = function(){ 
		 $rootScope.presetPrivileges = "";
	}  
	
	this.removePrivileges = function(privileges_name){
		$rootScope.items='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				privileges_name :privileges_name,
				do_action :'remove_privileges'
			})
		}).then(function successCallback(response){  
			if(response.data.msg="success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: "Disabled successfully."
				});
			}
		}, function errorCallback(response) {})
	} 
	
	this.enablePrivileges = function(privileges_name){
		$rootScope.items='';
		var dbName = localStorage.getItem("db_name");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				privileges_name :privileges_name,
				do_action :'enable_privileges'
			})
		}).then(function successCallback(response){  
			if(response.data.msg="success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: "Enabled successfully."
				});
			}
		}, function errorCallback(response) {})
	}  

	this.getUserCount = function(){
		$rootScope.items_count='';
		var dbName = localStorage.getItem("db_name");
		var dbId   = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				db_id :dbId,
				do_action :'get_user_count'
			})
		}).then(function successCallback(response){  
			dt = JSON.stringify(response.data); 
			 console.log('response '+response.data);   
			json_obj = JSON.parse(dt);
			$rootScope.items_count = json_obj;
		}, function errorCallback(response) {})
	}
	
	this.getUserPrivileges = function(userId){
		$rootScope.assignedPrivileges='';
		var dbName = localStorage.getItem("db_name");
		var dbId   = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({ 
				db_name :dbName,
				db_id :dbId,
				user_id :userId,
				do_action :'get_user_privileges'
			})
		}).then(function successCallback(response){  
			$rootScope.assignedPrivileges = response.data;
		}, function errorCallback(response) {})
	}

	this.editUser = function(userId){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var dbId   = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				db_id :dbId,
				user_id :userId,
				do_action : 'edit_user'
			})
		}).then(function successCallback(response){  
		    dt = JSON.stringify(response.data); 
			json_obj = JSON.parse(dt);
			$rootScope.items_edit    = json_obj;
			$rootScope.username      = json_obj.user_name;
			$rootScope.email         = json_obj.user_email;
			console.log('presessst_status '+json_obj.preset_status);
			$rootScope.presetCheck   = json_obj.preset_status;
			
			$timeout(function () {
				var preset_status = true;
				if(json_obj.preset_status == null || json_obj.preset_status == 0 || json_obj.preset_status == undefined){ 
					preset_status = false;
				}
				console.log('preset_status '+preset_status);
				$rootScope.selectPreset1 = {checked : preset_status};
				console.log('sadsadad '+$rootScope.selectPreset1.checked);
			}, 1000); 
			
			$rootScope.selected_privileges = json_obj.privileges;
		}, function errorCallback(response) {})
	}
	
	this.updateUser = function(userId,user_name,user_password,email_address,slectd_privileges,presetStatus){
		$rootScope.items_edit='';
		var dbName = localStorage.getItem("db_name");
		var dbId   = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				db_id :dbId,
				user_id :userId,
				user_name :user_name,
				user_password :user_password,
				email_address :email_address,
				slectd_privileges :slectd_privileges,
				preset_status :presetStatus,
				do_action :'update_user'
			})
		}).then(function successCallback(response){
			if(response.data.msg == "success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: 'User updated successfully.'
				}); 
			}else{
				$ionicPopup.alert({
					title: 'Error!',
					template: response.data.msg
				}); 
			}
		}, function errorCallback(response) {})
	} 
	
	this.setloggedOffUser = function(user_id,current_url){
		$rootScope.items_edit='';
		var dbName  = localStorage.getItem("db_name");
		var dbId    = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url');  
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				db_id :dbId,
				user_id :user_id,
				current_url :current_url,
				do_action :'add_user_logg_off_detail'
			})
		}).then(function successCallback(response){
			console.log(response.data.msg);
			/* if(response.data.msg == "success"){
				$ionicPopup.alert({
					title: 'Success!',
					template: 'User updated successfully.'
				}); 
			}else{
				$ionicPopup.alert({
					title: 'Error!',
					template: response.data.msg
				}); 
			} */
		}, function errorCallback(response) {})
	} 	
	
	this.deleteloggedOffUser = function(user_id){
		$rootScope.items_edit='';
		var dbName  = localStorage.getItem("db_name");
		var dbId    = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url'); 		
		  
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				db_id :dbId,
				user_id :user_id,
				do_action :'delete_logged_offuser'
			})
		}).then(function successCallback(response){
			
		}, function errorCallback(response) {})
	} 
 
	this.getloggedOffUser = function(){
		$rootScope.items_edit='';
		var dbName  = localStorage.getItem("db_name");
		var dbId    = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url'); 
		var user_id = localStorage.getItem("user_id"); 		
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/user_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				db_id :dbId,
				user_id :user_id,
				do_action :'get_logged_off_users'
			})
		}).then(function successCallback(response){
				dt = JSON.stringify(response.data); 
				json_obj = JSON.parse(dt);
				$rootScope.items_edit = json_obj;
		}, function errorCallback(response) {})
	} 
	
	
	this.getSingleSiteDetail = function(dbID){
		var api_url = localStorage.getItem('api_url');  
		$rootScope.items_edit=''; 
		
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/getSingleSiteDetail.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_id :dbID
			})
		}).then(function successCallback(response){ 
			console.log('response dsadd '+response.data.msg);
			if(response.data.msg == "founded") {
				localStorage.setItem("site_name", "");
				localStorage.setItem("site_url", "");
				localStorage.setItem("db_name", "");
				localStorage.setItem("db_id", "");
				
				localStorage.setItem("site_name", response.data.site_name);
				localStorage.setItem("site_url", response.data.site_url);
				localStorage.setItem("db_name", response.data.db_name);
				localStorage.setItem("db_id", response.data.dbID);
				$location.path('/app/orderList=pending');  
			}

		}, function errorCallback(response) {})
	}
	
	
	this.getNewOrders = function(){
		console.log('getNewOrders ');
		var dbName  = localStorage.getItem("db_name");
		var dbId    = localStorage.getItem("db_id");
		var api_url = localStorage.getItem('api_url'); 
		var user_id = localStorage.getItem("user_id"); 				
		 
		$http({   
			method: 'POST', 
			url: api_url+'/mobileapp/check_neworder_api.php', 
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
			data: $.param({
				db_name :dbName,
				db_id :dbId,
				user_id :user_id,
				do_action: "check_neworder",
			})
		}).then(function successCallback(response){ 
			if(response.data.msg == "founded") {
				var responsed_unreadOrders = response.data.unread_orders;   /* responsed by ajax */ 
				var current_unreadOrders   = localStorage.getItem("unread_orders");  /* current stored value */
				
				if((responsed_unreadOrders > current_unreadOrders) && (current_unreadOrders > 0)){
					var order_id = response.data.order_id;   /* responsed by ajax */
					
					var currentState = $state.current.name;  
						if(currentState == "app.orderList"){
							 /* accpet/decline order popup */ 
							    
							   $http({   
									method: 'POST', 
									url: api_url+"/mobileapp/check_neworder_api.php", 
									headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
									data: $.param({
										db_name :dbName,
										db_id :dbId,
										user_id :user_id,
										order_id :order_id,
										do_action :"get_new_order_detail" 
									})
								}).then(function successCallback(response){ 
									if(response.data.msg == "founded") { 
										/* accpet/decline order popup */							 
										  
										$http({   
										method: 'POST', 
										url: api_url+"/mobileapp/check_neworder_api.php",
										headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
										data: $.param({
											db_name :dbName,
											db_id :dbId,
											user_id :user_id,
											order_id :order_id,
											do_action :"get_new_order_detail" 
										})
									}).then(function successCallback(response){ 
										if(response.data.msg == "founded" && response.data.content!="") { 
											console.log('show '+response.data.content); 
											$ionicPopup.show({
											   template: response.data.content,
											   title: 'New Order Notification',
											   buttons: [
												 { text: "Accept",
												   onTap:function(e){
														$state.go('app.acceptOrder',{'order_status':'accept','order_id': order_id});
												   }
												 },
												 { text: "Decline",
												   onTap:function(e){
														$state.go('app.declineOrder',{'order_status':'decline','order_id': order_id});
												   }
												 },
											   ]
											});	
										}
										/* else{ 
											$ionicPopup.alert({
												title: 'Error!',
												template: 'Something went wrong,please try again'
											});
										} */
										 
									}, function errorCallback(response) {}) 
									   /* end accpet/decline order popup */
									   
									}else{ 
										$ionicPopup.alert({
											title: 'Error!',
											template: 'Something went wrong,please try again CONTENT '+response.data.msg
										});
									}
									 
								}, function errorCallback(response) {}) 
						}else{
							$location.path('/app/orderList=pending');
							$state.go('app.orderList',{'order_type':'pending'});
							
							$http({   
									method: 'POST', 
									url: api_url+"/mobileapp/check_neworder_api.php",
									headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
									data: $.param({
										db_name :dbName,
										db_id :dbId,
										user_id :user_id,
										order_id :order_id,
										do_action :"get_new_order_detail" 
									})
								}).then(function successCallback(response){ 
									   console.log('ELSE content '+response.data.content);
									 
									if(response.data.msg == "founded" && response.data.content!="") { 
										console.log('show '+response.data.content); 
										$ionicPopup.show({ 
										   template: response.data.content,
										   title: 'New Order Notification',
										   buttons: [
											 { text: "Accept",
											   onTap:function(e){
													$state.go('app.acceptOrder',{'order_status':'accept','order_id': order_id});
											   }
											 },
											 { text: "Decline",
											   onTap:function(e){
													$state.go('app.declineOrder',{'order_status':'decline','order_id': order_id});
											   }
											 },
										   ]
										});	
									}
									/* else{ 
										$ionicPopup.alert({
											title: 'Error!',
											template: 'Something went wrong,please try again'
										});
									} */
									 
								}, function errorCallback(response) {})  
							
						   /* end accpet/decline order popup */
	   
						} 
					}

					/* accpet/decline order popup */ 
					 
							/*        $http({   
									method: 'POST', 
									url: api_url+"/mobileapp/check_neworder_api.php",
									//url: get_order_detail,
									headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
									data: $.param({
										db_name :dbName,
										db_id :dbId,
										user_id :user_id,
										order_id :108884,
										do_action :"get_new_order_detail" 
									})
								}).then(function successCallback(response){ 
									 // console.log('responsedsfdsfsd dsadd '+response.data.msg);
									 // console.log('content '+response.data.content);
									 
									if(response.data.msg == "founded" && response.data.content!="") { 
										console.log('show '+response.data.content); 
										$ionicPopup.show({
										   // template: 'New order (108515) has been placed, please accept.', 
										   template: response.data.content,
										   title: 'New Order Notification',
										   buttons: [
											 { text: "Accept",
											   onTap:function(e){
													$state.go('app.acceptOrder',{'order_status':'accept','order_id': 92507});
											   }
											 },
											 { text: "Decline",
											   onTap:function(e){
													$state.go('app.declineOrder',{'order_status':'decline','order_id': 92507});
											   }
											 },
										   ]
										});	
									} 
								}, function errorCallback(response) {})    */
						   /* end accpet/decline order popup */				
			
			/* $rootScope.currState = $state; */ 
				$rootScope.totalOrders = response.data.unread_orders;
				 localStorage.setItem("unread_orders", response.data.unread_orders);  
			} 
			
		}, function errorCallback(response) {})
	}  
	 
});