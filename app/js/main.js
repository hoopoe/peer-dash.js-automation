'use strict';

var CHANNEL_URL = 'http://192.168.1.110/live/test.mpd',
    LOAD_CMD = 'load',
    STOP_CMD = 'stop',
    PLAY_CMD = 'play',
    PAUSE_CMD = 'pause'

angular.module('InfrastractureService', ['ngResource']).
factory('SignalingServers', function($resource) {
  return $resource('singnaling_servers.json', {}, {
    query: {
      method: 'GET',
      isArray: false
    }
  });
});

angular.module('AutomationService', ['ngResource']).
factory('SignalingManager', function($resource) {
  return $resource('http://localhost:9000/peerjs/list', {}, {
    query: {
      method: 'GET',
      isArray: true
    }
  });
})
  .factory('PeerManager', ['$q',
    function($q) {
      var me = new Peer({
        host: 'localhost',
        port: 9000,
        key: 'peerjs',
        debug: 2,
        config: {
          'iceServers': [{
            'url': 'stun:stun.l.google.com:19302'
          }],
        }
      });

      return {
        open: function() {
          var deferred = $q.defer();
          me.on('open', function(id) {
            deferred.resolve(id);
          }, function(err) {
            deferred.reject('some error');
          });
          return deferred.promise;
        },
        sendCommand: function(e, command) {
          var conn = me.connect(e.id);
          conn.label = 'AUTOMATION';
          conn.on('open', function() {
            conn.send({'cmd': command, 
              'channel': e.channel});
          });          
        }
      }
    }
  ]);

var app = angular.module('DashPlayerAutomation', [
  'ngRoute',
  'InfrastractureService',
  'AutomationService',
]);

app.config(['$logProvider', '$routeProvider', function($logProvider, $routeProvider) {
  $logProvider.debugEnabled(true);
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      controllerAs: 'home',
      templateUrl: 'templates/home.html'
    }).when('/action/:id/:name', {
      controller: 'ActionController',
      controllerAs: 'action',
      templateUrl: 'templates/action.html'
    })
    .otherwise('/');
}])

app.controller('HomeController', function($scope) {

});

app.controller('ActionController', function($scope, $route, $log) {
  var params = $route.current.pathParams;
  console.log(params.id);
  console.log(params.name);
  document.write("Test");
});

app.controller('AutomationController', function($scope, SignalingServers, SignalingManager, PeerManager) {
  PeerManager.open()
    .then(function(id) {
      $scope.selfId = id;      
    }, function(error) {
      console.log(error);
    });

  SignalingServers.query(function(data) {
    $scope.signalingServers = data.items;
  });

  SignalingManager.query(function(data) {
    var items = [];
    angular.forEach(data, function(i) {
      items.push({id: i, channel: CHANNEL_URL});
    });
    $scope.peers = items;
  });

  $scope.load = function(e) {
    PeerManager.sendCommand(e, LOAD_CMD);
  };

  $scope.play = function(e) {
    PeerManager.sendCommand(e, PLAY_CMD);
  };

  $scope.pause = function(e) {
    PeerManager.sendCommand(e, PAUSE_CMD);
  };

  $scope.stop = function(e) {
    PeerManager.sendCommand(e, STOP_CMD);
  };
});