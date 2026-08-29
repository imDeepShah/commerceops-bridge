# Deployment Readiness Gate

## Current status

The application is locally runnable and production-buildable. It is not yet submission-ready because it still needs a public deployment and a public source repository.

## Readiness checks

### 1. Build and test

- `npm test` passes.
- `npm run build` passes.
- The generated `dist` folder contains the production bundle.

### 2. Runtime independence

- No Shopify account is required.
- No API keys or secrets are required.
- Demo data is deterministic and local.
- WebMCP is progressive: the app still renders when WebMCP is unavailable.

### 3. Browser behavior

- App loads in a normal browser tab.
- Exception selection works.
- Investigation works.
- Cost audit works.
- Support packet works.
- Approval and audit behavior works.
- Reset clears temporary demo state.
- Browser console has no errors or warnings.

### 4. WebMCP behavior

- Hosted page is opened directly in a WebMCP-capable browser.
- `document.modelContext` exists.
- `getTools()` returns the registered tools.
- `executeTool()` returns structured results.
- Tool execution is visible in the app trace.

### 5. Hosting

- Deploy the Vite output to a public HTTPS URL.
- Confirm the URL works in an incognito window.
- Confirm the URL works in ChatGPT’s in-app browser or Chrome with WebMCP enabled.
- Do not require authentication for the judging demo.

### 6. Repository and submission

- Initialize or connect a public Git repository.
- Add an open-source license.
- Include setup instructions.
- Include the live URL and demo walkthrough.
- Record a public demo video under three minutes.

## Release decision

The app can move to public hosting after the test/build gate remains green and a hosting provider is selected. Shopify integration is not a readiness requirement.
