/*global marked hljs*/

(function page(W, doc) {
  'use strict';
  
  var PATH_MARKED = '/memo/marked.js';
  var PATH_HIGHLIGHT = '/memo/highlight.pack.js';
  var PATH_TEMPLATE = '/memo/template.html';
  var PATH_CSS = '/memo/page.css';
  var PATH_CSS_HIGHLIGHT = '/memo/github-gist.css';
  var PATH_FACEBOOK = '//connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v2.6&appId=630140543809781';
  
  var DEFAULT = {
    title: "shallaa's memo",
    description: "냉면!!!",
    img: 'http://shallaa.github.io/memo/IMG.JPG',
    favicon: 'https://github.com/favicon.ico'
  };
  
  var TIME = Date.now();
  
  var loadText, loadScript, loadCSS, addMeta, addFavicon;
  var writeTemplate, writePage, updateCode, updateLink, updateImg, updateTag;
  var wait, init, getMD;
  
  var head, width, href;
  
  loadText = function(url, callback) {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', url + '?v=' + TIME);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };
    xhr.send();
  };
  
  loadScript = function(src, callback) {
    var script = doc.createElement('script');
    
    head.appendChild(script);
    
    if (!!callback) {
      script.onload = callback;
    }
    
    script.type = 'text/javascript';
    script.src = src;
  };
  
  loadCSS = function(href) {
    var link = doc.createElement('link');
    
    head.appendChild(link);
    
    link.rel = 'stylesheet';
    link.href = href;
  };
  
  addMeta = function(name, content) {
    var meta = doc.createElement('meta');
    
    head.appendChild(meta);
    
    meta.name = name;
    meta.content = content;
  };
  
  addFavicon = function(href) {
    var link = doc.createElement('link');
    
    head.appendChild(link);
    
    link.rel = 'shortcut icon';
    link.type = 'image/png';
    link.href = href;
  };
  
  getMD = function getMD(callback) {
    var scripts = doc.getElementsByTagName('script');
    var index = scripts.length;
    var src;
    
    while(index--) {
      src = scripts[index].src;
      
      if (!!~src.indexOf('memo/page.js')) {
        var query = src.split('?')[1];
        
        if (!!query) {
          query = query.split('=');
          
          switch (query[0]) {
            case 'id': callback(doc.getElementById(query[1]).innerHTML); break;
            case 'md': loadText(query[1], callback); break;
          }
        } else {
          query = W.location.pathname.split('/');
          query = query[query.length - 1];
          
          if (!query) {
            query = 'README.md';
          } else {
            query = query.split('.')[0] + '.md';
          }
          
          loadText(query, callback);
        }
      }
    }
  };
  
  init = function() {
    loadCSS(PATH_CSS);
    loadCSS(PATH_CSS_HIGHLIGHT);
    loadText(PATH_TEMPLATE, writeTemplate);
  };
  
  writeTemplate = function(str) {
    var content = doc.createElement('div');
    
    str = str.replace(/___HREF___/g, href);
    str = str.replace(/___WIDTH___/g, width);

    content.innerHTML = str;
    
    doc.getElementsByTagName('body')[0].appendChild(content);
    
    getMD(writePage);
    loadScript(PATH_FACEBOOK);
  };
  
  writePage = function(str) {
    doc.getElementById('content').innerHTML = marked(str);
    
    updateLink();
    updateImg();
    updateTag();
    
    loadScript(PATH_HIGHLIGHT, updateCode);
  };
  
  updateLink = function() {
    var elements = doc.getElementsByTagName('a');
    var index = elements.length;
    var archor, href;
    
    while(index--) {
      archor = elements[index];
      href = archor.getAttribute('href');
      
      if (href.substr(href.length - 3) == '.md') {
        archor.setAttribute('href', href.substr(0, href.length - 3) + '.html');
      }
    }
  };
  
  updateImg = function() {
    var elements = doc.getElementsByTagName('img');
    var index = elements.length;
    var img;
    
    while(index--) {
      img = elements[index];
      img.style.maxWidth = width;
    }
  };
  
  updateTag = function() {
    var hs = doc.getElementsByTagName('h1');
    var ps = doc.getElementsByTagName('p');
    var imgs = doc.getElementsByTagName('img');
    var index = 0, count = ps.length;
    
    var title = DEFAULT.title;
    var description = DEFAULT.description;
    var img = DEFAULT.img;
    
    if (!!hs.length) {
      title = hs[0].innerHTML;
    }
    
    if (!!imgs.length) {
      img = imgs[0].src;
    }
    
    if (!!count) {
      description = '';
    }
    
    while(index < count) {
      description += ps[index++].innerText;
      
      if (description.length > 200) break;
    }
    
    addMeta('og:url', href);
    addMeta('og:type', 'website');
    addMeta('og:title', title);
    addMeta('og:description', description);
    addMeta('og:image', img);
  };
  
  updateCode = function() {
    var pres = doc.getElementsByTagName('pre');
    var index = pres.length;
    var code;
    
    while(index--) {
      code = pres[index].getElementsByTagName('code');
      
      if (!!code.length) {
        hljs.highlightBlock(code[0]);
      }
    }
  };
  
  wait = setInterval(function() {
    switch (doc.readyState) {
      case 'complete': case 'loaded': break;
      default: return;
    }
    
    clearInterval(wait);
    
    head = doc.getElementsByTagName('head')[0];
    
    href = W.location.href;
    width = W.innerWidth;
    
    addMeta('viewport', 'width=device-width,initial-scale=1.0,user-scalable=no');
    addFavicon(DEFAULT.favicon);
    
    loadScript(PATH_MARKED, init);
  }, 1);
})(window, document);