/*-------------------------------------------------------*/
/*----------------- Other Small Stuff -------------------*/

(function ($) {
    'use strict';
    /*global $*/

    // Get JsonFile
    function storeJSON(jsonFile) {
        jsonFile = JSON.parse(jsonFile);
        
        var i;
        for (i in jsonFile) {
            if (jsonFile.hasOwnProperty(i)) {
                $.takeThatDataCrazyMan(i, jsonFile[i]);
            }
        }
    }
    
//     Start
    $.getRequest('contents/contents.json', storeJSON, false);
    
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
    
    
    // Add Event Listeners
    function winEvents(title, name) {
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

}($$));