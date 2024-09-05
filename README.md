
### **1. API Service (`api`)**
- [x] Create endpoint to receive orders (`POST /orders`).
- [x] Validate order data.
- [x] Validate stock of product.
- [x] Publish order to `payment_queue` for processing.
- [x] Return order confirmation with status `PAYMENT_PENDING`.

### **2. Payment Service (`payment-processor`)**
- [x] Consume messages from `payment_queue`.
- [x] Process payment for the order.
- [x] Update order status to `CONFIRMED` or `PAYMENT_FAILED`.
- [x] Publish message to `order_fulfillment_queue` if payment is successful.

<!-- ### **3. Notification Service (`notification-service`)**
- [ ] Consume messages from `notification_queue`.
- [ ] Send notification to the customer (e.g., order confirmed, payment received).
- [ ] Handle notification failures and retry if necessary. -->

### **3. Shipping Service (`shipping-processor`)**
- [ ] Consume messages from `order_fulfillment_queue`.
- [ ] Manage the shipping process for the order.
- [ ] Update order status to `SHIPPED` and notify the customer.
- [ ] Publish the order to `notification_queue` after shipping.

<!-- ### **4. Error Handling Service (`error-handler`)**
- [ ] Monitor `error_queue` for failed operations.
- [ ] Log and manage errors (e.g., inventory issues, payment failures).
- [ ] Attempt retries or escalate the issue if necessary. -->

- [ ] Handle with .envs