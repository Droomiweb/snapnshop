# Fulfillment FAQ & Edge Cases

### Q: The supplier is out of stock. What do I do?
**A:**
1.  Check if another supplier has the item (see `suppliers.md`).
2.  If no stock, email the customer immediately:
    * *Subject:* Update regarding your order #{orderId}
    * *Body:* "We are verifying inventory for your item. It may be delayed by 3-5 days. Would you prefer to wait or receive a full refund?"
3.  Add a note in the Admin Dashboard: "Out of stock - emailed customer".

### Q: The supplier price increased.
**A:**
* **Small increase (<₹50):** Absorb the cost. Place the order.
* **Large increase:** Flag it to the Manager. Do not place the order yet.

### Q: Customer entered an invalid address/phone.
**A:**
1.  Do not ship.
2.  Call/WhatsApp the customer to verify.
3.  Update the address in your notes (currently, you cannot edit the order record directly, so put the correct address in the "Notes" field for the supplier).

### Q: Customer wants to cancel but I already placed the order.
**A:**
1.  Call the supplier immediately to cancel shipping.
2.  If not shipped, refund the customer.
3.  If shipped, tell the customer they must accept delivery and then return it.