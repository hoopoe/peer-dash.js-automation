'use strict';

angular.module('InfrastractureService', ['ngResource']).
    factory('SignalingServers', function($resource){
        return $resource('singnaling_servers.json', {}, {
            query: {method:'GET', isArray:false}
        });
    });

angular.module('AutomationService', ['ngResource']).
    factory('SignalingManager', function($resource){
        return $resource('http://localhost:9000/peerjs/list', {}, {
            query: {method:'GET', isArray:true}
        });
    })
    .factory('PeerManager', function(){
        return {      
            sendCommand: function(peerId, command) {
            	console.log(peerId + " " +command);
            }
        }
    });

var app = angular.module('DashPlayerAutomation', [
	'InfrastractureService',
    'AutomationService',
]);

app.controller('AutomationController', function($scope, SignalingServers, SignalingManager, PeerManager) {
	SignalingServers.query(function (data) {
        $scope.signalingServers = data.items;
    });

    SignalingManager.query(function (data) {
        $scope.peers = data;
    });

    $scope.start = function(e) {    	
    	PeerManager.sendCommand(e, 'start');
    };

    $scope.stop = function(e) {    	
    	PeerManager.sendCommand(e, 'stop');
    };
});