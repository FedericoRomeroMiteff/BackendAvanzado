document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on("updateProducts", (product) => {
    const productList = document.getElementById("product-list");
    const newProduct = document.createElement("li");
    newProduct.textContent = `${product.title} - $${product.price}`;
    productList.appendChild(newProduct);
  });

  socket.on("removeProduct", (productId) => {
    const productList = document.getElementById("product-list");
    const productItems = productList.getElementsByTagName("li");
    for (let item of productItems) {
      if (item.dataset.id === productId) {
        productList.removeChild(item);
        break;
      }
    }
  });

  function addProduct() {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    socket.emit("newProduct", { title, price });
  }

  function deleteProduct() {
    const productId = document.getElementById("productId").value;
    socket.emit("deleteProduct", productId);
  }

  window.addProduct = addProduct;
  window.deleteProduct = deleteProduct;
});
