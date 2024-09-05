
### **1. API Service (`api`)**
- [x] Create endpoint to receive orders (`POST /orders`).
- [x] Validate order data (product, quantity, address, payment method).
- [x] Publish order to `orders_queue` for processing.
- [x] Return order confirmation with status `PENDING`.

### **2. Order Processor (`order-processor`)**
- [ ] Consume messages from `orders_queue`.
- [ ] Validate product availability in inventory.
- [ ] Update order status to `PROCESSING` or `FAILED` (if inventory validation fails).
- [ ] Publish the order to `payment_queue` for payment processing.

### **3. Payment Service (`payment-processor`)**
- [ ] Consume messages from `payment_queue`.
- [ ] Process payment for the order.
- [ ] Update order status to `COMPLETED` or `PAYMENT_FAILED`.
- [ ] Publish message to `order_fulfillment_queue` if payment is successful.

### **4. Notification Service (`notification-service`)**
- [ ] Consume messages from `notification_queue`.
- [ ] Send notification to the customer (e.g., order confirmed, payment received).
- [ ] Handle notification failures and retry if necessary.

### **5. Shipping Service (`shipping-processor`)**
- [ ] Consume messages from `order_fulfillment_queue`.
- [ ] Manage the shipping process for the order.
- [ ] Update order status to `SHIPPED` and notify the customer.
- [ ] Publish the order to `notification_queue` after shipping.

### **6. Refund Service (`refund-processor`)**
- [ ] Handle order returns and refunds.
- [ ] Update order status to `RETURNED` or `REFUNDED`.
- [ ] Publish refund information to `notification_queue` for customer notification.

### **7. Error Handling Service (`error-handler`)**
- [ ] Monitor `error_queue` for failed operations.
- [ ] Log and manage errors (e.g., inventory issues, payment failures).
- [ ] Attempt retries or escalate the issue if necessary.


- [ ] Handle with .envs