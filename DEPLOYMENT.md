# GitHub Pages deployment

The site is deployment-ready at the repository root:

- `index.html` is the entry point.
- `.nojekyll` disables Jekyll processing.
- All site assets use relative paths.
- The itch.io ZIP is optional and is not used by GitHub Pages.

## Publish

1. Create an empty GitHub repository.
2. Connect and push this repository:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder, then save.

GitHub will display the public site URL after deployment completes.
