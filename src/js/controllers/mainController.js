// Create dummy controller
angular.module('myApp').controller('myController', function($scope, $q, salesforce, firebaseService, $mdDialog) {
    
    $scope.percent = function(a, b) {
        return Math.round((a / b) * 100) + '%';
    };

    function init() {

    	$scope.month = 8;
    	$scope.year = 2015;

        $scope.attributes = ['Steps', 'Calories', 'Distance', 'Floors'];
        $scope.selectedAttribute = 'Steps';

        $scope.userAggregatesConfig = {
            title: '',
            tooltips: true,
            labels: false,
            mouseover: function() {},
            mouseout: function() {},
            click: function() {},
            legend: {
              display: false,
              position: 'right'
            },
            colors: ['#1abc9c', '#2ecc71', '#e67e22', '#3498db']
        };

        $scope.userReadingsConfig = {
            title: '',
            tooltips: true,
            labels: false,
            mouseover: function() {},
            mouseout: function() {},
            click: function() {},
            legend: {
              display: false,
              position: 'right'
            },
            colors: ['#3498db', '#1abc9c', '#2ecc71', '#e67e22']
        };

    	refresh();
    }

    function getCorporateGoals() {
    	return salesforce.query('Corporate_Goal__c', {});
    }

    function getUsers() {
    	return salesforce.query('Contact', {});	
    }

    function getReadings() {
    	return salesforce.query('Reading__c', {});	
    }

    function getLeaderboard() {
    	return salesforce.query('Leaderboard__c', {
            where : { Month__c : { eq : "" + $scope.month + "" } }
        });	
    }

    function refresh() {

    	var promises = [
    		getCorporateGoals(), 
    		getUsers(), 
    		getReadings(),
    		getLeaderboard()
    	];

    	$q.all(promises)
    	.then(function(results) {
			$scope.corporateGoals = results[0];
			$scope.users = {};

            results[1].forEach(function(user) {
                
                if (!$scope.selectedUser) {
                    $scope.selectedUser = user._props.Id;
                }

                if (user._props.User__c == userId) {
                    $scope.contactId = user._props.Id;
                }

                $scope.users[user._props.Id] = user;
            });

			$scope.readings = results[2];
			$scope.leaderboard = results[3];

			setSelected();
            createUserAggregatesChart();
            createUserReadingsChart();
            resetNewChat();

            return firebaseService.getChats($scope);

		})
        .then(function() {}, function(error) {
			console.error(error);
		});
    }
    
    function setSelected() {
    	$scope.corporateGoals
    	.filter(function(item) {
			return item._props.Month__c == $scope.month && item._props.Year__c == $scope.year;
		})
    	.forEach(function(goal) {
    		Object.keys(goal._props).forEach(function(key) {
			    $scope['Corporate_' + key] = goal._props[key];
			});
    	});
    }

    function createUserAggregatesChart() {
        $scope.userAggregates = {
            series: ["Steps", "Calories", "Distance", "Floors"],
            data: $scope.leaderboard.map(function(record) {

                var value = 0;

                if ($scope.selectedAttribute == 'Steps') {
                    value = record._props.Total_Steps__c;
                } else if ($scope.selectedAttribute == 'Calories') {
                    value = record._props.Total_Calories__c;
                } else if ($scope.selectedAttribute == 'Distance') {
                    value = record._props.Total_Distance__c;
                } else {
                    value = record._props.Total_Floors__c;
                }

                return {
                    x: $scope.users[record._props.Contact__c]._props.FirstName,
                    y: [value]
                };
            })
        };
    }

    $scope.$watch('selectedAttribute', function(newValue, oldValue) {
        createUserAggregatesChart();   
        createUserReadingsChart(); 
    });

    $scope.$watch('selectedUser', function(newValue, oldValue) {
        createUserReadingsChart();   
    });

    function resetNewChat() {
        $scope.newChat = {
            user: $scope.contactId,
            comments: [],
            likes: 0,
            message: '',
            date: new Date().toDateString()
        };
    }

    $scope.addChat = function() {
        $scope.newChat.message = $scope.message;
        $scope.chats.$add($scope.newChat);
        resetNewChat();
    };

    function createUserReadingsChart() {
        $scope.userReadings = {
            series: ["", "", "", ""],
            data: $scope.readings
                .filter(function(reading) {
                    return (reading._props.Date__c.getMonth() + 1) == $scope.month && reading._props.Contact__c == $scope.selectedUser;
                })
                .map(function(record) {

                    var value = 0;
                    if ($scope.selectedAttribute == 'Steps') {
                        value = record._props.Steps__c;
                    } else if ($scope.selectedAttribute == 'Calories') {
                        value = record._props.Calories__c;
                    } else if ($scope.selectedAttribute == 'Distance') {
                        value = record._props.Distance__c;
                    } else {
                        value = record._props.Floors__c;
                    }

                    return {
                        x: record._props.Date__c.getDate(),
                        y: [value]
                    };
                })
        };
    }

    $scope.showUpdateDialog = function(ev) {
    };

    init();
});