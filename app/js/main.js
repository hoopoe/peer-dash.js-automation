'use strict';

var CHANNEL_URL = 'http://192.168.1.110/live/test.mpd',
    START_CMD = 'start',
    STOP_CMD = 'stop'

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
  'InfrastractureService',
  'AutomationService',
]);

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

  $scope.start = function(e) {
    PeerManager.sendCommand(e, START_CMD);
  };

  $scope.stop = function(e) {
    PeerManager.sendCommand(e, STOP_CMD);
  };
});