angular.module('myApp')

.factory('firebaseService',function($q, $firebaseArray) {

	//var refUsers = new Firebase("https://socialhealthchat.firebaseio.com/users");
    //var refChats = new Firebase("https://socialhealthchat.firebaseio.com/chats");

	return {
		getChats: function(scope) {
			return $q(function(resolve, reject) {
				var refChats = new Firebase("http://socialhealthchat.firebaseio.com/chats").limitToLast(8);;
				scope.chats = $firebaseArray(refChats);
				scope.chats.$loaded(function() {
			    	resolve();
			    });
			});
		}
	}
});