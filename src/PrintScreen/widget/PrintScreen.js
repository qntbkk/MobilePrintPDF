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

	"PrintScreen/widget/lib/jspdf",
    "dojo/dom-class",
    "dojo/_base/lang",
	"dojo/query",
	"dojo/on",
	"dojo/date/locale",
    "dojo/text!PrintScreen/widget/template/PrintScreen.html"
], function (declare, _WidgetBase, _TemplatedMixin, JsPDF, dojoClass, dojoLang, dojoQuery, on, locale, widgetTemplate) {
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

		// Internal variables. Non-primitives created in the prototype are shared between all widget instances.

		// dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
		postCreate: function () {
			logger.debug(this.id + ".postCreate");

			this.theButton.innerHTML = this.buttonText;
			on(this.theButton, "click", dojoLang.hitch(this, this.createPrintscreen));
		},

		createPrintscreen: function () {
			var widgetNode = dojoQuery("." + this.targetClass)[0],
				self = this,
				doc = new JsPDF("l", "pt", "letter"),

			/*html2canvas(widgetNode, {
				onrendered: function (canvas) {
					// document.body.appendChild(canvas);

					var strFileName2Save = self.Filename2Save(self.targetClass),
						imgDatap1 = canvas.toDataURL("image/png").slice("data:image/png;base64,".length),
						imgData = window.atob(imgDatap1),
						doc = new JsPDF("l", "pt", "letter");

					doc.addImage(imgData, "png", 0, 0, 792, 0);

					if (self.msieversion() > 8 && self.msieversion() < 11) {
						doc.save();
					} else {
						doc.output("save", strFileName2Save);
					}
				},
				height: widgetNode.scrollHeight
			});*/

			        // we support special element handlers. Register them with jQuery-style
			        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
			        // There is no support for any other type of selectors
			        // (class, of compound) at this time.
	        specialElementHandlers = {
	            // element with id of "bypass" - jQuery style selector
	            '#bypassme': function (element, renderer) {
	                // true = "handled elsewhere, bypass text extraction"
	                return true
	            }
	        },
	        margins = {
	            top: 80,
	            bottom: 60,
	            left: 40,
	            width: 792
	        };
	        // all coords and widths are in jsPDF instance's declared units
	        // 'inches' in this case
	        doc.fromHTML(
		        widgetNode, // HTML string or DOM elem ref.
		        margins.left, // x coord
		        margins.top, { // y coord
		            'width': margins.width, // max width of content on PDF
		            'elementHandlers': specialElementHandlers
		        },
	        function (dispose) {
	            // dispose: object with X, Y of the last line add to the PDF
	            //          this allow the insertion of new lines after html
	            doc.save('Test.pdf');
	        }, margins);
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
