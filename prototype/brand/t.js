const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:520,height:130},deviceScaleFactor:2});
require('fs').writeFileSync('t.html','<body style="margin:0;background:#fff;display:grid;place-items:center;height:120px"><img src="logo-horizontal-black.svg" style="height:44px"></body>');
await p.goto('file://'+__dirname+'/t.html');await p.waitForTimeout(300);
await p.screenshot({path:'logo-h-check.png'});await b.close();console.log('ok')})();
