console.log("enter content_script.js");
chrome.extension.onRequest.addListener(
	function (request, sender, sendResponse) {
		if (request.command == "location") {
			sendResponse({location: window.location});
		} else if (request.command == "redirect") {
			
			var CF_toggle = function(tabLocation) {
				if (tabLocation.href.match(/\/cf(\?[^#]*)?#([^\?]*)/)) {
					return tabLocation.href.replace(/\/cf(\?[^#])?#([^\?]*)/, "$2$1");
				} else if (tabLocation.href.match(/\/cf(\?[^#]*)?#(.*)/)) {
					return tabLocation.href.replace(/\/cf\?([^#]*)?#(.*)/,"$2&$1");
				} else if (tabLocation.href.match(/^[a-z]+\:\/\/([^\/]+)([^\?]*)(\?.*)?/)) {
					return tabLocation.href.replace(/^[a-z]+\:\/\/([^\/]+)([^\?]*)(\?.*)?/,"/cf$3#$2");
				}
			};
			
			var DEBUG_toggle = function(tabLocation) {
				if(tabLocation.href.match(/\??debugClientLibs=true[^/#]?/)) {
					return tabLocation.href.replace(/\??debugClientLibs=true[^/#]?/,"");
				} else if (tabLocation.href.match(/\/cf#/)) {
					return tabLocation.href.replace(/\/cf#/,"/cf?debugClientLibs=true#");
				} else {
					return tabLocation.href.replace(/$/,"?debugClientLibs=true");
				}
				
			};

			var newHref = window.location.href;

			if (request.href == "CF_toggle") {
				newHref = CF_toggle(window.location);
			} else if (request.href == "DEBUG_toggle") {
				newHref = DEBUG_toggle(window.location);
			} else if (request.href) {
				newHref = request.href;
			} 

			if (request.targetBlank === true) {
				window.open(newHref);
			} else {
				window.location.href = newHref;
			}
		}
	}
);

