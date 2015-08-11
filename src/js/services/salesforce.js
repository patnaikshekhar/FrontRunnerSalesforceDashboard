angular.module('myApp')

.factory('salesforce', function($q) {

	return {
		query: function(object, query) {
			return $q(function(resolve, reject) {

				var service = new SObjectModel[object]();
				service.retrieve(query, function(err, records) {
					if (err) {
						reject(err);
					} else {
						resolve(records);
					}
				});
			});
		}
	};
});