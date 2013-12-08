var _ = require('lodash');
var underscoreDeepExtend = require('underscoreDeepExtend');
var fs = require('fs');

_.mixin({deepExtend: underscoreDeepExtend(_)});

/**
 * read in provided json files
 */
var importFiles = function(dirs) {
	var len = dirs.length;
	var files = [];
	for(var i=0; i<len; i++) {
		files[i] = fs.readFileSync(dirs[i], 'utf8');
	}
	return files;
};


/**
 * parse json files
 */
var parseJsonFiles = function(files) {
	var objs = [];
	_.each(files, function(file, index) {
		objs[index] = JSON.parse(file);
	});
	return objs;
};


/**
 * merge data objects into masterObj
 */
var mergeData = function(objs) {
	var masterObj = {};
	_.each(objs, function(obj) {
		_.deepExtend(masterObj, obj);
	});
	return masterObj;
};


/**
 *  read in json files, merge them, then output a new json file
 *  example: node json-merge.js file1.json file2.json file3.json output.json
 */
var dirs = process.argv.slice(2, process.argv.length-1);
var outputDir = process.argv[process.argv.length-1];

var files = importFiles(dirs);
var objs = parseJsonFiles(files);
var masterObj = mergeData(objs);
var masterJson = JSON.stringify(masterObj, null, 2);

fs.writeFileSync(outputDir, masterJson, 'utf8');

console.log('files', dirs, 'merged to', outputDir);