const User = require('../models/User');

// 1. Subscription Check
const checkSubscription = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        // Search for the user in the database
        const user = await User.findOne({ username });

        if (!user) {
            // If user not found, create a new user with 'trial' subscription
            const newUser = await User.create({ username, subscriptionStatus: 'trial' });
            return res.json({ 
                status: 'success', 
                access: 'trial', 
                message: 'New user registered with trial access.' 
            });
        }

        // Send back the subscription status
        const access = user.subscriptionStatus;
        const scan_limit = access === 'premium' ? 'full' : 'limited'; // उदाहरण के लिए
        
        res.json({
            status: 'success',
            access: access, // 'trial' या 'premium'
            scan_limit: scan_limit, 
            message: `Access granted: ${access}`,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during subscription check' });
    }
};

// 2. Send Scan Results
const uploadScanResult = async (req, res) => {
    const { username, scanResult } = req.body;
    
    if (!username || !scanResult) {
        return res.status(400).json({ message: 'Username and scan result data are required' });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add the new scan result to the user's scanResults array
        const newResult = {
            scanId: `SCAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            resultData: scanResult, // JSON डेटा
        };

        user.scanResults.push(newResult);
        await user.save();

        res.json({
            status: 'success',
            message: 'Scan result uploaded successfully',
            scanId: newResult.scanId,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during result upload' });
    }
};

module.exports = { checkSubscription, uploadScanResult };