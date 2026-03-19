# gitops-app

Source code for the GitOps platform demo. CI lives here; CD lives in [`gitops-config`](https://github.com/YOUR_USERNAME/gitops-config).

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Developer pushes                   │
│                  to main branch                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │   GitHub Actions (CI)   │
         │  lint → test → scan     │
         │  build → push to ECR    │
         │  bump tag in config repo│
         └────────────┬────────────┘
                      │  opens PR on gitops-config
                      ▼
         ┌─────────────────────────┐
         │     gitops-config repo  │
         │  envs/dev/values.yaml   │◄── ArgoCD watches
         │  envs/staging/...       │
         │  envs/prod/...          │
         └────────────┬────────────┘
                      │  reconciles
                      ▼
         ┌─────────────────────────────────────────┐
         │        Kubernetes Cluster               │
         │  ┌──────────┐ ┌─────────┐ ┌──────────┐ │
         │  │   dev    │ │staging  │ │   prod   │ │
         │  │ auto-sync│ │ manual  │ │ canary   │ │
         │  └──────────┘ └─────────┘ └──────────┘ │
         └─────────────────────────────────────────┘
```

## Stack

| Layer | Tool |
|---|---|
| Container registry | AWS ECR |
| CI | GitHub Actions |
| Container scanning | Trivy |
| CD / GitOps | ArgoCD |
| Deployment strategy | Argo Rollouts (canary) |
| Packaging | Helm |
| Cluster (local) | kind |
| Cluster (cloud) | AWS EKS |

## Local development

```bash
# Prerequisites: Docker, kind, kubectl, helm, argocd CLI

# 1. Spin up a local cluster
kind create cluster --name gitops-demo

# 2. Install ArgoCD
kubectl create namespace argocd
helm repo add argo https://argoproj.github.io/argo-helm
helm install argocd argo/argo-cd -n argocd

# 3. Install Argo Rollouts
kubectl create namespace argo-rollouts
helm install argo-rollouts argo/argo-rollouts -n argo-rollouts

# 4. Apply the ApplicationSet (from config repo)
kubectl apply -f ../gitops-config/argocd/appsets/app-appset.yaml

# 5. Port-forward the ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Visit https://localhost:8080
```

## CI pipeline overview

On every push to `main`:

1. **Lint** — golangci-lint (or eslint for Node)
2. **Test** — unit tests with coverage report
3. **Scan** — Trivy scans the built image for CVEs; fails on CRITICAL
4. **Build & push** — multi-arch image pushed to ECR with `sha-<commit>` tag
5. **Promote** — opens a PR on `gitops-config` bumping `image.tag` in `envs/dev/values.yaml`

## Required secrets (GitHub → Settings → Secrets)

| Secret | Value |
|---|---|
| `AWS_ACCOUNT_ID` | Your AWS account ID |
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_ROLE_ARN` | IAM role with ECR push permissions |
| `CONFIG_REPO_TOKEN` | GitHub PAT with `repo` scope for gitops-config |
