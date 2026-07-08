


$(document).ready(function () {
    ItirateOverBackgroundImages()
});

function FindElementsWithBackgroundImage() {
    const elementsWithBackgroundImage = [];
    let allElements = null;

    // Get all elements on the page
    if ($('body').hasClass("modal-open")) {
        const modal = document.querySelector('#product-details-modal');
        if (modal) {
            allElements = modal.querySelectorAll('*');
        }
    }
    else {
        allElements = document.querySelectorAll('*');
    }

    // Iterate through each element and check for background-image in computed styles
    allElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const backgroundImage = computedStyle.getPropertyValue('background-image');

        if (backgroundImage !== 'none') {
            elementsWithBackgroundImage.push(element);
        }
    });

    return elementsWithBackgroundImage;
}

function ItirateOverBackgroundImages() {
    const elementsWithBackgroundImage = FindElementsWithBackgroundImage();

    elementsWithBackgroundImage.forEach((imageContainer) => {
        const backgroundImage = getComputedStyle(imageContainer).getPropertyValue('background-image');
        const urlParts = backgroundImage.split('-');
        const lastPart = urlParts[urlParts.length - 1].split('.')[0];
        let display = null;
        let element = null;
        let parent = null;
        var imageClass = $(imageContainer).attr("class");
        if (imageClass != null && imageClass != undefined && imageClass.includes('items-group-item')) {
            parent = imageContainer.closest('#ItemsAndGroupsPageContainer');
            if (parent !== undefined && parent !== null) {
                display = $(parent).css("display");
                if (display == 'none') {
                    return;
                }
            }

            parent = imageContainer.closest('#AllItemsFromGroupsPageContainer');
            if (parent !== undefined && parent !== null) {
                display = $(parent).css("display");
                if (display == 'none') {
                    return;
                }
            }
        }

        if (lastPart.includes('X')) {
            let widthAndHeight = lastPart.split('X');
            let width = parseInt(widthAndHeight[0]);
            let height = parseInt(widthAndHeight[1]);
            let currentContainerHeight = $(imageContainer).height();
            let padding = "";
            let popUpImageWidth = "";
            if (currentContainerHeight <= 0) {
                padding = $(imageContainer).css("padding-bottom");
                currentContainerHeight = parseInt(padding.split('p')[0])
            }
            let currentContainerWidth = $(imageContainer).width();

            if (currentContainerWidth <= 0) {
                popUpImageWidth = $("ul.item-images__big-image-list li").width();
                currentContainerWidth = popUpImageWidth
            }

            const urlPartsBySlash = backgroundImage.split('/');
            const imageCode = urlPartsBySlash[urlPartsBySlash.length - 1].split('.')[0];
            let imageID = $(imageContainer).attr("id");

            let imageName = "";
            if (imageID !== undefined) {
                imageName = imageID + "-";
            }
            imageName = imageCode;

            //if (currentContainerHeight != height) {
            //    console.log("non-equal height: " + imageName + ". Current Container Height: " + currentContainerHeight)
            //}
            //if (currentContainerWidth != width) {
            //    console.log("non-equal width for: " + imageName + ". Current Container Width: " + currentContainerWidth)
            //}
        }
    });
}