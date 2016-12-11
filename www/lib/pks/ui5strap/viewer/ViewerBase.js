/*
 * 
 * UI5Strap
 *
 * pks.ui5strap.viewer.ViewerBase
 * 
 * @author Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Homepage: http://ui5strap.com
 *
 * Copyright (c) 2013 Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */
 

sap.ui.define(['./library', 'sap/ui/base/Object', "sap/ui/core/Control", "./Console", "../core/Layer", "../core/NavContainer"], function(library, ObjectBase, ControlBase, Console, Layer, NavContainer){
	
	"use strict";
	
	/**
	 * Constructor for a new ViewerBase instance.
	 * 
	 * @param {object} options - Initial settings.
	 * 
	 * @class
	 * Abstract base class for viewers.
	 * @extends sap.ui.base.Object
	 * 
	 * @author Jan Philipp Knoeller
	 * @version 0.11.6
	 * 
	 * @constructor
	 * @public
	 * @alias pks.ui5strap.viewer.ViewerBase
	 * 
	 */
	var ViewerBase = ObjectBase.extend('pks.ui5strap.viewer.ViewerBase', /** @lends pks.ui5strap.viewer.ViewerBase.prototype */{
		/**
		 * @constructs
		 */
		"constructor" : function(options){
			sap.ui.base.Object.apply(this);
			
			if(!options.app || !options.container){
				throw new Error("Missing required viewer options 'app' or 'container'.");
			}
			
			//Error to Browser
			if(!options.errorToBrowser){
				options.errorToBrowser = false;
			}
			
			if(!options.environments){
				options.environments = {
						local : {
							pathToServerRoot : ".",
							pathToStaticRoot : ".",
							pathToThemeRoot : "./theme"
						}
				}
			}

			if(!options.environment){
				options.environment = "local";
			}
			
			this.options = options;
			
			//Initialize the Console
			if(options.console){
				this._console = new Console({ logLevel : jQuery.sap.log.getLevel() });
			}
		}
	}),
	ViewerBaseProto = ViewerBase.prototype;
	
	ViewerBase.OVERLAY_ID = "ui5strap-overlay";
	
	/**
	 * Initialzer
	 * @Public
	 */
	ViewerBaseProto.init = function(){
		this._initLog();
		
		this._initDom();
		
		//Register Loader Layer
		Layer.register('ui5strap-loader');
  		
		this._initOverlay();
	};
	
	/*
	* Init sapplication specific logging
	* @protected
	*/
	ViewerBaseProto._initLog = function(){
		var _this = this;
		this.log = this._console ? 
		
		{
			debug : function (message, logName) {
				_this._console.debug(message, logName);
				jQuery.sap.log.debug(message);
			},

			warning : function (message, logName) {
				_this._console.warning(message, logName);
				jQuery.sap.log.warning(message);
			},

			error : function (message, logName) {
				_this._console.error(message, logName);
				jQuery.sap.log.error(message);
			},

			info : function (message, logName) {
				_this._console.info(message, logName);
				jQuery.sap.log.info(message);
			},

			fatal : function (message, logName) {
				_this._console.fatal(message, logName);
				jQuery.sap.log.fatal(message);
			}
		} :		
				
		{
			debug : function (message) {
				jQuery.sap.log.debug(message);
			},

			warning : function (message) {
				jQuery.sap.log.warning(message);
			},

			error : function (message) {
				jQuery.sap.log.error(message);
			},

			info : function (message) {
				jQuery.sap.log.info(message);
			},

			fatal : function (message) {
				jQuery.sap.log.fatal(message);
			}
		};
	};

	/**
	 * @Public
	 */
	ViewerBaseProto.start = function(callback, loadCallback){
		throw new Error("Please inherit ui5strap.ViewerBase.prototype.start in your Viewer instance.");
	};

	/*
	* ----------------------------------------------------------------------
	* --------------------- Global Overlay ---------------------------------
	* ----------------------------------------------------------------------
	*/
	
	/**
	* Inititalizes the dom cache
	* @Protected
	*/
	ViewerBaseProto._initDom = function(){
		var _this = this,
			$oRootContainer = jQuery('#' + this.options.container);
		
		if($oRootContainer.length === 0){
			throw new Error("Cannot find root container: " + this.options.container);
		}
		
		var $oViewer = $oRootContainer.find(".ui5strap-viewer");

		if($oViewer.length === 0){
			var oViewerElement = document.createElement("div");
			oViewerElement.className = "ui5strap-viewer";
			$oViewer = jQuery(oViewerElement);
			$oRootContainer.append($oViewer);
		}
		
		var $oGlobalOverlay = $oRootContainer.find("#ui5strap-overlay");
			
		if($oGlobalOverlay.length === 0){
			$oGlobalOverlay = jQuery('<div id="' + ViewerBase.OVERLAY_ID + '" class="ui5strap-overlay ui5strap-layer ui5strap-hidden">'
					+ '<div id="' + ViewerBase.OVERLAY_ID + '-backdrop" class="ui5strap-overlay-backdrop"></div>'
					+ '<div id="' + ViewerBase.OVERLAY_ID + '-content" class="ui5strap-overlay-content"></div>'
				+ '</div>');
			
			$oRootContainer.append($oGlobalOverlay);
		}
		
		var $oGlobalLoader = $oRootContainer.find("#ui5strap-loader");
		
		if($oGlobalLoader.length === 0){
			$oGlobalLoader = jQuery('<div id="ui5strap-loader" class="ui5strap-layer ui5strap-loader ui5strap-hidden"></div>');
			
			$oRootContainer.append($oGlobalLoader);
		}
		
		var $oGlobalFatalScreen = $oRootContainer.find("#ui5strap-fatal");
		
		if($oGlobalFatalScreen.length === 0){
			$oGlobalFatalScreen = jQuery('<div id="ui5strap-fatal" class="ui5strap-layer ui5strap-hidden"></div>');
			
			$oRootContainer.append($oGlobalFatalScreen);
		}
		
		this._dom = {
			"$body" : jQuery(document.body),
			"$root" : $oViewer
		};
	};
	
	/**
	* Inititalzes the overlay
	* @Protected
	*/
	ViewerBaseProto._initOverlay = function(){
		var _this = this;
		
		Layer.register(ViewerBase.OVERLAY_ID);

		this.overlayControl = new NavContainer();
		this.overlayControl.placeAt(ViewerBase.OVERLAY_ID + '-content');

		jQuery('#' + ViewerBase.OVERLAY_ID + '-backdrop').on('tap', function onTap(event){
			_this.hideOverlay();
		});
	};

	/**
	* Returns whether the overlay layer is visible
	* @Public
	*/
	ViewerBaseProto.isOverlayVisible = function(){
		return Layer.isVisible(ViewerBase.OVERLAY_ID);
	};

	/**
	* Shows the overlay layer
	* @Public
	*/
	ViewerBaseProto.showOverlay = function(viewDataOrControl, callback, transitionName){
		var _this = this,
			overlayControl = this.overlayControl,
			transitionName = transitionName || 'slide-ttb';
		
		Layer.setVisible(ViewerBase.OVERLAY_ID, true, function(){
			if(viewDataOrControl instanceof ControlBase){
				//Control is directly injected into the frame
				overlayControl.toPage(viewDataOrControl, "content", transitionName, callback);
			}
			else{ 
				//viewDataOrControl is a data object
				if("appId" in viewDataOrControl){
					var viewApp = _this.getApp(viewDataOrControl.appId);
					if(null === viewApp){
						throw new Error('Invalid app: ' + viewDataOrControl.appId);
					}
					//View from a app
					viewApp.includeStyle(function includeStyle_complete(){
						var viewConfig = viewApp.config.getViewConfig(viewDataOrControl),
							view = viewApp.createView(viewConfig),
							target = overlayControl.defaultTarget;
						
						//Set target busy
						overlayControl.setTargetBusy(target, true);
						
						//Trigger onUpdate events
						overlayControl.updateTarget(target, view, {});
						
						view.loaded().then(function(){
							overlayControl.toPage(view, 'content', transitionName, function(param){
								viewApp.isVisibleInOverlay = true;
								
								//Set target available
								overlayControl.setTargetBusy(target, false);
								
								param.oldPage && viewApp.detachPage(param.oldPage);

								viewApp.onShowInOverlay(new sap.ui.base.Event("ui5strap.app.showInOverlay", viewApp, { 
									view : view, 
									viewConfig : viewConfig
								}));
								
								callback && callback();	
							});
						});
					});
				}
				else{
					//TODO How should this work here?
					overlayControl.toPage(viewDataOrControl, 'content', transitionName, callback);
				}
			}
		});
	};

	/**
	* Hides the overlay layer
	* @Public
	*/
	ViewerBaseProto.hideOverlay = function(callback, transitionName){
		if(!this.isOverlayVisible()){
			throw new Error('Overlay is not visible!');
		}

		var _this = this,
			overlayControl = this.overlayControl,
			page = overlayControl.targets["content"],
			transitionName = transitionName || 'slide-btt';
		
		overlayControl.toPage(null, 'content', transitionName, function toPage_complete(){
			Layer.setVisible(ViewerBase.OVERLAY_ID, false, function(){
				if(page instanceof sap.ui.core.mvc.View){
					var pageViewData = page.getViewData();
					if(pageViewData.app){
						var viewApp = pageViewData.app;
						viewApp.isVisibleInOverlay = false;
						viewApp.onHideInOverlay(new sap.ui.base.Event("ui5strap.app.hideInOverlay", viewApp, {})); 
						_this.removeStyle(viewApp);
					}
				}

				callback && callback();
			});
		});	
	};
	
	/*
	* ----------------------------------------------------------------------
	* --------------------- Settings  ----------------------------------
	* ----------------------------------------------------------------------
	*/
	
	/**
	* Get the Viewer Console control reference.
	* @public
	*/
	ViewerBaseProto.getConsole = function(){
		return this._console;
	};
	
	/**
	 * Shows the Viewer Console.
	 */
	ViewerBaseProto.showConsole = function(){
		var viewerConsole = this._console;
		viewerConsole.setCurrentLog(this.getApp().getId());
		this.showOverlay(viewerConsole, function(){
				viewerConsole.flush();
		});
	}

	/**
	 * @Public
	 */
	ViewerBaseProto.setLanguage = function(language){
		//sap.ui.getCore().getConfiguration().setLanguage(language);
	};

	/*
	* ----------------------------------------------------------------------
	* --------------------- Browser Flow  ----------------------------------
	* ----------------------------------------------------------------------
	*/
	
	/**
	*	Replaces the current browser content and opens a app defined in viewer config
	* @param sappId Sapplication ID
	* TODO Remove?
	* @deprecated
	*/
	ViewerBaseProto.openSapplication = function(appUrl){
		var currentUrl = [location.protocol, '//', location.host, location.pathname].join('');
		var appUrl = currentUrl + '?sapp=' + encodeURIComponent(appUrl) + '&rand=' + Math.random();

		this.exitViewer(appUrl);
	};
	
	/**
	* Changes the browser URL to an (external) url
	* @param url The URL to browse to
	* @Public
	*/
	ViewerBaseProto.exitViewer =  function(url){
		window.location.href = url; 
	};

	/**
	* Request the client's browser to switch to full screen mode
	* @Public
	*/  
	ViewerBaseProto.requestFullscreen =  function(element){
		if(typeof element === 'undefined'){
			element = document.documentElement;
		}
		if(element.requestFullscreen) {
	    	element.requestFullscreen();
	  	} else if(element.mozRequestFullScreen) {
	    	element.mozRequestFullScreen();
	  	} else if(element.webkitRequestFullscreen) {
	    	element.webkitRequestFullscreen();
	  	} else if(element.msRequestFullscreen) {
	    	element.msRequestFullscreen();
	  	}
	};

	//End ViewerBase
	
	return ViewerBase;
});