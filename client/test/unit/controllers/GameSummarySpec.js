describe('GameSummary', function () {

	var $scope, $httpBackend;

	beforeEach(function() {

		module('futurism');

		inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');
			var mockSumm = $injector.get('SummaryResource');
			var $rootScope = $injector.get('$rootScope');
			var $controller = $injector.get('$controller');

			$scope = $rootScope.$new();
			$controller('GameSummaryCtrl', {$scope: $scope, $routeParams: {gameId:'123'}, SummaryResource: mockSumm, account: {_id:1}});
		});
	});


	describe('init', function () {

		it('should add gameId to scope', function() {
			expect($scope.gameId).toBe('123');
		});

		it('should add account to scope', function() {
			expect($scope.account._id).toBe(1);
		});

		it('should create a summ object', function() {
			expect($scope.summ).toBeTruthy();
		});

		it('should request data from server', function () {
			$httpBackend.expectGET('/api/summaries/123').respond({});
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});
	});
});