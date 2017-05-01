var app = angular.module('myApp',['ui.router']);

app.config(function($stateProvider , $urlRouterProvider, $locationProvider){
   
    $locationProvider.html5Mode ({
        enabled: true,
        requireBase: false
    });

   authenticate = function($q , $http , $window, $location) {
        console.log("Authentication Function");
        var deferred = $q.defer();
        //console.log("deferred", deferred);
        $http({
            method : "GET",
            url : "/login/checkSession"
            }).then(function(response) {
                console.log (response);
                if (response.data.status == 200) {
                    deferred.resolve("Success");
                    console.log(deferred.promise);
                    console.log ('success');
                    //$scope.authenticated = true;
                    return true;
                } 
                else {        
                    deferred.reject();        
                    var protocol = $location.protocol();        
                    var host = protocol + '://' + $location.host();        
                    var port = $location.port();        
                    var sublink = 'home';        
                    var FullLink = host + ':' + port + '/' + sublink;
                    console.log("User will Redirect to :" + FullLink);
                    //$window.location.href = FullLink;
                    console.log(deferred.promise);
                    //$scope.authenticated = false;
                    return false;
                }      
                //return deferred.promise; 
                console.log(deferred.promise);
            }),(function (response){
                console.log("Error");
                //$scope.authenticated = false;
                return false;
            })
        }; 

    
        
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url : '/',
            templateUrl :'../Angular/Templates/home.html'
        })
        .state('home', {
            url : '/home',
            templateUrl : '../Angular/Templates/home.html'
        })
        .state('about', {
            url : '/about',
            templateUrl : '../Angular/Templates/about.html'
        })
        .state('services', {
            url : '/services',
            templateUrl : '../Angular/Templates/services.html',
            controller : 'serviceProviderCtrl',
            resolve : {
                auth : authenticate
            }
        })
        .state('gallery', {
             url : '/gallery',
             templateUrl : '../Angular/Templates/gallery.html'
        })
        .state('contact', {
            url : '/contactQuery',
            templateUrl : '../Angular/Templates/contact.html',
            controller : 'contactQueryCtrl'
        })
        .state('signin', {
            url : '/signin',
            templateUrl : '../Angular/Templates/LoginRegister/signin.html',
            controller : 'loginCtrl'
        })
        .state('signup', {
            url : '/signup',
            templateUrl : '../Angular/Templates/LoginRegister/signin.html',
            controller : 'loginCtrl'
        })
        .state('signout',{
            url : '/signout',
            controller : 'logoutCtrl'
        })
        .state('servicesProviderProfile', {
            url : '/servicesProviderProfile',
            templateUrl : '../Angular/Templates/DashBoard/Service/servicesProviderProfile.html',
            controller : 'servicesProviderProfileCtrl',
            resolve: {
                auth: authenticate
            }
        })
        .state('userProfile', {
            url : '/userProfile',
            templateUrl : '../Angular/Templates/userProfile.html',
            controller : 'userProfileCtrl',
            resolve: {
                auth: authenticate
            }
        })
        .state('serviceProvider', {
            url : '/serviceProvider',
            templateUrl : '../Angular/Templates/serviceProvider.html',
            controller : 'serviceProviderCtrl',
            resolve: {
                auth: authenticate
            }
        })
        .state('serviceProvider/addProfile',{
            url : '/serviceProvider/addProfile',
            templateUrl : '../Angular/Templates/DashBoard/Service/addProfile.html',
            controller : 'srvcPrvdrAddProfileCtrl',
            resolve: {
                auth: authenticate
            }
        })
        .state('customer/addProfile',{
            url : '/customer/addProfile',
            templateUrl : '../Angular/Templates/DashBoard/User/addProfile.html',
            controller : 'cstmrAddProfileCtrl',
            resolve :{
                auth : authenticate
            }
        })
        .state('dashboard',{
            url : '/dashboard',
            templateUrl : '../Angular/Templates/DashBoard/dashboard.html',
            controller : 'dashboardCtrl',
            resolve: {
                auth: authenticate
            }
        })
        .state('userBooking', {
            url : '/userBooking',
            controller : "userBookingCtrl",
            resolve : {
                auth : authenticate
            }
        })
       
});

//Main Controller Load At very First of Programmer
app.controller('myController', function($scope , $rootScope , $http, $window, $location, $log) {
    console.log("myController");

    //$scope.authenticated = false;

    $rootScope.load = function() {
        console.log("Authentication Function");
        $http({
            method : "GET",
            url : "/login/checkSession"
        }).then(function(response) {
                $log.log (response);
                if (response.data.status == 200) {
                    $log.log ('auth');
                    $scope.authenticated =  true;
                } 
                else {        
                    $log.log ('not auth');      
                    // var protocol = $location.protocol();        
                    // var host = protocol + '://' + $location.host();        
                    // var port = $location.port();        
                    // var sublink = "userLogin";        
                    // var FullLink = host + ':' + port + '/' + sublink;        
                    $scope.authenticated =  false;
                }      
            }),function(response){
                console.log("Error");
                $scope.authenticated =  false;
            }
        }; 
})

app.controller('loginCtrl',function($scope , $rootScope , $location , $http, $state) {
    console.log("Hello Login Controller");

    $scope.signin = function(user) {
        console.log("The User SignIN Controller : ",JSON.stringify(user));
        $http({
                method : "POST",
                url: "/userLogin",
                data: {user:$scope.user}
            }).then(function(data){
                $rootScope.userLogData = data.data;
                console.log("Success",$scope.userLogData);
                $scope.message = "Login Successfully";
                $rootScope.load();
                //$state.transitionTo ('services');

                
            }),function(data){
                console.log("UnSuccessFull",data);
                $state.transitionTo ('signup');
            }
            $scope.user = "";
            
    }
    
    $scope.signup = function(user) {
       console.log("The User SignIN Controller : ",JSON.stringify(user));
        $http({
                method : "POST",
                url: "/userRegister",
                data: {user:$scope.user}
            }).then(function(data){
                $rootScope.userRegData = data.data;
                console.log("Success",$scope.userRegData);
                $scope.message = "Register Successfully";
                $location.path("/signin");
                
            }),function(data){
                console.log("UnSuccessFull",data);
                $location.path('/signup');
                
            }
            $scope.user = "";

    }
});



app.controller('registerCtrl' , function($scope , $rootScope , $http) {
    $scope.signup = function(user) {
        console.log("The User SignUp Controller");
    }
})

// users And Service Provider Can Logout
app.controller('logoutCtrl',function($scope , $location , $http) {
    console.log("Logging Out");
    $http({
        method : 'GET',
        url : '/signout'
    }).then(function(data){
        console.log("Success");
        $scope.message = "Logout Successfully";
        $location.path("/")
        }),function(data){
        console.log("UnSuccessFull",data);
                
    }
})

// The User DAshBoard With A Update Field
app.controller('userProfileCtrl', function($scope , $rootScope , $location , $http) {
    console.log("This is userProfileCtrl Controller");
    $http({
        method : "GET",
        url : "/userProfile",
    }).then(function(data){
        console.log("Success");
        $rootScope.profileData = data.data.data;
        console.log($rootScope.profileData);
    }),function(data) {
        console.log("UnSuccessfull");
    }

    $scope.addProfile = function(newUser,profileData) {
        //console.log("You are Going to Update Your Profile");
        console.log("In usrProfile Controller The Data You Want to Update is : ",JSON.stringify(newUser));
        console.log("Your UserType is : "+profileData.usertype);
        if(profileData.usertype == 'serviceprovider'){
            console.log("serviceprovider API will HIT");
            $http({
                method : "POST",
                url : "/serviceProvider/addProfile",
                data : {newUser : $scope.newUser}
            }).then(function(data) {
                console.log("Success");
                $rootScope.updateProfile = data.data;
                if($rootScope.updateProfile.status === 200){
                    $state.transitionTo('serviceProvider');
                }
        
            }),function(data){
                console.log("UnsuccessFull");
            }
        }
        else
        {
            console.log("Customer API will HIT");
            $http({
                method : "POST",
                url : "/customer/addProfile",
                data : {newUser : $scope.newUser}
            }).then(function(data) {
                console.log("Success");
                $rootScope.updateProfile = data.data;
            }),function(data){
                console.log("UnsuccessFull");
            }
        }
        
    }
})


// Get all the service provider information on to the Screen
app.controller('serviceProviderCtrl', function($scope , $rootScope , $state , $window , $location , $http) {
    console.log("serviceProviderCtrl Called");
    $http({
        method : "GET",
        url : "/serviceProvider"
    }).then(function(data){
        console.log("Success");
        $rootScope.userData = data.data.data;
        console.log("The data Get from Service Provider is : ",$rootScope.userData);
        // console.log("The data Get from Service Provider is : ",data.data);
        // $rootScope.usersTable  = $scope.data;
    }),function(data){
        console.log("Error");
    }


    $scope.bookService = function(serviceprovider) {
        console.log("You are now going to book the Service Provider : ");
        console.log(JSON.stringify(serviceprovider));
        $rootScope.serviceprovider = serviceprovider;
        $http({
            method : "POST",
            url : "/user/scheduleEvent",
            data : {serviceprovider : serviceprovider}
        }).then(function(data) {
             console.log("Success");
             console.log(data.status);
             if(data.status === 204){
                 console.log("You need to Update");
                //  $window.location.href = 'userProfile';
                $state.transitionTo ('userProfile');
             }
             else if (data.status === 200) {
                 console.log("You can Book");
                 $state.transitionTo ('userBooking');
             }
             else
                console.log("Ther is Error in Find Customer");
        }),function(data){
            console.log("UnSuccessfull");
        }
    }
})


// UserQuery will save in a seperate Database
app.controller('contactQueryCtrl', function($scope , $rootScope , $location , $http) {
    console.log("contactQueryCtrl Called");
    $scope.contactQuery = function(query) {
        $http({
            method : "POST",
            url : "/contactQuery",
            data : {query : $scope.query}
        }).then(function(data) {
            console.log("Success");
            $scope.response = data.data;
        }),function(data) {
            console.log("Error");
        }
    }
})


// User+Service Provider DashBoard
app.controller('dashboardCtrl', function($scope , $rootScope , $location , $http){
    console.log("This is DashBoard Controller");
    $http({
        method : "GET",
        url : '/dashboardProfile'
    }).then(function(data) {
        console.log("Success");
        $rootScope.dashboardData = data.data;
        console.log($rootScope.dashboardData);
    }),function(data) {
        console.log("UnsuccessFull");
    }
})


app.controller('userBookingCtrl', function($scope , $rootScope , $location , $http) {
    console.log("Finally You Are going to  Book Event Owner Mr. : ",$rootScope.serviceprovider.name);
    $http({
        method : "POST",
        url : "/userBooking",
        data : {serviceprovider : $rootScope.serviceprovider}
    }).then(function(data) {
        console.log("Success");
    }),function(data) {
        console.log("UnSuccessFull");
    }
})