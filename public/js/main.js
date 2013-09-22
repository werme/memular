function MainCtrl($scope, $http) {
  $scope.nodes = [];
  $scope.lists = [];

  $scope.updateLists = function() {
    $http.get('/lists').success(function(data) {
       $scope.lists = data;
    });
  };

  $scope.selectAll = function() {
    $scope.currentList = null;
    $http.get('/nodes').success(function(data) {
       $scope.nodes = data;
    });
  };

  $scope.selectList = function(title) {
    $scope.currentList = title;
    $http.get('/list/' + title).success(function(data) {
       $scope.nodes = data;
    });
  };

  $scope.add = function() {
    var url;
    if($scope.currentList === null) {
      url = '/nodes';
    } else {
      url = '/list/nodes/' + $scope.currentList;
    }

    $http({
      method: 'POST',
      url: url,
      data: $.param({node: { word: $scope.word, translation: $scope.translation }}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config) {
      $scope.nodes.unshift({ word: data.word,
                          translation: data.translation,
                          id: data.id });
    }).error(function(data, status, headers, config) {});

    $scope.word = '';
    $scope.translation = '';
    $('.word-input').focus();
  };

  $scope.addList = function() {
    $http({
      method: 'POST',
      url: '/lists',
      data: $.param({list: { title: $scope.newList }}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      $scope.updateLists();
      $scope.selectList(data.title)
    }).error(function() {});
    $scope.newList = '';
    $('#new-list-input').blur();
  };

  $scope.removeList = function(id) {
    console.log(id);
    $http({
      method: 'DELETE',
      url: '/list/' + id + '/delete'
    }).success(function(data) {
      $scope.updateLists();
      $scope.selectAll();
    }).error(function() {});
  };

  $scope.remove = function(index, id) {
    $http({method: 'DELETE', url: "nodes/delete/" + id });
    $scope.nodes.splice(index,1);
  };

  $scope.toggleMenu = function() {
    $('.menu').toggleClass('show-menu');

    if($('.menu').hasClass('show-menu')) {
      $('#new-list-input').focus();
    } else {
      $('.word-input').focus();
    }
  }

  $scope.selectAll();
  $scope.updateLists();
}
