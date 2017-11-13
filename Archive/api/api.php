<?php
    header("Access-Control-Allow-Origin: *");
 	require_once("Rest.inc.php");
	
	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "localhost";
		const DB_USER = "root";
		const DB_PASSWORD = "@6gA4RQ^Xb*Fk997";
		const DB = "bully";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				echo $this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$username = $this->_request['username'];
			$password = $this->_request['password'];
			$login_type = $this->_request['login_type'];
			if($login_type=='parent'){
			if(!empty($username) and !empty($password)){
				//if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT id, fullname, username,email FROM users WHERE username = '$username' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();
						$result['login_type']=$login_type;	
						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$error = array('status' => "Failed", "msg" => "Please enter correct credential");
					$this->response($this->json($error), 200);
					//$this->response('', 204);	// If no records "No Content" status
				//}
			}
			}
			
			if($login_type=='child'){
			if(!empty($username) and !empty($password)){
				//if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT id, child_name, username,district,school FROM child WHERE username = '$username' AND password = '".md5($password)."' AND allow_login =1   LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$result['login_type']=$login_type;
						$this->response($this->json($result), 200);
					}
					$error = array('status' => "Failed", "msg" => "Please enter correct credential");
					$this->response($this->json($error), 200);
					//$this->response('', 204);	// If no records "No Content" status
				//}
			}
			}
			
			
		}
	
		
		private function register(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			//$data = json_decode(file_get_contents("php://input"),true);
			$data = $_POST;
			//print_r($_POST);
			//die;
			$column_names = array('username', 'email', 'password', 'fullname');
			$keys = array_keys($data);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					if($desired_key=='password'){
						$$desired_key = md5($data[$desired_key]);
					}else
					$$desired_key = $data[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			 $query = "INSERT INTO users(".trim($columns,',').") VALUES(".trim($values,',').")";
			
			if(!empty($data)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$id= $this->mysqli->insert_id;
				$data['id']=$id;
				$success = array('status' => "Success", "msg" => "User Created Successfully.", "data" => $data);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		/* private function updateCustomer(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$customer = json_decode(file_get_contents("php://input"),true);
			$id = (int)$customer['id'];
			$column_names = array('customerName', 'email', 'city', 'address', 'country');
			$keys = array_keys($customer['customer']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $customer['customer'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE angularcode_customers SET ".trim($columns,',')." WHERE customerNumber=$id";
			if(!empty($customer)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Customer ".$id." Updated Successfully.", "data" => $customer);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		} */
		
		/* private function deleteCustomer(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM angularcode_customers WHERE customerNumber = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		} */
		
		
		/*    Create Child */ 
		
		private function createChild(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			//$data = json_decode(file_get_contents("php://input"),true);
			$data = $_POST;
			//print_r($_POST);
			//die;
			$column_names = array('child_name', 'parent_id', 'district', 'school','username','password','allow_login');
			$keys = array_keys($data);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					if($desired_key=='password'){
						$$desired_key = md5($data[$desired_key]);
					}else
					$$desired_key = $data[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			 $query = "INSERT INTO child(".trim($columns,',').") VALUES(".trim($values,',').")";
			 
			
			if(!empty($data)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$id= $this->mysqli->insert_id;
				$data['id']=$id;
				$success = array('status' => "Success", "msg" => "Child Created Successfully.", "data" => $data);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		
		private function childList(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			 $parent_id = $this->_request['parent_id'];
			 $query="SELECT * FROM child WHERE parent_id = '$parent_id' ";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows >0) {
						$result = array();
						while($row = $r->fetch_assoc()){
							$result[] = $row;
						}
						$this->response($this->json($result), 200); // send user details
				
					}else{
						//$error = array('status' => "Failed");
					    $this->response('', 204);
					}
					
		}
		
		
		
		
		private function setChildstatus(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			//$data = json_decode(file_get_contents("php://input"),true);
			$data = $_POST;
			//print_r($_POST);
			//die;
			
			
			   $data['status_date']= date('Y-m-d');
			
				
			
			$column_names = array('child_id','parent_id', 'status', 'reason', 'status_date');
			$keys = array_keys($data);
			$columns = '';
			$updated_columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $data[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$updated_columns = $updated_columns.$desired_key."='".$$desired_key."',";
				$values = $values."'".$$desired_key."',";
			}
			
			$query="SELECT id FROM child_behaviour WHERE child_id = '".$data['child_id']."' AND parent_id= '".$data['parent_id']."' AND status_date = '".$data['status_date']."' LIMIT 1";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					  $result = $r->fetch_assoc();	
					  $query = "UPDATE child_behaviour SET ".trim($updated_columns,',')." WHERE child_id = '".$data['child_id']."' AND parent_id= '".$data['parent_id']."' AND status_date = '".$data['status_date']."' ";
					    $msg = 'Updaded';
						$id=$result['id'];
					
			    }else{
					   $query = "INSERT INTO child_behaviour(".trim($columns,',').") VALUES(".trim($values,',').")";
					   $msg = 'Added';
				}
				
			  if(!empty($data)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($msg=='Added')
				{
					$id= $this->mysqli->insert_id;
				}
				$data['id']=$id;
				$success = array('status' => "Success", "msg" => "Child Behaviour $msg Successfully.", "data" => $data);
				$this->response($this->json($success),200);
			   }else
				$this->response('',204);	//"No Content" status
					
		}
		
		
		private function child_filter(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			 $parent_id = $this->_request['parent_id'];
			 $child_id = $this->_request['child_id'];
			 $start_date = $this->_request['start_date'];
			 $end_date = $this->_request['end_date'];
			  $query="SELECT cb.*,c.child_name FROM `child_behaviour` cb join child c on cb.child_id=c.id  WHERE cb.child_id=$child_id and cb.parent_id=$parent_id and (cb.`status_date`>='".$start_date."' and cb.`status_date` <='".$end_date."') "; 
			 /*  $query="SELECT cb.*,count(cb.child_id) as count,c.child_name FROM `child_behaviour` cb join child c on cb.child_id=c.id  WHERE  cb.parent_id=$parent_id and (cb.`status_date`>='".$start_date."' and cb.`status_date` <='".$end_date."') GROUP by cb.`status` "; */
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows >0) {
						$result = array();
						while($row = $r->fetch_assoc()){
							$result[] = $row;
						}
						$this->response($this->json($result), 200); // send user details
				
					}else{
						//$error = array('status' => "Failed");
					    $this->response('', 204);
					}
					
		}
		
		
		private function mood_count(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			
			 $parent_id = $this->_request['parent_id'];
			 $child_id = $this->_request['child_id'];
			 $start_date = $this->_request['start_date'];
			 $end_date = $this->_request['end_date'];
			  $query="SELECT cb.*,count(cb.child_id) as count,c.child_name FROM `child_behaviour` cb join child c on cb.child_id=c.id  WHERE cb.child_id=$child_id and cb.parent_id=$parent_id and (cb.`status_date`>='".$start_date."' and cb.`status_date` <='".$end_date."') GROUP by cb.`status`  "; 
			 /*  $query="SELECT cb.*,count(cb.child_id) as count,c.child_name FROM `child_behaviour` cb join child c on cb.child_id=c.id  WHERE  cb.parent_id=$parent_id and (cb.`status_date`>='".$start_date."' and cb.`status_date` <='".$end_date."') GROUP by cb.`status` "; */
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows >0) {
						$result = array();
						while($row = $r->fetch_assoc()){
							$result[] = $row;
						}
						$this->response($this->json($result), 200); // send user details
				
					}else{
						//$error = array('status' => "Failed");
					    $this->response('', 204);
					}
					
		}
		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>