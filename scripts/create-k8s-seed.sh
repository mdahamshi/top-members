#!/usr/bin/env bash
set -euo pipefail

# Creates the seed-data ConfigMap from the local seed.sql file,
# then applies the seed Job.
# Run this once after the cluster is up and the schema is applied.

NAMESPACE="${1:-top-members}"

if [ ! -f ./seed.sql ]; then
  echo "Error: ./seed.sql not found"
  exit 1
fi

# Create seed-data ConfigMap from the seed.sql file
kubectl create configmap db-seed-data \
  --namespace "$NAMESPACE" \
  --from-file=seed.sql=./seed.sql \
  --dry-run=client -o yaml > ../k8s/seed-data.yaml

echo "Generated k8s/seed-data.yaml (gitignored)"

# Apply the ConfigMap and seed Job
kubectl apply -f ../k8s/seed-data.yaml --namespace "$NAMESPACE"
kubectl apply -f ../k8s/seed-job.yaml --namespace "$NAMESPACE"

echo "Seed Job created. Watch with: kubectl wait --for=condition=complete job/db-seed --namespace $NAMESPACE --timeout=30s"
