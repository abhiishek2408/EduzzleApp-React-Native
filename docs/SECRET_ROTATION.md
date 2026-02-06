# Security: leaked .env remediation & secret rotation

Summary
-------
This repo previously contained `backend/.env` with live Razorpay credentials. The file has been removed from the repository and `backend/.env` is now listed in `backend/.gitignore`. You must rotate the exposed credentials and clean git history if the secrets were ever pushed to a remote.

Immediate actions (must do now)
--------------------------------
- Rotate/revoke the exposed Razorpay `key_id` and `key_secret` in the Razorpay dashboard.
- Update your deployment/CI secret store with the new keys (DO NOT commit these to the repo). Examples: GitHub Actions secrets, Render/Heroku config, Azure Key Vault.
- Ask all collaborators to stop using old keys until rotation completes.

Purge leaked file from git history
---------------------------------
Recommended: use `git-filter-repo` (faster and safer than filter-branch).

1. On a machine with `git-filter-repo` installed, run:

```bash
# from outside any working clone
bash scripts/purge_env_history.sh git@github.com:your-org/your-repo.git
```

2. After the script finishes, notify the team. Each collaborator should either re-clone the repository or run the cleanup steps below:

```bash
git fetch origin
git checkout main
git reset --hard origin/main
git clean -fdx
```

Alternative: BFG Repo-Cleaner
--------------------------------
If you prefer BFG, see https://rtyley.github.io/bfg-repo-cleaner/ and follow its docs. The script in `scripts/` is tailored for `git-filter-repo`.

Rotate and update deployment secrets
-----------------------------------
- Immediately rotate the Razorpay key pair.
- Replace keys in your hosting/deployment provider secrets configuration.
- If you use CI workflows, add secrets to the CI secrets UI (GitHub Secrets, GitLab CI variables, etc.).

Scan for other exposures
------------------------
Run a secrets scanner (truffleHog, git-secrets, detect-secrets) over history to ensure no other credentials are leaked.

Considerations and warnings
---------------------------
- Rewriting history is disruptive: all clones and forks will require re-cloning.
- Do not add the new secrets back into the repo at any point.
- After rotation and purge, monitor logs and payment account activity for suspicious transactions.

If you'd like, I can:
- Produce a ready-to-run command customizing your remote URL and default branch.
- Run a repo-wide secrets scan and produce a short report (requires permission to run scanners).
