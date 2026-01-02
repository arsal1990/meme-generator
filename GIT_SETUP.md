# Git Setup Instructions

## Step 1: Install Git

If Git is not installed on your system, download and install it from:
- **Windows**: https://git-scm.com/download/win
- Or use a package manager like Chocolatey: `choco install git`

After installation, restart your terminal/command prompt.

## Step 2: Initialize Git Repository

Once Git is installed, run these commands in your project directory:

```bash
# Initialize the git repository
git init

# Configure your git user (if not already configured globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Meme Generator project"

# (Optional) Add remote repository
# git remote add origin <your-repository-url>
# git push -u origin main
```

## Step 3: Verify Setup

Check that everything is set up correctly:

```bash
git status
git log
```

