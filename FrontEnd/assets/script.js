////////////////// my lib
/// tested as the fastest way to remove child
function removeAllChildNodes(htmlElement) {
    while(htmlElement.lastChild) {
        htmlElement.removeChild(htmlElement.firstChild);
    }
}

function toKebabCase(text) {
    text = text.toLowerCase();
    text = text.replaceAll(/.'/g, ""); // enlève les >> l' d' etc.
    text = text.replaceAll(/\p{Punctuation}/gu, ""); // enlève les signes de ponctuation
    // if there is two or more consecutive spaces reduce the space to one space
    // this is to avoid having more than one hyphen during the next replaceAll below this one
    text = text.replaceAll(/\s{2,}/g, " ");
    text = text.replaceAll(" ", "-");
    return text;
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

////////////////// filtres
function createFilterButtonList(dataObjectArray) {
    const buttonContainerElement = document.body.querySelector("#portfolio .filters");
    const templateElement = document.getElementById("template--filter-button");
    const fragmentContainer = document.createDocumentFragment();
    // ajoute le bouton "Tous" car il n'est pas dans les données
    {
        // category 0 = all
        const allButton = createFilterButton("Tous", 0, true);
        fragmentContainer.append(allButton);
    }
    for(let i = 0; i !== dataObjectArray.length; ++ i) {
        const name = dataObjectArray[i]["name"];
        const newButton = createFilterButton(name,  + dataObjectArray[i]["id"]);
        fragmentContainer.append(newButton);
    }

    removeAllChildNodes(buttonContainerElement);
    buttonContainerElement.append(fragmentContainer);
    
    function createFilterButton(text, categoryId, checked = false) {
        const newButton = templateElement.content.cloneNode(true);
        // renomme l'id pour ne pas que ce soit un simple chiffre (améliore la clarté du code)
        categoryId = "category-" + categoryId;
        {
            const radioInput = newButton.querySelector("input");
            radioInput.setAttribute("id", categoryId);
            radioInput.setAttribute("value", categoryId);
            // par défaut
            radioInput.setAttribute("name", "filter");

            // new
            if(checked) {
                radioInput.checked = checked;
            }
        }
        {
            const label = newButton.querySelector("label");
            label.setAttribute("for", categoryId);
            label.textContent = text;
        }
        return newButton;
    }
}

////////////////// main

async function initFilterButtonList(categoryListURL) {
    const response = await fetch(categoryListURL);
    // on reçoit les données sous la forme d'un tableau d'objets
    const dataArray = await response.json();
    createFilterButtonList(dataArray);
}


async function createGallery(updateURL, callback) {
    const response = await fetch(updateURL);
    // on reçoit les données sous la forme d'un tableau d'objets
    const galleryData = await response.json();
    createGalleryItemList(galleryData);
    callback(galleryData);
}



initFilterButtonList("http://localhost:5678/api/categories");
// TODO : voir si l'on pourrait améliorer notre appel à l'API afin de ne recevoir que ce qui nous intéresse, à savoir l'URL de l'image et le titre...
createGallery("http://localhost:5678/api/works", function(galleryData) {
    // TODO : il vaudrait mieux vérifier lequel des radio buttons est checked, là je sais que c'est 0 (pour le filtre "Tous")
    let currentCategoryID_int = 0;
    document.addEventListener("change", function(event) {
        if(event.target.name === "filter") {
            const categoryID_str = event.target.id;
            const categoryID_int = parseInt(categoryID_str.substring(categoryID_str.lastIndexOf("-") + 1));
            /////////////////////////////////////////////////////////
            // pas la peine de lancer un rafraîchissement de la liste
            if(categoryID_int === currentCategoryID_int) return;
            /////////////////////////////////////////////////////////
            currentCategoryID_int = categoryID_int;
            const newGalleryData = categoryID_int === 0 ? galleryData : galleryData.filter(function(item) {
                return item["categoryId"] === categoryID_int;
            });
            createGalleryItemList(newGalleryData);
        }
    });
});

