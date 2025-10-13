// backend/src/routes/apiRoutes.js

const express = require("express");
const router = express.Router();
const celoService = require("../services/celoService");
const {
    resolveBankAccount,
    executeBankTransfer,
    executeAirtimePurchase,
} = require("../services/paymentProviderService");

// Bank name to code mapping for fiat payment providers (unchanged)
const BANK_CODES = {
    'GTBank': '058',
    'Zenith Bank': '057',
    'Access Bank': '044',
    'UBA': '033'
};

// Helper function to get bank code from name (for fiat transfers)
function getBankCode(bankName) {
    const code = BANK_CODES[bankName];
    if (!code) {
        throw new Error(`Invalid bank name: ${bankName}`);
    }
    return code;
}

// [REMOVED] Sponsorship endpoint removed as part of EVM migration

// POST /initiate-payment
router.post("/initiate-payment", async (req, res) => {
    const requestId = Date.now().toString();
    console.log(`[${requestId}] Payment initiation started`);

    try {
        const { paymentType, details, transactionHash, userAddress } = req.body;

        console.log(`[${requestId}] Request payload:`, {
            paymentType,
            details: { ...details, accountNumber: details.accountNumber ? '***' + details.accountNumber.slice(-4) : undefined },
            transactionHash,
            userAddress
        });

        if (!paymentType || !details || !transactionHash || !userAddress) {
            console.log(`[${requestId}] Validation failed - missing required fields`);
            return res.status(400).json({
                error: "paymentType, details, transactionHash, and userAddress are required"
            });
        }

        // Get treasury address from environment
        const treasuryAddress = process.env.TREASURY_ADDRESS;
        if (!treasuryAddress) {
            console.log(`[${requestId}] Treasury address not configured`);
            throw new Error('Treasury address not configured');
        }

        console.log(`[${requestId}] Starting transaction confirmation for hash: ${transactionHash}`);

        // Use Celo service to confirm transaction via RPC
        const txResult = await celoService.confirmTransaction(transactionHash);

        console.log(`[${requestId}] Transaction confirmation result:`, txResult);

        if (!txResult.success) {
            console.log(`[${requestId}] Transaction confirmation failed:`, txResult.error);
            return res.status(400).json({
                error: txResult.error || "Transaction confirmation failed"
            });
        }

        console.log(`[${requestId}] Transaction confirmed successfully, processing ${paymentType} payment`);

        let result;
        if (paymentType === "airtime") {
            console.log(`[${requestId}] Processing airtime purchase for ${details.phoneNumber}`);
            result = await executeAirtimePurchase(details.phoneNumber, details.amount);
        } else if (paymentType === "bank") {
            console.log(`[${requestId}] Processing bank transfer to ${details.bankName}`);
            const bankCode = getBankCode(details.bankName);
            const amountInKobo = Math.round(Number(details.amount) * 100);
            result = await executeBankTransfer(
                details.accountNumber,
                bankCode,
                amountInKobo,
                details.accountName
            );
        } else {
            console.log(`[${requestId}] Invalid payment type: ${paymentType}`);
            return res.status(400).json({
                error: "Invalid payment type. Must be 'bank' or 'airtime'"
            });
        }

        console.log(`[${requestId}] Payment processing completed successfully:`, result);
        res.json({ success: true, result });
    } catch (err) {
        console.error(`[${requestId}] Payment initiation error:`, {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        res.status(500).json({
            error: err.message || "Internal server error"
        });
    }
});

// POST /resolve-account
router.post("/resolve-account", async (req, res) => {
    try {
        const { accountNumber, bankName } = req.body;
        if (!accountNumber || !bankName) {
            return res.status(400).json({ error: "accountNumber and bankName are required" });
        }

        // Convert bank name to code if needed by your payment provider
        const bankCode = getBankCode(bankName);
        const result = await resolveBankAccount(accountNumber, bankCode);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Note: Celo transactions are signed and submitted client-side via ChipiPay
// No need for server-side transaction creation/signing endpoints

// GET /get-balance/:accountId
router.get("/get-balance/:accountId", async (req, res) => {
    try {
        const { accountId } = req.params;
        if (!accountId) {
            return res.status(400).json({ error: "accountId is required" });
        }
        const balance = await celoService.getGTokenBalance(accountId);
        res.json({ balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
