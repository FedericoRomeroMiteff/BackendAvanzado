const socket = io();

function addProduct() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;

  if (title && price) {
    socket.emit("newProduct", { title, price });
  } else {
    alert("Por favor, complete todos los campos.");
  }
}

function deleteProduct(productId) {
  socket.emit("deleteProduct", productId);
}

function modifyProduct() {
  const productId = document.getElementById("modProductId").value;
  const title = document.getElementById("modTitle").value;
  const price = document.getElementById("modPrice").value;

  if (productId && title && price) {
    socket.emit("modifyProduct", { id: productId, title, price });
  } else {
    alert("Por favor, complete todos los campos.");
  }
}

socket.on("updateProducts", (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.textContent = `${product.title} - $${product.price}`;
    productItem.setAttribute("data-id", product.id);
    productItem.innerHTML += `<button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    productItem.innerHTML += `<button onclick="modifyProduct(${product.id})">Modificar</button>`;
    productList.appendChild(productItem);
  });
});
