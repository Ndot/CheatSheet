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
