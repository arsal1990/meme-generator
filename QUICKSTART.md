# Quick Start Guide

Get your meme app running in 5 minutes!

## Prerequisites Check

Before you begin, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] An Instant DB account ([sign up here](https://instantdb.com))

## Step 1: Install Dependencies

```bash
npm install
```

**Expected time**: 1-2 minutes

## Step 2: Push Schema to Instant DB

The schema file is already created in `instant.schema.ts`. Just push it:

```bash
npx instant-cli@latest push schema
```

### First Time Setup

If prompted to login:

```bash
npx instant-cli@latest login
```

Then push the schema:

```bash
npx instant-cli@latest push schema
```

### Confirm Changes

When prompted with schema changes, type `y` and press Enter.

**Expected time**: 1 minute

> **Detailed instructions**: See `INSTANTDB_SCHEMA_SETUP.md`

## Step 3: Run the App

```bash
npm run dev
```

**Expected output**:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

You should see:
- 🎭 Meme Generator header
- Template images
- Upload/URL input options
- Text controls

## Step 5: Test the App

### Quick Test Checklist

- [ ] **Load a template image** (click any template)
- [ ] **Add text** (type in top/bottom text fields)
- [ ] **Download meme** (click "Download Meme" button)
- [ ] **Navigate to feed** (click "Feed" in navbar)
- [ ] **Log in** (click "Login" → enter email → verify code)
- [ ] **Post a meme** (create meme → "Post to Feed")
- [ ] **Upvote** (click heart icon on a meme)

## Common Issues

### Issue: Port 3000 already in use
**Solution**:
```bash
# Use a different port
npm run dev -- -p 3001
```

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org

### Issue: Schema not found errors
**Solution**: Run `npx instant-cli@latest push schema` to push the schema

### Issue: Can't receive verification email
**Solution**: 
- Check spam folder
- Use a different email
- Verify Instant DB app ID is correct

## Next Steps

1. **Read the full documentation**: `README.md`
2. **Run comprehensive tests**: `TESTING_GUIDE.md`
3. **Deploy to production**: See deployment section in README

## Need Help?

- 📖 Full documentation: `README.md`
- 🔍 Troubleshooting: `TESTING_GUIDE.md`
- 🗄️ Database setup: `INSTANTDB_SCHEMA_SETUP.md`
- 🐛 Found a bug? Open an issue on GitHub

## Success!

If you can create a meme, post it to the feed, and upvote it, you're all set! 🎉

Now go create some hilarious memes! 🎭

