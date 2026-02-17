# DEV server

Tato aplikace se musi vzdy spoustet na `http://localhost:5173`.

Pokud je port `5173` obsazeny, Vite ma spadnout. Je to zamer.

Pred spustenim vyvojoveho serveru ukoncete stare Node procesy.

## Prikazy (PowerShell)

Zastaveni vsech Node serveru:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

Spusteni dev serveru:

```powershell
cd web
npm run dev
```

## Troubleshooting

- Pokud se stranka po upravach nemeni, uzivatel je pravdepodobne na spatnem portu.
- Vzdy zkontrolujte URL v prohlizeci.
