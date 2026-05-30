# Troubleshooting

## Common Issues

### Pods stuck in Pending or CrashLoopBackOff

```bash
# Check pod status
kubectl get pods -n top-members
kubectl describe pod <pod-name> -n top-members
kubectl logs <pod-name> -n top-members
```

### PostgreSQL not starting

Check PVC is bound:

```bash
kubectl get pvc -n top-members
```

If PVC is stuck Pending, ensure a StorageClass is available:

```bash
kubectl get storageclass
kubectl get sc
```

### kubectl authentication errors

The kubeconfig credential might be expired. Re-export from the k3s server:

```bash
cat /etc/rancher/k3s/k3s.yaml
# Re-encode and update the Jenkins credential
```

### DNS not resolving

Flush Pi-hole cache:

```bash
pihole restartdns
```

Or check with external DNS:

```bash
dig +short top-members-k3s.sarawebs.com @8.8.8.8
```

### Seed Job fails

Ensure the secret exists and DATABASE_URL is correct:

```bash
kubectl get secret top-members-secrets -n top-members -o yaml
```

### Ingress not routing

Check Traefik is running:

```bash
kubectl get pods -n kube-system | grep traefik
```

Check Ingress rules:

```bash
kubectl describe ingress -n top-members
```
