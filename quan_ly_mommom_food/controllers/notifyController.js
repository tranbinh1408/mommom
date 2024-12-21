const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

const notifyController = {
  callStaff: async (req, res) => {
    try {
      const { tableId } = req.body;
      
      if (!tableId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bàn'
        });
      }
      
      const message = `🔔 Khách hàng tại bàn ${tableId} cần trợ giúp!`;
      
      await bot.sendMessage(CHAT_ID, message);
      
      res.json({
        success: true,
        message: 'Đã gửi thông báo cho nhân viên'
      });
    } catch (error) {
      console.error('Notify error:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể gửi thông báo',
        error: error.message
      });
    }
  }
};

module.exports = notifyController;
