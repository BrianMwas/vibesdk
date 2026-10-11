# Custom Domains Setup (Cloudflare for SaaS)

## Domain layout

| Host | Purpose | Config |
| --- | --- | --- |
| `usespeek.app` | Speek frontend. Not served by this Worker. | none |
| `build.speek.site` | This Worker: API, dashboard, git endpoints | `CUSTOM_DOMAIN` |
| `speek.site` | Builder live previews (`/space/...`), isolated from the API origin | `CUSTOM_PREVIEW_DOMAIN` |
| `<deploymentId>.speek.site` | Published user apps, agent file links (`b-...`) | `CUSTOM_PREVIEW_DOMAIN` |
| `fallback.speek.site` | CNAME target for customer-owned domains | derived |
| `app.customer.com` | Customer-owned domain attached to an app | `CUSTOM_DOMAIN_ZONE_ID` |

User apps stay off `usespeek.app` on purpose. Untrusted app content on the
frontend domain could get the whole domain flagged by Safe Browsing and can
set cookies the frontend receives. Universal SSL only covers one level of
subdomain, so apps live at `*.speek.site`, not `*.build.speek.site`.

## One-time setup on the `speek.site` zone

1. **DNS**: create proxied records for the zone apex, the wildcard and the
   fallback origin. The Worker serves all of them, so the target is a
   placeholder (the address is never contacted):

   ```
   A  speek.site           192.0.2.1  (proxied)
   A  *.speek.site         192.0.2.1  (proxied)
   A  fallback.speek.site  192.0.2.1  (proxied)
   ```

2. **Enable Custom Hostnames**: zone, then SSL/TLS, then Custom Hostnames,
   then Enable.

3. **Set the fallback origin** to `fallback.speek.site` (dashboard, or
   `PUT /zones/{zone_id}/custom_hostnames/fallback_origin` with
   `{ "origin": "fallback.speek.site" }`). Wait until it reports `active`.

4. **Set `CUSTOM_DOMAIN_ZONE_ID`** to the `speek.site` zone id in the deploy
   environment. `scripts/deploy.ts` uploads it as a secret and, when it is
   set, adds a `*/*` Worker route on that zone. That catch-all is required:
   requests for custom hostnames keep the customer's `Host` header, so no
   `speek.site`-specific route would match them.

After deploy, the Worker routes are:

```
build.speek.site   (custom domain)
*speek.site/*      (zone speek.site)  apex previews + app subdomains
*/*                (zone speek.site)  customer custom hostnames
```

## How it works once set up

- An app owner attaches a domain (`PUT /api/apps/:id/custom-domain`). It is
  registered via `createCustomHostname`, and the response tells the owner to
  create `CNAME app.customer.com -> fallback.speek.site`.
- Once the CNAME exists, Cloudflare's HTTP validation succeeds, a certificate
  is issued, and the hostname moves to `active`.
- `worker/index.ts` resolves any host that is not `build.speek.site`,
  `speek.site` or `<deploymentId>.speek.site` against `apps.custom_domain`
  (only when `custom_domain_status = 'active'`), then dispatches to the same
  deployment.
- Status is checked live whenever the owner opens the Domain tab or calls
  `GET /api/apps/:id/custom-domain`.

## Scope limitations (v1)

- Apex domains are not supported, only subdomains (`app.example.com`).
- One domain per app, one app per domain (unique index on
  `apps.custom_domain`).
- Attaching a custom domain is additive: the app stays reachable at
  `<deploymentId>.speek.site`.
- Domains under `speek.site` cannot be attached as custom domains.
