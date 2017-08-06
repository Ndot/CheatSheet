/**
 * This is a simple SPA (Single Page Application) implementation.
 * First we have an event listener on the hash part of the URL, this is
 * what determines where we are on the page.
 * Which Object Literals determines a funcitonality that happens when
 * the hash changes.
 * For these Object Literals to work we just need to add them to our Subject by
 * calling "hashSubject.addObserver(ObjectLiteral)".
 *
 * NOTE: "hashSubject" calls the "update" method on the Object Literals, this
 * means it's mandatory for those literals to have an "update" method on them
 * that works as the entry point for the object.
 *
 * @author Ndot
 * @param   {object}   $$   - Object reference to the helper.js.
 * @param   {object}   hljs - Object reference to the vendor/highlight.pack.js.
 * @returns {function}      - Calling this function initializes the SPA module.
 */
var SPA = function ($$, hljs) {
    'use strict';
    /*global $, hljs*/

    var hashSubject = new Subject(),
        nav = document.getElementById('main-navigation'),
        id_spa = document.getElementById('spa'),
        id_link = id_spa.querySelector('#spa-links'),
        id_content = id_spa.querySelector('#spa-content'),
        id_loading = id_spa.querySelector('#loading'),
        links = {},
        content = {},
        activeClass = {},
        openLinksAbove = {},
        intoView = {},
        titleManager = {};

    /**
     * Responsible for grabing the side nav links array for
     * the correct scope and render the links in the
     * side nav panel. Or hide the side nav panel in case
     * of the home page.
     */
    links = {
        "data": "",
        "hashCheck": "",
        "render": function (elem, objArr) {
            var innerText, activeElement, ulElememt = elem.creatEl('ul');
            elem.dataset.classActive = "active-links-" + objArr.name;
            
            objArr.chapters.forEach( (function (val) {
                if (typeof val === 'object') {
                    if (val.chapters[0]) {
                        activeElement.classList.add('more-links');
                        activeElement.dataset.hidden = 'true';
                        activeElement.addEventListener('click', $$.openClose);
                    }
                    if (!val.chapters[0]) {
                        activeElement.classList.add('category-title');
                        activeElement.classList.add('color3');
                        activeElement.classList.remove('links');
                    }
                    activeElement.removeAttribute('href');
                    this.render(activeElement.parentElement, val);
                    return;
                }
                // This is nice (Regex Baby)
                innerText = val.replace(/<([^>]+)>/g, '&#60;$1&#62;');

                activeElement = ulElememt.creatEl('li')
                    .creatEl('a', {'href': '#' + objArr.name + '/' + val, 'data-id': val, 'class': 'links'});
                activeElement.innerHTML = innerText;
            }).bind(this));
        },
        "isThisHere": function (value) {
            var dataToCheck = $$.giveMeMyFilesOldFool(value);
            return dataToCheck;
        },
        "start": function (hash) {
            id_link.innerHTML = '';
            this.data = this.isThisHere(hash[0]);
            this.render(id_link, this.data);
        },
        "update": function (hash) {
            if (hash[0] !== this.hashCheck && hash[0] !== 'home') {
                id_link.parentElement.style.display = 'block';
                this.hashCheck = hash[0];
                this.start(hash);
                id_link.style.transition = 'none';
                id_link.style.opacity = '0.1';
            } else if (hash[0] === 'home') {
                id_link.parentElement.style.display = 'none';
            }
            setTimeout(function () {
                id_link.style.transition = 'all 0.4s linear';
                id_link.style.opacity = '1';
            }, 0);
        }
    };

    /**
     * Checks if data is available, if not requests
     * that content via xhr and saves it. This avoids
     * multiple requests to previous seen content.
     *
     * When data is available that data is rendered in
     * the content panel.
     */
    content = {
        "data": "",
        "hashString": "",
        "render": function (cont) {
            id_content.innerHTML = cont;
            var code = id_content.querySelector('code');
            if (code) {
                var elemArray = id_content.querySelectorAll('code');
                for(var i = 0; i < elemArray.length; i += 1) {
                    hljs.highlightBlock(elemArray[i]);
                }
            }
            id_loading.classList.remove('loading');
        },
        "cacheThis": function (key, value) {
            $$.takeThatDataCrazyMan(key, value);
        },
        // In case 'data' doesnt exist this is the callback
        "callback": function (data) {
            this.cacheThis(this.hashString, data);
            this.render(data);
        },
        "isThisHere": function (value) {
            var dataToCheck = $$.giveMeMyFilesOldFool(value);
            return dataToCheck;
        },
        "update": function (hash) {
            this.hashString = hash.join('/');
            this.data = this.isThisHere(this.hashString);
            if (this.data === undefined) {
                id_loading.classList.add('loading');
                $$.getRequest('contents/' + this.hashString + '.html', this.callback.bind(this));
            } else {
                this.render(this.data);
            }
        }
    };

    /**
     * Calls the activeClass helper function to update
     * the active class on main nav and on side nav.
     */
    activeClass = {
        "update": function (hash) {
            // Main navigation
            $$.activeClass(nav, hash[0]);
            // Side navigation
            $$.activeClass(id_link, hash[hash.length - 1]);
        }
    };

    /**
     * In case the active class links is a sub-links in the
     * side nav column open the parent element to expose
     * the active link.
     */
    openLinksAbove = {
        "openLinks": function (elem) {
            if (elem.dataset.hidden === 'true') {
                $$.openClose(elem);
            }
        },
        "recursiveUp": function (a) {
            var link = (a === null) ? null : a.parentElement.parentElement.previousElementSibling;
            if (link !== null) {
                this.openLinks(link);
                this.recursiveUp(link);
            }
        },
        "grabActiveClass": function () {
            return id_link.querySelector('.' + id_link.dataset.classActive);
        },
        "update": function () {
            if (id_link.querySelector('[data-hidden]')) {
                this.recursiveUp(this.grabActiveClass());
            }
        }
    };
    
    /**
     * Scrolls the side nav element to show the links with
     * the active class.
     */
    intoView = {
        "goThere": function (elem) {
            elem.scrollIntoView({block: "start", behavior: "smooth"});
        },
        "ifVisible": function (elem) {
            if (elem !== null) {
                var parent = id_link,
                    elemPosition = elem.offsetTop - parent.scrollTop,
                    parentHeight = parent.clientHeight - elem.clientHeight;

                if (elemPosition < 0 || elemPosition > parentHeight) {
                    this.goThere(elem);
                }
            } else {
                this.goThere(id_link.querySelector('li'));
            }
        },
        "update": function (hash) {
            this.ifVisible(id_link.querySelector('a[class*="active-links-"]'));
            id_content.scrollTop = 0;
        }
    };

    /**
     * Change title to match the current page and content.
     */
    titleManager = {
        changeTitle: function (pageTitle) {
            document.title = pageTitle + ' | CheatSheet - by Ndot';
        },
        changeTitleToHome: function () {
            document.title = 'CheatSheet - by Ndot';
        },
        update: function (hash) {
            // Clean last index of 'home' from the array.
            if (hash.indexOf('home') !== -1) { hash.splice(hash.lastIndexOf('home'), 1); }

            // Upper Case the first letter.
            hash[0] = hash[0][0].toUpperCase() + hash[0].slice(1);

            (hash[0] === 'Home' ? this.changeTitleToHome() : this.changeTitle(hash.join(' ')));
        }
    }

    /*-------------------------------------------------------*/
    /*-------------------------------- Add the new OBSERVERS */

    hashSubject.addObserver(links);
    hashSubject.addObserver(content);
    hashSubject.addObserver(activeClass);
    hashSubject.addObserver(openLinksAbove);
    hashSubject.addObserver(intoView);
    hashSubject.addObserver(titleManager);

    /*-------------------------------------------------------*/
    /*-------------------------------------------------------*/

    /**
     * Grab the location.hash and turn it into an array with
     * one element for which scope, making the necessary modifications
     * in case we are on the Home Page.
     *
     * Notify all the Observer with the created array.
     */
    function init() {
        var hashArray = decodeURIComponent(location.hash).substr(1).split('/');
        
        if (hashArray[0] === '' || hashArray[0] === 'home') {
            links.hashCheck = "";
            hashArray[0] = 'home';
        }
        hashArray[1] =  (hashArray[1] === undefined) ? 'home' : hashArray[1];
        hashSubject.notify(hashArray);
    }


    function start() {
        // Listener
        window.addEventListener('hashchange', init);

        // Initial URL check
        init();
    }

    return start;

}($$, hljs);
