$(function () {
    var cropp = $("#cropp"),
        croppImg = $("#croppImg"),
        originImg = $("#originImg"),
        square = $("#square"),
        isMouseDown = false,
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
        coords = {}
    ;

    // set cropp image position
    function positioningCroppImg() {
        // cropp element: top, left
        croppProperty.croppTop = parseFloat(cropp.position().top);
        croppProperty.croppLeft = parseFloat(cropp.position().left);

        // 2px - border
        var croppImgTop = -croppProperty.croppTop - 2,
            croppImgLeft = -croppProperty.croppLeft - 2
        ;
        // set position for cropp image
        croppImg.css({
            "top": croppImgTop + "px",
            "left": croppImgLeft + "px",
            "width": originImgProperty.originImgWidth + "px",
            "height": originImgProperty.originImgHeight + "px"
        });
    }

    // set image resize square position
    function positioningSquare() {
        // cropp element: height, width, top, left
        croppProperty.croppHeight = parseFloat(cropp.css("height"));
        croppProperty.croppWidth = parseFloat(cropp.css("width"));
        croppProperty.croppTop = parseFloat(cropp.position().top);
        croppProperty.croppLeft = parseFloat(cropp.position().left);

        var squareTop, squareLeft;
        // get resize square coords
        squareTop = croppProperty.croppHeight + croppProperty.croppTop - 2;
        squareLeft = croppProperty.croppWidth + croppProperty.croppLeft - 2;
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
        left = parseFloat(cropp.position().left);
        top = parseFloat(cropp.position().top);
        var right = croppProperty.croppWidth + left - 4,
            bottom = croppProperty.croppHeight + top - 4
        ;

        if (top < 0) {
            setCroppArea(0, left);
        }

        if (left < 0) {
            setCroppArea(top, 0);
        }

        if (bottom > originImgProperty.originImgHeight) {
            setCroppArea(bottom - croppProperty.croppHeight - 4, left);
        }

        if (right > originImgProperty.originImgWidth) {
            setCroppArea(top, right - croppProperty.croppWidth - 4);
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
        coords.relativeMouseX = coords.mouseX - croppProperty.croppLeft;
        coords.relativeMouseY = coords.mouseY - croppProperty.croppTop;
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
