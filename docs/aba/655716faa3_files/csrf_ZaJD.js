(function () {
    "use strict";
    var TOKEN_NAME = "__RequestVerificationToken";

    function getToken() {
        var el = document.querySelector('input[name="' + TOKEN_NAME + '"]');
        return el ? el.value : null;
    }
    function isUnsafe(m) {
        if (!m) return false;
        m = ("" + m).toUpperCase();
        return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
    }

    // Resolve a (possibly relative) URL to an absolute one and compare full origin
    // (scheme + host + port). Fail-closed: any uncertainty => NOT same-origin, so we
    // never leak the token off-origin.
    function isSameOrigin(url) {
        try {
            // Empty/relative-without-host URLs target the current page => same-origin.
            if (url === null || typeof url === "undefined" || url === "") return true;
            var a = document.createElement("a");
            a.href = url;                 // browser resolves relative URLs against current page
            // If the resolved URL somehow has no protocol/host we can trust, bail out.
            if (!a.protocol || !a.host) return false;
            var pageProtocol = window.location.protocol;
            var pageHost = window.location.host; // host includes port when non-default
            // Some old IE leaves protocol without the trailing colon inconsistently; normalize.
            var linkProtocol = a.protocol.charAt(a.protocol.length - 1) === ":" ? a.protocol : a.protocol + ":";
            return linkProtocol === pageProtocol && a.host === pageHost;
        } catch (e) {
            return false; // fail-closed
        }
    }

    // Inject the hidden token field into a form if it is a same-origin unsafe-verb form
    // and doesn't already carry one. This guarantees the field is in the form BODY no
    // matter how the form is submitted (user click, jQuery .submit(), or native
    // HTMLFormElement.submit()) -- none of which we can rely on firing a 'submit' event.
    function ensureFormToken(form) {
        try {
            if (!form || form.tagName !== "FORM") return;
            if (!isUnsafe(form.getAttribute("method") || "GET")) return;
            // getAttribute keeps the raw action value; isSameOrigin resolves it.
            var action = form.getAttribute("action");
            if (action && !isSameOrigin(action)) return; // skip cross-origin actions
            if (form.querySelector('input[name="' + TOKEN_NAME + '"]')) return; // already has one
            var t = getToken();
            if (!t) return;
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = TOKEN_NAME;
            input.value = t;
            form.appendChild(input);
        } catch (e) { /* no-op */ }
    }

    function ensureAllForms(root) {
        var scope = root && root.querySelectorAll ? root : document;
        var forms = scope.querySelectorAll("form");
        for (var i = 0; i < forms.length; i++) {
            ensureFormToken(forms[i]);
        }
    }

    // ------------------------------------------------------------------
    // Coverage note: this file covers jQuery AJAX and HTML <form> posts.
    // Native fetch() / XMLHttpRequest calls are NOT wrapped here. The app does
    // not currently issue unsafe requests through those APIs directly; if that
    // ever changes, set the TOKEN_NAME header (with a same-origin check) on
    // those calls too -- see isSameOrigin() above for the fail-closed test.
    // ------------------------------------------------------------------

    // (1) jQuery AJAX: attach the token header to same-origin unsafe-verb requests.
    //     Use ajaxPrefilter (NOT ajaxSetup.beforeSend) because a per-call beforeSend
    //     REPLACES the ajaxSetup one and would silently drop the token. A prefilter runs
    //     for every call regardless of per-call options.
    if (window.jQuery) {
        jQuery.ajaxPrefilter(function (options, originalOptions, xhr) {
            try {
                // jQuery 1.5.1 leaves options.type = "GET" when the caller passed { method: "POST" }.
                var verb = options.type || options.method;
                if (!isUnsafe(verb)) return;
                if (!isSameOrigin(options.url)) return; // strict same-origin, fail-closed
                var t = getToken();
                if (t && xhr && xhr.setRequestHeader) {
                    xhr.setRequestHeader(TOKEN_NAME, t);
                }
            } catch (e) { /* no-op */ }
        });

        // Surface expired-token AJAX failures to the user. AntiForgeryFriendlyErrorFilter
        // answers failed-token AJAX posts with a 403 whose body is JSON:
        // { tokenExpired: true, message: "<localized text>" }.
        jQuery(document).ajaxError(function (event, xhr) {
            try {
                if (!xhr || xhr.status !== 403 || !xhr.responseText) return;
                var data = JSON.parse(xhr.responseText);
                if (data && data.tokenExpired === true && data.message) {
                    alert(data.message);
                }
            } catch (e) { /* no-op */ }
        });
    }

    // (2) Full-page form posts: inject the hidden token up front so it is present in the
    //     form body whether it is submitted by a user click, jQuery .submit(), or native
    //     form.submit() (the latter two fire NO 'submit' event).
    //   - on ready: cover all forms already in the DOM
    //   - MutationObserver: cover forms added dynamically later
    //   - submit capture listener: backstop for anything created-and-submitted in one tick
    function onReady() {
        ensureAllForms(document);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", onReady);
    } else {
        onReady();
    }

    if (window.MutationObserver) {
        var mo = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                if (!added) continue;
                for (var j = 0; j < added.length; j++) {
                    var node = added[j];
                    if (node.nodeType !== 1) continue; // element nodes only
                    if (node.tagName === "FORM") {
                        ensureFormToken(node);
                    } else if (node.querySelectorAll) {
                        ensureAllForms(node);
                    }
                }
            }
        });
        // Wait for a body to observe.
        if (document.body) {
            mo.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                mo.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    // Backstop: delegated (capture) submit handler for the rare create-then-submit-in-one-tick
    // case that a click/user submit triggers before the observer callback runs.
    document.addEventListener("submit", function (e) {
        ensureFormToken(e.target);
    }, true);
})();
