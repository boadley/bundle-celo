# Bundle: The OpenRouter for Fiat

![Bundle Logo](https://github.com/boadley/bundle-celo/blob/main/media/bundle_logo_128_128.png)

**The financial super-app that connects the global crypto economy to everyday Nigerian commerce.**

---

| **Quick Links** | |
|---|---|
| 🚀 **Live App Demo** | [bundle-celo.splashycm.xyz](https://bundle-Celo.splashycm.xyz) (_Optimized for mobile_) |
| 🎬 **Watch the 3-Min Video Pitch** | [Watch on YouTube](https://youtube.com/shorts/eVUAnA1Rg9E?feature=share) |

---

## 🎬 The Demo Video (The Best Place to Start)

<a href="https://youtube.com/shorts/eVUAnA1Rg9E?feature=share"><img src="https://github.com/boadley/bundle-Celo/blob/main/media/bundle_video_thumbnail.jpg" alt="Bundle Demo Video Screenshot" width="300"></a>
<br>
**(Click the image to watch the 3-minute video)**

---

## 🎯 The Vision

For the growing class of Nigerian crypto-earners, Bundle is the financial super-app that acts as a universal router, allowing them to instantly spend their digital assets on any real-world service, from airtime to bank transfers, without ever touching a traditional off-ramp.

## 🔥 The Problem We Solve

Nigeria has one of the world's most vibrant crypto economies. Yet, using this digital value for daily life is slow, expensive, and complex. The bridge between Web3 earnings and real-world expenses is broken. Bundle fixes this.

## ✨ How It Works: The "OpenRouter" Magic

Bundle is a non-custodial web app built on Celo. Our backend acts as an intelligent routing engine:
1.  **User Pays in Crypto:** A user initiates a payment for a N10,000 bank transfer using G.
2.  **Celo Confirms:** We confirm the transaction in 2-3 seconds on the Celo network.
3.  **Router Executes in Fiat:** Our backend instantly makes a N10,000 Naira payment to the recipient from our corporate account via the Paystack API.
4.  **The Result:** The recipient gets Naira instantly. They have no idea crypto was involved. It's fast, secure, and regulator-friendly.

---

### A Note on This MVP

This MVP is a fully functional demonstration of the core 'OpenRouter for Fiat' technology. The user interface has been optimized for a mobile-first experience, which is the primary target for our consumer app.

**For the best experience, please view the live app on a mobile device or by using your browser's responsive mobile viewer.**

---

## 🏆 A Multi-Track Winning Strategy

Bundle is designed as a super-app ecosystem to address the main hackathon tracks and more:
-   **RealFi:** Flawless stablecoin off-ramping for real-world assets.
-   **DLT for Operations:** Our B2B API (vision) will automate corporate expenses.
-   **Immersive Experience:** Our roadmap includes NFT loyalty badges and DeFi savings vaults.
-   **AI & DePIN:** Our core moat is an AI-powered routing engine that ensures the cheapest, most reliable payment path.

---

## 🛠️ Tech Stack & Architecture

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS
-   **Wallet Integration:** WalletConnect
-   **Backend:** Node.js, Express
-   **Blockchain:** Celo Mainnet (using $G)
-   **Fiat Payments:** Paystack API (Sandbox)
-   **Deployment:** AWS EC2 (Frontend & Backend)

## 🚀 Getting Started

To run this project locally, please follow these steps:
1.  Clone the repository: `git clone https://github.com/boadley/bundle-celo.git`
2.  Install dependencies: `cd backend && npm install` and `cd frontend && npm install`
4.  Create and configure your `.env` files in both directories using the `.env.example` as a guide.
5.  Add your WalletConnect project ID to `frontend/.env`:
    ```
    VITE_WALLETCONNECT_PROJECT_ID=your_wallet_connect_pj_id
    ```
6.  Run the backend: `cd backend && npm start`
7.  Run the frontend: `cd frontend && npm run dev`