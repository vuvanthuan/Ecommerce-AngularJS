app.service("CartService", function ($rootScope) {
  var cartItems = [];

  // Try to load existing cart from localStorage
  function loadCartFromStorage() {
    var storedCart = localStorage.getItem("tmvCart");
    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (e) {
        console.error("Error loading cart from storage", e);
        cartItems = [];
      }
    }
  }

  // Save cart to localStorage and broadcast update
  function saveCartToStorage() {
    localStorage.setItem("tmvCart", JSON.stringify(cartItems));
    $rootScope.$broadcast("cartUpdated");
  }

  // Initialize cart
  loadCartFromStorage();

  return {
    getCartItems: function () {
      return cartItems;
    },

    addToCart: function (product, quantity) {
      quantity = quantity || 1;

      // Check if product already in cart (sử dụng _id)
      for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i]._id === product._id) {
          // Sửa id thành _id
          cartItems[i].quantity += quantity;
          saveCartToStorage();
          return;
        }
      }

      // If not found, add as new item
      cartItems.push({
        _id: product._id, // Sửa id thành _id
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      });

      saveCartToStorage();
    },

    removeFromCart: function (productId) {
      for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i]._id === productId) {
          // Sửa id thành _id
          cartItems.splice(i, 1);
          saveCartToStorage();
          return;
        }
      }
    },

    updateCart: function (newCartItems) {
      cartItems = newCartItems;
      saveCartToStorage();
    },

    getCartItemCount: function () {
      var count = 0;
      for (var i = 0; i < cartItems.length; i++) {
        count += cartItems[i].quantity;
      }
      return count;
    },

    getCartTotal: function () {
      var total = 0;
      for (var i = 0; i < cartItems.length; i++) {
        total += cartItems[i].price * cartItems[i].quantity;
      }
      return total;
    },

    clearCart: function () {
      cartItems = [];
      saveCartToStorage();
    },
  };
});
