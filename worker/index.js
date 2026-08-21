const portraitRoute = "/_media/profile-82d807edf2.webp";
const portraitAsset = "/profile-82d807edf2.webp";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === portraitRoute) {
      const assetUrl = new URL(portraitAsset, request.url);
      const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
      const headers = new Headers(asset.headers);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      headers.set("Content-Type", "image/webp");
      return new Response(asset.body, {
        status: asset.status,
        statusText: asset.statusText,
        headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
