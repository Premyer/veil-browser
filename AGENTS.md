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

## Veil web workspace
- Keep the web workspace independent of the Android repositories; browser UI changes must not modify their branches.
- Keep browser workspace data on the device and exclude private tabs from storage, history and exports; browsing data is not a cloud-sync product.
- Use a browser-safe model for validated imports and navigation; external sites run in sandboxed frames and reader extraction uses user-provided HTML because same-origin restrictions cannot be bypassed.
