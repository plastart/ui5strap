/*
 * 
 * UI5Strap
 *
 * ui5strap.AppFrame
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

sap.ui.define(['./library', './AppComponent'], function(library, AppComponent){

	var AppFrame = AppComponent.extend("ui5strap.AppFrame", {
		"constructor" : function(app, options){
			AppComponent.call(this, app, options);
			
			this.initialized = false;
		}
	}),
	AppFrameProto = AppFrame.prototype;

	/*
	 * Must be explicitely called from outside
	 * @PostConstruct
	 * @Public
	 */
	AppFrameProto.init = function(){
		var _this = this;
		
		var rootControl = this._createControl();
		
		this.getRootControl = function(){
			return rootControl;
		};
		
		this.app.getRootControl = function(){
			return rootControl;
		};
		
		this.app.showInitialContent = function(callback){
			_this.showInitialContent(callback);
		};
		
		this._initHistory();
	};

	/*
	 * Creates the control that represents this AppFrame
	 * @Protected
	 */
	AppFrameProto._createControl = function(){
		jQuery.sap.log.debug("AppFrameProto._createControl");
		
		//Init default NavContainer
		var frameConfig = this.options,
			app = this.app,
			navContainerModule = frameConfig.navContainer || "ui5strap.NavContainerStandard";
		
		jQuery.sap.require(navContainerModule);
		var NavContainerConstructor = jQuery.sap.getObject(navContainerModule);
		if(!NavContainerConstructor){
			throw new Error('Invalid NavContainer: ' + navContainerModule);
		}
		
		var navContainerOptions = frameConfig.navContainerOptions || {};
		if(navContainerOptions.id){
			navContainerOptions.id = this.app.createControlId(navContainerOptions.id);
		}
		
		var rootControl = new NavContainerConstructor(navContainerOptions);
		
		if(frameConfig.events && frameConfig.events.control){
			var eKeys = Object.keys(frameConfig.events.control),
				eKeysLength = eKeys.length;
			for(var i = 0; i < eKeysLength; i++){
				var evs = frameConfig.events.control[eKeys[i]];
				
				rootControl.attachEvent(eKeys[i], { "actions" : evs }, function(oEvent, data){
					
					for(var j = 0; j < data.actions.length; j ++){
						app.runAction({
							"parameters" : data.actions[j], 
							"eventSource" : oEvent.getSource(),
							"eventParameters" : oEvent.getParameters()
						});
					}
					
					//console.log(data);
				});
			}
		}
		
		return rootControl;
	};

	/*
	* Inits History for navigation handling in browsers.
	*/
	AppFrameProto._initHistory = function(){

	};

	/**
	* Shows the initial content defined in app configuration
	* @Public
	*/
	AppFrameProto.showInitialContent = function(callback){
		jQuery.sap.log.debug("AppFrameProto.showInitialContent");

		var _this = this,
			initialViews = this.options.initialViews,
			callI = 0;

		var complete = function(){
			callI--;
			if(callI === 0){
				if(!_this.initialized){
					_this.initialized = true;
				}

				callback && callback();
			}
		}

		if(!initialViews || initialViews.length === 0){
			callI = 1;
			complete();
			return;
		}

		callI = initialViews.length;

		for(var i = 0; i < initialViews.length; i++){
			var initialViewData = jQuery.extend({}, initialViews[i]);
			if(!_this.initialized){
				initialViewData.transition = 'transition-none';
			}
			this.navigateTo(this.getRootControl(), initialViewData, complete);
		}

	};
	
	/*
	 * DEPRECATED METHODS 
	 */

	/**
	 * @deprecated
	 */
	AppFrameProto.getControl = function(){
		jQuery.sap.log.warning("AppFrameProto.getControl is deprecated. Use AppFrameProto.getRootControl instead.");
		return this.getRootControl();
	};

	/**
	* @deprecated
	*/
	AppFrameProto.getConfig = function(){
		jQuery.sap.log.warning("ui5strap.AppFrame.prototype.getConfig is deprecated and will be removed soon. Use ui5strap.AppFrame.prototype.getApp().getConfig() instead.");
		return this.app.config;
	};

	/**
	* Returns the currently shown page within the NavContainer's target
	* @Public
	* @deprecated
	*/
	AppFrameProto.getCurrentPage = function (target) {
		jQuery.sap.log.warning("AppFrameProto.getCurrentPage is deprecated!  Use INavigator.getTarget instead.");
		return this.getRootControl().getTarget(target);
	};

	/**
	* Returns whether the frame supports the specified target
	* @Public
	* @deprecated
	*/
	AppFrameProto.hasTarget = function(target) {
		jQuery.sap.log.warning("AppFrameProto.hasTarget is deprecated! Use INavigator.hasTarget instead.");
		return this.getRootControl().hasTarget(target);
	}
	
	/**
	* Returns whether a target is busy
	* @Public
	* @deprecated
	*/
	AppFrameProto.isBusy = function(target){
		jQuery.sap.log.warning("AppFrameProto.isBusy is deprecated! Use INavigator.isTargetBusy instead.");
		
		return this.getRootControl().isTargetBusy(target);
	};

	/**
	 * Shows a page defined by given data
	 * @Public
	 * @deprecated
	 */
	AppFrameProto.toPage = function (viewConfig, callback) {
		jQuery.sap.log.warning("AppFrameProto.toPage is deprecated! Use AppBaseProto.navigateTo instead!");
		return this.getApp.navigateTo(this.getRootControl(), viewConfig, callback, true);
	};

	/**
	* Get the viewConfig based on a definition object. Def object must contain "viewName" attribute!
	* @deprecated
	*/
	AppFrameProto.getViewConfig = function(viewDef){
		jQuery.sap.log.warning("AppFrameProto.getViewConfig is deprecated! Use resolveViewConfig instead!");
		var viewConfig = this.app.config.getViewConfig(viewDef);

		//TODO use default target here...
		if(!viewConfig.target){
			viewConfig.target = this.getRootControl().defaultTarget;
		}

		return viewConfig;
	};
	
	/**
	* Resolve the viewConfig based on a definition object. Def object must contain "viewName" attribute!
	* @deprecated
	*/
	AppFrameProto.resolveViewConfig = function(navControl, viewDef){
		jQuery.sap.log.warning("ui5strap.AppFrame.prototype.resolveViewConfig is deprecated. Use AppConfigProto.getViewConfig instead.");
		var viewConfig = this.app.config.getViewConfig(viewDef);

		return viewConfig;
	};

	/**
	 * @deprecated
	 */
	AppFrameProto.validatePage = function(viewDef){
		jQuery.sap.log.warning("ui5strap.AppFrame.prototype.validatePage is deprecated and will be removed soon! Use getViewConfig instead.");
		
		return this.getViewConfig(viewDef);
	};

	/**
	* @Public
	* @deprecated
	*/
	AppFrameProto.gotoPage = function (viewDef, callback) {
		jQuery.sap.log.warning("AppFrameProto.gotoPage is deprecated! Use AppBaseProto.navigateTo instead!");
		
		return this.getApp().navigateTo(this.getRootControl(), viewDef, callback);
	};
	
	/**
	* @Public
	* @deprecated
	*/
	AppFrameProto.navigateTo = function (navControl, viewConfig, callback, suppressResolve) {
		jQuery.sap.log.warning("AppFrameProto.navigateTo is deprecated! Use AppBaseProto.navigateTo instead.");
		
		return this.getApp().navigateTo(navControl, viewConfig, callback, suppressResolve);
	};

	//Return Module Constructor
	return AppFrame;
});