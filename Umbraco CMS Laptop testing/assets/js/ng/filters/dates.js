(function(window) {
    function dateSuffix($filter) {
        var suffixes = ["th", "st", "nd", "rd"];
        return function(input, format) {
            var dtfilter = $filter('date')(input, format);
            var day = parseInt($filter('date')(input, 'dd'));
            var relevantDigits = (day < 30) ? day % 20 : day % 30;
            var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
            return dtfilter.replace('oo', suffix);
        };
    }

    window.app.filter('dateSuffix', ['$filter', dateSuffix]);
})(window);