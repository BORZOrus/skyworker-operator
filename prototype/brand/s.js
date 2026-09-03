const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const html=`<body style="margin:0;background:#F4F5F7;font-family:sans-serif">
<div style="padding:20px;display:flex;flex-direction:column;gap:16px">
<div style="background:#fff;padding:20px;border:1px solid #ddd"><b>resource4</b><br><img src="resource4.svg" style="max-width:600px;max-height:120px"></div>
<div style="background:#fff;padding:20px;border:1px solid #ddd"><b>resource5</b><br><img src="resource5.svg" style="max-width:600px;max-height:120px"></div>
<div style="background:#fff;padding:20px;border:1px solid #ddd"><b>resource6</b><br><img src="resource6.svg" style="max-width:600px;max-height:120px"></div>
</div></body>`;
require('fs').writeFileSync('preview.html',html);
const p=await b.newPage({viewport:{width:700,height:560},deviceScaleFactor:2});
await p.goto('file://'+__dirname+'/preview.html');await p.waitForTimeout(400);
await p.screenshot({path:'resources-preview.png'});await b.close();console.log('ok')})();
