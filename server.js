const { app } = require('./dist/apps/negocio/server/main.server.mjs');
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});