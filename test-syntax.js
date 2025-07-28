// Test syntax of analytics routes
try {
  console.log('Testing analytics routes syntax...');
  require('./routes/analyticsRoutes.js');
  console.log('✅ Analytics routes syntax is OK');
} catch (error) {
  console.error('❌ Syntax error in analytics routes:', error.message);
  console.error(error.stack);
}

try {
  console.log('Testing app.js syntax...');
  require('./app.js');
  console.log('✅ App.js syntax is OK');
} catch (error) {
  console.error('❌ Syntax error in app.js:', error.message);
  console.error(error.stack);
}
