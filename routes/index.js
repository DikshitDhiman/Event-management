var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var User =  require('./../models/loginUserSchema.js');
var Service =  require('./../models/serviceProviderSchema.js');
var Customer =  require('./../models/customerSchema.js');
var UserQuery = require('./../models/userQuerySchema.js');
var Booked = require('./../models/customerBooking.js');
var jsmd5 = require('js-md5');


/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '.public/images/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
  }
});
var upload = multer({ //multer settings
    storage: storage
  }).single('file');



//Success
router.get('/', function(req, res) {
  
  res.sendFile(path.join(__dirname + './../public/Angular/Templates/index.html'));
});


//Success
router.post('/userLogin', function(req,res) {
    console.log("SignIN Request GEt , Data is : ",req.body.user);

    var username = req.body.user.username;
    var pass = jsmd5(req.body.user.pass);

      console.log("The UserName Is : "+username+"\n The Password is  : "+pass);
      User.findOne({'username' : username},function(err,user)
      {
          if(err)
          {
            console.log("Error Occured",err);
            res.status(204).send("Error to find a User");
            return;
          }
          else if(!user)
          {
            //console.log("Data Not Foundd");
            //res.status(204).send({message : "User Not Found"});
            res.send("User Not Found");
          }
          else
          {
            console.log("Data Found");
            if(user.password == pass)
              {
                console.log("Password Matched , User Login Successfully");
                req.session.user = user;
          
                console.log("You Are in Session Name : "+req.session.user.username);
                res.status(200).send({data:user , sessionuser : req.session.user.username});
                //res.redirect('dashboard');
                //res.send({data:user}) 
              }
              else
              {
                console.log("PassWord is Incorrect");
              }
          }
    });
});



router.get('/login/checkSession', function(req, res) {
    //console.log("You Are in Session : "+req.session.user.name);
    if(req.session.user)
    {
        res.send({status : 200});
    }
    else
    {
        res.send({status : 400});
    }
});


//Success
router.post('/userRegister' ,function(req,res) {
  console.log("Sign Up Request Get",req.body.user.userName);
  var pass = jsmd5(req.body.user.pass);
  var cpass = jsmd5(req.body.user.cpass);
  console.log(pass , cpass);
  if(pass==cpass)
  {
    User.findOne({"username" : req.body.user.userName},function(err,data)
      {
          if(err)
          {
            console.log("Error Occured");
            res.send("Error to find a User");
            return;
          }
            
          else if(data)
          {
            console.log("Data Found");
            res.send("Username Already Registered , Please try OtherOne");
            return;
          }
          else
          {
              var newuser = new User({
                'usertype' : req.body.user.usertype,
                'name' : req.body.user.firstName+" "+req.body.user.lastName,
                'username' : req.body.user.userName,
                'email' : req.body.user.email,
                'password' : pass
              });
              console.log("The Info you want to saVE is : ",newuser);
              newuser.save(function(err,data)
              {
                  if(err){
                    console.log("Can't Register",err);
                  }
                  else if(!data)
                  {
                    console.log("data not Saved");
                  }
                  else
                  {
                    res.status(200).send("User Successfully Registered");
                  }
              });
          }
      });
    
    }

});



router.post('/serviceLogin', function(req,res) {
    console.log("Service Provider Login API");
    var username = req.body.service.username;
    var pass = jsmd5(req.body.service.pass);

    Service.findOne({'username' : username} , function(err,user) {
        if(err)
        {
            res.status(500).send("Error",err);
            return;
        }
        else if(!user) {
            console.log("User Not Found");
            res.status(204).send({message : "User Not Found"});
            return;
        }
        else
        {
            console.log("UserName Exist");
            if(user.password == pass)
            {
              console.log("Password Mathched");
              res.status(200).send({message : "Login Successfully" , data : user});
            }
            else
            {
              console.log("Password not Matched");
              res.status(204).send({message : "Password not Matched"});
              return;
            }
        }
    });
});



router.post('/serviceRegistration', function(req,res) {
    console.log("Service Provider Registration API");
    Service.findOne({'username' : req.body.service.username} ,function(err,service) {
      if(err)
      {
        res.status(500).send({message : "error in Find User" , err : err});
        return;
      }
      else if(!service)
      {
          console.log("You Are Unique User , Go Ahead");
          var newservice = new Service ({
              'name' : req.body.service.firstName+" "+req.body.service.lastName,
              'username' : req.body.service.username,
              'email' : req.body.service.email,
              'servicetype' : req.body.service.type,
              'password' : req.body.service.pass
          });

          newservice.save(function(err , data) {
            if(err){
              res.status(500).send({message : "Error" , err : err});
            }
            else if(!data) {
              res.status(200).send({message : "User Not Registered"});
              return;
            }
            else {
              res.status(200).send({message : "Successfully REgistered" , data : data});
              return;

            }
          });
      }
      else
      {
          res.status(204).send({message : "Username AlreaDY registered"});
          return;
      }
    });
      
});


/*router.get('/userProfile' , function(req,res) {
    console.log("The userProfile API");
    //console.log("The UserType is : "+req.session.user.usertype);
    if(req.session.user)
    {
        User.find({'username':req.session.user.username}, function(err, data) {
            if(err)
            {
                res.status(500).send({message : "Error Occured" , error : err});
            }
            else if(!data)
            {
                res.status(204).send({message : "Data Not Found" , data : data});
            }
            else
            {
                console.log("data Found");
                res.status(200).send({data : data});
            }
        });
    }
    else
    {
      res.status(204).send({message : "You Are not Logged In"});
    }
});*/


//Success
router.get('/dashboardProfile' , function(req,res) {
    console.log("The dashboardProfile API");
    console.log("The UserType is : "+req.session.user.usertype);
    if(req.session.user.usertype == "user")
    {
        User.find({'username':req.session.user.username}, function(err, data) {
            if(err)
            {
                res.status(500).send({message : "Error Occured" , error : err});
            }
            else if(!data)
            {
                res.status(204).send({message : "Data Not Found" , data : data});
            }
            else
            {
                console.log("data Found");
                res.status(200).send({message : "Data SuccessFully Found" , data : data});
            }
        });
    }
    else if(req.session.user.usertype == "serviceprovider")
    {
        Service.find({'username':req.session.user.username}, function(err, data) {
            if(err)
            {
                res.status(500).send({message : "Error Occured" , error : err});
            }
            else if(!data)
            {
                res.status(204).send({message : "Data Not Found" , data : data});
            }
            else
            {
                console.log("data Found");
                res.status(200).send({data : data});
            }
        });
    }
    else
    {
        res.status(200).send({message : "You are not in a Session , Please Login First"});
    }
});


//Success
router.get('/signout', function(req,res) {
  console.log("Logging out");
  //req.session.user.destroy();
  req.session.destroy(function(err) {
        if(err){
          res.status(204).send("Can't Destroy");
        }
        else
        {
          res.status(200).send("Successfully Destroyed"); 
        }
    })

});


//Success
router.get('/serviceProvider' , function(req,res) {
  console.log("Service Provider API");
  if(req.session.user.usertype == "user")
  {
      Service.find({}, function(err,service) {
          if(err)
          {
            res.status(500).send({message : "Error Occured" , error : err});
          }

          else if(!service) {
            res.status(204).send({message : "Services Not Foundd"});
          }

          else
          {
            console.log("Services Foundd", service);
            // console.log("Services Foundd");
            res.status(200).send({message : "Data Successfully Retreived" , data : service});
          }
      });
  }
  else
  {
    res.status(204).send({message : "You Don't have Permission"});
  }
  
});


router.post('/imageUpload', function(req, res) {
  console.log("Image Upload API");
  upload(req,res,function(err){
      if(err){
          res.json({error_code:1,err_desc:err});
          return;
          }
          console.log("image",req.session.user.name);
          res.json({error_code:0,err_desc:null});
      });
})




//Success
router.post('/contactQuery' , function(req , res) {
   console.log("This is Contact Query API");
   var newQuery = new UserQuery({
        'name' : req.body.query.firstName+" "+req.body.query.lastName,
        'email' : req.body.query.email,
        'message' : req.body.query.message
   });
   console.log("")
   newQuery.save(function(err , data) {
        if(err)
          {
            res.status(500).send("Error Occured ::",err);
          }

          else if(!data) {
            res.status(204).send({message : "Query Unsuccessfull"});
          }

          else
          {
            console.log("Successfully POsted Query");
            res.status(200).send({message : "Query Successfull", data : data});
          }
   });
});



router.post('/Admin/addUser' , function(req,res) {
    console.log("You are in Admin Add User API");
    //console.log("Sign Up Request Get",req.body.user);
    //var pass = jsmd5(req.body.add.pass);
    //var cpass = jsmd5(req.body.add.cpass);
    
    
      User.findOne({"username" : req.body.add.userName},function(err,data)
        {
            if(err)
            {
              console.log("Error Occured");
              res.send("Error to find a User");
              return;
            }
              
            else if(data)
            {
              console.log("Data Found");
              res.send("Username Already Registered , Please try OtherOne");
              return;
            }
            else
            {
                var newuser = new User({
                  'usertype' : req.body.add.userType,
                  'name' : req.body.add.firstName+" "+req.body.add.lastName,
                  'username' : req.body.add.userName,
                  'email' : req.body.add.email,
                  'password' : pass
                });
                console.log("The Info you want to saVE is : ",newuser);
                newuser.save(function(err,data)
                {
                    if(err){
                      console.log("Can't Register",err);
                    }
                    else if(!data)
                    {
                      console.log("data not Saved");
                    }
                    else
                    {
                      res.status(200).send({message : "User Successfully Registered" , data : data});
                    }
                });
            }
        });
});



router.post('/Admin/addServiceProvider' , function(req,res) {
    console.log("You are in Admin Add Service API");
    //console.log("Sign Up Request Get",req.body.user);
    //var pass = jsmd5(req.body.add.pass);
    //var cpass = jsmd5(req.body.add.cpass);
    
    
      User.findOne({"username" : req.body.add.userName},function(err,data)
        {
            if(err)
            {
              console.log("Error Occured");
              res.send("Error to find a User");
              return;
            }
              
            else if(data)
            {
              console.log("Data Found");
              res.send("UserName Already Registered , Please try OtherOne");
              return;
            }
            else
            {
                var newService = new Service({
                  'usertype' : req.body.add.userType,
                  'name' : req.body.add.firstName+" "+req.body.add.lastName,
                  'username' : req.body.add.userName,
                  'email' : req.body.add.email,
                  'password' : pass
                });
                console.log("The Info you want to saVE is : ",newService);
                newService.save(function(err,data)
                {
                    if(err){
                      console.log("Can't Register",err);
                    }
                    else if(!data)
                    {
                      console.log("data not Saved");
                    }
                    else
                    {
                      res.status(200).send({message : "User Successfully Registered" , data : data});
                    }
                });
            }
        });
});



router.put('/Admin/editUser' , function(req,res) {
  console.log("Edit Up Request Put",req.body.editUser);
  var pass = jsmd5(req.body.editUser.pass);
  var cpass = jsmd5(req.body.editUser.cpass);
  console.log(pass , cpass);
  if(pass==cpass)
  {
    User.findOne({"username" : req.body.editUser.userName},function(err,data)
      {
          if(err)
          {
            console.log("Error Occured");
            res.send("Error to find a User");
            return;
          }
            
          else if(data)
          {
            console.log("Data Found");
            res.send("Username Already Registered , Please try OtherOne");
            return;
          }
          else
          {
              var userUpdate = new User({
                  'usertype' : req.body.editUser.userType,
                  'name' : req.body.editUser.firstName+" "+req.body.editUser.lastName,
                  'username' : req.body.editUser.userName,
                  'email' : req.body.editUser.email,
                  'password' : pass
              });

              console.log("The Info you want to saVE is : ",userUpdate);

              User.findOneAndUpdate({'_id': data._id}, {$set: {'usertype': userUpdate.usertype , 'name':userUpdate.name , 'username' : userUpdate.username,'email' : userUpdate.email, 'password' : userUpdate.password}}, {upsert: fasle}, function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Record Can't Uodated"); 
                    res.status(204).send({message : "Not Updated"});
                    return;
                  }
                  else
                  {
                    console.log("User Successfully Updated");
                    res.status(200).send({message : "Successfully Updated" , data : doc});
                    return;
                  }
              });
          }
      });
    
    } 
});



router.put('/Admin/deleteUser' , function(req ,res) {
    console.log("Delete User Request Put",req.body.deleteUser);
    var username  = req.body.deleteUser.username;
  
    User.findOne({"username" : userName},function(err,data)
      {
          if(err)
          {
            console.log("Error Occured");
            res.send("Error to find a User");
            return;
          }
            
          else if(!data)
          {
            console.log("Data Not Found");
            res.send("Username not MAtched , Please try OtherOne");
            return;
          }
          else
          {
              User.findOneAndUpdate({'_id': data._id}, {$set: {'deleteduser': true}}, {upsert: fasle}, function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Record Can't Uodated"); 
                    res.status(204).send({message : "Not Updated"});
                    return;
                  }
                  else
                  {
                    console.log("User Successfully Deleted");
                    res.status(200).send({message : "Successfully Deleted" , data : doc});
                    return;
                  }
              });
          }
      });
    
});



router.put('/Admin/deleteServiceProvider' , function(req ,res) {
    console.log("Delete User Request Put",req.body.deleteService);
    var username  = req.body.deleteService.username;
  
    User.findOne({"username" : username},function(err,data)
      {
          if(err)
          {
            console.log("Error Occured");
            res.send("Error to find a User");
            return;
          }
            
          else if(!data)
          {
            console.log("Data Not Found");
            res.send("Username not MAtched , Please try OtherOne");
            return;
          }
          else
          {
              User.findOneAndUpdate({'_id': data._id}, {$set: {'deletedservice': true}}, {upsert: fasle}, function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Record Can't Deleted"); 
                    res.status(204).send({message : "Not Deleted"});
                    return;
                  }
                  else
                  {
                    console.log("Services Successfully Deleted");
                    res.status(200).send({message : "Successfully Deleted" , data : doc});
                    return;
                  }
              });
          }
      });
    
});



router.get('/Admin/DashBoard' , function(req ,res) {
    console.log("Get Admin DashBoard");
})



//Success
router.post('/serviceProvider/addProfile' , function(req,res) {
  console.log("Add Profile POST API with username : " + req.session.user.username);
  console.log("The New Info is : ",JSON.stringify(req.body.newUser));
    Service.findOne({'username' : req.session.user.username},function(err,data)
      {
          if(err)
          {
            console.log("Error Occured");
            res.send("Error to find a User");
            return;
          }
            
          else if(data)
          {
            console.log("Data Found");
            console.log("Username Already Registered , It will Update");
            var serviceUpdate = new Service({
                  'servicetype' : req.body.newUser.servicetype,
                  'servicecharge' : req.body.newUser.servicecharge
              });

              console.log("The data you want to Update is ",serviceUpdate);
              Service.findOneAndUpdate({'_id': data._id}, {$set: {'servicetype': serviceUpdate.servicetype , 'servicecharge' : serviceUpdate.servicecharge}}, {upsert: false}, function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Record Can't Uodated"); 
                    res.status(204).send({message : "Not Updated"});
                    return;
                  }
                  else
                  {
                    console.log("ServiceProvider Successfully Updated");
                    res.status(200).send({message : "Successfully Updated" , data : doc});
                    return;
                  }
              });
          }
          else
          {
              console.log("UserName is not Exist , Record will be create new");
               var servicetype = req.body.newUser.servicetype;
               var servicecharge = req.body.newUser.servicecharge;
               var serviceUpdate = new Service({
                  'name' : req.session.user.name,
                  'username' : req.session.user.username,
                  'email' : req.session.user.email,
                  'servicetype' : servicetype,
                  'servicecharge' : servicecharge,
                  'deleteflag' : false
              });
              console.log(servicetype,servicecharge);
              console.log("The Record you want to Create in Service is : ",serviceUpdate);

              serviceUpdate.save(function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Records Can't Save"); 
                    res.status(204).send({message : "Unsuccessfull"});
                    return;
                  }
                  else
                  {
                    console.log("ServiceProvider Successfully Saved");
                    res.status(200).send({message : "Successfully Saved" , data : doc});
                    return;
                  }
              });
          }
      });
});


//Success
router.post('/customer/addProfile' , function(req,res) {
  console.log("User Add Profile POST API for UserName : "+req.session.user.username);
    Customer.findOne({"username" : req.session.user.username},function(err,data)
      {
          if(err)
          {
            console.log("Error Occured");
            res.send("Error to find a Customer");
            return;
          }
            
          else if(data)
          {
            console.log("Data Found");
            console.log("Customer with username Already Registered , It will Update");
            var customerUpdate = new Customer();
              customerUpdate.address = req.body.newUser.address;
              
              console.log("The Data you want to Update is : ",customerUpdate);

              Customer.findOneAndUpdate({'_id': data._id}, {$set: {'address' : customerUpdate.address}}, {upsert: false}, function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Record Can't Updated"); 
                    res.status(204).send({message : "Not Updated"});
                    return;
                  }
                  else
                  {
                    console.log("Customer Successfully Updated");
                    res.status(200).send({message : "Successfully Updated" , data : doc});
                    return;
                  }
              });
          }
          else
          {
              console.log("Customer with username is not Exist , Record will be Create new : ---");
               var customerUpdate = new Customer({
                  'name' : req.session.user.name,
                  'username' : req.session.user.username,
                  'email' : req.session.user.email,
                  'address' : req.body.newUser.address,
                  'deleteflag' : false
              });

              console.log("The Info you want to saVE is : ",customerUpdate);

              customerUpdate.save(function(err,doc) {
                  if (err) 
                  {
                      res.status(500).send({message : "Error" , data : err});
                      return;
                  }
                  else if(!doc)
                  {
                    console.log("Records Can't Save"); 
                    res.status(204).send({message : "Unsuccessfull"});
                    return;
                  }
                  else
                  {
                    console.log("Customer Successfully Saved");
                    res.status(200).send({message : "Successfully Saved" , data : doc});
                    return;
                  }
              });
          }
      });
});


router.post('/user/scheduleEvent' , function(req, res){
  console.log("Customer Existence  API");
  //console.log("The Service Provider is : ",JSON.stringify(req.body.serviceprovider.name));
  console.log("User Logged in : "+req.session.user.username);
  Customer.findOne({'username' : req.session.user.username}, function(err, customer){
        if(err)
          {
            res.status(500).send({message : "Error Occured" , error : err});
          }

        else if(!customer) {
            res.status(204).send({message : "Customer is  Not Foundd , You Need to update your Account"});
          }

        else
          {
            console.log("Customer Foundd", customer);
            // console.log("Services Foundd");
            req.session.customer = customer;
            console.log("The Customer Session with name : ",req.session.customer.name);
            res.status(200).send({message : "Customer Already Updated " , data : customer});
            
          }
    });
});



router.post('/userBooking', function(req, res) {
  console.log("Final Booking API of EVENT PEOVIDER");
  console.log("The Customer who want to Booking is : ",req.session.customer.name);
  console.log("The Service Provider is : ",req.body.serviceprovider.name);
  var newBooking = new Booked({
    'cust' : req.session.customer._id,
    'srvc' : req.body.serviceprovider._id  
  });

  console.log("The Info is Going to Book is : ",newBooking);
  newBooking.save(function(err,doc) {
      if(err)
          {
            res.status(500).send({message : "Error Occured" , error : err});
          }

      else if(!doc) {
            res.status(204).send({message : "New Booking can not Save"});
          }

      else
          {
            console.log("Booking SuccessFull", doc);
            // console.log("Services Foundd");
            res.status(200).send({message : "The Event Successfully Booked " , data : doc});
          }
    });
});


module.exports = router;
