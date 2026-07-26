# GoKwik Shopify Web Pixels Reference

This document serves as a reference for the custom checkout events fired by GoKwik through Shopify's Customer Events (Web Pixels) API. These events are executed within the sandboxed custom pixel environment in Shopify Admin and are not directly accessible from the Next.js React application.

---

## GoKwik Custom Events

The following 9 events are dispatched by GoKwik to the Shopify Web Pixels framework:

1. **`Started_Checkout_GK`**
   - *Description*: Fired when the GoKwik custom checkout experience is initialized.
   - *Trigger Condition*: Triggered immediately when the GoKwik checkout window/modal starts loading.

2. **`Mobile_Added_GK`**
   - *Description*: Fired when the customer inputs and submits their mobile number.
   - *Trigger Condition*: Triggered upon validation and submission of the customer's phone number.

3. **`Address_Step_Reached_GK`**
   - *Description*: Fired when the checkout flow proceeds to the address selection or entry screen.
   - *Trigger Condition*: Triggered when the address page is rendered to the customer.

4. **`Address_Added_GK`**
   - *Description*: Fired when the customer successfully enters or selects their delivery address.
   - *Trigger Condition*: Triggered when the shipping address is confirmed and saved.

5. **`Payment_Step_Reached_GK`**
   - *Description*: Fired when the customer reaches the final payment option selection page.
   - *Trigger Condition*: Triggered when the payment options are displayed to the customer.

6. **`Payment_Method_Selected_GK`**
   - *Description*: Fired when the customer selects a specific payment method (e.g., UPI, COD, Cards).
   - *Trigger Condition*: Triggered upon selecting a payment option before final checkout submission.

7. **`Order_Placed_GK`**
   - *Description*: Fired when the checkout transaction completes successfully.
   - *Trigger Condition*: Triggered when the order has been successfully processed and placed in Shopify.

8. **`Coupon_Applied_Success_GK`**
   - *Description*: Fired when a coupon code is successfully applied and validated.
   - *Trigger Condition*: Triggered when GoKwik successfully matches and applies a discount code.

9. **`Coupon_Applied_Failed_GK`**
   - *Description*: Fired when an invalid coupon is entered or coupon application fails.
   - *Trigger Condition*: Triggered upon rejection of a coupon code input.

---

## Technical Note & Decision Point

> [!IMPORTANT]
> **Sandboxed Environment Constraints**:
> Because these events fire within Shopify's Web Pixels iframe sandbox, they cannot be registered or listened to inside the main Next.js client bundle (e.g. via `window.addEventListener` or normal React handlers).
>
> **Consumption Patterns**:
> To leverage these events for analytics (such as custom GA4/Gtag conversion tracking or backend webhooks), you must:
> 1. Set up a Custom Pixel under **Shopify Admin Settings → Customer events**.
> 2. Register event handlers in the Shopify Admin dashboard custom pixel using:
>    ```javascript
>    analytics.subscribe("gokwik_events", (event) => {
>      // Custom forwarding logic here (e.g., call gtag() or fetch() to custom endpoint)
>    });
>    ```
> 
> *Do not implement consumption logic in Next.js frontend code yet. This remains a pending decision point for tracking integration strategy.*
