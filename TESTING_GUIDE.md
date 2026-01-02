# Meme App Testing Guide

This guide provides comprehensive testing instructions for the full-stack meme generator application.

## Prerequisites

Before testing, ensure:
1. Node.js and npm are installed
2. All dependencies are installed: `npm install`
3. Instant DB schema is configured (see `INSTANTDB_SCHEMA_SETUP.md`)

## Starting the Application

```bash
npm run dev
```

The app should start at `http://localhost:3000`

## Testing Checklist

### Phase 1: Initial Load & Navigation

- [ ] **Homepage loads without errors**
  - Check browser console for errors
  - Verify gradient background is visible
  - Verify navbar displays correctly

- [ ] **Navigation works**
  - Click "Feed" link → should navigate to `/feed`
  - Click "🎭 Meme Generator" → should return to homepage
  - No errors in console during navigation

### Phase 2: Authentication Testing

#### Login Flow
- [ ] **Open login modal**
  - Click "Login" button in navbar
  - Modal appears with email input

- [ ] **Send verification code**
  - Enter a valid email address
  - Click "Send Verification Code"
  - Should show "Sending..." state
  - Should receive 6-digit code via email

- [ ] **Verify code**
  - Enter the 6-digit code from email
  - Click "Verify Code"
  - Should show "Verifying..." state
  - Should successfully log in
  - Modal closes
  - Navbar shows "Logged in as [email]" and "Logout" button

#### Error Handling
- [ ] **Invalid email**
  - Enter invalid email format
  - Should show error message

- [ ] **Wrong verification code**
  - Enter incorrect code
  - Should show error message
  - Should not log in user

#### Logout
- [ ] **Logout functionality**
  - Click "Logout" button
  - User should be logged out
  - Navbar should show "Login" button again

### Phase 3: Meme Generator Testing

#### Image Loading
- [ ] **Template selection**
  - Click each template image
  - Image should load on canvas
  - Active template should have visual indicator (border)
  - Canvas should resize to fit image

- [ ] **File upload**
  - Click file input
  - Select an image from computer
  - Image should load on canvas
  - Template selection should clear

- [ ] **URL input**
  - Enter image URL in URL input field
  - Click "Load" button
  - Image should load on canvas
  - Template selection should clear

- [ ] **Image errors**
  - Enter invalid URL
  - Should show error alert
  - Canvas should not change

#### Text Overlays
- [ ] **Top text**
  - Type text in top text input
  - Text should appear on canvas
  - Text should be white with black outline
  - Text should be centered at top

- [ ] **Bottom text**
  - Type text in bottom text input
  - Text should appear on canvas
  - Text should be white with black outline
  - Text should be centered at bottom

#### Text Dragging
- [ ] **Drag top text**
  - Click and drag top text overlay (not the input)
  - Text position should update on canvas
  - Cursor should change to grabbing

- [ ] **Drag bottom text**
  - Click and drag bottom text overlay
  - Text position should update on canvas
  - Position should be constrained to canvas

#### Text Controls
- [ ] **Font size slider (top)**
  - Move top text font size slider
  - Text size should update in real-time
  - Display should show current size value

- [ ] **Font size slider (bottom)**
  - Move bottom text font size slider
  - Text size should update in real-time

- [ ] **Color picker (top)**
  - Click top text color picker
  - Select different color
  - Text color should update on canvas
  - Black outline should remain

- [ ] **Color picker (bottom)**
  - Click bottom text color picker
  - Select different color
  - Text color should update on canvas

#### Download
- [ ] **Download button disabled**
  - Before loading image, button should be disabled

- [ ] **Download meme**
  - Create a meme with image and text
  - Click "Download Meme" button
  - Should download PNG file
  - File should contain meme with text

### Phase 4: Post to Feed Testing

#### Unauthenticated User
- [ ] **Post without login**
  - Create a meme without logging in
  - Click "Post to Feed" button
  - Should show alert: "Please log in to post memes to the feed."
  - Should not post meme

#### Authenticated User
- [ ] **Post with login**
  - Log in first
  - Create a meme with image and text
  - Click "Post to Feed" button
  - Should show "Posting..." state
  - Should show success alert
  - Should redirect to feed page after 1 second
  - Meme should appear in feed

- [ ] **Post without image**
  - Log in
  - Click "Post to Feed" without loading image
  - Should show alert: "Please create a meme first."
  - Should not post

#### Large Images
- [ ] **Large image handling**
  - Try posting a very large image (>5MB)
  - Should show size warning
  - Should not post

### Phase 5: Feed Page Testing

#### Feed Display
- [ ] **Navigate to feed**
  - Click "Feed" link
  - Should load feed page
  - Should show header "📱 Meme Feed"

- [ ] **Empty state**
  - If no memes exist, should show:
    - "No memes yet!"
    - "Be the first to create and share a meme."

- [ ] **Meme display**
  - Memes should display in grid (3 columns on desktop)
  - Each meme should show:
    - Image with text overlays
    - Creation date
    - Upvote button
    - Upvote count

- [ ] **Loading state**
  - On slow connection, should show "Loading memes..." message

#### Meme Rendering
- [ ] **Image quality**
  - Base64 images should render clearly
  - Top text should be visible
  - Bottom text should be visible
  - Text should have proper styling (white with black outline)

#### Responsive Design
- [ ] **Mobile view**
  - Resize browser to mobile size
  - Grid should change to 1 column
  - Memes should remain readable

- [ ] **Tablet view**
  - Resize to tablet size
  - Grid should show 2 columns

### Phase 6: Upvote System Testing

#### Unauthenticated User
- [ ] **Upvote without login**
  - Log out if logged in
  - Try to click upvote button
  - Button should be disabled
  - Hover should show "Log in to upvote"

#### Authenticated User
- [ ] **Add upvote**
  - Log in
  - Click upvote button on a meme
  - Heart icon should change from 🤍 to ❤️
  - Button color should change to red
  - Count should increase by 1
  - Update should be immediate (optimistic update)

- [ ] **Remove upvote**
  - Click upvote button again
  - Heart should change back to 🤍
  - Button should return to gray
  - Count should decrease by 1

#### Real-time Updates
- [ ] **Multiple tabs test**
  - Open feed in two browser tabs
  - Upvote a meme in tab 1
  - Tab 2 should update to show new count (may take a few seconds)

- [ ] **Post in multiple tabs**
  - Keep two tabs open on feed
  - Post a meme from homepage
  - New meme should appear in both feed tabs

#### Concurrent Upvotes
- [ ] **Rapid clicking**
  - Rapidly click upvote button multiple times
  - Should handle gracefully (no errors)
  - Final state should be correct (upvoted or not)

### Phase 7: Error Handling

#### Network Errors
- [ ] **Offline mode**
  - Disconnect internet
  - Try to post a meme
  - Should show error message
  - Try to upvote
  - Should show error message

#### Invalid Data
- [ ] **Special characters**
  - Enter special characters in text fields: `!@#$%^&*()`
  - Should render correctly on canvas
  - Should save and display correctly in feed

- [ ] **Very long text**
  - Enter maximum length text (100 characters)
  - Should not exceed maxLength
  - Should render on canvas (may overflow)

### Phase 8: Performance Testing

#### Image Loading
- [ ] **Multiple images**
  - Load different images sequentially
  - Each should load without memory leaks
  - Canvas should update correctly

#### Feed Scrolling
- [ ] **Large feed**
  - If many memes exist, scroll through feed
  - Should scroll smoothly
  - Images should load progressively

### Phase 9: Browser Console

Throughout all testing:
- [ ] **No console errors**
  - Keep developer console open
  - Check for errors during all operations
  - Check for warnings (can be ignored if minor)

- [ ] **Network requests**
  - Check Network tab
  - Instant DB API calls should succeed
  - No failed requests (except intentional offline tests)

## Common Issues & Solutions

### Issue: Images don't load
- **Solution**: Check CORS settings, use templates instead of external URLs

### Issue: Can't log in
- **Solution**: Verify email, check spam folder for code, try again

### Issue: Memes don't appear in feed
- **Solution**: Check Instant DB schema is configured, check browser console for errors

### Issue: Upvotes don't work
- **Solution**: Ensure you're logged in, check network tab for API errors

### Issue: Canvas is blank
- **Solution**: Reload page, try different browser, clear cache

## Performance Benchmarks

Expected performance:
- **Initial load**: < 3 seconds
- **Image load**: < 1 second
- **Post meme**: < 2 seconds
- **Upvote**: < 500ms (optimistic update is immediate)
- **Feed load**: < 2 seconds (depends on number of memes)

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Success Criteria

All checkboxes above should be checked with no errors or unexpected behavior.

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Network errors (if any)
6. Screenshots (if applicable)

## Next Steps After Testing

1. Fix any discovered bugs
2. Optimize performance if needed
3. Add any missing features
4. Deploy to production (Vercel recommended)

