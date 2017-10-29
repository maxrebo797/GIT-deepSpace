(function (window) {
    'use strict';

    function ReferenceSvc($http) {
        this.get = function (type, callback) {
            $http.get('/api/references/' + type).success(function (data) {
                callback && callback(data);
            });
        };

        this.states = [
            { displayText: 'Victoria' },
            { displayText: 'New South Wales' },
            { displayText: 'ACT' },
            { displayText: 'Queensland' },
            { displayText: 'Northern Territory' },
            { displayText: 'South Australia' },
            { displayText: 'Western Australia' },
            { displayText: 'Tasmania' }
        ];

        return this;
    }


    window.app.service('ReferenceSvc', ['$http', ReferenceSvc]);
})(window);