/*-------------------------------------------------------*/
/*-------------------- Mini LIBRARY ---------------------*/

var $ = (function () {
    'use strict';
    
    var storage = {},
        linkOpenClose;

    // Store file
    function store(key, value) {
        storage[key] = value;
    }

    // Send file
    function send(file) {
        if (storage[file]) {
            return storage[file];
        }
    }
    
    // Get request
    function getRequest(url, callback, bol=true) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, bol);
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                getRequest('404.html', callback);
            }
        };
        xhr.send(null);
    }

    // Active Class
    function activeClass(el, string) {
        var elementList = el.querySelectorAll('[data-id]'),
            classToAdd = el.attributes['data-class-active'].value,
            elementLength = elementList.length,
            refId,
            i;

        for (i = 0; i < elementLength; i += 1) {
            refId = elementList[i].attributes['data-id'].value;
            if (refId === string) {
                elementList[i].classList.add(classToAdd);
            } else {
                elementList[i].classList.remove(classToAdd);
            }
        }
    }
    
    // Open Close hidden links
    linkOpenClose = function (e) {
        var link = (e.target) ? this : e;
           
        if (link.dataset.hidden === 'true') {
            link.nextSibling.style.display = 'block';
            link.dataset.hidden = 'false';
            link.classList.add('opened-links');
        } else {
            link.nextSibling.style.display = 'none';
            link.dataset.hidden = 'true';
            link.classList.remove('opened-links');
        }
    };
   
    // Exposed methods
    return {
        getRequest: getRequest,
        activeClass: activeClass,
        giveMeMyFilesOldFool: send,
        takeThatDataCrazyMan: store,
        linkOpenClose: linkOpenClose
    };
}());

// Add creatEl to Object
Object.prototype.creatEl = function (tag, obj) {
    'use strict';
    var el, val;
    el = document.createElement(tag);
    if (obj) {
        for (val in obj) {
            if (obj.hasOwnProperty(val)) {
                el.setAttribute(val, obj[val]);
            }
        }
    }
    this.appendChild(el);
    return el;
};

/*-------------------------------------------------------*/
/*----------------- Other Small Stuff -------------------*/

(function () {
    'use strict';
    /*global $*/

    // Get JsonFile
    function navReady(jsonFile) {
        jsonFile = JSON.parse(jsonFile);
        
        var i;
        for (i in jsonFile) {
            if (jsonFile.hasOwnProperty(i)) {
                $.takeThatDataCrazyMan(i, jsonFile[i]);
            }
        }
    }
    
    // Start
    $.getRequest('contents/contents.json', navReady, false);
    
/*-------------------------------------------------------*/
/*----------------------- Theme -------------------------*/
    
    var cssLinkDark = document.querySelector('link[id=dark]'),
        changeCss;
    
    changeCss = function (theme) {
        var ref = (typeof theme === 'string') ? theme : this.dataset.theme,
            value = (ref === 'light') ? "alternate" : 'stylesheet';
        
        cssLinkDark.rel = value;
        localStorage.csstheme = ref;
    };
    
    // Set Theme
    if (localStorage.csstheme) {
        changeCss(localStorage.csstheme);
    }

    // Event Listener
    function winEvents() {
        document.getElementById('light-css').addEventListener('click', changeCss);
        document.getElementById('dark-css').addEventListener('click', changeCss);
    }

    window.addEventListener('load', winEvents);
}());