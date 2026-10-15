SOLID TV Ghana — Staff Login update

A visible Staff Login button has been added to the header on desktop and mobile. After login it becomes Dashboard. The Staff Portal link remains in the footer.

1. Extract this complete folder.
2. Copy your existing .env.local into the project root (it is not included for security).
3. Run npm install and npm run dev.
4. Select Staff Login in the header and sign in with your Supabase administrator account.

Admin account-management and live-status endpoints in api/ require a compatible serverless host such as Vercel; the Vite development server alone does not serve those endpoints.
