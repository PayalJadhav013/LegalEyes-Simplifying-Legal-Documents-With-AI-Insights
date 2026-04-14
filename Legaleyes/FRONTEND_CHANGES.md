# Frontend Changes Required

## 1. Update vite.config.ts — add proxy

Replace the server section:

```ts
server: {
  host: "::",
  port: 8080,        // change frontend port to 5173 to avoid clash with Spring Boot
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // Spring Boot
      changeOrigin: true,
    }
  }
}
```

## 2. Replace AuthContext.tsx — use our JWT backend

Replace the entire file with the version below.

## 3. Replace Login.tsx and Signup.tsx — remove Supabase calls

Replace supabase.auth calls with fetch('/api/auth/login') and fetch('/api/auth/register').

## 4. Update AIAnalyser.tsx — add real file upload + chat

Connect the upload button and send button to /api/documents/upload and /api/chat.

## 5. vite.config.ts port

Change port from 8080 to 5173 (since Spring Boot now uses 8080).
