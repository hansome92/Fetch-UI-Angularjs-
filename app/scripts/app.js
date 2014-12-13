'use strict';

/**
 * @ngdoc overview
 * @name angularjsApp
 * @description
 * # angularjsApp
 *
 * Main module of the application.
 */
var app = angular.module('angularjsApp', ['ngRoute', 'loginController','dashboardController','clientsController','loanProductController','chargesController','createClientController','userServices','Constants','ui.bootstrap','angularFileUpload','naif.base64']);

 // Angular supports chaining, so here we chain the config function onto
  // the module we're configuring.
  app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.
      when('/', {
        hclass: 'pre-login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/clients', {
        templateUrl: 'views/clients.html',
        controller: 'ClientsCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/loans', {
        templateUrl: 'views/loans.html',
        controller: 'LoansCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/loansPendingApproval', {
        templateUrl: 'views/loansPendingApprovals.html',
        controller: 'LoansPendingApprovalsCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/loansAwaitingDisbursement', {
        templateUrl: 'views/loansAwaitingDisbursement.html',
        controller: 'LoansAwaitingDisbursementCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
       when('/loansRejected', {
        templateUrl: 'views/loansRejected.html',
        controller: 'LoansRejectedCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/loansWrittenOff', {
        templateUrl: 'views/loansWrittenOff.html',
        controller: 'LoansWrittenOffCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/configuration', {
        templateUrl: 'views/configuration.html',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/loanProducts', {
        templateUrl: 'views/loanProducts.html',
        controller: 'LoanProductsCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/charges', {
        templateUrl: 'views/charges.html',
        controller: 'ChargesCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/createloanproduct', {
        templateUrl: 'views/createLoanProduct.html',
        controller: 'LoansWrittenOffCtrl',
        data: {
            authorizedRoles: ['admin']
          }
      }).
      when('/createCharge', {
        templateUrl: 'views/createCharge.html',
        controller: '',
        data: {
            authorizedRoles: ['admin']
          }
      }).when('/editloanproduct/:id', {
          templateUrl: 'views/editloanproduct.html',
          controller: 'EditLoanProductsCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/editCharge/:id', {
          templateUrl: 'views/editCharge.html',
          controller: 'EditChargeCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/createClient', {
          templateUrl: 'views/Client/basicClientInfo.html',
          controller: 'CreateClientCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/editbasicclientinfo/:id', {
          templateUrl: 'views/Client/editBasicClientInfo.html',
          controller: 'EditClientCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/editadditionalclientinfo/:id', {
          templateUrl: 'views/Client/additionalClientInfo.html',
          controller: 'CreateClientAdditionalInfoCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/editclientidentification/:id', {
          templateUrl: 'views/Client/addClientIdentification.html',
          controller: 'ClientIdentificationCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/editnextofkeen/:id', {
          templateUrl: 'views/Client/addNextOfKeen.html',
          controller: 'ClientNextToKeenCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).when('/editbusinessdetails/:id', {
          templateUrl: 'views/Client/addBusinessDetails.html',
          controller: 'ClientBusinessActivityCtrl',
          data: {
            authorizedRoles: ['admin']
          }
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Mifos-Platform-TenantId'] = 'default';
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    }
]);


app.run(function ($rootScope, $location, AUTH_EVENTS, AuthService, Session, APPLICATION,PAGE_URL) {
  //total number of records in single page
  $rootScope.itemsByPage = APPLICATION.PAGE_SIZE;
  //total number of page in single page
  $rootScope.displayedPages = APPLICATION.DISPLAYED_PAGES;
  $rootScope.page = {
      setHclass: function(hclass) {
          this.hclass = hclass;
      }
  }

  //TODO: we need to find a way to remove from root scope
  $rootScope.pdfExport = function(ignoreColumns){
    var cols = [];
    if(ignoreColumns != undefined && ignoreColumns.indexOf(',') != -1){
      cols = ignoreColumns.split(',');
    }
    if(ignoreColumns != undefined && ignoreColumns.indexOf(',') === -1){
      cols = [ignoreColumns];
    }

      $('.table').tableExport({type:'pdf',
          ignoreColumn: cols, 
          escape:'false',
          pdfFontSize:7,
          pdfLeftMargin:5
      });  
  }
  
  //TODO: we need to find a way to remove from root scope
  $rootScope.xlsExport = function(ignoreColumns){
       var cols = [];
      if(ignoreColumns != undefined && ignoreColumns.indexOf(',') != -1){
         cols = ignoreColumns.split(',');
      }
      if(ignoreColumns != undefined && ignoreColumns.indexOf(',') === -1){
        cols = [ignoreColumns];
      }

      $('.table').tableExport({type:'excel',
          ignoreColumn: cols, 
          escape:'false'
      });  
  }

  //TODO default template for the batch request processing
  $rootScope.batchAPITemplate = function(requestno,requestUrl,requestMethod,jsonData){
      var cols = '{ "requestId":'+requestno+',"relativeUrl":"'+requestUrl+'","method":"'+requestMethod+'",'+
    '"headers":[ {"name":"Content-type","value":"application/json; charset=utf-8"},{"name":"X-Mifos-Platform-TenantId","value":"default"}],'+
    '"body":"'+jsonData+'"}';  
    return cols;
  }

  $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setHclass(current.$$route.hclass);
  });

  //To update after view reloaded
  $rootScope.$on('$includeContentLoaded', function() {
    console.log("includeContentLoaded: includeContentLoaded success!");
      //get top navigation menu
        var $topNavigation = angular.element('#main-navbar-collapse .nav.navbar-nav:first');
        //find all li tags (menus) from top UL
        var $liEle = $topNavigation.find('li');
        //check length
        if ($liEle.length > 0) {
          //travers to each menu item to remove selected menu class
          $liEle.each(function() {
              var $li=$(this);
              $li.removeClass('active');
          });
        }
        var split_location_path = $location.path().split('/');
        var location_path = '/'+split_location_path[1];
        //add active /selection class for open view menu item      
        switch(location_path){
          case PAGE_URL.CLIENTS:
          case PAGE_URL.LOANS:
          case PAGE_URL.LOANSAWAITINGDISBURSEMENT:
          case PAGE_URL.LOANSPENDINGAPPROVAL:
          case PAGE_URL.LOANSREJECTED:
          case PAGE_URL.LOANSWRITTENOFF:
          case PAGE_URL.CREATE_CLIENT:
          case PAGE_URL.EDIT_BASIC_CLIENT_INFORMATION:
          case PAGE_URL.EDIT_CLIENT_ADDITIONAL_INFO:
          case PAGE_URL.EDIT_CLIENT_IDENTIFICATION:
          case PAGE_URL.EDIT_CLIENT_NEXT_OF_KEEN:
          case PAGE_URL.EDIT_CLIENT_BUSINESS_DETAILS:
            $topNavigation.find('.clients').parent().addClass('active');
            break;
          case PAGE_URL.CONFIGURATION:
          case PAGE_URL.LOANPRODUCTS:
          case PAGE_URL.CHARGES:
          case PAGE_URL.ACCOUNTING:
          case PAGE_URL.CREATELOANPRODUCT:
          case PAGE_URL.CREATECHARGE:
          case PAGE_URL.EDITLOANPRODUCT:
          case PAGE_URL.EDITCHARGE:
            $topNavigation.find('.configuration').parent().addClass('active');
            break;  
          default:
            $topNavigation.find('.home').parent().addClass('active');
        }
  });

  $rootScope.$on('$stateChangeStart', function (event, next) {    
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });

  //hendled notAuthenticated event
  $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, next) {
    $location.url(PAGE_URL.ROOT);
  });
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, function (event, next) {
    $location.url(PAGE_URL.ROOT);
  });  

  if(Session.getValue(APPLICATION.authToken) != null){
    if($location.path()==PAGE_URL.ROOT || $location.path()==''){
      $location.url(PAGE_URL.DASHBOARD);
    }
  }else{
    //TODO - Need to remove else block once all the functionality will be implemented
    $location.url(PAGE_URL.ROOT);
  }
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

app.controller('ApplicationController', function ($scope, $location, USER_ROLES, AuthService) {  
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };

  $scope.changeView = function (view) {
    $location.path(view);
  };
});

app.factory('Session', function(APPLICATION) {
  

  var Session = {
    create: function(sessionId, userName, userRole){
      var data = {};
      data[APPLICATION.authToken] = sessionId;
      data[APPLICATION.username] = userName;
      data[APPLICATION.role] = userRole;
      window.localStorage.setItem('ang_session', JSON.stringify(data));
    },
    setValue: function(key, value) { 
      var data = {};
      try {
        data =  JSON.parse(window.localStorage.getItem(APPLICATION.sessionName));
      } catch (e) {
        console.log('Error to get session data from local storage');
        return null;
      }
      data[key] = value;
      window.localStorage.setItem('ang_session', JSON.stringify(data)); 
    },
    getValue: function(key) { 
      var data = {};
      try {
        data =  JSON.parse(window.localStorage.getItem(APPLICATION.sessionName));
        return data[key];
      } catch (e) {
        console.log('Error to get session data from local storage');
        return null;
      }
      
    },
    remove: function(){
      var data = {};
      window.localStorage.setItem(APPLICATION.sessionName, JSON.stringify(data));
    }
  };
  
  return Session; 
});

app.directive('showValidation', [function() {
    return {
        restrict: "A",
        require:'form',
        link: function(scope, element, attrs, formCtrl) {
            element.find('.validate').each(function() {
                var $formGroup=$(this);
                var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                if ($inputs.length > 0) {
                    $inputs.each(function() {
                        var $input=$(this);
                        scope.$watch(function() {
                            return $input.hasClass('ng-invalid');
                        }, function(isInvalid) {
                            var $spanEle = $formGroup.find('span');
                            if ($spanEle.length > 0) {
                              $spanEle.each(function() {
                                  var $span=$(this);
                                  $span.toggleClass('glyphicon-remove', isInvalid);
                                  $span.toggleClass('glyphicon-ok', !isInvalid);    
                              });
                            }
                            $formGroup.toggleClass('has-success', !isInvalid);
                            $formGroup.toggleClass('has-error', isInvalid);
                        });
                    });
                }
            });
        }
    };
}]);

 app.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9.]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseFloat(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]); 

//color code status for each data tables
app.filter('status', [ function() {
    var STATUS_COLOR_CODE = {'0': 'status bad',//red
      '100': 'status on-hold',//yellow
      '200': 'status on-hold',//yellow
      '300': 'status active',//green
      '400': 'status closed',//grey
      '500': 'status closed',//grey
      '600': 'status closed',//grey
      '601': 'status closed',//grey
      '602': 'status active',//green
      '700': 'status active',//green
      '800': 'status active',//green
      '900': 'status active'//green
    };
    return function(statusCode) {
      return STATUS_COLOR_CODE[statusCode];
    };
}]);

//color code status for each data tables
app.filter('checkEmptyString', [ function() {

    return function(value) {
      return value=='';
    };
}]);


