/*-------------------------------------------------------*/
/*----- SUBJECT - Properties and Methods (HELPERS) ------*/

var SubObj = function () {
    'use strict';
    this.observerList = [];
};

SubObj.prototype.add = function (obj) {
    'use strict';
    var i, Olength = this.observerList.length;
    for (i = 0; i < Olength; i += 1) {
        if (this.observerList[i] === obj) { return; }
    }
    return this.observerList.push(obj);
};

SubObj.prototype.removeObserver = function (index) {
    'use strict';
    if (index !== undefined) {
        return this.observerList.splice(index, 1);
    }
};

SubObj.prototype.findMe = function (obj) {
    'use strict';
    var i, Olength = this.observerList.length;
    for (i = 0; i < Olength; i += 1) {
        if (this.observerList[i] === obj) {
            return i;
        }
    }
};

/*-------------------------------------------------------*/
/*----------------------- SUBJECT -----------------------*/

var Subject = function () {
    'use strict';
    this.subObj = new SubObj();
};

Subject.prototype.addObserver = function (observer) {
    'use strict';
    this.subObj.add(observer);
};

Subject.prototype.removeObserver = function (observer) {
    'use strict';
    this.subObj.removeObserver(this.subObj.findMe(observer));
};

Subject.prototype.notify = function (context) {
    'use strict';
    var i, Olength = this.subObj.observerList.length;
    for (i = 0; i < Olength; i += 1) {
        this.subObj.observerList[i].update(context);
    }
};

/*-------------------------------------------------------*/
/*------------------------- SPA -------------------------*/

(function ($, hljs) {
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
        intoView = {};

/*-------------------------------------------------------*/
/*------------------------ Links ------------------------*/

    links = {
        "data": "",
        "hashCheck": "",
        "render": function (elem, objArr) {
            var innerText, activeElement, ulElememt = elem.creatEl('ul');
            
            objArr.chapters.forEach(function (val) {
                if (typeof val === 'object') {
                    activeElement.classList.add('more-links');
                    activeElement.removeAttribute('href');
                    activeElement.dataset.hidden = 'true';
                    activeElement.addEventListener('click', $.linkOpenClose);
                    links.render(activeElement.parentElement, val);
                    return;
                }
                // This is nice (Regex Baby)
                innerText = val.replace(/<([^>]+)>/g, '&#60;$1&#62;');

                activeElement = ulElememt.creatEl('li')
                    .creatEl('a', {'href': '#' + objArr.name + '/' + val, 'data-id': val, 'class': 'links'});
                activeElement.innerHTML = innerText;
            });
        },
        "isThisHere": function (value) {
            var dataToCheck = $.giveMeMyFilesOldFool(value);
            return dataToCheck;
        },
        "start": function (hash) {
            id_link.innerHTML = '';
            this.data = this.isThisHere(hash[0]);
            this.render(id_link, this.data);
        },
        "update": function (hash) {
            if (hash[0] !== this.hashCheck && hash[0] !== 'home') {
                id_link.style.display = 'block';
                this.hashCheck = hash[0];
                this.start(hash);
            } else if (hash[0] === 'home') {
                id_link.style.display = 'none';
            }
        }
    };

/*-------------------------------------------------------*/
/*----------------------- Content -----------------------*/

    content = {
        "data": "",
        "hashString": "",
        "render": function (cont) {
            id_content.innerHTML = cont;
            var code = id_content.querySelector('code');
            if (code) {
                hljs.highlightBlock(id_content.querySelector('code'));
            }
            id_loading.classList.remove('loading');
        },
        "cacheThis": function (key, value) {
            $.takeThatDataCrazyMan(key, value);
        },
        // In case 'data' doesnt exist this is the callback
        "callback": function (data) {
            this.cacheThis(this.hashString, data);
            this.render(data);
        },
        "isThisHere": function (value) {
            var dataToCheck = $.giveMeMyFilesOldFool(value);
            return dataToCheck;
        },
        "update": function (hash) {
            this.hashString = hash.join('/');
            this.data = this.isThisHere(this.hashString);
            if (this.data === undefined) {
                id_loading.classList.add('loading');
                $.getRequest('contents/' + this.hashString + '.html', this.callback.bind(this));
            } else {
                this.render(this.data);
            }
        }
    };

/*-------------------------------------------------------*/
/*-------------------- Active Class ---------------------*/

    activeClass = {
        "update": function (hash) {
            $.activeClass(nav, hash[0]);
            $.activeClass(id_link, hash[hash.length - 1]);
        }
    };

/*-------------------------------------------------------*/
/*------------------ Open Links Above -------------------*/
    
    openLinksAbove = {
        "openLinks": function (elem) {
            if (elem.dataset.hidden === 'true') {
                $.linkOpenClose(elem);
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
    
/*-------------------------------------------------------*/
/*------------------- Scroll to View --------------------*/

    intoView = {
        "goThere": function (elem) {
            elem.scrollIntoView({block: "start", behavior: "smooth"});
        },
        "ifVisible": function (elem) {
            if (elem !== null) {
                var parent = elem.offsetParent,
                    elemPosition = elem.offsetTop - parent.scrollTop,
                    parentHeight = parent.clientHeight - elem.clientHeight;

                if (elemPosition < 0 || elemPosition > parentHeight) {
                    this.goThere(elem);
                }
            }
        },
        "update": function (hash) {
            if (hash[1] !== 'home') {
                this.ifVisible(id_link.querySelector('.active-links'));
            }
            id_content.scrollTop = 0;
        }
    };

/*-------------------------------------------------------*/
/*---------------- Add the new OBSERVERS ----------------*/

    hashSubject.addObserver(links);
    hashSubject.addObserver(content);
    hashSubject.addObserver(activeClass);
    hashSubject.addObserver(openLinksAbove);
    hashSubject.addObserver(intoView);

/*-------------------------------------------------------*/
/*------------------------ init -------------------------*/

    function init() {
        var hashArray = decodeURIComponent(location.hash).substr(1).split('/');
        
        if (hashArray[0] === '' || hashArray[0] === 'home') {
            links.hashCheck = "";
            hashArray[0] = 'home';
        }
        hashArray[1] =  (hashArray[1] === undefined) ? 'home' : hashArray[1];
        hashSubject.notify(hashArray);
    }

    // Listener
    window.addEventListener('hashchange', init);

    // Initial URL check
    init();

}($, hljs));