# Instant DB Schema Configuration Guide

## Overview
Instant DB uses a **code-based schema** approach. The schema is defined in code and pushed using the CLI.

## ✅ Schema Already Defined!

The schema file `instant.schema.ts` has already been created in your project root with:
- **memes** entity (imageData, topText, bottomText, createdAt, userId, upvoteCount)
- **upvotes** entity (memeId, userId)
- Proper relationships between entities

## Push Schema to Instant DB (Required)

Run this command in your terminal to push the schema to Instant DB:

```bash
npx instant-cli@latest push schema
```

### What This Does:
1. Reads your `instant.schema.ts` file
2. Compares it with the current schema in Instant DB cloud
3. Shows you the changes to be applied
4. Prompts for confirmation
5. Updates your database schema

### First Time Setup:

If prompted to login:
```bash
npx instant-cli@latest login
```

Then push the schema:
```bash
npx instant-cli@latest push schema
```

## Expected Output

You should see something like:

```
✓ Successfully authenticated
✓ Reading schema file: instant.schema.ts
✓ Comparing with remote schema

Changes to be applied:
  + Create entity: memes
    - imageData: string
    - topText: string
    - bottomText: string
    - createdAt: number
    - userId: string
    - upvoteCount: number
  
  + Create entity: upvotes
    - memeId: string
    - userId: string
  
  + Create link: memesUpvotes

Apply these changes? (y/N)
```

Type `y` and press Enter.

## Schema Definition

The schema is defined in `instant.schema.ts`:

```typescript
memes entity:
  - imageData: string (base64 encoded image)
  - topText: string (top meme text)
  - bottomText: string (bottom meme text)
  - createdAt: number (timestamp in milliseconds)
  - userId: string (reference to auth user)
  - upvoteCount: number (default: 0)

upvotes entity:
  - memeId: string (reference to memes.id)
  - userId: string (reference to auth user)

Links:
  - memes ↔ upvotes (one-to-many relationship)
```

## Verification

After pushing the schema, verify it worked:

1. **Check the CLI output** - Should say "Successfully applied schema changes"

2. **Run your app:**
   ```bash
   npm run dev
   ```

3. **Open http://localhost:3000** in your browser

4. **Check browser console** - Should have no schema errors

5. **Test creating a meme:**
   - Load an image
   - Add text
   - Log in (if not already)
   - Click "Post to Feed"
   - Should succeed without errors

## Modifying the Schema

If you need to change the schema later:

1. **Edit `instant.schema.ts`** - Make your changes
2. **Push the changes:**
   ```bash
   npx instant-cli@latest push schema
   ```
3. **Review the diff** - CLI shows what will change
4. **Confirm** - Type `y` to apply

## Authentication

Instant DB handles authentication automatically:
- Users are stored in the built-in auth system
- Magic code authentication is enabled by default
- No schema configuration needed for users
- User IDs are automatically generated

## Troubleshooting

### CLI Issues

**Error: "instant-cli: command not found"**
```bash
# Make sure npx is working
npx --version

# Try with explicit version
npx instant-cli@latest --version
```

**Error: "Not authenticated"**
```bash
# Login first
npx instant-cli@latest login

# Then push schema
npx instant-cli@latest push schema
```

**Error: "Schema file not found"**
- Make sure you're in the project root directory
- Check that `instant.schema.ts` exists
- Run `ls -la` to see all files

### Runtime Issues

**Error: "Entity not found"**
- Schema not pushed yet - run `npx instant-cli@latest push schema`
- Verify entity name spelling (case-sensitive)
- Check browser console for specific error

**Error: "Attribute type mismatch"**
- Check that you're passing correct types
- Numbers should be numbers, not strings
- Timestamps should be in milliseconds: `Date.now()`

**Error: "Unique constraint violation"**
- User is trying to upvote the same meme twice
- This is expected behavior - working correctly!

