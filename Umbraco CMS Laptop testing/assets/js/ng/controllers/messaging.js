(function (window) {
    'use strict';

    function MessagingCtrl($scope, $rootScope, $modal, MessagingSvc, NotificationSvc, UserSvc, ConnectionSvc, $q, $timeout) {
        $scope.recipients = {};
        $scope.connections = ConnectionSvc.list();
        $scope.submitted = false;
        $scope.page = 0;
        $scope.pageSize = 10;
        $scope.messagesView = 'inbox';
        $scope.bulkProcessingResult = '';
        $scope.bulkProcessingResultOpen = false;
        $scope.showDeleteConfirmation = false;
        $scope.messagesSearchString = '';
        $scope.showingSearchResults = false;

        if (window.location.hash) {
            var obj = JSON.parse(window.location.hash.substr(1));

            $scope.messagesView = obj.view || 'inbox';
            $scope.page = (parseInt(obj.page) || 1) - 1;
            $scope.searchQuery = obj.search;
            $scope.messagesSearchString = obj.search;
        }

        $scope.refresh = function () {
            var location = 'Inbox,InboxOutbox';
            switch ($scope.messagesView) {
                case 'sent':
                    location = 'Outbox';
                    break;
                case 'trash':
                    location = 'Trash';
                    break;
            }

            window.location.hash = $scope.getCurrentFilter();

            $scope.$loading = true;
            $scope.$error = false;
            MessagingSvc.list($scope.page, $scope.pageSize, location, $scope.searchQuery, function (resp) {
                $scope.data = resp.data;
                $scope.$loading = false;
            },
            function () {
                $scope.$error = true;
                $scope.$loading = false;
            });
        };

        $scope.getCurrentFilter = function () {
            var params = {};
            try {
                params = {
                    page: $scope.page + 1,
                    view: $scope.messagesView,
                    search: $scope.searchQuery
                };
            }
            catch(err)
            {
                params = {
                    page: 1,
                    view: "inbox"
                };
            }

            return JSON.stringify(params);
        };

        $scope.refresh();

        $scope.next = function () {
            $scope.page++;
            $scope.refresh();
        };

        $scope.back = function () {
            $scope.page--;
            $scope.refresh();
        };

        $scope.getSelectedItems = function () {
            if (!$scope.data) { return []; }
            return $scope.data.items.filter(function (ent) { return ent.isSelected; });
        };

        $scope.getSelectedCount = function () {
            return $scope.getSelectedItems().length;
        };

        $scope.allIsSelected = function () {
            return $scope.data && ($scope.getSelectedCount() === $scope.data.items.length);
        };

        $scope.selectAll = function () {
            if ($scope.allIsSelected()) {
                $scope.data.items.filter(function (ent) { ent.isSelected = false; });
            }
            else {
                $scope.data.items.filter(function (ent) { ent.isSelected = true; });
            }
        };

        var showBulkProcessingResult = function (message) {
            $scope.bulkProcessingResult = message;
            $scope.bulkProcessingResultOpen = true;
            $timeout(function () {
                $scope.bulkProcessingResultOpen = false;
            }, 4000);
        };

        $scope.bulkMarkRead = function () {
            $scope.bulkProcessing = true;
            var ids = $scope.getSelectedItems().map(function(ent) { return ent.id; });

            MessagingSvc.markReadMulti(ids, function () {
                $scope.bulkProcessing = false;
                showBulkProcessingResult(ids.length + " conversations successfully marked read.");

                angular.forEach($scope.getSelectedItems(), function (ent) {
                    ent.isUnread = false;
                    ent.isSelected = false;
                });

                $rootScope.$broadcast('inbox:updated');

            }, function () {
                $scope.bulkProcessing = false;
                showBulkProcessingResult("An error has occurred.");
            });
        };

        $scope.bulkMarkUnread = function () {
            $scope.bulkProcessing = true;
            var ids = $scope.getSelectedItems().map(function(ent) { return ent.id; });

            MessagingSvc.markUnreadMulti(ids, function () {
                $scope.bulkProcessing = false;
                showBulkProcessingResult(ids.length + " conversations successfully marked unread.");

                angular.forEach($scope.getSelectedItems(), function (ent) {
                    ent.isUnread = true;
                    ent.isSelected = false;
                });

                $rootScope.$broadcast('inbox:updated');

            }, function () {
                $scope.bulkProcessing = false;
                showBulkProcessingResult("An error has occurred.");
            });
        };

        $scope.bulkDelete = function () {
            $scope.bulkProcessing = true;
            var ids = $scope.getSelectedItems().map(function(ent) { return ent.id; });

            MessagingSvc.archiveMulti(ids, function () {
                $scope.bulkProcessing = false;
                showBulkProcessingResult(ids.length + " conversations successfully deleted.");

                $rootScope.$broadcast('inbox:updated');

                $scope.refresh();
            }, function () {
                $scope.bulkProcessing = false;
                showBulkProcessingResult("An error has occurred.");
            });
        };

        $scope.search = function (s) {
            $scope.searchQuery = s;
            $scope.refresh();
            $scope.showingSearchResults = true;
        };

        $scope.clearSearch = function () {
            $scope.showingSearchResults = false;
            $scope.messagesSearchString = "";
            $scope.searchQuery = "";
            $scope.refresh();
        };

        $scope.newMessage = function (defaults) {
            $modal.open({
                animation: true,
                templateUrl: '/assets/templates/message-new-modal.html',
                controller: 'MessageNewController',
                size: 'md',
                resolve: {
                    defaults: function () {
                        return defaults;
                    }
                }
            });
        };
    }

    window.app.controller('MessagingCtrl', ['$scope', '$rootScope', '$modal', 'MessagingSvc', 'NotificationSvc', 'UserSvc', 'ConnectionSvc', '$q', '$timeout', MessagingCtrl]);

    function ViewConversationCtrl($scope, $rootScope, $modal, MessagingSvc) {

        $scope.showDeleteConfirmation = false;
        $scope.conversationDeleted = false;

        $scope.init = function (id) {
            MessagingSvc.getConversation(id, function (resp) {
                $scope.conversation = resp.data;
                $scope.members = $scope.conversation.members.filter(function (ent) { return ent.id !== userId; }).map(function (ent) { return ent.name; }).join(', ');

                MessagingSvc.markRead(id, function () { $rootScope.$broadcast('inbox:updated'); }, function () { });
            }, function () {
                alert('An error has occurred.');
            });
        };

        $scope.reply = function () {
            $modal.open({
                animation: true,
                templateUrl: '/assets/templates/message-reply-modal.html',
                controller: 'MessageReplyController',
                size: 'md',
                resolve: {
                    recipientsText: function () {
                        return $scope.conversation.members
                            .filter(function (ent) { return ent.id != window.userId; })
                            .map(function (ent) { return ent.name; }).join(', ');
                    },
                    conversationId: function () {
                        return $scope.conversation.id;
                    }
                }
            });
        };

        $scope.getCurrentFilter = function () {
            if (window.location.hash && window.location.hash.startsWith('#filter=')) {
                return '#' + window.location.hash.substr(8);
            }
        };

        $scope.archive = function () {
            $scope.$loading = true;
            $scope.showDeleteConfirmation = false;
            MessagingSvc.archiveMulti([$scope.conversation.id], function () {
                $scope.conversationDeleted = true;
                //window.location = '/online-network/messages';
            }, function (resp) {
                console.error(resp);
                $scope.$loading = false;
                alert('An error has occurred.');
            });
        };

        $scope.$on('conversation:updated', function (ev, id) {
            if (id === $scope.conversation.id) {
                MessagingSvc.getConversation(id, function (resp) {
                    $scope.conversation = resp.data;
                }, function () {
                    alert('An error has occurred.');
                });
            }
        });
    }

    window.app.controller('ViewConversationCtrl', ['$scope', '$rootScope', '$modal', 'MessagingSvc', ViewConversationCtrl]);

    function MessageReplyController($scope, $rootScope, $modalInstance, MessagingSvc, conversationId, recipientsText) {
        $scope.recipientsText = recipientsText;
        $scope.conversationId = conversationId;

        $scope.submit = function (body) {
            $scope.$loading = true;
            MessagingSvc.send($scope.conversationId, $scope.body, function () {
                $scope.responseMessage = 'Your message has been delivered.';

                $rootScope.$broadcast('conversation:updated', $scope.conversationId);
            }, function () {
                alert('An error has occurred.');
                $scope.$loading = false;
            });
        };
    }

    window.app.controller('MessageReplyController', ['$scope', '$rootScope', '$modalInstance', 'MessagingSvc', 'conversationId', 'recipientsText', MessageReplyController]);

    function MessageNewController($scope, $rootScope, $modalInstance, $http, MessagingSvc, defaults) {
        if (defaults) {
            $scope.recipients = defaults.recipients;
            $scope.defaultRecipients = defaults.recipients.map(function(ent) { return ent.name; }).join(', ');
        }
        else {
            $scope.recipients = [];
        }

        $scope.usersList = [];
        $scope.refreshUsers = function (query) {
            if (query && query.length > 3) {
                var params = { query: query, skip: 0, take: 10 };
                return $http.get(
                  '/api/search/users',
                  { params: params }
                ).then(function (response) {
                    $scope.usersList = response.data.results || [];
                });
            }
        };

        $scope.submit = function () {
            var recipients = $scope.recipients.map(function(ent) { return ent.id; });
            var subject = $scope.subject;
            var body = $scope.body;

            $scope.$loading = true;
            MessagingSvc.startConversation(recipients, body, subject, function () {
                $scope.responseMessage = 'Your message has been delivered.';
            }, function () {
                alert('An error has occurred.');
                $scope.$loading = false;
            });
        };
    }

    window.app.controller('MessageNewController', ['$scope', '$rootScope', '$modalInstance', '$http', 'MessagingSvc', 'defaults', MessageNewController]);

})(window);
