/*
 * This script is used on Cloudflare Workers to customize HTTP headers in the
 * responses sent from Cloudflare CDN
 * (see https://www.cloudflare.com/products/cloudflare-workers/)
 */
let overrideHeaders = false;
let headers = {
    "__all__": {
        "Server": "cloudflare",
        "Strict-Transport-Security": [
            "max-age=31536000",
            "includeSubDomains",
            "preload",
        ].join("; "),
        "Expect-CT": [
            "max-age=86400",
            'report-uri="https://olbat.report-uri.com/r/d/ct/reportOnly"',
        ].join(", "),
        "Expect-Staple": [
            "max-age=86400",
            'report-uri="https://olbat.report-uri.com/r/d/staple/reportOnly"',
        ].join(", "),
        "Report-To": '{"group":"default","max_age":31536000,"endpoints":[{"url":"https://olbat.report-uri.com/a/d/g"}],"include_subdomains":true}',
        "NEL": '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
        "X-Content-Type-Options" : "nosniff",
        // headers to be removed
        "Public-Key-Pins": null,
        "X-Powered-By": null,
    },
    "text/html": {
        "Content-Security-Policy": [
            "base-uri 'self'",
            "default-src 'self'",
            "connect-src 'self'",
            "script-src 'self' 'report-sample' 'unsafe-inline' 'sha256-c7TMDkQ7LWNg1RZ5AX+ABdNwtEoMRxP/crHuUqWvRj4='",
            "style-src 'self' 'report-sample'",
            "img-src 'self'",
            "object-src 'self'",
            "font-src 'self'",
            "manifest-src 'self'",
            "media-src 'self'",
            "prefetch-src 'self'",
            "worker-src 'none'",
            "child-src 'self'",
            "frame-src 'self'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "upgrade-insecure-requests",
            "report-uri https://olbat.report-uri.com/r/d/csp/enforce",
        ].join("; "),
        "Permissions-Policy": [
            "geolocation=()",
            "midi=()",
            "microphone=()",
            "camera=()",
            "accelerometer=()",
            "magnetometer=()",
            "gyroscope=()",
            "payment=()",
            "usb=()",
            "sync-xhr=(self)",
        ].join(", "),
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Frame-Options": "deny",
        "X-XSS-Protection": "0",
    },
}

function setHeaders(baseHdrs, newHdrs, override=true) {
    Object.keys(newHdrs).map(function(name, index) {
        if ((name in newHdrs) && (newHdrs[name] === null)) {
            baseHdrs.delete(name);
        } else if (override || !baseHdrs.has(name)) {
            baseHdrs.set(name, newHdrs[name]);
        }
    });
}

async function setupHeaders(req) {
  let response = await fetch(req);

  let respHdrs = new Headers(response.headers);

  if ("__all__" in headers)
    setHeaders(respHdrs, headers["__all__"], overrideHeaders);

  if (respHdrs.has("Content-Type")) {
    let mediaType = respHdrs.get("Content-Type").split(";", 2)[0].trim();
    if (mediaType in headers)
      setHeaders(respHdrs, headers[mediaType], overrideHeaders);
  }

  return new Response(response.body , {
      status: response.status,
      statusText: response.statusText,
      headers: respHdrs,
  });
}

addEventListener('fetch', event => {
    event.respondWith(setupHeaders(event.request))
});
