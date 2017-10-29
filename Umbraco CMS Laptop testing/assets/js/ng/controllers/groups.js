(function (window, Handlebars) {
    'use strict';

    function GroupCtrl($scope, $modal, $rootScope, GroupSvc) {

        $scope.makeAdmin = function (key, user) {
            $scope.confirm('Add Facilitator', 'Are you sure you want to add this member as a facilitator?').then(function () {
                GroupSvc.makeAdmin(key, user, function () {
                    //alert('user is now admin/facilitator');
                    $rootScope.$broadcast('group:members:updated', key);
                }, function () {
                    alert('something went wrong');
                });
            });
        };

        $scope.removeAdmin = function (key, user) {
            $scope.confirm('Remove Facilitator', 'Are you sure you want to remove this member as a facilitator?').then(function () {
                GroupSvc.removeAdmin(key, user, function () {
                    //alert('user is now admin/facilitator');
                    $rootScope.$broadcast('group:members:updated', key);
                }, function () {
                    alert('something went wrong');
                });
            });
        };

        $scope.approve = function (key, user) {
            GroupSvc.approve(key, user, function () {
                //alert('user has been approved and is now a member');
                $rootScope.$broadcast('group:members:updated', key);
            }, function () {
                alert('something went wrong');
            });
        };

        $scope.deny = function (key, user) {
            GroupSvc.deny(key, user, function () {
                //alert('user has been denied');
                $rootScope.$broadcast('group:members:updated', key);
            }, function () {
                alert('something went wrong');
            });
        };

        $scope.remove = function (key, user) {
            $scope.confirm('Remove Member', 'Are you sure you want to remove this member from the group?').then(function () {
                GroupSvc.remove(key, user, function () {
                    //alert('user has been removed');
                    $rootScope.$broadcast('group:members:updated', key);
                }, function () {
                    alert('something went wrong');
                });
            });
        };

        $scope.groupBroadcast = function (groupId) {
            $modal.open({
                animation: true,
                templateUrl: '/assets/templates/group-broadcast-modal.html',
                controller: 'GroupBroadcastCtrl',
                size: 'md',
                resolve: {
                    groupId: function () {
                        return groupId;
                    }
                }
            });
        };

        $scope.leave = function (key, refreshOnSuccess) {
            $scope.confirm('Leave Group', 'Are you sure you want to leave this group?').then(function () {
                GroupSvc.leave(key, function () {
                    if (refreshOnSuccess) {
                        window.location.reload();
                    }
                });
            });
        }
    }

    window.app.controller('GroupCtrl', ['$scope', '$modal', '$rootScope', 'GroupSvc', GroupCtrl]);

    function CreateGroupCtrl($scope, GroupSvc, PermissionSvc) {
        $scope.model = { references: [] };
        $scope.permissions = [];
        $scope.submitted = false;

        $scope.create = function () {
            if ($scope.form.$valid) {
                GroupSvc.create($scope.model, function (resp) {
                    var url = resp.data.url;

                    PermissionSvc.update(resp.data.id, $scope.permissions, function () {
                        window.location = url;
                    }, function () {
                        alert('something went wrong');
                    });
                },
                function () {
                    alert('something went wrong');
                });
            } else {
                $scope.submitted = true;
            }
        };
    }

    window.app.controller('CreateGroupCtrl', ['$scope', 'GroupSvc', 'PermissionSvc', CreateGroupCtrl]);

    function EditGroupCtrl($scope, GroupSvc, PermissionSvc) {
        $scope.permissions = [];
        $scope.submitted = false;

        $scope.init = function (key) {
            GroupSvc.get(key, function (resp) {
                $scope.model = resp.data;

                PermissionSvc.list($scope.model.id, function (resp) {
                    $scope.permissions = resp.data;
                });
            },
            function () {
                alert('something went wrong');
            });
        };

        $scope.save = function () {
            if ($scope.form.$valid) {
                window.async.parallel([
                    function (callback) {
                        GroupSvc.save($scope.model,
                            function (resp) { callback(null, resp.data); },
                            function (resp) { callback(resp, resp.data); });
                    },
                    function (callback) {
                        PermissionSvc.update($scope.model.id, $scope.permissions,
                            function () { callback(null); },
                            function (resp) { callback(resp, resp.data); });
                    }
                ], function (err, results) {
                    if (err) {
                        alert('something went wrong');
                        console.log(results);
                        return;
                    }

                    window.location = results.clean()[0];

                    $scope.$loading = false;
                });
            } else {
                $scope.submitted = true;
            }
        };
    }

    window.app.controller('EditGroupCtrl', ['$scope', 'GroupSvc', 'PermissionSvc', EditGroupCtrl]);

    function GroupDetailCtrl($scope, $modal, GroupSvc) {
        $scope.$ready = false;
        $scope.init = function (key, currentStatus, exclusivity) {
            $scope.key = key;
            $scope.currentStatus = currentStatus === '' ? null : currentStatus;
            $scope.exclusivity = exclusivity;
            $scope.$ready = true;
        };

        $scope.do = function (action) {
            var fn = null;
            switch (action) {
                case 'join':
                    $modal.open({
                        animation: true,
                        templateUrl: '/assets/templates/join-group-modal.html',
                        controller: 'JoinGroupController',
                        size: 'md',
                        resolve: {
                            groupKey: function () {
                                return $scope.key;
                            },
                            canSkip: function () {
                                return $scope.exclusivity == 'Open';
                            }
                        }
                    });
                    break;
                case 'leave':
                    fn = GroupSvc.leave;
                    break;
                case 'accept':
                    fn = GroupSvc.accept;
                    break;
            }

            if (fn === null) {
                return;
            }
            if (fn == GroupSvc.leave) {
                $scope.confirm('Leave Group', 'Are you sure you want to leave this group?').then(function () {
                    $scope.$loading = true;
                    fn($scope.key, function (resp) {
                        $scope.currentStatus = null;
                        $scope.$loading = false;
                    });
                });
            }
            else {
                $scope.$loading = true;
                fn($scope.key, function (resp) {
                    switch (action) {
                        case 'join':
                            $scope.currentStatus = resp.data;
                            break;
                        case 'leave':
                            $scope.currentStatus = null;
                            break;
                        case 'accept':
                            $scope.currentStatus = 'Active';
                            break;
                    }

                    $scope.$loading = false;
                }, function (resp) {
                    alert('something went wrong');

                    $scope.$loading = false;
                });
            }
        };
    }

    window.app.controller('GroupDetailCtrl', ['$scope', '$modal', 'GroupSvc', GroupDetailCtrl]);

    function GroupInviteMembersCtrl($scope, TypeaheadSvc, GroupSvc) {

        $scope.init = function (key) {
            $scope.groupKey = key;
        };

        $scope.ttDataset = TypeaheadSvc.userSearch({
            templates: {
                suggestion: Handlebars.compile('<em>{{displayText}}</em><span><a class="add" href="#">Add</a></span>')
            }
        });
        $scope.ttOptions = angular.extend({}, TypeaheadSvc.defaultOptions, { highlight: true });

        $scope.$on('typeahead:selected', function (e, args) {
            $scope.$loading = true;
            GroupSvc.invite($scope.groupKey, args.id,
                function () {
                    $scope.member = null;
                    alert('invited.');
                    $scope.$loading = false;
                }, function () {
                    alert('something went wrong');
                    $scope.$loading = false;
                });
        });
    }

    window.app.controller('GroupInviteMembersCtrl', ['$scope', 'TypeaheadSvc', 'GroupSvc', GroupInviteMembersCtrl]);

    function JoinGroupController($scope, $modalInstance, GroupSvc, groupKey, canSkip) {
        $scope.groupKey = groupKey;
        $scope.canSkip = canSkip;

        $scope.submit = function (reason) {
            $scope.$loading = true;
            GroupSvc.join($scope.groupKey, reason || '', function (resp) {
                if (resp.data === 'Pending') {
                    $scope.responseMessage = 'Thank you, your request to join the group has been received and as this is a moderated group the facilitator will be in contact shortly.';
                }
                else if (resp.data === 'Active') {
                    $scope.responseMessage = 'Thank you, your request to join the group has been received and you can now participate and connect with other members.';
                }
                $scope.$loading = false;
            }, function (resp) {
                console.error(resp);
                alert('An error has occurred.');
                $scope.$loading = false;
            });
        };

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }

    window.app.controller('JoinGroupController', ['$scope', '$modalInstance', 'GroupSvc', 'groupKey', 'canSkip', JoinGroupController]);

    function GroupMemberListCtrl($scope, GroupSvc) {
        $scope.page = 0;
        $scope.pageSize = 10;

        $scope.init = function (key) {
            $scope.groupKey = key;
            $scope.name = "";
            $scope.refresh();
        };

        $scope.searchClear = function () {
            $scope.name = '';
            $scope.$loading = true;
            $scope.getMembers($scope.groupKey, $scope.name, $scope.page, $scope.pageSize);
            $scope.page = 0;
            $scope.refresh();
        };

        $scope.search = function () {
            $scope.$loading = true;
            $scope.getMembers($scope.groupKey, $scope.name, $scope.page, $scope.pageSize);
            $scope.page = 0;
            $scope.refresh();
        };

        $scope.refresh = function () {
            $scope.$loading = true;
            $scope.getMembers($scope.groupKey, $scope.name, $scope.page, $scope.pageSize);
        };

        $scope.back = function () {
            $scope.page--;
            $scope.refresh();
        };

        $scope.next = function () {
            $scope.page++;
            $scope.refresh();
        };

        $scope.$on('group:members:updated', function () {
            $scope.refresh();
        });

        $scope.getMembers = function (groupKey, name, page, pageSize) {
            GroupSvc.getMembers(groupKey, name, page, pageSize, function (resp) {
                $scope.data = resp.data;
                $scope.$loading = false;
            }, function (resp) {
                console.error(resp);
                $scope.$loading = false;
            });

        };
    }

    window.app.controller('GroupMemberListCtrl', ['$scope', 'GroupSvc', GroupMemberListCtrl]);


    function GroupBroadcastCtrl($scope, $modalInstance, MessagingSvc, groupId) {
        $scope.submit = function (body) {
            $scope.$loading = true;
            MessagingSvc.sendToGroup(groupId, body, function (resp) {
                $scope.responseMessage = 'Your message has been delivered.';
            }, function (resp) {
                console.error(resp);
                alert('An error has occurred.');
                $scope.$loading = false;
            });
        };
    }

    window.app.controller('GroupBroadcastCtrl', ['$scope', '$modalInstance', 'MessagingSvc', 'groupId', GroupBroadcastCtrl]);




})(window, window.Handlebars);
