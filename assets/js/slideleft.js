window.onload = function () {

    var elem = document.querySelector('.links-wrapper'),
        firstTouchPosX,
        firstTouchPosY,
        leftPosElem,
        diffTouchX = 0,
        diffTouchY = 0,
        valueApply,
        scrollLock = false;

    elem.addEventListener('touchstart', function (e) {
        elem.style.transition = 'none';
        firstTouchPosX = e.changedTouches[0].clientX;
        firstTouchPosY = e.changedTouches[0].clientY;
        leftPosElem = elem.getBoundingClientRect().left;
    });
        
        
    elem.addEventListener('touchmove', function (e) {
        diffTouchX = e.changedTouches[0].clientX - firstTouchPosX,
        diffTouchY = e.changedTouches[0].clientY - firstTouchPosY,    
        valueApply = diffTouchX + leftPosElem;
        
        if(scrollLock === true) { return; }
        
        if (diffTouchY > 50 || diffTouchY < -50) {
            elem.style.transform = '';
            scrollLock = true;
            return;
        }
        
        elem.style.transform = 'translate(' + valueApply + 'px)';
    });
    
    elem.addEventListener('touchend', function (e) {
        elem.style.transition = '';
        elem.style.transform = '';
        
        if (scrollLock === true || (diffTouchX < 50 && diffTouchX > -50)) {
            diffTouchX = 0;
            diffTouchY = 0;
            scrollLock = false;
            return;
        }
        
        elem.classList.toggle('translate-links');
        elem.querySelector('#btn-open-links').classList.toggle('rotate');
        diffTouchX = 0;
        diffTouchY = 0;
    });
};