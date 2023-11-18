import express from 'express';
import { sendTwilioNotificationWhatsapp, 
    sendTwilioNotificationSMS } from '../services/notificationService.js';

const router = express.Router();


router.post('/notification/whatsapp', sendTwilioNotificationWhatsapp);
router.post('/notification/sms', sendTwilioNotificationSMS);

export default router;