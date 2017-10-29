(function () {
    'use strict';

    function formatUrl(url, data) {
        var ret = url;
        if (data) {
            for (var k in data) {
                ret = ret.replace(':' + k, data[k]);
            }
        }
        return ret;
    }

    function Model($http, config) {
        this.$config = config;
        this.$http = $http;
    }

    Model.prototype.config = function (config) {
        this.$config = config;
    };

    Model.prototype.$load = function (data) {
        for (var k in data) {
            this[k] = data[k];
        }

        this.$clean = angular.copy(this.$data());

        if (this.$loaded) { this.$loaded(this); }
    };

    Model.prototype.$data = function () {
        var ret = {};
        for (var k in this) {
            if (k[0] !== '$' && typeof (this[k]) !== 'function') {
                ret[k] = this[k];
            }
        }
        return ret;
    };

    Model.prototype.get = function (id, callback) {
        return this.queryObj(this.$config.getUrl, { id: id }, callback);
    };

    Model.prototype.save = function (callback, errorCallback) {
        var self = this;
        this.$loading = true;

        (this.id ? this.$http.put(formatUrl(this.$config.updateUrl, { id: this.id }), this.$data())
            : this.$http.post(this.$config.createUrl, this.$data()))

        .success(function (data) {
            self.$load(data);
            self.$loading = false;

            if (callback) { callback(data, this); }
        })
        .error(errorCallback);
    };

    Model.prototype.query = function (url, params, callback) {
        var ret = [];

        this.$http.get(formatUrl(url, params))

        .success(function (data) {
            for (var i = 0; i < data.length; i++) {
                ret.push(data[i]);
            }

            if (callback) { callback(ret, this); }
        });

        return ret;
    };

    Model.prototype.queryObj = function (url, params, callback) {
        var ret = new Model(this.$http, this.$config);
        ret.$loading = true;

        this.$http.get(formatUrl(url, params))

        .success(function (data) {
            ret.$load(data);
            ret.$loading = false;

            if (callback) { callback(ret); }
        });

        return ret;
    };

    Model.prototype.all = function (callback) {
        return this.query(this.$config.allUrl, null, callback);
    };

    Model.prototype.empty = function () {
        var ret = new Model(this.$http, this.$config);
        ret.$clean = this.$data();

        return ret;
    };

    Model.prototype.isClean = function () {
        return angular.equals(this, this.$clean, true);
    };

    Model.prototype.reset = function () {
        this.$load(this.$clean);
    };

    function ModelFactory($http) {
        this.$http = $http;

        this.config = function (config) {
            return new Model(this.$http, config);
        };
    }

    angular.module('model', []).service('Model', ['$http', ModelFactory]);
})();
