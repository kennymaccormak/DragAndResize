$(function () {
    var cropp = $("#cropp"),
        croppImg = $("#croppImg"),
        originImg = $("#originImg"),
        square = $("#square"),
        isMouseDown = false,
        croppTop,
        croppLeft,
        croppHeight,
        croppWidth,
        originImgWidth,
        originImgHeight,
        coords = {}
    ;

    // set cropp image position
    function positioningCroppImg() {
        // cropp element: top, left
        croppTop = parseFloat(cropp.css("top"));
        croppLeft = parseFloat(cropp.css("left"));

        // 2px - border
        var croppImgTop = -croppTop - 2,
            croppImgLeft = -croppLeft - 2
        ;
        // width and height of original image
        originImgWidth = parseFloat(originImg.css("width"));
        originImgHeight = parseFloat(originImg.css("height"));
        // set position for cropp image
        croppImg.css({
            "top": croppImgTop + "px",
            "left": croppImgLeft + "px",
            "width": originImgWidth + "px",
            "height": originImgHeight + "px"
        });
    }

    // set image resize square position
    function positioningSquare() {
        // cropp element: height, width, top, left
        croppHeight = parseFloat(cropp.css("height"));
        croppWidth = parseFloat(cropp.css("width"));
        croppTop = parseFloat(cropp.css("top"));
        croppLeft = parseFloat(cropp.css("left"));

        var squareTop, squareLeft;
        // get resize square coords
        squareTop = croppHeight + croppTop - 2;
        squareLeft = croppWidth + croppLeft - 2;
        // set position for resize square
        square.css({
            "top": squareTop + "px",
            "left": squareLeft + "px"
        });

    }

    // set position for resize square and cropp image
    function positioningElements() {
        positioningCroppImg();
        positioningSquare();
    }

    positioningElements();

    function getCoord(clientX, clientY) {
        coords.mouseX = clientX;
        coords.mouseY = clientY;
    }

    function setCroppArea(top, left) {
        cropp.css({"left": left});
        cropp.css({"top": top});
        positioningElements();
        isMouseDown = false;
        return true;
    }

    function checkMove(top, left) {
        left = parseFloat(cropp.css("left"));
        top = parseFloat(cropp.css("top"));
        var right = croppWidth + left - 4,
            bottom = croppHeight + top - 4
        ;

        if (top < 0) {
            setCroppArea(0, left);
        }

        if (left < 0) {
            setCroppArea(top, 0);
        }

        if (bottom > originImgHeight) {
            setCroppArea(bottom - croppHeight - 4, left);
        }

        if (right > originImgWidth) {
            setCroppArea(top, right - croppWidth - 4);
        }
    }

    function moveCroppArea(top, left) {
        cropp.css({"left": left});
        cropp.css({"top": top});
        positioningElements();
    }

    cropp.mousedown(function (event) {
        (event.which === 1) ? isMouseDown = true : isMouseDown = false;
        coords.mouseX = event.pageX;
        coords.mouseY = event.pageY;
        coords.relativeMouseX = coords.mouseX - croppLeft;
        coords.relativeMouseY = coords.mouseY - croppTop;
    });

    cropp.mouseup(function () {
        isMouseDown = false;
    });

    $(document).mouseup(function () {
        isMouseDown = false;
    });

    $(document).mousemove(function (event) {
        var top = coords.mouseY - coords.relativeMouseY;
        var left = coords.mouseX - coords.relativeMouseX;

        if (!checkMove(top, left) && isMouseDown) {
            moveCroppArea(top, left);
            getCoord(event.clientX, event.clientY);
        } else {
            return false;
        }
    });

    cropp.on("dragstart", function () {
        return false;
    });
});
