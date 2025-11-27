document.addEventListener("DOMContentLoaded", () => {
    const image = initializeImages();
    renderImages(image);
});

// 이미지 불러오기
function initializeImages() {
    const defaultImages = [
        { name: "기본 사진 A", grade: "C", src: "images/Cdefault.jpg" },
        { name: "기본 사진 B", grade: "C", src: "images/Cdefault2.jpg" },
        { name: "기본 사진 C", grade: "C", src: "images/Cdefault3.jpg" },
    ];

    let images = JSON.parse(localStorage.getItem("drawnImages")) || [];
    defaultImages.forEach(defaultImage => {
        const isDuplicate = images.some(photo => photo.src === defaultImage.src);
        if (!isDuplicate) {
            images.push(defaultImage);
        }
    });

    localStorage.setItem("drawnImages", JSON.stringify(images));
    return images;
}

// 이미지 렌더링
function renderImages(image) {
    const collectionSection = document.getElementById("collection-section");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");

    collectionSection.innerHTML = "";

    if (image.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "아직 획득한 사진이 없습니다. 뽑기 페이지로 이동해보세요!";
        collectionSection.appendChild(emptyMessage);
        return;
    }

    image.forEach((photo) => {
        const imgElement = document.createElement("img");
        imgElement.src = photo.src;
        imgElement.alt = photo.name || "획득한 사진";

        imgElement.addEventListener("click", () => {
            modalImg.src = photo.src;
            modal.classList.remove("hidden");
        });

        collectionSection.appendChild(imgElement);
    });
}
