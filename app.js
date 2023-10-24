const express = require('express');
const config = require('./config.json')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const path = require('path');

// 托管静态文件
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });
  app.use((req, res, next) => {
    const subdomain = req.subdomains[0]; // 获取子域名
    const targetUrl = config[subdomain]; // 根据子域名获取目标URL
    if (targetUrl) {
      createProxyMiddleware({ 
        target: targetUrl, 
        changeOrigin: true,
        // onProxyRes: (proxyRes, req, res) => {
        //     const end = res.end;
        //     const write = res.write;
        //     let buffer = Buffer.from('');
        
        //     res.write = (data) => {
        //       buffer = Buffer.concat([buffer, data]);
        //     };
        
        //     res.end = () => {
        //       const html = buffer.toString();
        //       const script = '<script>window.ethereum = window.parent.ethereum;</script>';
        //       const modifiedHtml = injectScript(html, script);
        //       res.setHeader('content-length', modifiedHtml.length);
        //       write.call(res, modifiedHtml);
        //       end.call(res);
        //     };
        //   },
      })(req, res, next);
    } else {
      res.status(404).send('Not found');
    }
  });

app.listen(80, () => {
  console.log('Server is running on http://0.0.0.0:80');
});
const injectScript = (html, script) => {
    const closingBodyTag = '</body>';
    if (html.lastIndexOf(closingBodyTag) === -1) {
      return html;
    }
    return html.slice(0, html.lastIndexOf(closingBodyTag)) + script + closingBodyTag;
  };