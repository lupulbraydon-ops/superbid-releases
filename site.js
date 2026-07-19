// Point every [data-download] button at the newest release asset and show its
// version. Static fallback (the /releases/latest redirect) already works, so
// any API failure just leaves the page as-is.
(async () => {
  try {
    const res = await fetch(
      "https://api.github.com/repos/lupulbraydon-ops/superbid-releases/releases/latest",
      { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return;
    const release = await res.json();
    const asset = (release.assets || []).find(a => a.name.endsWith(".zip"));
    if (!asset) return;
    document.querySelectorAll("[data-download]").forEach(a => {
      a.href = asset.browser_download_url;
    });
    const mb = Math.round(asset.size / 1048576);
    document.querySelectorAll("[data-version]").forEach(el => {
      el.textContent = `${release.tag_name} · ${mb} MB · Windows 10/11 (64-bit)`;
    });
  } catch {
    // offline or rate-limited — the static links still work
  }
})();
