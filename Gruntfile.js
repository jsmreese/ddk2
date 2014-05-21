"use strict";

module.exports = function(grunt) {
	var _ = require("lodash");
	
	var standard_files = function (folder) {
		return {
			expand: true,
			cwd: "js/" + folder,
			src: ["*.js", "!*-LEGACY.js", "!*-R.js"],
			dest: "dist/js/client/",
			rename: function (dest) {
				return dest + "ddk2-" + folder + "-standard.js";
			}
		};
	};
	
	var legacy_files = function (folder) {
		return {
			expand: true,
			cwd: "js/" + folder,
			src: ["*.js", "!*-STANDARD.js", "!*-R.js"],
			dest: "dist/js/client/",
			rename: function (dest) {
				return dest + "ddk2-" + folder + "-legacy.js";
			}
		};
	};

	var standard_responsive_files = function (folder) {
		return {
			expand: true,
			cwd: "js/" + folder,
			src: ["*.js", "foundation/foundation.js", "foundation/*.js", "!*-LEGACY.js", "!*-NR.js"],
			dest: "dist/js/client/",
			rename: function (dest) {
				return dest + "ddk2-" + folder + "-responsive-standard.js";
			}
		};
	};
	
	var legacy_responsive_files = function (folder) {
		return {
			expand: true,
			cwd: "js/" + folder,
			src: ["*.js", "foundation/foundation.js", "foundation/*.js", "!*-STANDARD.js", "!*-NR.js"],
			dest: "dist/js/client/",
			rename: function (dest) {
				return dest + "ddk2-" + folder + "-responsive-legacy.js";
			}
		};
	};
	
	var server_files = {
		expand: true,
		cwd: "js/server",
		src: ["*.js"],
		dest: "dist/js/server/",
		rename: function (dest) {
			return dest + "ddk2-server.js";
		}
	};

	var banner = "/* <%= pkg.title %>\n" +
		" * Version: <%= pkg.version %>\n" +
		" * Date: <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
		" * Copyright (c) <%= grunt.template.today('yyyy') %> PureShare, Inc.\n" +
		" */\n\n";

	var server_banner = banner +
		"var DDK = DDK || {};\n" + 
		"DDK.VERSION = \"<%= pkg.version %>\";\n\n";

	var server_min_banner = banner + "var DDK_SERVERJSMIN = true;\n\n";
	
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON("package.json"),

		// Task configuration.
		clean: {
			client: {
				src: ["dist/js/client"]
			},
			server: {
				src: ["dist/js/server"]
			},
			css: {
				src: ["dist/css"]
			}
		},
		
		concat: {
			options: {
				stripBanners: false,
				separator: "\n;\n\n",
				process: function (src, filepath) {
					return "/*******************************************" +
					"\n * File: " + filepath + 
					"\n */" +
					"\n\n" + src.replace(/\r\n|\r/g, "\n");
				},
				banner: banner
			},
			core: {
				files: [
					standard_files("core"),
					legacy_files("core")
				]
			},
			core_responsive: {
				files: [
					standard_responsive_files("core"),
					legacy_responsive_files("core")
				]
			},
			plugins: {
				files: [
					standard_files("plugins"),
					legacy_files("plugins")
				]
			},
			addons: {
				files: [
					standard_files("addons"),
					legacy_files("addons")
				]
			},
			server: {
				options: {
					banner: server_banner
				},
				files: [
					server_files
				]
			},
			css: {
				options: {
					separator: "\n\n\n"
				},
				files: [
					// standard build
					{
						expand: true,
						cwd: "css/",
						src: ["*.css", "!*-LEGACY.css", "!*-NR.css"],
						dest: "dist/css/",
						rename: function (dest) {
							return dest + "ddk2-responsive-standard.css";
						}
					},
					// legacy build
					{
						expand: true,
						cwd: "css/",
						src: ["*.css", "!*-STANDARD.css", "!*-NR.css"],
						dest: "dist/css/",
						rename: function (dest) {
							return dest + "ddk2-responsive-legacy.css";
						}
					}
				]
			}
		},
		
		uglify: {
			client: {
				options: {
					banner: banner
				},
				files: [
					{
						expand: true,
						cwd: "dist/js/client/",
						src: ["*.js"],
						dest: "dist/js/client/",
						ext: ".min.js"
					}
				]
			},
			server: {
				options: {
					banner: server_min_banner
				},
				files: [
					{
						expand: true,
						cwd: "dist/js/server/",
						src: ["*.js"],
						dest: "dist/js/server/",
						ext: ".min.js"
					}
				]
			}
		},
		
		cssmin: {
			css: {
				options: {
					banner: banner
				},
				files: [
					{
						expand: true,
						cwd: "dist/css",
						src: ["*.css"],
						dest: "dist/css",
						ext: ".min.css"
					}
				]
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	//grunt.loadNpmTasks("grunt-contrib-qunit");
	//grunt.loadNpmTasks("grunt-contrib-jshint");

	// default task
	grunt.registerTask("default", ["clean", "concat", "uglify", "cssmin"]);

	// css task
	grunt.registerTask("css", ["clean:css", "concat:css", "cssmin:css"]);
	
	// server task
	grunt.registerTask("server", ["clean:server", "concat:server", "uglify:server"]);

	// server task
	grunt.registerTask("resp", ["clean:client", "concat:core_responsive", "uglify:client"]);
	
	// client tasks
	_.each("core plugins addons".split(" "), function (value) {
		grunt.registerTask(value, ["clean:client", "concat:" + value, "uglify:client"]);
	});

	// dev task
	grunt.registerTask("dev", ["clean", "concat"]);

	//grunt.registerTask("test", [/*"qunit",*/ /*"jshint,"*/ "clean", "concat:standard", "uglify:standard"]);

};
