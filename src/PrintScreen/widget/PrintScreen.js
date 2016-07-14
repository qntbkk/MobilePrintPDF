/*global logger, define, require*/
/*jslint nomen:true */
/*
    PrintScreen
    ========================

    @file      : PrintScreen.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Wed, 13 Jul 2016 19:22:54 GMT
    @copyright : 
    @license   : Apache 2

    Documentation
    ========================
    Provides a "print" button that uses html2pdf to create a nice printscreen.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

	"PrintScreen/widget/lib/html2canvas",
	"PrintScreen/widget/lib/jspdf",
    "dojo/dom-class",
    "dojo/_base/lang",
	"dojo/query",
	"dojo/on",
	"dojo/date/locale",
    "dojo/text!PrintScreen/widget/template/PrintScreen.html"
], function (declare, _WidgetBase, _TemplatedMixin, html2canvas, JsPDF, dojoClass, dojoLang, dojoQuery, on, locale, widgetTemplate) {
	"use strict";

	// Declare widget's prototype.
	return declare("PrintScreen.widget.PrintScreen", [_WidgetBase, _TemplatedMixin], {
		// _TemplatedMixin will create our dom node using this HTML template.
		templateString: widgetTemplate,

		// DOM elements
		theButton: null,

		// Parameters configured in the Modeler.
		targetClass: "",
		buttonText: "",

		myHtml2canvas: null,

		// Internal variables. Non-primitives created in the prototype are shared between all widget instances.
		// -------------------------------------------------------------------
		// Constants for print table functionality
		// -------------------------------------------------------------------
		C_PRINTTABLE_X_POS_START: 80,
		C_PRINTTABLE_Y_POS_START: 100,
		C_PRINTTABLE_PIXELS_2_PDF_FACTOR: 0.9,

		// dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
		postCreate: function () {
			logger.debug(this.id + ".postCreate");

			this.theButton.innerHTML = this.buttonText;
			on(this.theButton, "click", dojoLang.hitch(this, this.createPrintscreen));
		},

		createPrintscreen: function () {
			var widgetNode = dojoQuery("." + this.targetClass)[0],
				self = this;
			html2canvas(widgetNode, {
				onrendered: function (canvas) {
					// document.body.appendChild(canvas);

					var strFileName2Save = self.Filename2Save(self.targetClass),
						imgDatap1 = canvas.toDataURL("image/png").slice("data:image/png;base64,".length),
						imgData = window.atob(imgDatap1),
						doc = new JsPDF("p", "pt", "letter");

					doc.addImage(imgData, "png", 0, 0, 612, 0);

					if (self.msieversion() > 8 && self.msieversion() < 11) {
						doc.save();
					} else {
						doc.output("save", strFileName2Save);
					}
				}
			});
		},

		msieversion: function () {
			var ua = window.navigator.userAgent,
				msie = ua.indexOf("MSIE ");

			if (msie > 0) { // If Internet Explorer, return version number
				return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
			} else { // If another browser, return 0
				return 0;
			}
		},

		Filename2Save: function (Class2Print) {
			var milsecDateNow = Date.now(),
				dateDateNow = new Date(milsecDateNow),
				options = {
					selector: "date",
					datePattern: "yyyy-MM-dd"
				},
				strDate = locale.format(dateDateNow, options),
			// strTime = formatDate(dateDateNow, "hh:mm" );

				strFileName2Save = this.fileNamePrefix + " " + strDate + ".pdf";
			return strFileName2Save;
		}
	});
});

require(["PrintScreen/widget/PrintScreen"]);