# 🛒🌾 BuyFromFarmer

**BuyFromFarmer** is an eCommerce platform that connects customers directly with farmers. It enables seamless product browsing, cart management, order placement, and real-time **inventory tracking and management**. The system also features an AI-powered chatbot for natural language queries and integrates with Cloudinary for image storage. Admins receive low-stock alerts and can notify farmers via SMS using Twilio.

---

## 🔧 Tech Stack

* **Frontend:** Angular, Bootstrap
* **Backend:** Spring Boot (Java)
* **Database:** MySQL
* **Chatbot:** Stanford CoreNLP (NER & Intent Detection)
* **Image Storage:** Cloudinary
* **Authentication:** Spring Security
* **SMS Notifications:** Twilio

---

## 🚀 Features

* ✅ Browse and search for fresh produce
* 🛒 Add items to cart and place orders
* 📦 Inventory tracking and automated stock management
* 🧾 Admin product and farmer management
* 🤖 AI-powered chatbot for natural queries
* ☁️ Cloud-based image upload and storage
* 📲 SMS notifications for restock requests

---

## 📦 Inventory Management

* **Manual Stock Control:** Admins can update stock levels for each product.
* **Scheduled Checks:** A background job runs daily to monitor inventory.
* **Low Stock Alerts:** If a product falls below a threshold, the system alerts the admin.
* **Farmer Notifications via Twilio:** Admins can send SMS messages to farmers using Twilio to request restocking of low-inventory items.

