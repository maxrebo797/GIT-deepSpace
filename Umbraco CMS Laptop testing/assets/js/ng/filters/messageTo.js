(function (window) {
    function messageTo() {
        return function (items, name) {
            var filtered = [];

            if (name === undefined || name === '') {
                return items;
            }

            angular.forEach(items, function (item) {
                if (name != item.name) {
                    filtered.push(item);
                }
            });

            return filtered;
        };
    }

    window.app.filter('messageTo', [messageTo]);
})(window);