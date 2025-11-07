# GitHub Actions CI for `simple-vite-react-express`

This guide walks you through running the GitHub Actions workflow in `.github/workflows/ci-cd.yml` to build, lint, and test the app. Deployment is not automated yet; you can add it later when you choose a hosting provider.

---

## 1. What the workflow does

The workflow triggers on pushes and pull requests targeting `main` or `master`.

1. **Build & Test job**
   - Checks out the code.
   - Installs Node 20 with npm caching.
   - Runs `npm ci`, `npm run lint`, `npm run test:ci`, and `npm run build`.
   - Prunes dev dependencies from `node_modules` and zips the repository (excluding Git metadata and coverage).
   - Uploads `dist.zip` as a workflow artifact (ready for manual deployment).

   > ℹ️ If the backend route tests are still failing locally, this step will fail too. Fix or skip the failing suites before expecting green runs.

2. **Deployment (manual for now)**
   - After a successful run, download `dist.zip` from the workflow artifacts.
   - Deploy it manually to your hosting provider (Azure, Render, etc.).

---

## 2. Customizing the pipeline

- **Branches**: update `on.push.branches` and `on.pull_request.branches` if you use a different default branch.
- **Test commands**: adjust or split the test scripts if you need more granularity (e.g. run `npm run test:services` separately).
- **Build artifacts**: modify the `zip` command if you need to include/exclude additional assets.  
- **Add deployment later**: when you decide on a platform, append a new job after `build_and_test` that consumes the `dist.zip` artifact and pushes it to that provider (Azure publish profile, Render API key, etc.).

---

## 3. Running the pipeline

1. Commit the workflow (`.github/workflows/ci-cd.yml`) and this guide.
2. Push to your repository.
3. Check `Actions` in GitHub to monitor the run.
4. Download `dist.zip` from the artifacts if you plan to deploy manually.

If a step fails, open the job logs and address the reported issue (commonly missing secrets or test failures).

---

## 4. FAQ

**Q: ¿Puedo automatizar el despliegue después?**  
A: Sí. Una vez que elijas el proveedor, agregá un nuevo job al workflow con la acción oficial o un script que use sus credenciales.

**Q: How do I set environment variables per environment?**  
A: Create GitHub Environments (e.g. `staging`, `production`) and add environment-specific secrets. Reference them in the workflow with `${{ secrets.MY_SECRET }}`.

**Q: ¿Dónde pongo las credenciales del hosting?**  
A: En `Settings → Secrets and variables → Actions`. Añadí las claves/Tokens que exija tu plataforma y úsalos en el nuevo job de deploy cuando lo crees.


