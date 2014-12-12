angular.module('flapperNews', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
	      	url: '/home',
	      	templateUrl: '/home.html',
	      	controller: 'MainCtrl',
	      	resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
	    })
	    .state('posts', {
		  	url: '/posts/{id}',
		  	templateUrl: '/posts.html',
		  	controller: 'PostsCtrl'
		});

	$urlRouterProvider.otherwise('home');
}])
.factory(
	'posts', [
		'$http',
		function($http){
  			var o = {
				    posts:[
					  {title: 'post 1', link: '', upvotes: 5, comments: []}
					]
				};
			o.getAll = function() {
			    return $http.get('/posts').success(function(data){
			    	angular.copy(data, o.posts);
			    });
			};
			o.create = function(post) {
			  	return $http.post('/posts', post).success(function(data){
			    	o.posts.push(data);
			  	});
			};
			return o;
		}
	]
)
.controller(
	'MainCtrl', [
		'$scope',
		'posts',
		function($scope, posts){
		  	$scope.test = 'Hello world!';

			$scope.posts = posts.posts;
			$scope.addPost = function(){
				if(!$scope.title || $scope.title === '') { alert('Title empty'); return; }
				posts.create({
				    title: $scope.title,
				    link: $scope.link,
				});
				$scope.title = '';
				$scope.link = '';

				console.log(angular.toJson(posts.posts, true));
			};
			$scope.incrementUpvotes = function(post) {
			  	post.upvotes += 1;
			};
		}
	]
)
.controller(
	'PostsCtrl', [
		'$scope',
		'$stateParams',
		'posts',
		function($scope, $stateParams, posts){
			$scope.post = posts.posts[$stateParams.id];
			$scope.addComment = function(){
			 	var authorName;
			 	if(!$scope.author || $scope.author === '') { 
			 			authorName = 'user';
			 	} else {
			 			authorName = $scope.author;
			 	};
			 	if($scope.body === '') { return; }
			  	$scope.post.comments.push({
				    body: $scope.body,
				    author: authorName,
				    upvotes: 0
			  	});
			 	 $scope.body = '';
			 	  $scope.author = '';
			};
			$scope.incrementUpvotes = function(comment) {
			  	comment.upvotes += 1;
			};
		}
	]
);