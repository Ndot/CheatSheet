/**
* Mini LIBRARY
* 
* @name $$
* @return {Object}
*/
var $$ = (function () {
    'use strict';
    
    var _storage = {},
        _transitionEventEnd,
        openClose;

    /**
    * Store any type of data into an Object.
    *
    * @method takeThatDataCrazyMan
    * @param {string} key - The reference to the data we are saving.
    * @param {*} value - The data to be saved.
    */
    function store(key, value) {
        _storage[key] = value;
    }

    /**
    * If it exists returns the data stored in the
    * Object by the "takeThatDataCrazyMan" function.
    *
    * @method giveMeMyFilesOldFool
    * @param {string} key - The reference to the data we are retriving.
    * @return {*}
    */
    function send(key) {
        if (_storage[key]) {
            return _storage[key];
        }
    }

    /**
    * Simple XML Http Request.
    *
    * @method getRequest
    * @param {string} url - The URL as a string.
    * @param {getRequestCallback} callback - The callback that handles the response.
    * @param {boolean} [asynchronous=true] - TRUE for Asynchronous and FALSE for Synchronous.
    */
    function getRequest(url, callback, asynchronous) {
        var xhr = new XMLHttpRequest(),
            asynchronous = (asynchronous === undefined) ? true : asynchronous;
        xhr.open('GET', url, asynchronous);
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                getRequest('404.html', callback);
            }
        };
        xhr.send(null);
    }

    /**
    * This is the callback from the getRequest() method.
    * This callback takes the xhr.responseText as a parameter,
    * and gets called when the XMLHttpRequest onload method succeeds.
    * 
    * @callback getRequestCallback
    * @param {string} responseMessage - The xhr responseText.
    */

    /**
    * First parameter is the parent Element of the elements to apply the class,
    * this element needs to have a 'data-class-active' attribute with a value of the
    * class to apply. The refValue is going to be checked against the 'data-id' of
    * the elements, when they match that element gets the class retrived from the
    * 'data-class-active' attribute of the parent.
    *
    * @method activeClass
    * @param {Element} elem - The parent element of the elements to apply the class.
    * @param {string} refValue - Reference value to match.
    */
    function activeClass(elem, refValue) {
        var elementList = elem.querySelectorAll('[data-id]'),
            classToAdd = elem.attributes['data-class-active'].value,
            elementLength = elementList.length,
            refId,
            i;

        for (i = 0; i < elementLength; i += 1) {
            refId = elementList[i].attributes['data-id'].value;
            if (refId === refValue) {
                elementList[i].classList.add(classToAdd);
            } else {
                elementList[i].classList.remove(classToAdd);
            }
        }
    }

    /**
    * Account for Browser Prefixes
    * This function checks which transition event name to use.
    *
    * @method _whichTransitionEvent
    * @private
    * @return {string} - String with the correct transitionend event type. 
    */
    function _whichTransitionEvent() {
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
    
    _transitionEventEnd = _whichTransitionEvent();
    
    /**
    * Slide Up or Down the next Element Sibling.<br/><br/>
    * This function takes an Event or an Element. The Element to which the
    * Event referes need to have an attribute of 'data-hidden' with a value
    * of true of false.
    * When the next Element Sibling is open the element gets a class of
    * 'opened-links'. The transition duration of the Slide is controled in CSS.
    *
    * @function openClose
    * @param {Element|Event} e - The Element or an Event targeting an Element.
    */
    openClose = function (e) {
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
                this.removeEventListener(_transitionEventEnd, heightAuto);
            },
            heightRemove = function () {
                link.nextElementSibling.style.height = '0';
            };
        
         if (link.dataset.hidden === 'true') {
            tall = link.nextElementSibling.scrollHeight;
            link.nextElementSibling.addEventListener(_transitionEventEnd, heightAuto);
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
        openClose: openClose
    };
}());

/**
* Creates a new tag, appends it to the Object and
* returns the new element.
*
* @param {string} tag
* @param {object} obj
* @return {Element}
*/
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