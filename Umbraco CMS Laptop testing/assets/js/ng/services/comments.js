(function (window) {
    'use strict';

    function CommentSvc($http) {

        this.list = function (entity, success, error) {
            $http.get('/api/comments?entity=' + entity).then(success, error);
        };

        this.create = function (model, success, error) {
        	$http.post('/api/comments/create', model).then(success, error);
        };

        this.edit = function(model, success, error) {
            $http.post('/api/comments/edit', model).then(success, error);
        }

        return this;
    }

    window.app.service('CommentSvc', ['$http', CommentSvc]);
})(window);