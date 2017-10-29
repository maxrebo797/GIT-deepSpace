(function (window, Bloodhound) {
    'use strict';

    function TypeaheadSvc() {
        this.defaultOptions = { minLength: 3 };

        this.userSearch = function (extraOptions) {
            var extraOptions = extraOptions || {};
            var ret = new Bloodhound({
                datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.displayText); },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/api/search/users?query=%QUERY',
                    filter: function (resp) {
                        var map = function (ent) {
                            return {
                                id: ent.id,
                                displayText: ent.primaryText
                            };
                        };

                        return resp.results.map(map);
                    }
                }
            });

            ret.initialize();

            return angular.extend(extraOptions, {
                displayKey: 'displayText',
                source: ret.ttAdapter()
            });
        };

        return this;
    }

    window.app.service('TypeaheadSvc', [TypeaheadSvc]);

})(window, window.Bloodhound);