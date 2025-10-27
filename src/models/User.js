const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    subscriptionStatus: {
        type: String,
        required: true,
        enum: ['trial', 'premium'], // केवल ये दो वैल्यूज ही अलाउड होंगी
        default: 'trial',
    },
    scanResults: [ // भविष्य के JSON रिजल्ट्स के लिए एरे
        {
            scanId: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
            resultData: mongoose.Schema.Types.Mixed, // JSON डेटा स्टोर करने के लिए
        },
    ],
}, {
    timestamps: true, // CreatedAt और UpdatedAt फ़ील्ड्स ऑटोमैटिकली जोड़ देगा
});

const User = mongoose.model('User', userSchema);

module.exports = User;