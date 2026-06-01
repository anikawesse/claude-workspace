# Meta Pixel Codes (Browser-only, ohne CAPI)

**Pixel-ID:** 1250685732578298
**Stand:** 2026-05-30 — CAPI deaktiviert, Browser-Pixel direkt, ohne Wert-Übermittlung

---

## 1. Salespage (Miniprodukt) — nur PageView

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1250685732578298');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1250685732578298&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

---

## 2. Danke-Seite — PageView + Purchase (ohne Wert, mit Reload-Schutz)

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1250685732578298');
fbq('track', 'PageView');

(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var transactionId = urlParams.get('transaction_id')
                   || urlParams.get('order_id')
                   || urlParams.get('orderid')
                   || 'fallback_' + new Date().toDateString();

  var storageKey = 'fbq_purchase_' + transactionId;

  if (!localStorage.getItem(storageKey)) {
    fbq('track', 'Purchase', {}, { eventID: transactionId });
    localStorage.setItem(storageKey, '1');
  }
})();
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1250685732578298&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```
