(function (window) {
    'use strict';

    function MessagingSvc($http) {
        this.list = function (page, pageSize, location, search, success, error) {
            $http.get('/api/messages', { params: { page: page, pageSize: pageSize, location: location, search: search}}).then(success, error);
        };

        this.send = function (conversation, body, success, error) {
            $http.post('/api/messages/send', { conversation: conversation, body: body }).then(success, error);
        };

        this.startConversation = function (recipients, body, subject, success, error) {
            $http.post('/api/messages/start', { recipients: recipients, body: body, subject: subject }).then(success, error);
        };

        this.getConversation = function (id, success, error) {
            $http.get('/api/messages/conversation?id=' + id).then(success, error);
        };

        this.markRead = function (conversation, success, error) {
            $http.post('/api/messages/markread', { conversation: conversation }).then(success, error);
        };

        this.markUnread = function (conversation, success, error) {
            $http.post('/api/messages/markunread', { conversation: conversation }).then(success, error);
        };

        this.leave = function (id, success, error) {
            $http.post('/api/messages/leave', { id: id }).then(success, error);
        };

        this.archiveMulti = function (ids, success, error) {
            $http.post('/api/messages/ArchiveMulti', { ids: ids }).then(success, error);
        };

        this.markReadMulti = function (ids, success, error) {
            $http.post('/api/messages/MarkReadMulti', { ids: ids }).then(success, error);
        };

        this.markUnreadMulti = function (ids, success, error) {
            $http.post('/api/messages/MarkUnreadMulti', { ids: ids }).then(success, error);
        };

        this.sendToGroup = function (group, body, success, error) {
            $http.post('/api/messages/start', { groupId: group, body: body }).then(success, error);
        };

        this.getUnreadCount = function (success, error) {
            $http.get('/api/messages/UnreadCount').then(success, error);
        };

        return this;
    }

    window.app.service('MessagingSvc', ['$http', MessagingSvc]);
})(window);
