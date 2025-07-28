// server/utils/logEvent.js
const Analytics = require('../models/Analytics');

module.exports = async function logEvent(type, data = {}) {
  try {
    await Analytics.create({ type, data, ts: Date.now() });
  } catch (err) {
    console.error('❌ analytics write failed', err);
  }
};