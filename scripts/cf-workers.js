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
        "Public-Key-Pins-Report-Only": [
            'max-age=86400',
            'pin-sha256="xzyQeYHLztwo8SFf9pM2d1htw5it5sGkBYuAeleLlqA="',
            'pin-sha256="lCppFqbkrlJ3EcVFAkeip0+44VaoJUymbnOaEUk7tEU="',
            'pin-sha256="K87oWBWM9UZfyddvDfoxL+8lpNyoUB2ptGtn0fv6G2Q="',
            'report-uri="https://olbat.report-uri.com/r/d/hpkp/reportOnly"',
        ].join("; "),
        "Expect-CT": [
            "max-age=86400",
            'report-uri="https://olbat.report-uri.com/r/d/ct/reportOnly"',
        ].join(", "),
        "Expect-Staple": [
            "max-age=86400",
            'report-uri="https://olbat.report-uri.com/r/d/staple/reportOnly"',
        ].join(", "),
        "X-Content-Type-Options" : "nosniff",
        // headers to be removed
        "Public-Key-Pins": null,
        "X-Powered-By": null,
        "X-AspNet-Version": null,
    },
    "text/html": {
        "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'sha256-c7TMDkQ7LWNg1RZ5AX+ABdNwtEoMRxP/crHuUqWvRj4=' https://ajax.cloudflare.com",
            "style-src 'self' 'unsafe-inline'",
            "frame-ancestors 'none'",
            "require-sri-for script style",
            "upgrade-insecure-requests",
            "report-uri https://olbat.report-uri.com/r/d/csp/enforce",
        ].join("; "),
        "Feature-Policy": [
            "geolocation 'none'",
            "midi 'none'",
            "microphone 'none'",
            "camera 'none'",
            "accelerometer 'none'",
            "magnetometer 'none'",
            "gyroscope 'none'",
            "speaker 'none'",
            "payment 'none'",
            "usb 'none'",
            "vr 'none'",
            "sync-xhr 'self'",
        ].join("; "),
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-XSS-Protection": [
            "1",
            "mode=block",
            "report=https://olbat.report-uri.com/r/d/xss/enforce",
        ].join("; "),
        "X-Frame-Options": "deny",
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
