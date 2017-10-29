(function (window) {
    'use strict';

    function ActivityFeedSvc($http) {

        this.list = function (take, success, error) {
            $http.get('/api/activity-feed', { params: { take: take } }).then(success, error);
            //$http.get('/api/activity-feed?limit=count').then(success, error);
            // Mock the response with static data, also shuffle to boot
            /*var response = {};
            response.data = {
                        "activities":[
                                        {
                                            actor: "ALPAL",
                                            actorImageUrl: "/assets/images/placeholder-user.png",
                                            action: "shared a post",
                                            suffix: "",
                                            target: "Get active and keep well",
                                            url: "...",
                                            type: 'blog_post'
                                        },
                                        {
                                            actor: "group name",
                                            actorImageUrl: "/assets/images/placeholder-user.png",
                                            action: "created event",
                                            target: "event name",
                                            suffix: "group",
                                            url: "...",
                                            type: 'created_event'
                                        },
                                        {
                                            actor: "JOHN SNOW",
                                            actorImageUrl: "/assets/images/placeholder-user.png",
                                            action: "shared a post",
                                            suffix: "",
                                            target: "Wall to Wall rock",
                                            url: "...",
                                            type: 'blog_post'
                                        },
                                        {
                                            actor: "group name",
                                            actorImageUrl: "/assets/images/placeholder-user.png",
                                            action: "created event",
                                            target: "event name",
                                            suffix: "group",
                                            url: "...",
                                            type: 'created_event'
                                        },
                                        {
                                            actor: "JOHN",
                                            actorImageUrl: "/assets/images/placeholder-user.png",
                                            action: "likes a post",
                                            suffix: "",
                                            target: "Bring the Ring",
                                            url: "...",
                                            type: 'blog_post'
                                        },
                                        {
                                            actor: "Team Sideline",
                                            actorImageUrl: "/assets/images/placeholder-user.png",
                                            action: "created event",
                                            target: "greated event this side on the internet, long title too",
                                            suffix: "group",
                                            url: "...",
                                            type: 'created_event'
                                        }
                                    ]
                        };
            response.data.activities = self.shuffle( response.data.activities);
            success(response);*/
        };

        return this;
    }

    window.app.service('ActivityFeedSvc', ['$http', ActivityFeedSvc]);
})(window);
