window.onload = function () {

    var elem = document.querySelector('.links-wrapper'),
        firstTouchPosX,
        firstTouchPosY,
        leftPosElem,
        diffTouchX = 0,
        diffTouchY = 0,
        valueApply;

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
        
        if (diffTouchY > 50 || diffTouchY < -50) {
            elem.style.transform = '';
            return console.log('returned');
        }
        
        elem.style.transform = 'translate(' + valueApply + 'px)';
    });
    
    elem.addEventListener('touchend', function (e) {
        elem.style.transition = '';
        elem.style.transform = '';
        
        if ((diffTouchX < 50 && diffTouchX > -50) || (diffTouchY > 50 || diffTouchY < -50)) {
            diffTouchX = 0;
            diffTouchY = 0;
            return;
        }
        
        elem.classList.toggle('translate-links');
        elem.querySelector('#btn-open-links').classList.toggle('rotate');
        diffTouchX = 0;
        diffTouchY = 0;
    });
};