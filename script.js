const classItens = document.querySelector('.items');
const classOl = document.querySelector('.cart__items');
const body = document.querySelector('body'); 

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Tive ajuda do Emerson Saturnino e Herique Clementino para fazer o requisito de soma.
const sum = async () => {
  let initNumber = 0;
  const textoPrice = document.querySelector('.total-price');
  const arrayCart = document.querySelectorAll('.cart__item');
    arrayCart.forEach((value) => {
      const convertNumber = value.innerText.split('$')[1];
      initNumber += parseFloat(convertNumber);
    });
    textoPrice.innerText = initNumber;
};

// Remove o item do carrinho ao clicar nele. https://developer.mozilla.org/pt-BR/docs/Web/API/ChildNode/remove
async function cartItemClickListener(event) {
   event.target.remove();
   sum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Cria o loading antes da promisse ser resolvida
const createLoading = () => {
  body.appendChild(createCustomElement('p', 'loading', 'Carregando...'));
};

// Remove o loading depois da promise ser resolvida
const removeLoading = () => {
  const pLoanding = document.querySelector('.loading');
  body.removeChild(pLoanding);
};

// Faz a requisição para a API
const apiUrl = async (item) => {
  const URL = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`);
  const docJson = await URL.json();
  const listComputer = await docJson.results;
  return listComputer;
};

// Adiciona o elemento buscado (computador) como filho da section com a classe items
const elementComputerSection = async () => {
  const list = await apiUrl('computador');
  list.forEach((item) => {
    const computers = createProductItemElement(item);
      classItens.appendChild(computers);
  });
};

// Faz a requisição na API pelo id
const fetchSearchId = async (id) => {
  const productId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const response = await productId.json();
  return response;
};

// Salva os items do carrinho no localStorage.Referencia https://www.youtube.com/watch?v=hNTozXl-qJA. 
const updateLocalStorage = async () => {
  const item = document.querySelector('.cart__items');
  await localStorage.setItem('Cart', item.innerHTML);
};

// Cria o item a ser adicionado no carrinho. Codigo ajustado com a ajuda de Herique Clementino.
const createProductCart = async (id) => {
  const itemId = await fetchSearchId(id);
  classOl.appendChild(createCartItemElement(itemId));
  updateLocalStorage();
  await sum();
};

// Adiciona Item no carrinho. Referencia da ajuda que encontrei, no final  da pagina.
const addProductCart = async () => {
   body.addEventListener('click', (event) => {
    const clickElement = event.target;
      if (clickElement.className === 'item__add') {
         createProductCart(getSkuFromProductItem(event.target.parentNode));
    }
  });
};

addProductCart();

// Captura os items salvos no localStorage ao carregar a pagina. Esse codico construi com ajuda do codigo do Emerson.
const reloadStorage = () => {
  const itemStorage = localStorage.getItem('Cart');
  if (itemStorage) {
    classOl.innerHTML = itemStorage;
    sum();
  }
};

reloadStorage();

// Limpa o carrinho de compras. Referencia da ajuda que tive no final da pagina
const clearCart = () => {
  body.addEventListener('click', (event) => {
    const clickElement = event.target;
      if (clickElement.className === 'empty-cart') {
        classOl.innerText = '';
        localStorage.clear();
        sum();
      }
  });
};

clearCart();

window.onload = async () => {
   createLoading();
   await elementComputerSection(); 
   removeLoading();
};

// segundo Requisito: https://www.youtube.com/watch?v=LEtLtRXBDms&t=492s
// https://www.youtube.com/watch?v=9bWDK5oltiI.

// Limpa carrinho: https://pt.stackoverflow.com/questions/441373/
// como-remover-todos-os-elementos-de-uma-div-em-javascript#:~:text=Para%20remover%20de%20uma%20s%C3%B3,
// do%20elemento%20pelo%20valor%20fornecido.