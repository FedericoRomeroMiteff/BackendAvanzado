const socket = io();

socket.on("update-products", (products) => {
  updateProductList(products);
});

socket.on("remove-product", (productId) => {
  removeProductFromList(productId);
});

function updateProductList(products) {
  const productList = document.getElementById("product-list");

  productList.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("li");

    productItem.innerHTML = `${product.title} - $${product.price}`;

    productItem.appendChild(createDeleteButton(product.id));
    productItem.appendChild(createEditButton(product));

    productList.appendChild(productItem);
  });
}

function removeProductFromList(productId) {
  const productList = document.getElementById("product-list");

  const productItems = productList.getElementsByTagName("li");

  for (let item of productItems) {
    if (item.dataset.id === productId) {
      productList.removeChild(item);
      break;
    }
  }
}

function createDeleteButton(productId) {
  const deleteButton = document.createElement("button");

  deleteButton.innerHTML = "Eliminar";

  deleteButton.addEventListener("click", () => {
    socket.emit("delete-product", productId);
  });

  return deleteButton;
}

function createEditButton(product) {
  const editButton = document.createElement("button");

  editButton.innerHTML = "Modificar";

  editButton.addEventListener("click", () => {
    const newTitle = prompt("Nuevo título del producto:", product.title);
    const newPrice = prompt("Nuevo precio del producto:", product.price);

    if (newTitle && newPrice) {
      socket.emit("update-product", {
        id: product.id,
        title: newTitle,
        price: newPrice,
      });
    }
  });

  return editButton;
}

const addProductForm = document.getElementById("add-product-form");
addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleInput = document.getElementById("title").value;
  const priceInput = document.getElementById("price").value;

  socket.emit("new-product", {
    title: titleInput,
    price: priceInput,
  });

  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
});
