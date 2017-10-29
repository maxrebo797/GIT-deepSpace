(function (window, tinymce) {
    'use strict';

    function file_browser(field_name, url, type, win) {

        // console.log(field_name, url, type, win);

        tinymce.activeEditor.windowManager.open({
            file: '/assets/dialog/upload.html',
            title: 'File Upload',
            width: 420,
            height: 400,
            resizable: 'no',
            inline: 'yes',
            close_previous: 'no'
        }, {
            window: win,
            input: field_name
        });

        return false;
    }

    var defaultConfig = {
        mode: 'exact',
        plugins: ['link', 'image', 'media', 'stylebuttons', 'paste', 'fileuploader'/*, 'autoresize'*/],
        content_css: '/assets/css/style.css?' + new Date().getTime(),
        height: 440,
        browser_spellcheck: true,
        resize: false,
        menubar: false,
        statusbar: false,
        theme_advanced_buttons1: "formatselect",
        toolbar: 'bold italic underline | alignleft aligncenter alignright | numlist bullist outdent indent | quote link imageupload media',
        file_browser_callback: file_browser,
        autoresize_min_height: 440
    };

    function TinyMCE() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                'ngModel': '='
            }
        };

        var counter = 0;
        var prefix = 'tinymce-';

        directive.link = function (scope, element, attrs, ngModel) {
            var tinyInstance;

            if (!attrs.id) {
                attrs.$set('id', prefix + counter++);
            }

            var updateView = function () {
                ngModel.$setViewValue(element.val());
                if (!scope.$root.$$phase) {
                    scope.$apply();
                }
            };

            console.log(attrs.id);

            var options = {
                // Update model when calling setContent (such as from the source editor popup)
                setup: function (ed) {
                    ed.on('init', function () {
                        ngModel.$render();
                        ngModel.$setPristine();
                    });
                    // Update model on button click
                    ed.on('ExecCommand', function () {
                        ed.save();
                        updateView();
                    });
                    // Update model on keypress
                    ed.on('KeyUp', function () {
                        ed.save();
                        updateView();
                    });
                    // Update model on change, i.e. copy/pasted text, plugins altering content
                    ed.on('SetContent', function (e) {
                        if (!e.initial && ngModel.$viewValue !== e.content) {
                            ed.save();
                            updateView();
                        }
                    });
                    ed.on('blur', function () {
                        element.blur();
                    });
                    // Update model when an object has been resized (table, image)
                    ed.on('ObjectResized', function () {
                        ed.save();
                        updateView();
                    });
                },

                elements: attrs.id
            };

            options = angular.extend(defaultConfig, options);

            //setTimeout(function () { tinymce.init(options); }, 100);
            tinymce.init(options);

            ngModel.$render = function () {
                if (!tinyInstance) {
                    tinyInstance = tinymce.get(attrs.id);
                }
                if (tinyInstance) {
                    tinyInstance.setContent(ngModel.$viewValue || '');
                }
            };

            scope.$on('$destroy', function () {
                if (!tinyInstance) { tinyInstance = tinymce.get(attrs.id); }
                if (tinyInstance) {
                    tinyInstance.remove();
                    tinyInstance = null;
                }
            });
        };

        return directive;
    }

    window.app.directive('tinymce', [TinyMCE]);
})(window, window.tinymce);
