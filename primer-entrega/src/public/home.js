document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.textContent = "¡Bienvenido a la lista de productos!";
  }
  socket.on("updateProducts", (product) => {
    const productList = document.getElementById("product-list");
    const newProduct = document.createElement("li");
    newProduct.textContent = `${product.title} - $${product.price}`;
    newProduct.dataset.id = product.id;
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
});
