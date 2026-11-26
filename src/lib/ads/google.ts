/** Google Ads — PageView via gtag config + conversion/Lead (klik WA). */

/** AW-XXX dari `AW-XXX` atau `AW-XXX/label`. */
export function getGoogleAdsAccountId(adsId: string): string {
  return adsId.split("/")[0] ?? adsId;
}

export function getGoogleAdsScriptSrc(adsId: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${getGoogleAdsAccountId(adsId)}`;
}

export function getGoogleAdsConfigScript(adsId: string): string {
  const accountId = getGoogleAdsAccountId(adsId);
  return `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('js',new Date());
gtag('config','${accountId}');
  `.trim();
}

export function trackGoogleAdsLead(adsId: string): void {
  if (typeof window.gtag !== "function") return;
  // Boleh `AW-XXX` atau `AW-XXX/label` (conversion action).
  window.gtag("event", "conversion", { send_to: adsId });
  window.gtag("event", "generate_lead");
}
