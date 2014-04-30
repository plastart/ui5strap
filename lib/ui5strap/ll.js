/*
 * 
 * Liberty Platform
 *
 *
 * Liberty Lite Bootstrap
 * 
 * Author: Jan Philipp Knöller
 * 
 * Copyright (c) 2013 Jan Philipp Knöller
 * 
 * http://pksoftware.de
 * 
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

/* 
* Provide requestAnimationFrame for older browsers
*/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/*
* Liberty Lite main
*/
function libertyLite(_appBase){

 	var _initConfig = function(callback){
		var configModel = new sap.ui.model.json.JSONModel();
		
		configModel.attachRequestCompleted({}, function(){
			callback(configModel.getData());
		});
		configModel.attachRequestFailed({}, function(){
			alert('Could not load app config!');
		});
		
		configModel.loadData(_appBase + '/app.json');
	};

	_initConfig(function _initConfigSuccess(_configData){
		var _packageName = _configData.app['package'],
	 		_moduleName = _packageName + ".App";

	 	jQuery.sap.registerModulePath(_packageName, _appBase);

	 	jQuery.sap.declare(_moduleName);
		
		sap.ui.base.Object.extend(_moduleName);

		var MyApp = jQuery.sap.getObject(_moduleName),
			MyAppProto = MyApp.prototype;

		var _instance = null;

		jQuery.sap.declare('liberty');

		liberty = {};

		var _libertyViewer = {
			getApp : function(){
				if(null === _instance){
					_instance = new MyApp();
				}
				return _instance;
			}
		};

	 	liberty.getViewer = function(){
	 		return _libertyViewer;
	 	};

		var _initStyle = function(sheets, callback){
			var callI = 0;
			var callMax = sheets.length;
			var success = function anon_loadCssComplete(){
					callI ++;
					if(callI === callMax){
						callback();
					}
			};

			var error = function anon_loadCssFailed(){
					throw new Error('Could not load css file: ');
			};

			
			for (var i = 0; i < sheets.length; i++){
				jQuery.sap.includeStyleSheet(sheets[i], 'ui5strap-css-' + i, success, error);
			}
		};

		var _start = function(app){
			app.getFrame().showInitialContent();

			app.setLoaderVisible(false);
		};

		MyAppProto.getConfig = function(){
			return _configData;
		};

		MyAppProto.init = function(){
			var app = this;

			app.getLocalization();

			//Libs
			var libs = _configData.libraries;

			for(var packageName in libs){
				jQuery.sap.registerModulePath(packageName, libs[packageName]);
			}

			//Views
			var views = _configData.views;

			_configData.getViewData = function(viewName){
				if(!(viewName in views)){
					return null;
				}
				return jQuery.extend({ viewName : viewName }, views[viewName]);
			};

			//Frame
			var frameOptions = _configData.frame;
			var frameModule = frameOptions.module;
			jQuery.sap.require(frameModule);

			var FrameConstructor = jQuery.sap.getObject(frameModule);
			
			var frame =  new FrameConstructor();

			app.getFrame = function(){
				return frame;
			};

			//Load css files
			var css = _configData.css;

			var sheets = [];

			for(var i = 0; i < css.length; i++){
				var sheet = css[i];
				if(typeof sheet === 'string'){
					sheets.push(_appBase + "/" + sheet);
				}
				else{
					sheets.push(jQuery.sap.getModulePath(sheet['package']) + "/" + sheet.src);
				}
			}

			frame.init(frameOptions);
			frame.placeAt('ui5strap-body');

			_initStyle(sheets, function(){
				_start(app);
			});
		};

		MyAppProto.setLoaderVisible = function(visible){
			jQuery('#loader').css('display', visible ? 'block' : 'none');
		};

		MyAppProto.getLocalization = function(){
			if(!this._localization){
				//Localization
				this._localization = new sap.ui.model.resource.ResourceModel({
					bundleUrl : _appBase + "/i18n/i18n.properties"
				});
				sap.ui.getCore().setModel(this._localization, "i18n");
				
				document.title = this._localization.getProperty("HTML_TITLE");
			}
			else{
				return this._localization;
			}
		};

		liberty.getViewer().getApp().init();

	}); //End _initConfig

}; //End libertyLite