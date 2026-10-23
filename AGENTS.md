<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

// ============= Project rules =============

- The parish office dashboard (/dashboard) and the service_requests table are public by design (anon SELECT/INSERT/UPDATE policies) — no auth was requested. If the user later asks for staff login, move the dashboard under `_authenticated` and tighten the RLS policies before publishing.
