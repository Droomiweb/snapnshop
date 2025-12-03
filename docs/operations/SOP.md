# Standard Operating Procedure (SOP): Order Fulfillment

**Role:** Fulfillment Operator  
**Goal:** Ensure all orders are placed with the supplier and tracked within 24 hours.

## 1. Daily Routine (Morning & Evening)
1.  **Login to Admin Dashboard**: Go to `/admin`.
2.  **Check Pending Orders**: Look for orders with `Supplier Status: Pending`.
3.  **Validate Address**: ensure the customer address looks correct. If zip code is missing, email customer.

## 2. Placing Orders (IndiaMART)
1.  **Export CSV**: Click "Export CSV" to get a batch file.
2.  **Send to Supplier**:
    * **Method A (Email)**: Click "Email Order" on the dashboard item, or attach the CSV in an email to `sales@supplier.com`.
    * **Method B (Portal)**: Log in to supplier portal and upload CSV.
3.  **Mark as Placed**:
    * Click "Mark Placed" in the Admin Dashboard.
    * Enter the **Supplier Order ID** (from their confirmation email).
    * Add any notes (e.g., "Price increased by ₹50").

## 3. Shipping Updates
1.  **Monitor Supplier Email**: Wait for the tracking number (AWB).
2.  **Update Dashboard**:
    * Find the order (Filter by 'Placed').
    * Click "Add Tracking".
    * Select Courier (e.g., Delhivery) and enter AWB.
3.  **Done**: The customer automatically sees "Shipped" on their tracking page.

## 4. Troubleshooting
* **Out of Stock**: Email customer offering a refund or wait time.
* **Supplier No Response**: Call supplier if no status change for 48 hours.