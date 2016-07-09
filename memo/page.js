/*global marked*/

var PATH_MARKED = '/memo/marked.js';
var PATH_TEMPLATE = '/memo/template.html';
var PATH_CSS = '/memo/page.css';

var TIME = Date.now();

var fn = function fn(scope) {
  scope(window, document);
};

fn(function polyfill(W, doc) {
  
});

fn(function main(W, doc) {
  var loadText = function(url, callback) {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', url + '?v=' + TIME);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };
    xhr.send();
  };
  
  var loadScript = function(src, callback) {
    var script = doc.createElement('script');
    
    doc.getElementsByTagName('head')[0].appendChild(script);
    
    script.onload = callback;
    script.type = 'text/javascript';
    script.src = src;
  };
  
  var loadCSS = function(href) {
    var link = doc.createElement('link');
    
    doc.getElementsByTagName('head')[0].appendChild(link);
    
    link.rel = 'stylesheet';
    link.href = href;
  };
  
  var getMD = function getMD(callback) {
    var scripts = doc.getElementsByTagName('script');
    var index = scripts.length;
    var src, str;
    
    while(index--) {
      src = scripts[index].src;
      
      if (!!~src.indexOf('memo/page.js')) {
        var query = src.split('?')[1].split('=');
        
        switch (query[0]) {
          case 'id': callback(doc.getElementById(query[1]).innerHTML); break;
          case 'md': loadText(query[1], callback); break;
          default: break;
        }
      }
    }
  };
  
  var init = function() {
    loadCSS(PATH_CSS);
    loadText(PATH_TEMPLATE, writeTemplate);
  };
  
  var writeTemplate = function(str) {
    doc.getElementsByTagName('body')[0].innerHTML = str;
    
    getMD(writePage);
  };
  
  var writePage = function(str) {
    // var page = doc.createElement('div');
    
    // page.innerHTML = marked(str);
    
    // doc.getElementsByTagName('body')[0].appendChild(page);
    
    doc.getElementById('content').innerHTML = marked(str);
    
    var archors = doc.getElementsByTagName('a');
    var index = archors.length;
    var archor, href;
    
    while(index--) {
      archor = archors[index];
      href = archor.getAttribute('href');
      
      if (href.substr(href.length - 3, 3) == '.md') {
        archor.href = href.substr(0, href.length - 3) + '.html';
      }
    }
  };
  
  var wait = setInterval(function() {
    switch (doc.readyState) {
      case 'complete': case 'loaded': break;
      default: return;
    }
    
    clearInterval(wait);
    
    loadScript(PATH_MARKED, init);
  }, 1);
});