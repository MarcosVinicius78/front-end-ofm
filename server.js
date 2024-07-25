const express = require('express');
const { join } = require('path');
const { ngExpressEngine } = require('@nguniversal/express-engine');
const { APP_BASE_HREF } = require('@angular/common');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const { ModuleMapServerLoader } = require('@nguniversal/module-map-ngfactory-loader');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.js');

const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
const APP_SERVER_MODULE = AppServerModuleNgFactory;

// The Universal engine
app.engine('html', ngExpressEngine({
  bootstrap: APP_SERVER_MODULE,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
    { provide: APP_BASE_HREF, useValue: '/' }
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Serve static files
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// Universal route handler
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
