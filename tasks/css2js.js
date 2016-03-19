/*jshint node: true*/

/*
 * grunt-css2
 * https://github.com/ragiragi/grunt-css2js
 *
 * Copyright (c) 2013 Choi Seong-Rak
 * Licensed under the BSD license.
 */
(function () {

    var path = require('path');
    module.exports = function (grunt) {
        'use strict';

        grunt.registerMultiTask('css2js', 'Convert a CSS File to JS DOM Script.', function () {

            // Iterate of the Files Array
            this.files.forEach(function (file) {

                var existFiles = file.src.filter(function (filepath) {
                    // Remove nonexistent files (it's up to you to filter or warn here).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });

                var contents = existFiles.map(function (filepath) {
                    // Read and return the file's source.
                    return grunt.file.read(filepath);
                }).join('\n');

                var fileNames = existFiles.map(function (filepath) {
                    return path.basename(filepath);
                }).join(', ');

                var cssInJavascriptString = convertInJSString(contents);

                var moduleName = fileNames.replace(/([.]css)/gi, "");

                grunt.file.write(file.dest, "" +
                "angular.module(\"component."+ moduleName +".stylesheets\", [\"$templateCache\", function ($templateCache) {\r\n"+
                "  $templateCache.put(\""+ fileNames +"\", "+ cssInJavascriptString +");\r\n"+
                "}]);\r\n");

                grunt.log.writeln('File "' + file.dest + '" created.');

            });

            return true;
        });

    };

    var convertInJSString = module.exports.convertInJSString = function (css) {
        var cssLines = css.split(/\r?\n/), cssLineCount = cssLines.length;
        return cssLines.map(function (l, idx) {
            var isLastOne = idx === (cssLineCount - 1);
            l = l.replace(/\\/g, '\\\\');
            l = l.replace(/\"/g, '\\"');
            return '"' + l + '' + (!isLastOne ? '\\n' : '') + '"';
        }).join(" +\n");
    };

}());
