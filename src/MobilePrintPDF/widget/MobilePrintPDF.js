define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/Dialog",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/on",
    "dojo/_base/event",
    "dojo/text!MobilePrintPDF/widget/template/MobilePrintPDF.html"
], function (declare, _WidgetBase, _TemplatedMixin, Dialog, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoArray, lang, dojoText, on, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";
    return declare("MobilePrintPDF.widget.MobilePrintPDF", [ _WidgetBase, _TemplatedMixin], {
        // Internal variables.
        templateString: widgetTemplate,

        _handles: null,
        _contextObj: null,
        theButton: null,
        buttonText: "",
        targetClass: "",

        postCreate: function() {
            // every time the user clicks the button, increment the counter
            logger.debug(this.id + ".postCreate");
            this.theButton.innerHTML = this.buttonText;
            //this.connect(this.theButton, "onclick", lang.hitch(this, this.onClick));
            on(document.getElementById('buttonText'), "click" , lang.hitch(this, this.onClick));
        },

        onClick: function(){
            //https://www.cp.eng.chula.ac.th/books/wp-content/uploads/sites/5/2018/01/java101.pdf
            this.print('file://' + 'https://www.cp.eng.chula.ac.th/books/wp-content/uploads/sites/5/2018/01/java101.pdf')
        },

         // Print the content
        print: function (content, options) {

            var printer = null;
            
            var plugin = function() {
                return cordova.plugins.printer;
            };

            var toast = function (text) {
                var isMac = navigator.userAgent.toLowerCase().includes('macintosh');
                    text  = text !== null ? text : 'finished or canceled';
            
                setTimeout(function () {
                    if (window.Windows !== undefined) {
                        showWinDialog(text);
                    } else
                    if (!isMac && window.plugins && window.plugins.toast) {
                        window.plugins.toast.showShortBottom(String(text));
                    }
                    else {
                        alert(text);
                    }
                }, 500);
            };

            var showWinDialog = function (text) {
                if (dialog) {
                    dialog.content = text;
                    return;
                }
            
                dialog = new Windows.UI.Popups.MessageDialog(text);
            
                dialog.showAsync().done(function () {
                    dialog = null;
                });
            };

            options         = options || {};
            options.printer = printer;

            plugin().print(content, options, function (res) {
            toast(res ? 'Done' : 'Canceled');
            });
        }
    });

    
    
});
require(["MobilePrintPDF/widget/MobilePrintPDF"]);
