const socket = io();

socket.on("updateProducts", (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.dataset.id = product.id;
    productItem.innerHTML = `${product.title} - $${product.price} 
            <button onclick="deleteProduct('${product.id}')">Eliminar</button>
            <button onclick="editProduct('${product.id}', '${product.title}', '${product.price}')">Modificar</button>`;
    productList.appendChild(productItem);
  });
});

function addProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  socket.emit("newProduct", { title, price });
}

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

function editProduct(id, title, price) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-title").value = title;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-form").style.display = "block";
}

function saveProduct() {
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value;
  const price = document.getElementById("edit-price").value;
  socket.emit("updateProduct", { id, title, price });
  document.getElementById("edit-form").style.display = "none";
}
