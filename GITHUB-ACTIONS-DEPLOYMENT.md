# GitHub Actions CI/CD for `simple-vite-react-express`

This guide walks you through running the GitHub Actions workflow in `.github/workflows/ci-cd.yml` to build, test, and deploy the app to Azure App Service.

---

## 1. Prerequisites in Azure

1. **Azure Web App (Linux)**  
   - Runtime stack: `Node 20 LTS`.  
   - Deployment Center: leave disabled (GitHub Actions will handle deployments).

2. **Publish profile**  
   - In the Azure Portal: Web App → `Overview` → `Get publish profile`.  
   - Download the XML file and keep it handy for the GitHub secret below.

3. **Application settings**  
   - Configure any required environment variables (e.g. database URLs) under Web App → `Configuration`.

---

## 2. Repository configuration in GitHub

1. **Add repository secrets**
   - `AZURE_WEBAPP_NAME`: exact name of your Azure Web App.  
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: contents of the publish-profile XML. Copy the entire XML and paste it as the secret value.

2. *(Optional)* Add repository variables for values you want to reuse across workflows (e.g. database connection strings). Reference them with `vars.MY_VAR`.

---

## 3. What the workflow does

The workflow triggers on pushes and pull requests targeting `main` or `master`.

1. **Build & Test job**
   - Checks out the code.
   - Installs Node 20 with npm caching.
   - Runs `npm ci`, `npm run lint`, `npm run test:ci`, and `npm run build`.
   - Prunes dev dependencies from `node_modules` and zips the repository (excluding Git metadata and coverage).
   - Uploads `dist.zip` as a workflow artifact.

   > ℹ️ If the backend route tests are still failing locally, this step will fail too. Fix or skip the failing suites before expecting green runs.

2. **Deploy job** *(only on `main`)*
   - Downloads the `dist.zip` artifact.
  - Uses `azure/webapps-deploy@v3` with the publish profile to push the package to Azure.
   - Publishes the deployment URL as an environment link in the Actions run.

---

## 4. Customizing the pipeline

- **Branches**: update `on.push.branches` and `on.pull_request.branches` if you use a different default branch.
- **Test commands**: adjust or split the test scripts if you need more granularity (e.g. run `npm run test:services` separately).
- **Build artifacts**: modify the `zip` command if you need to include/exclude additional assets.  
- **Environment promotion**: add extra jobs (staging, QA) by duplicating the `deploy` job with different secrets and environment names.

---

## 5. Running the pipeline

1. Commit the workflow (`.github/workflows/ci-cd.yml`) and this guide.
2. Push to your repository.
3. Check `Actions` in GitHub to monitor the run.
4. Once the deploy job finishes, the run summary links directly to the deployed site.

If a step fails, open the job logs and address the reported issue (commonly missing secrets or test failures).

---

## 6. FAQ

**Q: Can I use a Service Principal instead of a publish profile?**  
A: Yes. Replace the `publish-profile` input with `azure-credentials` after creating an Azure AD app and storing the JSON credentials in a secret.

**Q: How do I set environment variables per environment?**  
A: Create GitHub Environments (e.g. `staging`, `production`) and add environment-specific secrets. Reference them in the workflow with `${{ secrets.MY_SECRET }}`.

**Q: Deploy step fails with permission errors.**  
A: Regenerate the publish profile, update the secret, and re-run the workflow. Make sure the Web App name matches exactly.


