window.onload = function () {

    var elem = document.querySelector('.links-wrapper'),
        firstTouchPosX,
        firstTouchPosY,
        leftPosElem,
        diffTouchX = 0,
        diffTouchY = 0,
        valueApply,
        scrollLock = null;

    elem.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        elem.style.transition = 'none';
        firstTouchPosX = e.changedTouches[0].clientX;
        firstTouchPosY = e.changedTouches[0].clientY;
        leftPosElem = elem.getBoundingClientRect().left;
        // Reset variable values
        diffTouchX = 0;
        diffTouchY = 0;
        scrollLock = null;
    });
        
        
    elem.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        
        if(scrollLock === 'vertical') { return; }
        
        if (scrollLock === 'horizontal') {
            // Set values
            diffTouchX = e.changedTouches[0].clientX - firstTouchPosX;
            valueApply = diffTouchX + leftPosElem;
            // Prevent scrolling and applying the element position
            e.preventDefault();
            elem.style.transform = 'translate(' + valueApply + 'px)';
            return;
        }
        
        // Set the difference beetwin X and Y fisrt touch
        // and the NOW touch to determin the scroll orientation
        diffTouchX = e.changedTouches[0].clientX - firstTouchPosX;
        diffTouchY = e.changedTouches[0].clientY - firstTouchPosY;    
        
        if (diffTouchX > 5 || diffTouchX < -5) {
            scrollLock = 'horizontal';
            return;
        }
        
        if (diffTouchY > 5 || diffTouchY < -5) {
            elem.style.transform = '';
            scrollLock = 'vertical';
            return;
        }
    });
    
    elem.addEventListener('touchend', function (e) {
        e.stopPropagation();
        elem.style.transition = '';
        elem.style.transform = '';
        
        if (scrollLock === 'vertical' || (diffTouchX < 60 && diffTouchX > -60)) {
            return;
        }
        
        elem.classList.toggle('translate-links');
        elem.querySelector('#btn-open-links').classList.toggle('rotate');

        elem.parentElement.parentElement.querySelector('.content-wrapper > #spa-content').classList.toggle('apply-3d');
        elem.parentElement.parentElement.querySelector('.content-wrapper > #black-pane').classList.toggle('black-pane');
    });
};
