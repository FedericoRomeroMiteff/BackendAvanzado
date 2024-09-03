const socket = io();

function addProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  socket.emit("newProduct", { title, price });
}

function deleteProduct(productId) {
  socket.emit("deleteProduct", productId);
}

function showUpdateForm(id, title, price) {
  document.getElementById("update-form").style.display = "block";
  document.getElementById("update-title").value = title;
  document.getElementById("update-price").value = price;
  document.getElementById("update-form").dataset.productId = id;
}

function modifyProduct() {
  const id = document.getElementById("update-form").dataset.productId;
  const title = document.getElementById("update-title").value;
  const price = document.getElementById("update-price").value;
  socket.emit("modifyProduct", { id: parseInt(id), title, price });
}

socket.on("updateProducts", (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.title} - $${product.price}`;
    listItem.dataset.id = product.id;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = () => deleteProduct(product.id);

    const modifyButton = document.createElement("button");
    modifyButton.textContent = "Modificar";
    modifyButton.onclick = () =>
      showUpdateForm(product.id, product.title, product.price);

    listItem.appendChild(deleteButton);
    listItem.appendChild(modifyButton);

    productList.appendChild(listItem);
  });
});
