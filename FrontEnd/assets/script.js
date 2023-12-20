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
    text = text.replaceAll(/\p{Punctuation}/gu, ""); // enlève les isgnes de ponctuation
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
function createFilterButtonList(data) {
    const buttonContainerElement = document.body.querySelector("#portfolio .filters");
    const templateElement = document.getElementById("template--filter-button");
    const fragmentContainer = document.createDocumentFragment();
    // ajoute le bouton "Tous" car il n'est pas dans les données
    {
        const allButton = createButton("Tous", "all", true);
        fragmentContainer.append(allButton);
    }
    for(let i = 0; i !== data.length; ++ i) {
        const name = data[i]["name"];
        const newButton = createButton(name, toKebabCase(name));
        fragmentContainer.append(newButton);
    }

    removeAllChildNodes(buttonContainerElement);
    buttonContainerElement.append(fragmentContainer);
    
    function createButton(text, value, checked = false) {
        const newButton = templateElement.content.cloneNode(true);
        {
            const radioInput = newButton.querySelector("input");
            radioInput.setAttribute("id", value);
            radioInput.setAttribute("value", value);
            // par défaut
            radioInput.setAttribute("name", "filter");

            // new
            if(checked) {
                radioInput.checked = checked;
            }
        }
        {
            const label = newButton.querySelector("label");
            label.setAttribute("for", value);
            label.textContent = text;
        }
        return newButton;
    }
}

////////////////// main

async function updateFilterButtonList(categoryListURL) {
    const response = await fetch(categoryListURL);
    // on reçoit les données sous la forme d'un tableau d'objets
    const dataArray = await response.json();
    createFilterButtonList(dataArray);
}

async function updateGallery(updateURL) {
    const response = await fetch(updateURL);
    // on reçoit les données sous la forme d'un tableau d'objets
    const dataArray = await response.json();
    createGalleryItemList(dataArray);
}

updateFilterButtonList("http://localhost:5678/api/categories");
// TODO : voir si l'on pourrait améliorer notre appel à l'API afin de ne recevoir que ce qui nous intéresse, à savoir l'URL de l'image et le titre...
updateGallery("http://localhost:5678/api/works");
