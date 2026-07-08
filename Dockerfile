FROM jenkins/jenkins:2.555.2
USER root
RUN apt-get update && apt-get install -y curl && \
  curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
  chmod +x kubectl && \
  mv kubectl /usr/local/bin/kubectl && \
  apt-get install -y ansible && \
  apt-get clean && rm -rf /var/lib/apt/lists/*
USER jenkins