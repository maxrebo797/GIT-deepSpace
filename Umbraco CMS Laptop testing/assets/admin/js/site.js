(function () {
    'use strict';

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var id = $(this).parents('[role="tablist"]').attr('id');
        var key = 'lastTag';
        if (id) {
            key += ':' + id;
        }

        localStorage.setItem(key, $(e.target).attr('href'));
    });

    $('[role="tablist"]').each(function (idx, elem) {
        var id = $(elem).attr('id');
        var key = 'lastTag';
        if (id) {
            key += ':' + id;
        }

        var lastTab = localStorage.getItem(key);
        if (lastTab) {
            $('[href="' + lastTab + '"]').tab('show');
        }
    });


    var _tinymce = {
        init: function () {
            // TinyMCE
            tinymce.PluginManager.add('stylebuttons', function (editor, url) {
                ['h1', 'h2', 'h3'].forEach(function (name) {
                    editor.addButton("style-" + name, {
                        tooltip: "Toggle " + name,
                        text: name.toUpperCase(),
                        onClick: function () { editor.execCommand('mceToggleFormat', false, name); },
                        onPostRender: function () {
                            var self = this,
                                setup = function () {
                                    editor.formatter.formatChanged(name, function (state) {
                                        self.active(state);
                                    });
                                };
                            editor.formatter ? setup() : editor.on('init', setup);
                        }
                    });
                });
            });

            tinymce.PluginManager.add('quotebutton', function (editor) {
                editor.addButton('quote', {
                    tooltip: 'Create quoted text',
                    title: 'Create quoted text',
                    icon: 'bla',
                    onClick: function () {
                        editor.focus();
                        editor.selection.setContent('<blockquote>' + editor.selection.getContent() + '</blockquote>');
                    }
                });
            });

            tinymce.PluginManager.add('fileuploader', function (editor) {
                editor.addButton('imageupload', {
                    tooltip: 'Upload image',
                    title: 'Upload image',
                    icon: 'image',
                    onClick: function () {
                        editor.windowManager.open({
                            file: '/assets/dialog/upload.html?v=2.1',
                            title: 'File Upload',
                            width: 420,
                            height: 400,
                            resizable: 'no',
                            inline: 'yes',
                            close_previous: 'no'
                        }, {
                            window: editor.window,
                            editor: editor
                        });
                    }
                });
            });

            tinymce.PluginManager.load('paste', '/assets/js/plugins/paste/plugin.min.js');
        }
    };

    _tinymce.init();

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
        selector: "textarea.wysiwyg",
        plugins: ['link', 'image', 'media', 'stylebuttons', 'paste', 'fileuploader'],
        content_css: '/assets/css/style.css?' + new Date().getTime(),
        height: 200,
        browser_spellcheck: true,
        resize: false,
        menubar: false,
        statusbar: false,
        theme_advanced_buttons1: "formatselect",
        toolbar: 'bold italic underline | alignleft aligncenter alignright | numlist bullist outdent indent | quote link imageupload media',
        file_browser_callback: file_browser,
        skin: 'light'
    };

    tinymce.init(defaultConfig);
})();
