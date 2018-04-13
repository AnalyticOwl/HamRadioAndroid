<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;  
use DB;
use URL; 
use Mail;

class APIController extends BaseController { 
	
	
			
	
	public function songs()
	{
		$songsList = DB::table('songs')->get();
		$response = array('status' => 'success', 'message' => '', 'songs' =>  $songsList);
		 echo json_encode($response);
	}

	public function specific_songs($limit,$id)
	{
		$specific_song = DB::table('songs')->where('id', '=', $id)->get();
		if(count( $specific_song) > 0)
		{
			$response = array('status' => 'success', 'message' => '', 'songs' =>  $specific_song);
		}
		else
		{
			$response = array('status' => 'error', 'message' => 'Invalid song id');
		}
		echo json_encode($response);
	}
	
	public function singleSong($songId)
	{
		$song = array();
		if($songId!="")
		{			
			$song = DB::table('songs')->where('id',$songId)->get();
		}
		else
		{
			$song = DB::table('songs')->get();
		}
		
		$response = array('status' => 'success', 'message' => '', 'song' =>  $song);
		echo json_encode($response);
	}
	
	public function offsetSongs($pageId)
	{
		$songsList = array();
		if($pageId!=""){
			$offset = $pageId*10;
			$songsList = DB::table('songs')->skip($offset)->limit(10)->get();		  
		}else{
			$songsList = DB::table('songs')->get();
		}
		
	  	$response = array('status' => 'success', 'message' => '', 'songs' =>  $songsList);
	   	echo json_encode($response);
	}

	// post api's
	
	/*public function createalbum(Request $request)
	{
		$base_url = URL::to('/');
		if(isset($request))
		{
			if(isset($request->name) && $request->name != '')
			{
				$albumName = $request->name;
			}
			else
			{
				$response = array('status' => 'error', 'message' => 'Album name is required');
				echo json_encode($response);
			}
			
				$albumName = $request->name;
				
				$image_title = $request->image_title;
				$image_name = $_FILES['image']['name'];
				$image_tmp_name = $_FILES['image']['tmp_name'];
				$path = "storage/images/";
				$image_path = $path.$image_name;
				move_uploaded_file($image_tmp_name,$image_path);
			
				$imageUrl = $base_url.'/'.$image_path;
				$artist = $request->artist;
				
				$albumId = DB::table('albums')->insertGetId( [ 'name' => "$albumName", 'image' => "$imageUrl", 'artist' => "$artist"] ) ;
				if($albumId != '')
				{
					$response = array('status' => 'sucess', 'message' => 'Record inserted successfully');
					if(isset($request->songs_list) && $request->songs_list != '')
					{
						$song_list = json_decode($request->songs_list);
						dd($song_list );
					}
					else
					{
						dd('here');
					}
					echo json_encode($response);
				}
				else
				{
					$response = array('status' => 'error', 'message' => 'Record not inserted');
					echo json_encode($response);
				}
		}
		else
		{
			$response = array('status' => 'error', 'message' => 'Bad request.');
		}
	}*/
	
	public function register_user()
	{
		if(isset($_POST['data']))
		{
		    
		    $allData = json_decode($_POST['data']);
		    
			$base_url = URL::to('/');
			$username = $allData->username;
			$email = $allData->email;
			$password = $allData->password;
		/*
			$email = $request->email;
			$password = $request->password;
			$token = $request->token;
			$image = $request->image;
			
			$image_name = $_FILES['image']['name'];
			$image_tmp_name = $_FILES['image']['tmp_name'];
			$path = "storage/images/";
			$image_path = $path.$image_name;
			move_uploaded_file($image_tmp_name,$image_path);
		
			$imageUrl = $base_url.'/'.$image_path;
		*/	
		    $response = '';
		    $usernamecheck = DB::table('users')->where('username','=',$username)->get();
		    if(count( $usernamecheck))
		    {
	        	$response = array('status' => 'error', 'message' => 'Username already exists');
	        	return json_encode($response);
		    }
		    $emailcheck = DB::table('users')->where('email','=',$email)->get();
		    if(count( $emailcheck))
		    {
	        	$response = array('status' => 'error', 'message' => 'Email already exists');
	        	return json_encode($response);
		    }
		   
		    $creationdate = date('Y-m-d H:i:s');
			$userid = DB::table('users')->insertGetId( [ 'username' => "$username", 'email' => "$email", 'password' => "$password", 'creationdate' => "$creationdate", 'status' => 0] ) ;
		//	$user = DB::table('users')->where('id','=',$userid)->get() ;
		//	$user = $user[0];
	       $this->sendEmail($email,$userid,$creationdate);
			$response = array('status' => 'success', 'message' => 'User created succesffully');
		}
		else
		{
			$response = array('status' => 'error', 'message' => 'Bad request.');
		}	
		echo json_encode($response);
	}
	public function sendEmail($email,$userid,$creationdate)
   {
        $base_url = URL::to('/');
        $link = base64_encode($creationdate.'_'.$userid);
        
        
        $messageToSend = 'Thank you for registering with us.';
        $messageToSend .= '<br>';
        $messageToSend .= 'Please copy the following link into new window and press enter to activate your account :';
        $messageToSend .= '<br>';
        $messageToSend .= $base_url.'/confirm-email/'.$link;
       
        
        Mail::send([], [], function ($message) use ($email,$messageToSend) {
        $message->from('hamstereq@testingserver.net', 'Support');
        $message->to($email)->subject('Email Confirmation')->setBody($messageToSend ,'text/html');

		});
   }
   public function confirm_email($id)
   {
        $link = base64_decode($id);
        $data = explode('_',$link);
        $date = $data[0];
        $userid = $data[1];
        $user = DB::select('select * from users where id = '.$userid);
        $currentdate = date('Y-m-d H:i:s');
        
        $diff = strtotime($currentdate) - strtotime($date);
        $diff_in_hrs = $diff/3600;
        $response = '';
        if(count($user) > 0)
        {
            if(floor($diff_in_hrs) > 24)
            {
                $response = array('status' => 'error', 'message' => 'This link has been expired');
    			return json_encode($response);
            }
            else
            {
                 $user = DB::select('update users set status = 1  where id = '.$userid);
                // $response = array('status' => 'success', 'message' => 'Status has been updated successfully');
    			// return json_encode($response);
            }
        }
        
   }
	public function login_user(Request $request)
	{
	    if(isset($_POST['data']))
		{
		    $allData = json_decode($_POST['data']);
		    
			$base_url = URL::to('/');
			$email = $allData->email;
			$password = $allData->password;
			$response = '';
		    $isUserExists = DB::select("select id,username, email, status  from users where  email = '{$email}' and password = '{$password}' and status = 1");
		    if(count( $isUserExists) > 0)
		    {
	        	$response = array('status' => 'success', 'message' => 'User login successfully', 'data' => $isUserExists);
	        	return json_encode($response);
		    }
		    else
		    {
		        $response = array('status' => 'error', 'message' => 'Invalid crednetials');
	        	return json_encode($response);
		    }
		}
	
		else
		{
			$response = array('status' => 'error', 'message' => 'Bad request.');
		}	
		echo json_encode($response);
	}
	
	public function getProfile()
	{
		$profilesList = DB::table('profile')->orderby('name','asc')->get();
		$response = array('status' => 'success', 'message' => '', 'profile' =>  $profilesList);
		 echo json_encode($response);
	}

	public function getProfileById($id)
	{
	  
		$profilesList = DB::select("select * from profile where id = ".$id);

		if(count( $profilesList) > 0)
		{
			$response = array('status' => 'success', 'message' => '', 'profile' =>  $profilesList);
		}
		else
		{
			$response = array('status' => 'error', 'message' => 'Invalid profile id');
		}
		echo json_encode($response);
	}
	public function addNewProfile()
	{
	   
	   	if(isset($_POST['data']))
	   	{
	   	    $allData = json_decode($_POST['data']);
	   	    
	   	    $profile = $allData->profile;
	   	    
	   	   $name = $profile[0]->name;
    	   $band = $profile[0]->band;
    	   $status = $profile[0]->status;
    	   
    	   if( $name == '' )
    			{
    				$response = array('status' => 'error', 'message' => 'Profile name is required');
    				return json_encode($response);
    			}
    			if( $band == '')
    			{
    				$response = array('status' => 'error', 'message' => 'Band value is required');
    				return json_encode($response);
    			}
    			if( $status   == '')
    			{
    				$response = array('status' => 'error', 'message' => 'Status value is required');
    				return json_encode($response);
    			}
    			
    			 // Loop through Object
                 // Replace ... with your PHP Object
                $string ="";
                if(is_object($band)){
                    foreach($band as $key => $value) {
                        $string  .= $key.":".$value.",";
                    }     
                    trim($string,",");
    			    
    			    $id = DB::table('profile')->insertGetId( [ 'name' => "$name", 'band' => "$string", 'status' => "$status"] ) ;
                }else{
                    $id = DB::table('profile')->insertGetId( [ 'name' => "$name", 'band' => "$band", 'status' => "$status"] ) ;    
                }
                
    			

    			
    				$response = array('status' => 'success', 'message' => 'Profile inserted succesffully', 'profile Id' => $id);
    				
	   	}
	   	else
		{
			$response = array('status' => 'error', 'message' => 'Bad request.');
		}	
// 	    if(isset($request->profile))
// 	    {
//     	    $requestArray = json_decode($request->profile);
    	  
//     		if(isset($requestArray))
//     		{
//     			$name = $requestArray[0]->name;
//     			$band = $requestArray[0]->band;
//     			$status = $requestArray[0]->status;
    		
//     			if( $name == '' )
//     			{
//     				$response = array('status' => 'error', 'message' => 'Profile name is required');
//     				return json_encode($response);
//     			}
//     			if( $band == '')
//     			{
//     				$response = array('status' => 'error', 'message' => 'Band value is required');
//     				return json_encode($response);
//     			}
//     			if( $status   == '')
//     			{
//     				$response = array('status' => 'error', 'message' => 'Status value is required');
//     				return json_encode($response);
//     			}
//     			$id = DB::table('profile')->insertGetId( [ 'name' => "$name", 'band' => "$band", 'status' => "$status"] ) ;
//     				$response = array('status' => 'success', 'message' => 'Profile inserted succesffully', 'profile Id' => $id);
//     		}
// 	    }
// 		else
// 		{
// 			$response = array('status' => 'error', 'message' => 'Bad request.','request'=>$request);
// 		}	
		echo json_encode($response);
	}
	
	public function updateProfile()
	{
	     if(isset($_POST['data']))
	     {
	          $allData = json_decode($_POST['data']);
	         
	         if( $allData->profile->id == '')
	         {
	             $response = array('status' => 'error', 'message' => 'Invalid profile id');
	             return json_encode($response);
	         }
	          if( $allData->profile->name == '')
	         {
	             $response = array('status' => 'error', 'message' => 'Please provide profile name');
	             return json_encode($response);
	         }
	          if( $allData->profile->status == '')
	         {
	             $response = array('status' => 'error', 'message' => 'Please provide status value');
	             return json_encode($response);
	         }
	         
	         $id = DB::table('profile')->where('id',  $allData->profile->id  )->update( ['name' =>  $allData->profile->name , 'band' =>  $allData->profile->band,  'status' =>  $allData->profile->status  ]) ;
	         
	          $response = array('status' => 'success', 'message' => 'Profile updated successfully');
	          return json_encode($response);
	     }
	}
	public function addplaylist()
	{

	   if(isset($_POST['data']))
	   {
	      
	       $allData = json_decode($_POST['data']);
	       
	      if($allData->playlists[0]->name == '') 
	      {
	         $response = array('status' => 'error', 'message' => 'Please provide play list name');
	         return json_encode($response); 
	      }
	       if($allData->playlists[0]->user_id == '') 
	      {
	         $response = array('status' => 'error', 'message' => 'Please provide user id');
	         return json_encode($response); 
	      }
	      
	      $is_playlist_exists = DB::table('playlist')->where('name', '=', $allData->playlists[0]->name)->where('user_id', '=', $allData->playlists[0]->user_id)->get();
	      if(count($is_playlist_exists) > 0)
	      {
	            DB::table('playlist')->where('name' , '=', $allData->playlists[0]->name)->where('user_id' , '=', $allData->playlists[0]->user_id)->delete();
	            DB::table('songs')->where('playlist_id' , '=',  $is_playlist_exists[0]->id)->delete();
	      }
	      
	      $id = DB::table('playlist')->insertGetId( ['name' => $allData->playlists[0]->name, 'user_id' => $allData->playlists[0]->user_id] ) ;
	      
	       foreach( $allData as $playlist)
	       {
	          foreach($playlist[0]->songs as $songs)
	            {
	                DB::table('songs')->insert( [ 'name' => $songs->name, 'artist' => $songs->artist, 'image' => $songs->image, 
	                'album_id' => $songs->album_id, 'songUrl' => $songs->songUrl, 'playlist_id' =>  $id,'profile_id' =>  $songs->profile_id] ) ;
	            }
	       }

	       $playlist = DB::table('playlist')->where('id', '=', $id)->get();
	       $songslist= DB::table('songs')->where('playlist_id', '=',  $id)->get();
	       $playlistNew['id'] = $playlist[0]->id;
	       $playlistNew['name'] = $playlist[0]->name;
	        $playlistNew['user_id'] = $playlist[0]->user_id;
	       $playlistNew['songs'] =$songslist;
	     //  $playlist['songs'] =  =
	       $responses['playlists'] = $playlistNew;
	       $response = array('status' => 'success', 'data' => $responses);
	   }
	   else
		{
			$response = array('status' => 'error', 'message' => 'Bad request.');
		}
		
	    echo json_encode($response);
	}
	public function getplaylist($id,$pid)
	{
	     $playlist = DB::select("select * from playlist where user_id = '{$id}' and id = $pid");

	    if(count($playlist) > 0)
	    {
	       $songslist= DB::table('songs')->where('playlist_id', '=',  $playlist[0]->id)->get();
	       $playlistNew['id'] = $playlist[0]->id;
	       $playlistNew['name'] = $playlist[0]->name;
	       $playlistNew['user_id'] = $playlist[0]->user_id;
	       $playlistNew['songs'] =$songslist;
	       $responses['playlists'] = $playlistNew;
	       $response = array('status' => 'success', 'data' => $responses);
	    }
	    else
	    {
	        $response = array('status' => 'error', 'message' => 'Invalid user id');
	    }
	    echo json_encode($response);
	}
	public function getplaylists($id)
	{
	     $playlist = DB::select("select id,name  from playlist where user_id = '{$id}'");

	    if(count($playlist) > 0)
	    {
	      
	       $response = array('status' => 'success', 'data' =>$playlist);
	    }
	    else
	    {
	        $response = array('status' => 'error', 'message' => 'Invalid user id');
	    }
	    echo json_encode($response);
	}
	public function updateplaylist()
	{
		
	     
	     if(isset($_POST['data']))
	     {
    	         $allData = json_decode($_POST['data']);
    	         
    	        
    	      if($allData->playlists[0]->id == '') 
    	      {
    	         $response = array('status' => 'error', 'message' => 'Please provide play list id');
    	         return json_encode($response); 
    	      }
    	      /*if($allData->playlists[0]->name == '') 
    	      {
    	         $response = array('status' => 'error', 'message' => 'Please provide play list name');
    	         return json_encode($response); 
    	      }*/
    	      
	         $playlistss = DB::select("select * from playlist where id = " .$allData->playlists[0]->id);
	        
	        if(count( $playlistss) > 0)
    	        {
    	         foreach( $allData as $playlist)
        	       {
        	           
        	           //$id = DB::table('playlist')->where('id',  $playlist[0]->id  )->update( ['name' =>  $playlist[0]->name]) ;
        	          
        	            foreach($playlist[0]->songs as $songs)
        	            {
        	                /*DB::table('songs')->where('id',  $songs->id  )->update( [  'name' => $songs->name, 'artist' => $songs->artist, 'image' => $songs->image, 
        	                'album_id' => $songs->album_id, 'songUrl' => $songs->songUrl, 'playlist_id' =>  $songs->playlist_id, 'profile_id' =>  $songs->profile_id] ) ;*/
			
				 DB::table('songs')->insert( [ 'name' => $songs->name, 'artist' => $songs->artist, 'image' => $songs->image, 
	                'album_id' => $songs->album_id, 'songUrl' => $songs->songUrl, 'playlist_id' =>  $allData->playlists[0]->id,'profile_id' =>  $songs->profile_id] ) ;
        	            }
        	       }
        	          $response = array('status' => 'success', 'message' => 'Play list updated successfully');
        	          
    	        }
    	       
	     }
	     else
    	        {
    	             $response = array('status' => 'error', 'message' => 'Invalid play list id');
    	        }   
	    echo json_encode($response);
	}

	public function deleteplaylist($id)
	{
	      $playlist = DB::select("select * from playlist where id = " .$id);
	    
	        
        if(count( $playlist) > 0)
        {
            DB::select("delete from songs where playlist_id = " .$id);
            DB::select("delete from playlist where id = " .$id);
            $response = array('status' => 'success', 'message' => 'Play list deleted successfully');
	    }
    	else
        {
             $response = array('status' => 'error', 'message' => 'Invalid playlist id');
        }   
	    echo json_encode($response);
	}
	public function forgetPassword()
	{
		
		if(isset($_POST['data']))
	     {
    	         $allData = json_decode($_POST['data']);
    	        
    	      if($allData->email == '') 
    	      {
    	         $response = array('status' => 'error', 'message' => 'Please provide email address');
    	         return json_encode($response); 
    	      }
    	      
	         $user = DB::select("select * from users  where email = '{$allData->email}' and status = 1");
	       
	        if(count($user) > 0)
    	    {
				$this->sendForgetPasswordEmail($allData->email,$user[0]->id);
				$response = array('status' => 'success', 'message' => 'A reset password email has been sent.');
			}
			else
			{
				$response = array('status' => 'error', 'message' => 'User does not exists');
    	        return json_encode($response); 
			}
    	       
	     }
	     else
		{
			 $response = array('status' => 'error', 'message' => 'Please provide email address');
		}   
	    echo json_encode($response);
	}
	public function sendForgetPasswordEmail($email,$userid)
   {
        $base_url = URL::to('/');
        $link = base64_encode($email.'_'.$userid);
        
        $messageToSend = 'Hi,';
        $messageToSend .= '<br>';
        $messageToSend .= 'A forget password request has been sent by you. Please click on the following link to reset your password. ';
        $messageToSend .= '<br>';
        $messageToSend .= $base_url.'/reset-password/'.$link;
       
        
        Mail::send([], [], function ($message) use ($email,$messageToSend) {
        $message->from('hamstereq@testingserver.net', 'Support');
        $message->to($email)->subject('Forget Password')->setBody($messageToSend ,'text/html');

		});
		
   }
   public function resetPassword($id)
   {
	  	$link = base64_decode($id);
		$data = explode('_' ,$link);
		$email = $data[0];
		return view('resetPassword',compact('email'));
   }
   public function changePassword(Request $request)
   {
	    $email = $request->email;
		$password = $request->password;
		
		DB::select("update users set password = '{$password}' where email = '{$email}'");
		$response = array('status' => 1);
		return json_encode($response);
   }
   
}

?>
