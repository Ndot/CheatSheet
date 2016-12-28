/*-------------------------------------------------------*/
/*-------------------- Mini LIBRARY ---------------------*/

var $ = (function () {
    'use strict';
    
    var storage = {},
        linkOpenClose,
        transitionEventEnd;

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
    function getRequest(url, callback, bol) {
        var xhr = new XMLHttpRequest(),
            bol = (bol === undefined) ? true : bol;
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

    // Account for Browser Prefixes
    function whichTransitionEvent() {
        var t,
            el = document.createElement('fakeelement'),
            transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            };

        for (t in transitions) {
            if ( el.style[t] !== undefined ) {
                return transitions[t];
            }
        }
    }
    
    transitionEventEnd = whichTransitionEvent();
    
    // Open Close hidden links
    linkOpenClose = function (e) {
        var link = (e.target) ? this : e,
            tall,
            heightAuto = function () {
                // The height auto allows the element height to 
                // ajust when nested elements are opened.
                // The if condition checks if the element shoud be open
                // If the user clicks the button to fast this avoids the auto
                // propertie to be applyed to an element that shoud be closed eg; height = 0
                // Or else the element will always be open eg: height = auto
                if (this.previousElementSibling.classList.value.includes('opened-links')){
                    this.style.height = 'auto';
                }
                this.removeEventListener(transitionEventEnd, heightAuto);
            },
            heightRemove = function () {
                link.nextElementSibling.style.height = '0';
            };
        
         if (link.dataset.hidden === 'true') {
            tall = link.nextElementSibling.scrollHeight;
            link.nextElementSibling.addEventListener(transitionEventEnd, heightAuto);
            link.nextElementSibling.style.height = tall + 'px';
            link.dataset.hidden = 'false';
            link.classList.add('opened-links');
        } else {
            tall = link.nextElementSibling.scrollHeight;
            link.nextElementSibling.style.height = tall + 'px';
            link.dataset.hidden = 'true';
            link.classList.remove('opened-links');
            // Allow the function to exit and then apply height=0
            // this way it allows the CSS transition to be applyed.
            setTimeout(heightRemove, 50);
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
    
    var cssLinks = document.querySelectorAll('link[id]'),
        changeCss;
    
    changeCss = function (theme) {
        var ref = (typeof theme === 'string') ? theme : this.dataset.theme, i;
        
        for (i=0;  i < cssLinks.length; i += 1) {
            if (cssLinks[i].id === 'main') {continue;}
            if (cssLinks[i].id === ref) {
                cssLinks[i].rel = 'stylesheet';
            } else {
                cssLinks[i].rel = 'alternate';
            }
        }
        localStorage.csstheme = ref;
    };
    
    // Set Theme
    if (localStorage.csstheme) {
        changeCss(localStorage.csstheme);
    }

    
/*-------------------------------------------------------*/
/*------------------ Translate Links --------------------*/
    
    var translateLinks, stopEventPropagation, stopEventDefault;
    
    
    translateLinks = function (e) {
        e.stopPropagation();
        this.classList.toggle('rotate');
        this.parentElement.classList.toggle('translate-links');
    };
    
    stopEventPropagation = function (e) {
        e.stopPropagation();
    };

/*-------------------------------------------------------*/
/*------------------ Main Mavigation --------------------*/
    
    var hoverToFalse, hoverToTrue, ulMainNav;
    
    hoverToFalse = function (e) {
        var i,
            x = e.clientX,
            y = e.clientY,
            rect = this.getBoundingClientRect();
        
        if (x > rect.right || x < rect.left || y < rect.top || y > rect.bottom) {
            // Remove 'show-links' class to make the links hide
            ulMainNav.classList.remove('move');
            
            // Set pointerEvents on links to none
            // To make them unclickable
            var links = this.querySelectorAll('a');
            for(i = 0; i < links.length; i += 1) {
                links[i].style.pointerEvents = 'none';
            }
        }
    };
    
    hoverToTrue = function (e) {
        var links = this.querySelectorAll('a'),
            i = 0;
        
        // The setTimeout is need to avoid the browser
        // to act on the first click on the link.
        // If no setTimeout is applyed the browser will
        // set pointerEvents = 'auto' and immediately
        // click the visible link on the menu.
        setTimeout(function () {
            for (i; i < links.length; i += 1) {
                links[i].style.pointerEvents = 'auto';
            }
        }, 0);
        
        // Add 'show-links' class to make the links visible
        ulMainNav.classList.add('move');
    };
    
    
/*-------------------------------------------------------*/
/*------------ Add All the Event Listeners --------------*/
    
    // Adding Event Listeners
    function winEvents() {
        // Define variables needed
        var cssBtn = document.querySelectorAll('[id*="-css"]'),
            btnOpenLinks = document.getElementById('btn-open-links'),
            i;
        
        // Adding Events for the CHANGE THEME BUTTONS
        for (i = 0; i < cssBtn.length; i += 1) {
            cssBtn[i].addEventListener('click', changeCss);
        }
        
        
        // Adding Events for the MAIN NAVIGATION
        ulMainNav = document.querySelector('.header-nav');
        ulMainNav.addEventListener('mouseout', hoverToFalse);
        ulMainNav.addEventListener('mouseover', hoverToTrue);
        
        
        // Adding Events for the OPEN AND CLOSE SIDE LINKS BUTTON
        btnOpenLinks.addEventListener('click', translateLinks);
        // Adding Touch Events to "btnOpenLinks" to STOP PROPAGATION
        // of the touch event. This prevents the touch events on the
        // parent (class=links-wrapper) to be called when this element
        // is clicked / touched on a touch device.
        btnOpenLinks.addEventListener('touchstart', stopEventPropagation);
        btnOpenLinks.addEventListener('touchmove', stopEventPropagation);
        btnOpenLinks.addEventListener('touchend', stopEventPropagation);
    }

    window.addEventListener('load', winEvents);
}());