$(function () {
    var cropp = $("#cropp"),
        container = $("#container"),
        croppImg = $("#croppImg"),
        originImg = $("#originImg"),
        square1 = $("#square1"),
        square2 = $("#square2"),
        square3 = $("#square3"),
        square4 = $("#square4"),
        cropp_x = $("#cropp_x"),
        cropp_y = $("#cropp_y"),
        cropp_xx = $("#cropp_xx"),
        cropp_yy = $("#cropp_yy"),
        isRelative = $("#isRelative"),
        showRelativeCoords = false,
        isMouseDown = false,
        isResizing = false,
        containerProperty = {
            containerTop: 0,
            containerLeft: 0,
            containerHeight: 0,
            containerWidth: 0
        },
        croppProperty = {
            croppTop: 0,
            croppLeft: 0,
            croppHeight: 0,
            croppWidth: 0
        },
        croppCoords = {
            x: 0,
            y: 0,
            _x: 0,
            _y: 0
        },
        originImgProperty = {
            originImgTop: 0,
            originImgLeft: 0,
            originImgHeight: 0,
            originImgWidth: 0
        },
        originImgCoords = {
            x: 0,
            y: 0,
            _x: 0,
            _y: 0
        },
        coords = {}
    ;

    function getContainerProperty() {
        containerProperty.containerTop = parseFloat(container[0].offsetTop);
        containerProperty.containerLeft = parseFloat(container[0].offsetLeft);
        containerProperty.containerHeight = parseFloat(container.css("height"));
        containerProperty.containerWidth = parseFloat(container.css("width"));
    }

    function getCroppProperty() {
        croppProperty.croppTop = parseFloat(cropp.position().top);
        croppProperty.croppLeft = parseFloat(cropp.position().left);
        croppProperty.croppHeight = parseFloat(cropp.css("height"));
        croppProperty.croppWidth = parseFloat(cropp.css("width"));
    }

    function getOriginImgProperty() {
        originImgProperty.originImgTop = parseFloat(originImg.position().top);
        originImgProperty.originImgLeft = parseFloat(originImg.position().left);
        originImgProperty.originImgHeight = parseFloat(originImg.css("height"));
        originImgProperty.originImgWidth = parseFloat(originImg.css("width"));
    }

    function getOriginImgCoords() {
        originImgCoords.x = containerProperty.containerTop;
        originImgCoords.y = containerProperty.containerLeft;
        originImgCoords._x = containerProperty.containerLeft + originImgProperty.originImgWidth;
        originImgCoords._y = containerProperty.containerTop + originImgProperty.originImgHeight;
    }

    function getCroppCoords() {

        if (showRelativeCoords) {
            croppCoords.x = croppProperty.croppTop;
            croppCoords.y = croppProperty.croppLeft;
            croppCoords._x = croppCoords.x + croppProperty.croppHeight;
            croppCoords._y = croppCoords.y + croppProperty.croppWidth;
        } else {
            croppCoords.x = croppProperty.croppTop + containerProperty.containerTop;
            croppCoords.y = croppProperty.croppLeft + containerProperty.containerLeft;
            croppCoords._x = croppCoords.x + croppProperty.croppHeight;
            croppCoords._y = croppCoords.y + croppProperty.croppWidth;
        }

        cropp_x.val(croppCoords.x);
        cropp_y.val(croppCoords.y);
        cropp_xx.val(croppCoords._x);
        cropp_yy.val(croppCoords._y);
    }

    function getProperty() {
        getContainerProperty();
        getCroppProperty();
        getOriginImgProperty();
        getOriginImgCoords()
    }

    function setCoords(event) {
        coords.mouseX = event.pageX;
        coords.mouseY = event.pageY;
        coords.relativeMouseX = coords.mouseX - croppProperty.croppLeft;
        coords.relativeMouseY = coords.mouseY - croppProperty.croppTop;
    }

    getProperty();

    function positioningCroppImg() {
        getCroppProperty();
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

    function positioningSquares(square, newTop, newLeft) {
        var squareTop, squareLeft;
        // get resize square1 coords
        squareTop = newTop - 2;
        squareLeft = newLeft - 2;
        // set position for resize square1
        square.css({
            "top": squareTop + "px",
            "left": squareLeft + "px"
        });
    }

    function setSquareTopLeft() {
        positioningSquares(square1, croppProperty.croppTop, croppProperty.croppLeft);
        positioningSquares(square2, croppProperty.croppTop, croppProperty.croppWidth + croppProperty.croppLeft);
        positioningSquares(square3, croppProperty.croppHeight + croppProperty.croppTop, croppProperty.croppWidth + croppProperty.croppLeft);
        positioningSquares(square4, croppProperty.croppHeight + croppProperty.croppTop, croppProperty.croppLeft);
    }

    // set position for resize square1 and cropp image
    function positioningElements() {
        positioningCroppImg();
        setSquareTopLeft()
    }

    // moving

    function setCroppArea(top, left) {
        cropp.css({"left": left});
        cropp.css({"top": top});
        positioningElements();
        isMouseDown = false;
        return false;
    }

    function checkMove() {
        var left = parseFloat(cropp.position().left);
        var top = parseFloat(cropp.position().top);
        var right = croppProperty.croppWidth + left - 4;
        var bottom = croppProperty.croppHeight + top - 4;
        var newTop = originImgProperty.originImgHeight - croppProperty.croppHeight - 4;
        var newLeft = originImgProperty.originImgWidth - croppProperty.croppWidth - 4;

        if (top < originImgProperty.originImgTop) {
            setCroppArea(originImgProperty.originImgTop, left);
        } else if (left < originImgProperty.originImgLeft) {
            setCroppArea(top, originImgProperty.originImgLeft);
        } else if (bottom > originImgProperty.originImgHeight) {
            setCroppArea(newTop, left);
        } else if (right > originImgProperty.originImgWidth) {
            setCroppArea(top, newLeft);
        } else {
            return true
        }
    }

    function moveCroppArea(top, left) {
        cropp.css({"left": left});
        cropp.css({"top": top});
        positioningElements();
    }

    // resizing

    function resizingCroppArea(event) {
        croppProperty.croppHeight = event.pageY - containerProperty.containerTop - croppProperty.croppTop;
        croppProperty.croppWidth = event.pageX - containerProperty.containerLeft - croppProperty.croppLeft;
        cropp.css({"height": croppProperty.croppHeight});
        cropp.css({"width": croppProperty.croppWidth});
    }

    function moveSquare(event) {
        square3.css({"top": event.pageY - containerProperty.containerTop - 2});
        square3.css({"left": event.pageX - containerProperty.containerLeft - 2});
        resizingCroppArea(event);
        setSquareTopLeft();
    }

    function checkResizing(pageX, pageY) {
        if (pageX > originImgCoords._x) {
            square3.css({"top": croppProperty.croppHeight + croppProperty.croppTop - 2});
            square3.css({"left": originImgCoords._x - 4 - containerProperty.containerLeft});
            cropp.css({"width": originImgProperty.originImgWidth - croppProperty.croppLeft - 2});
            return false;
        } else if (pageY > originImgCoords._y) {
            square3.css({"top": originImgCoords._y - 4 - containerProperty.containerTop});
            square3.css({"left": croppProperty.croppWidth + croppProperty.croppLeft - 2});
            cropp.css({"height": originImgProperty.originImgHeight - croppProperty.croppTop - 2});
            return false;
        } else if (pageX < croppProperty.croppLeft + containerProperty.containerLeft) {
            square3.css({"top": croppProperty.croppHeight + croppProperty.croppTop - 2});
            square3.css({"left": croppProperty.croppLeft});
            cropp.css({"width": 2});
            return false;
        } else if (pageY < croppProperty.croppTop + containerProperty.containerTop) {
            square3.css({"top": croppProperty.croppTop});
            square3.css({"left": croppProperty.croppWidth + croppProperty.croppLeft - 2});
            cropp.css({"height": 2});
            return false;
        } else {
            return true;
        }
    }

    positioningElements();

    //  moving events
    cropp.mousedown(function (event) {
        isMouseDown = event.which === 1;
        setCoords(event);
    });

    cropp.mouseup(function () {
        if (event.which === 1) {
            isMouseDown = false;
        }
    });

    // resizing events
    square3.mousedown(function (event) {
        if (event.which === 1) {
            isResizing = true;
            getCroppProperty();
        }
    });

    square3.mouseup(function () {
        if (event.which === 1) {
            isResizing = false;
        }
    });

    // general events

    $(document).mouseup(function () {
        if (event.which === 1) {
            isMouseDown = false;
            isResizing = false;
        }
    });

    $(document).mousemove(function (event) {
        getCroppCoords();
        getProperty();
        if (checkMove() && isMouseDown && !isResizing) {
            var top = event.clientY - coords.relativeMouseY;
            var left = event.clientX - coords.relativeMouseX;
            console.log(top + ", " + left);
            moveCroppArea(top, left);
        } else if (isResizing && !isMouseDown && checkResizing(event.pageX, event.pageY)) {
            moveSquare(event);
        } else {
            return false;
        }
    });

    isRelative.click(function () {
        showRelativeCoords = $("#isRelative:checked").length !== 0;
        getCroppCoords();
    });

    cropp.on("dragstart", function () {
        return false;
    });
    square3.on("dragstart", croppImg, function () {
        return false;
    });
});
