// Point every [data-download] button at the newest release asset for its product
// and show the version. Static fallbacks in the HTML already work, so any API
// failure just leaves the page as-is.
//
// SuperJob's feed intentionally may not exist yet: while it 404s, its buttons keep
// the "join the beta" mailto they ship with, and the moment the first release is
// published they become real download links with no site edit. That is the whole
// point of data-live-label.
const FEEDS = {
  superbid: "lupulbraydon-ops/superbid-releases",
  superjob: "lupulbraydon-ops/superjob-releases",
};

Object.entries(FEEDS).forEach(async ([product, repo]) => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return;              // no releases yet, or rate-limited
    const release = await res.json();
    const asset = (release.assets || []).find(a => a.name.endsWith(".zip"));
    if (!asset) return;

    document.querySelectorAll(`[data-download="${product}"]`).forEach(a => {
      a.href = asset.browser_download_url;
      if (a.dataset.liveLabel) a.textContent = a.dataset.liveLabel;
      a.removeAttribute("data-pending");
    });
    // Version + size only. The platform used to be appended here too, but these
    // labels now sit under half-width buttons in the hero and the extra clause
    // wrapped to a second line; "Windows 10 and 11, 64-bit" is stated once in the
    // hero note instead.
    const mb = Math.round(asset.size / 1048576);
    document.querySelectorAll(`[data-version="${product}"]`).forEach(el => {
      el.textContent = `${release.tag_name} · ${mb} MB`;
    });
  } catch {
    // offline or rate-limited — the static links still work
  }
});
