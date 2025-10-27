# Save Segment - React Task

A simple React application that allows users to create and save segments by selecting dynamic schemas.  
The app demonstrates component-based design, React state management, conditional rendering, API integration, and handling of CORS issues.

---

## Features

- Modal popup for creating a segment
- Dynamic dropdowns for adding multiple schemas
- Blue box UI showing selected schemas
- Loader while API request is in progress
- Toast notifications for success/error messages
- Proper handling and documentation for CORS issues
- Clean and modular React structure

---

## Add environment variables

Create a file named .env in the project root (same level as package.json):
REACT_APP_CORS_PROXY=https://cors-anywhere.herokuapp.com/
REACT_APP_WEBHOOK_URL=https://webhook.site/<your-unique-id>

---

## API Integration & CORS Issue

When sending data directly to https://webhook.site, the browser blocks the request due to CORS restrictions (missing Access-Control-Allow-Origin header).

To bypass this for testing, the app uses a CORS proxy:
https://cors-anywhere.herokuapp.com/

---

## If you see “403 Forbidden” from CORS proxy:

Visit this link once in your browser and click the button:
https://cors-anywhere.herokuapp.com/corsdemo

That activates temporary access for your IP.

In production, such calls should be routed through a backend (e.g., Node.js/Express) for security and reliability.
