////////////////// my lib
/// tested as the fastest way to remove child
function removeAllChildNodes(htmlElement) {
    while(htmlElement.lastChild) {
        htmlElement.removeChild(htmlElement.firstChild);
    }
}
/////////////////////////////

function createGalleryItem(imageAddress, imageTitle) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    ////////////////////
    image.setAttribute("src", imageAddress);
    image.setAttribute("alt", "");
    
    ////////////////////
    figcaption.textContent = imageTitle;
    
    ////////////////////
    figure.append(image, figcaption);
    
    ////////////////////
    return figure;
}

// recrée la liste (TODO : voir pour ne construire que les éléments nouveaux)
function createGalleryItemList(itemList) {
    const domItemsContainer = document.body.querySelector("#portfolio .gallery");
    const temporaryItemsContainer = document.createDocumentFragment();
    for(let i = 0; i !== itemList.length; ++ i) {
        const newItem = createGalleryItem(itemList[i]["imageUrl"], itemList[i]["title"]);
        temporaryItemsContainer.append(newItem)
    }
    // rafraîchit la liste
    removeAllChildNodes(domItemsContainer);
    domItemsContainer.append(temporaryItemsContainer);
}

////////////////// main

async function updateGallery(updateURL) {
    const response = await fetch(updateURL);
    // on reçoit les données sous la forme d'un tableau d'objets
    const dataArray = await response.json();
    createGalleryItemList(dataArray);
}

// TODO : voir si l'on pourrait améliorer notre appel à l'API afin de ne recevoir que ce qui nous intéresse, à savoir l'URL de l'image et le titre...
updateGallery("http://localhost:5678/api/works");
