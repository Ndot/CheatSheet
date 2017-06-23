window.onload = function () {

    var elem = document.querySelector('.links-wrapper'),
        elem3d = elem.parentElement.parentElement.querySelector('.content-wrapper > #spa-content'),
        elemBlackPane = elem.parentElement.parentElement.querySelector('.content-wrapper > #black-pane'),
        firstTouchPosX,
        firstTouchPosY,
        leftPosElem,
        diffTouchX = 0,
        diffTouchY = 0,
        valueApply,
        valueApply3d,
        scrollLock = null,
        areTheLinksClosing;

    elem.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        elem.style.transition = 'none';
        elem3d.style.transition = 'none';
        firstTouchPosX = e.changedTouches[0].clientX;
        firstTouchPosY = e.changedTouches[0].clientY;
        leftPosElem = elem.getBoundingClientRect().left;
        // Reset variable values
        diffTouchX = 0;
        diffTouchY = 0;
        scrollLock = null;
        
        // Reset areTheLinksClosing
        areTheLinksClosing = false;
        // Always add the class so the background is semiblack transparent
        elemBlackPane.classList.add('active');
    });

        
    elem.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        
        if(scrollLock === 'vertical') { return; }
        
        if (scrollLock === 'horizontal') {
            // Set values
            diffTouchX = e.changedTouches[0].clientX - firstTouchPosX;
            valueApply = diffTouchX + leftPosElem;
            // WARNING: This is tightly coupled to the CSS propertie "transform: rotateY(-60deg)"
            // in the spa_content.less file...if one change the other needs to change also...
            // Why??? Because...bahhh...
            valueApply3d = elem3d.classList.contains('apply-3d') ? (-(diffTouchX / 4) - 60) : -(diffTouchX / 4);

            // Prevent scrolling and applying the element position
            e.preventDefault();
            elem.style.transform = 'translate(' + valueApply + 'px)';
            elem3d.style.transform = 'rotateY(' + valueApply3d + 'deg)';

            return;
        }
        
        // Set the difference beetwin X and Y fisrt touch
        // and the NOW touch to determin the scroll orientation
        diffTouchX = e.changedTouches[0].clientX - firstTouchPosX;
        diffTouchY = e.changedTouches[0].clientY - firstTouchPosY;    
        
        if (diffTouchX > 5 || diffTouchX < -5) {
            areTheLinksClosing = elem3d.classList.contains('apply-3d') ? true : false;
            scrollLock = 'horizontal';
            return;
        }
        
        if (diffTouchY > 5 || diffTouchY < -5) {
            elem.style.transform = '';
            scrollLock = 'vertical';
            // HACK: The links are actualy closing but
            // since i'm checking if(!areTheLinksClosing)
            // on touchend this need to be true.
            areTheLinksClosing = true;
            return;
        }
    });
    
    elem.addEventListener('touchend', function (e) {
        e.stopPropagation();
        elem.style.transition = '';
        elem.style.transform = '';
        elem3d.style.transition = '';
        elem3d.style.transform = '';
        
        if (scrollLock === 'vertical' || (diffTouchX < 60 && diffTouchX > -60)) {
            if(!areTheLinksClosing) { elemBlackPane.classList.remove('active'); }
            return;
        }
        
        elem.classList.toggle('translate-links');
        elem.querySelector('#btn-open-links').classList.toggle('rotate');

        elem3d.classList.toggle('apply-3d');
        if(areTheLinksClosing) { elemBlackPane.classList.remove('active'); }
    });
};
