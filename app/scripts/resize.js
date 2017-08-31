$(function () {
    var cropp = $("#cropp"),
        originImg = $("#originImg"),
        square = $("#square"),
        isResizing = false,
        croppProperty = {
            croppTop: 0,
            croppLeft: 0,
            croppHeight: 0,
            croppWidth: 0
        },
        originImgProperty = {
            originImgTop: parseFloat(originImg.position().top),
            originImgLeft: parseFloat(originImg.position().left),
            originImgHeight: parseFloat(originImg.css("height")),
            originImgWidth: parseFloat(originImg.css("width"))
        },
        originImgCoords = {
            x: originImgProperty.originImgLeft,
            y: originImgProperty.originImgTop,
            _x: originImgProperty.originImgLeft + originImgProperty.originImgWidth,
            _y: originImgProperty.originImgTop + originImgProperty.originImgHeight
        }
    ;

    function getCroppProperty() {
        croppProperty.croppTop = parseFloat(cropp.position().top);
        croppProperty.croppLeft = parseFloat(cropp.position().left);
        croppProperty.croppHeight = parseFloat(cropp.css("height"));
        croppProperty.croppWidth = parseFloat(cropp.css("width"));
    }

    function resizingCroppArea(event) {
        croppProperty.croppHeight = event.pageY - croppProperty.croppTop;
        croppProperty.croppWidth = event.pageX - croppProperty.croppLeft;
        cropp.css({"height": croppProperty.croppHeight + 2});
        cropp.css({"width": croppProperty.croppWidth + 2});
    }

    function moveSquare(event) {
        square.css({"top": event.pageY});
        square.css({"left": event.pageX});
        resizingCroppArea(event);
    }

    function checkResizing(pageX, pageY) {
        if (pageX > originImgCoords._x) {
            square.css({"top": croppProperty.croppHeight + croppProperty.croppTop - 2});
            square.css({"left": originImgCoords._x - 4});
            cropp.css({"width": originImgProperty.originImgWidth - croppProperty.croppLeft - 2});
            return false;
        } else if (pageY > originImgCoords._y) {
            square.css({"top": originImgCoords._y - 4});
            square.css({"left": croppProperty.croppWidth + croppProperty.croppLeft - 2});
            cropp.css({"height": originImgProperty.originImgHeight - croppProperty.croppTop - 2});
            return false;
        } else if (pageX < croppProperty.croppLeft) {
            square.css({"top": croppProperty.croppHeight + croppProperty.croppTop - 2});
            square.css({"left": croppProperty.croppLeft});
            cropp.css({"width": 2});
            return false;
        } else if (pageY < croppProperty.croppTop) {
            square.css({"top": croppProperty.croppTop});
            square.css({"left": croppProperty.croppWidth + croppProperty.croppLeft - 2});
            cropp.css({"height": 2});
            return false;
        }

        else {
            return true;
        }
    }


    square.mousedown(function (event) {
        if (event.which === 1) {
            isResizing = true;
            getCroppProperty();
        }
    });

    square.mouseup(function () {
        if (event.which === 1) {
            isResizing = false;
        }

    });

    $(document).mouseup(function () {
        if (event.which === 1) {
            isResizing = false;
        }
    });

    $(document).mousemove(function (event) {
        if (isResizing && checkResizing(event.pageX, event.pageY)) {
            moveSquare(event);
        } else {
            return false;
        }
    });


});