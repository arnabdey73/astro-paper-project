---
title: "💰 A Guide to Automating Cost Savings on Azure with Python, Terraform & Azure DevOps"
author: Arnab Dey
pubDatetime: 2025-05-26T10:00:00Z
featured: true
draft: false
tags:
  - azure
  - devops
  - python
  - terraform
  - cost-optimization
  - automation
description: Learn how to build a Python-based cost optimizer for Azure that automatically identifies cost-saving opportunities using Terraform and Azure DevOps pipelines.
---

Managing cloud costs is one of the biggest concerns for modern DevOps and Cloud Engineers. Azure provides powerful tools to analyze and manage spend—but automating cost optimization at scale? That's where this project comes in.

In this post, I'll walk you through how I built a Python-based cost optimizer for Azure, powered by Terraform and Azure DevOps pipelines.

## 🚀 Project Goals

* Automate cost data extraction and analysis
* Detect idle virtual machines and unused disks
* Suggest SKU right-sizing based on CPU usage
* Spot cost anomalies using historical data
* Deliver recommendations via CI/CD pipelines

## 🧱 Tech Stack

* **Python** — for the cost analysis engine
* **Terraform** — for infrastructure provisioning (e.g., Log Analytics, Storage)
* **Azure SDKs** — for querying cost data and resources
* **Azure DevOps** — for automation pipelines

## 🗂️ Repo Structure

```plaintext
azure-cost-optimizer/
├── infra/                  # Terraform for infra setup
├── src/                   # Python logic
├── tests/                 # Pytest-based unit tests
├── azure-pipelines.yml    # CI/CD pipeline config
└── README.md
```

## 🔧 How It Works

1. **Terraform** provisions:
   * A Storage Account for cost exports
   * A Log Analytics Workspace
   * A daily cost export schedule

2. **Python scripts**:
   * Connect to Azure using a Service Principal
   * Pull cost + usage data from Cost Management API and Log Analytics
   * Analyze usage trends, detect inefficiencies
   * Output JSON recommendations

3. **Azure DevOps pipeline**:
   * Runs the analysis daily
   * Publishes results as pipeline artifacts

## 🧠 What It Detects

* **Idle VMs** — VMs with <5% CPU for 7+ days
* **Orphaned disks** — Disks unattached for >30 days
* **Anomaly Detection** — Sudden cost spikes
* **Resize Suggestions** — Based on VM SKU and CPU usage

## 📦 Output Example

```json
{
  "idleVMs": [
    {
      "name": "vm-dev-01",
      "cpu": "2%",
      "region": "westeurope"
    }
  ],
  "orphanedDisks": [],
  "anomalies": [],
  "skuRecommendations": []
}
```

## ⚙️ How to Use

1. Clone the [GitHub repo](https://github.com/your-handle/azure-cost-optimizer)
2. Create a `.env` file with Azure credentials
3. Deploy infrastructure via Terraform
4. Run `python -m src.optimizer` locally or through the pipeline

## 🤖 CI/CD in Azure DevOps

* Lint + test the code
* Deploy infra if needed
* Run the optimizer on a schedule
* Publish `recommendations.json` as an artifact

## 💡 Why I Built This

I work with Azure daily, and I kept seeing unused resources or surprise bills. Instead of reacting, I wanted proactive, daily insights—automated and actionable. This tool fills that gap.

## 🧩 What's Next

* Export findings to Power BI or dashboards
* Add email or Teams notifications
* Support cost optimization across Management Groups

## 👋 Final Thoughts

Cloud cost management doesn't have to be reactive or manual. With a bit of code and automation, you can take control—and keep your cloud spend lean and efficient.

If you're working on anything similar or want help getting started, reach out! I'd love to connect.

🔗 GitHub Repo: [azure-cost-optimizer](https://github.com/your-handle/azure-cost-optimizer)
