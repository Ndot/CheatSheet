var $$=function(){"use strict";function a(a,b){h[a]=b}function b(a){if(h[a])return h[a]}function c(a,b,d){var e=new XMLHttpRequest,d=void 0===d||d;e.open("GET",a,d),e.onload=function(){4===e.readyState&&200===e.status?b(e.responseText):c("404.html",b)},e.send(null)}function d(a,b){var c,d,e=a.querySelectorAll("[data-id]"),f=a.attributes["data-class-active"].value,g=e.length;for(d=0;d<g;d+=1)c=e[d].attributes["data-id"].value,c===b?e[d].classList.add(f):e[d].classList.remove(f)}function e(){var a,b=document.createElement("fakeelement"),c={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(a in c)if(void 0!==b.style[a])return c[a]}var f,g,h={};return f=e(),g=function(a){var b,c=a.target?this:a,d=function(){this.previousElementSibling.classList.value.includes("opened-links")&&(this.style.height="auto"),this.removeEventListener(f,d)},e=function(){c.nextElementSibling.style.height="0"};"true"===c.dataset.hidden?(b=c.nextElementSibling.scrollHeight,c.nextElementSibling.addEventListener(f,d),c.nextElementSibling.style.height=b+"px",c.dataset.hidden="false",c.classList.add("opened-links")):(b=c.nextElementSibling.scrollHeight,c.nextElementSibling.style.height=b+"px",c.dataset.hidden="true",c.classList.remove("opened-links"),setTimeout(e,50))},{getRequest:c,activeClass:d,giveMeMyFilesOldFool:b,takeThatDataCrazyMan:a,openClose:g}}();Object.prototype.creatEl=function(a,b){"use strict";var c,d;if(c=document.createElement(a),b)for(d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return this.appendChild(c),c},function(a){"use strict";function b(b){b=JSON.parse(b);var c;for(c in b)b.hasOwnProperty(c)&&a.takeThatDataCrazyMan(c,b[c])}function c(a,b){var c,e=document.querySelectorAll('[id*="-css"]'),k=document.getElementById("btn-open-links"),l=document.getElementById("black-pane");for(c=0;c<e.length;c+=1)e[c].addEventListener("click",d);j=document.querySelector(".header-nav"),j.addEventListener("mouseout",h),j.addEventListener("mouseover",i),k.addEventListener("click",f),k.addEventListener("touchstart",g),k.addEventListener("touchmove",g),k.addEventListener("touchend",g),l.addEventListener("click",f.bind(k))}a.getRequest("contents/contents.json",b,!1);var d,e=document.querySelectorAll("link[id]");d=function(a){var b,c="string"==typeof a?a:this.dataset.theme;for(b=0;b<e.length;b+=1)"main"!==e[b].id&&(e[b].id===c?e[b].rel="stylesheet":e[b].rel="alternate");localStorage.csstheme=c},localStorage.csstheme&&d(localStorage.csstheme);var f,g;f=function(a){a.stopPropagation(),this.classList.toggle("rotate"),this.parentElement.classList.toggle("translate-links"),this.parentElement.parentElement.querySelector(".content-wrapper > #spa-content").classList.toggle("apply-3d"),this.parentElement.parentElement.querySelector(".content-wrapper > #black-pane").classList.toggle("active")},g=function(a){a.stopPropagation()};var h,i,j;h=function(a){var b,c=a.clientX,d=a.clientY,e=this.getBoundingClientRect();if(c>e.right||c<e.left||d<e.top||d>e.bottom){j.classList.remove("move");var f=this.querySelectorAll("a");for(b=0;b<f.length;b+=1)f[b].style.pointerEvents="none"}},i=function(a){var b=this.querySelectorAll("a"),c=0;setTimeout(function(){for(c;c<b.length;c+=1)b[c].style.pointerEvents="auto"},0),j.classList.add("move")},window.addEventListener("load",c)}($$),window.onload=function(){"use strict";var a,b,c,d,e,f,g,h=document.querySelector(".links-wrapper"),i=h.parentElement.parentElement.querySelector(".content-wrapper > #spa-content"),j=h.parentElement.parentElement.querySelector(".content-wrapper > #black-pane"),k=0,l=0,m=null;h.addEventListener("touchstart",function(d){d.stopPropagation(),h.style.transition="none",i.style.transition="none",a=d.changedTouches[0].clientX,b=d.changedTouches[0].clientY,c=h.getBoundingClientRect().left,k=0,l=0,m=null,f=!h.classList.contains("translate-links"),j.classList.add("active")}),h.addEventListener("touchmove",function(f){if(f.stopPropagation(),"vertical"!==m)return"horizontal"===m?(k=f.changedTouches[0].clientX-a,d=k+c,e=i.classList.contains("apply-3d")?-(k/4)-60:-(k/4),f.preventDefault(),h.style.transform="translate("+d+"px)",void(i.style.transform="rotateY("+e+"deg)")):(k=f.changedTouches[0].clientX-a,l=f.changedTouches[0].clientY-b,k>5||k<-5?(g=!!h.classList.contains("translate-links"),void(m="horizontal")):l>5||l<-5?(h.style.transform="",void(m="vertical")):void 0)}),h.addEventListener("touchend",function(a){return a.stopPropagation(),h.style.transition="",h.style.transform="",i.style.transition="",i.style.transform="","vertical"===m||k<60&&k>-60?void(f&&j.classList.remove("active")):(h.classList.toggle("translate-links"),h.querySelector("#btn-open-links").classList.toggle("rotate"),i.classList.toggle("apply-3d"),void(g&&j.classList.remove("active")))})};var SubObj=function(){"use strict";this.observerList=[]};SubObj.prototype.add=function(a){"use strict";var b,c=this.observerList.length;for(b=0;b<c;b+=1)if(this.observerList[b]===a)return;return this.observerList.push(a)},SubObj.prototype.removeObserver=function(a){"use strict";if(void 0!==a)return this.observerList.splice(a,1)},SubObj.prototype.findMe=function(a){"use strict";var b,c=this.observerList.length;for(b=0;b<c;b+=1)if(this.observerList[b]===a)return b};var Subject=function(){"use strict";this.subObj=new SubObj};Subject.prototype.addObserver=function(a){"use strict";this.subObj.add(a)},Subject.prototype.removeObserver=function(a){"use strict";this.subObj.removeObserver(this.subObj.findMe(a))},Subject.prototype.notify=function(a){"use strict";var b,c=this.subObj.observerList.length;for(b=0;b<c;b+=1)this.subObj.observerList[b].update(a)},function(a,b){"use strict";function c(){var a=decodeURIComponent(location.hash).substr(1).split("/");""!==a[0]&&"home"!==a[0]||(j.hashCheck="",a[0]="home"),a[1]=void 0===a[1]?"home":a[1],d.notify(a)}var d=new Subject,e=document.getElementById("main-navigation"),f=document.getElementById("spa"),g=f.querySelector("#spa-links"),h=f.querySelector("#spa-content"),i=f.querySelector("#loading"),j={},k={},l={},m={},n={};j={data:"",hashCheck:"",render:function(b,c){var d,e,f=b.creatEl("ul");b.dataset.classActive="active-links-"+c.name,c.chapters.forEach(function(b){return"object"==typeof b?(e.classList.add("more-links"),e.removeAttribute("href"),e.dataset.hidden="true",e.addEventListener("click",a.openClose),void j.render(e.parentElement,b)):(d=b.replace(/<([^>]+)>/g,"&#60;$1&#62;"),e=f.creatEl("li").creatEl("a",{href:"#"+c.name+"/"+b,"data-id":b,class:"links"}),void(e.innerHTML=d))})},isThisHere:function(b){var c=a.giveMeMyFilesOldFool(b);return c},start:function(a){g.innerHTML="",this.data=this.isThisHere(a[0]),this.render(g,this.data)},update:function(a){a[0]!==this.hashCheck&&"home"!==a[0]?(g.parentElement.style.display="block",this.hashCheck=a[0],this.start(a),g.style.transition="none",g.style.opacity="0.1"):"home"===a[0]&&(g.parentElement.style.display="none"),setTimeout(function(){g.style.transition="all 0.4s linear",g.style.opacity="1"},0)}},k={data:"",hashString:"",render:function(a){h.innerHTML=a;var c=h.querySelector("code");if(c)for(var d=h.querySelectorAll("code"),e=0;e<d.length;e+=1)b.highlightBlock(d[e]);i.classList.remove("loading")},cacheThis:function(b,c){a.takeThatDataCrazyMan(b,c)},callback:function(a){this.cacheThis(this.hashString,a),this.render(a)},isThisHere:function(b){var c=a.giveMeMyFilesOldFool(b);return c},update:function(b){this.hashString=b.join("/"),this.data=this.isThisHere(this.hashString),void 0===this.data?(i.classList.add("loading"),a.getRequest("contents/"+this.hashString+".html",this.callback.bind(this))):this.render(this.data)}},l={update:function(b){a.activeClass(e,b[0]),a.activeClass(g,b[b.length-1])}},m={openLinks:function(b){"true"===b.dataset.hidden&&a.openClose(b)},recursiveUp:function(a){var b=null===a?null:a.parentElement.parentElement.previousElementSibling;null!==b&&(this.openLinks(b),this.recursiveUp(b))},grabActiveClass:function(){return g.querySelector("."+g.dataset.classActive)},update:function(){g.querySelector("[data-hidden]")&&this.recursiveUp(this.grabActiveClass())}},n={goThere:function(a){a.scrollIntoView({block:"start",behavior:"smooth"})},ifVisible:function(a){if(null!==a){var b=g,c=a.offsetTop-b.scrollTop,d=b.clientHeight-a.clientHeight;(c<0||c>d)&&this.goThere(a)}else this.goThere(g.querySelector("li"))},update:function(a){this.ifVisible(g.querySelector('a[class*="active-links-"]')),h.scrollTop=0}},d.addObserver(j),d.addObserver(k),d.addObserver(l),d.addObserver(m),d.addObserver(n),window.addEventListener("hashchange",c),c()}($$,hljs);
