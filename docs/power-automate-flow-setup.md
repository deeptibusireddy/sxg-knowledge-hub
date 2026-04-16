# Power Automate Flow Setup — Power BI Data Connector

This flow lets the dashboard query Power BI datasets **without** an Azure AD app registration
or admin consent. The flow runs under your own Power BI credentials.

---

## Step 1 — Create the flow

1. Go to **https://make.powerautomate.com**
2. Click **+ Create** → **Instant cloud flow**
3. Name it: `SxG Knowledge Hub - Power BI Query`
4. Trigger: **When an HTTP request is received**
5. Click **Create**

---

## Step 2 — Configure the HTTP trigger

Click on the **"When an HTTP request is received"** trigger and paste this JSON schema:

```json
{
  "type": "object",
  "properties": {
    "queryName":  { "type": "string" },
    "datasetId":  { "type": "string" },
    "daxQuery":   { "type": "string" }
  },
  "required": ["queryName", "datasetId", "daxQuery"]
}
```

Set **Method** to `POST`.

> ⚠️ **Do not save yet** — Power Automate requires at least one action before saving.
> Continue directly to Step 3 and save everything together at the end.

---

## Step 3 — Add the Power BI action

1. Click **+ New step**
2. Search for **Power BI** → select **"Run a query against a dataset"** (or "Execute queries")
3. Configure it:
   - **Workspace**: Select your SxG workspace (or enter the ID `a20ce897-3f88-41ed-9e33-67fa2ae68e90`)
   - **Dataset**: Use dynamic content → select `datasetId` from the trigger body
   - **Query**: Use dynamic content → select `daxQuery` from the trigger body

> **Note:** The first time you use the Power BI connector it will ask you to sign in.
> Sign in with your Microsoft work account that has access to the datasets.

---

## Step 4 — Parse the response

The Power BI action returns a complex nested object. Add a **"Parse JSON"** step:

1. Click **+ New step** → search **Parse JSON**
2. **Content**: Use the output from the Power BI step (Body)
3. **Schema**: Click "Generate from sample" and paste:

```json
{
  "results": [
    {
      "tables": [
        {
          "rows": [
            { "[Date]": "Jan", "[Count]": 42 }
          ]
        }
      ]
    }
  ]
}
```

---

## Step 5 — Return the rows

1. Click **+ New step** → search **Response** (HTTP Response)
2. Configure:
   - **Status Code**: `200`
   - **Headers**: add `Content-Type` = `application/json`
   - **Body**:
     ```
     {
       "rows": @{outputs('Run_a_query_against_a_dataset')?['body']?['results']?[0]?['tables']?[0]?['rows']}
     }
     ```

---

## Step 6 — Enable CORS

The dashboard (running at `http://localhost:5173`) needs to call the flow from the browser.

In the **Response** step, add these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

> **Tip:** Power Automate flows handle OPTIONS preflight automatically — just adding the headers
> to the Response step is enough for most browsers.

---

## Step 7 — Wire it up

1. **Save** the flow (now it has trigger + actions, so it will save)
2. Go back to the **"When an HTTP request is received"** trigger — the **HTTP POST URL** is now visible
3. Copy that URL and paste it into `src/config.ts`:

```typescript
export const POWERBI_FLOW_URL = 'https://prod-XX.westus.logic.azure.com/workflows/...';
```

4. The dashboard will now use the flow for all queries — no sign-in required from users!

---

## DAX query format

Queries in `POWERBI_QUERIES` must use `EVALUATE SELECTCOLUMNS` with explicit aliases:

```dax
EVALUATE
SELECTCOLUMNS(
  'YourTableName',
  "Name",  [LOBColumn],
  "Count", [BlockedCount]
)
```

The returned rows will have keys like `[Name]` and `[Count]` — exactly matching
what the dashboard expects.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| CORS error in browser | Add `Access-Control-Allow-Origin: *` to Response step headers |
| 401 from Power BI action | Re-authenticate the Power BI connector in the flow |
| Empty rows | Check the DAX query runs correctly in Power BI Desktop first |
| Timeout (flow >30s) | Split slow queries across separate flows or optimize the DAX |
