document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("#mainView");
    const pageHeading = document.querySelector("main h2");
    const shoppingCart = [];

    function cartItem(id, name, price, quantity, thumbnail) {//constructor function
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.thumbnail = thumbnail;
    }

    function updateStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    }

    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }

    function removeStorage() {//where should this be used?
        localStorage.removeItem('shoppingCart');
    }

    function addToCart(e, count) {
        count += 1;//figure out different way to implement count
        const newItem = new cartItem(e.target.id, e.target.dataset.title, e.target.dataset.price, count, e.target.dataset.thumbnail);
        shoppingCart.push(newItem);
        for (let i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].id == newItem.id && shoppingCart.length > 1 && shoppingCart[i].quantity < newItem.quantity) {
                shoppingCart.splice(i, 1);
            }
        }
        updateStorage()
        toasterMessage("You have added " + e.target.dataset.title + " to cart");
    }

    function delItem(e) {
        const btn = e.target;
        const id = btn.dataset.id;
        for (let i = 0; i < shoppingCart.length; i++) {
            if (shoppingCart[i].id == id) {
                shoppingCart.splice(i, 1);
            }
        }
        updateStorage();
        cartView();
    }

    function toasterMessage(message) {//style this to make it pop
        const area = document.querySelector("#toaster");
        area.className = "visible";
        area.textContent = message;
        setTimeout(() => {
            area.className = "hidden";
        }, 5000);
    }

    //Shopping Cart View
    const cart = document.querySelector("#CART");
    cart.addEventListener("click", cartView);

    const clic = document.querySelector("#cartCount");
    let amount = 0;
    const cartLocal = retrieveStorage();
    for (let p of cartLocal) {
        amount += Number(p.quantity);
    }
    clic.textContent = amount;

    function cartView(e) {
        main.innerHTML = "";
        pageHeading.textContent = "Shopping Cart";
        const localCart = retrieveStorage();

        const items = document.createElement("div");
        items.setAttribute("id", "cartItems");
        const itable = document.createElement("table");
        itable.setAttribute("id", "cartInfo")
        const trHead = document.createElement("tr");
        const th1 = document.createElement("th");
        const th2 = document.createElement("th");
        th2.textContent = "Items";
        const th3 = document.createElement("th");
        const th4 = document.createElement("th");
        th4.textContent = "Price";
        const th5 = document.createElement("th");
        th5.textContent = "Quantity";
        const th6 = document.createElement("th");
        th5.textContent = "Subtotal";
        trHead.appendChild(th1);
        trHead.appendChild(th2);
        trHead.appendChild(th3);
        trHead.appendChild(th4);
        trHead.appendChild(th5);
        trHead.appendChild(th6);
        itable.appendChild(trHead);
        for (let c of localCart) {
            console.log(localCart);
            const tr = document.createElement("tr");
            const deleteItem = document.createElement("td");
            const del = document.createElement("button");
            del.textContent = "-";
            del.dataset.id = c.id;
            del.addEventListener("click", delItem);
            deleteItem.appendChild(del);

            const item = document.createElement("td");
            const img = document.createElement("img");
            img.src = c.thumbnail;
            item.appendChild(img);
            item.textContent = c.name;

            const pris = document.createElement("td");
            pris.textContent = c.price;
            const quanti = document.createElement("td");
            quanti.textContent = c.quantity;
            const subtotal = document.createElement("td");

            tr.appendChild(deleteItem);
            tr.appendChild(item);
            tr.appendChild(pris);
            tr.appendChild(quanti);
            tr.appendChild(subtotal);
            itable.appendChild(tr);
        }
        main.appendChild(itable);

        const shipSumm = document.createElement("div");
        shipSumm.setAttribute("id", "shipSumm");
        const ship = document.createElement("div");
        const innership = document.createElement("div");
        const tsh = document.createElement("h4");
        tsh.textContent = "Shipping";

        innership.appendChild(tsh);

        const summ = document.createElement("div");

        ship.appendChild(innership);
        shipSumm.appendChild(ship);
        main.appendChild(shipSumm);



        const checkoutButton = document.createElement("button");
        checkoutButton.setAttribute("id", "checkoutButton");
        checkoutButton.textContent = "Checkout";
        checkoutButton.addEventListener("click", () => { toasterMessage("Purchase complete. Thank you for shopping!") })
        main.appendChild(checkoutButton);
    };

    //Single Product View
    function singleProduct(e, path) {
        let count = 0;
        main.innerHTML = "";
        pageHeading.textContent = path + "" + e.target.dataset.title;
        const prod = document.createElement("div");
        const prodImg = document.createElement("img");
        prodImg.src = e.target.dataset.thumbnail;
        const prodInfo = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = e.target.dataset.title;
        const h5 = document.createElement("h5");
        h5.textContent = e.target.dataset.price;

        const tags = document.createElement("div");
        const prourl = "https://dummyjson.com/products/" + e.target.id;
        fetch(prourl)
            .then(resp => resp.json())
            .then(product => {
                for (let i of product.tags) {
                    const tag = document.createElement("button");
                    tag.textContent = i;
                    tags.appendChild(tag);
                };
            })
            .catch(error => console.error(error));

        const add = document.createElement("button");
        add.setAttribute("id", "ADD");
        add.textContent = "Add to Cart";
        //count+=1;
        add.addEventListener("click", () => { addToCart(e, count) });
        prodInfo.appendChild(tags);
        prodInfo.appendChild(h3);
        prodInfo.appendChild(h5);


        prod.appendChild(prodImg);
        prod.appendChild(prodInfo);
        prod.appendChild(add);
        main.appendChild(prod);
    };



    const url = "https://dummyjson.com/products?limit=100";
    fetch(url)
        .then(result => {
            if (result.ok) {
                return result.json();
            } else {
                return Promise.reject({
                    status: result.status,
                    statusText: result.statusText
                });
            }

        })
        .then(product => {
            const home = document.querySelector("#HOME");
            home.addEventListener("click", () => { homeView(product); });
            const logo = document.querySelector("#logo");
            logo.addEventListener("click", () => { homeView(product) });
            const browse = document.querySelector("#BROWSE");
            browse.addEventListener("click", () => { browseView(product); });
        })
        .catch(err => { console.error("error: " + err) });


    //Home View
    function homeView(product) {
        main.innerHTML = "";
        pageHeading.textContent = "Home";
        const title = document.createElement("h3");
        title.textContent = "Featured Products!"
        title.style.textAlign = "center";
        const featured = document.createElement("div");
        featured.setAttribute("id", "featured");
        for (let pro of product.products) {
            if (Number(pro.rating) >= 4.8) {
                const feabutton = document.createElement("button");
                const fea = document.createElement("img");
                fea.src = pro.thumbnail;
                feabutton.appendChild(fea);
                fea.dataset.title = pro.title;
                fea.dataset.thumbnail = pro.thumbnail;
                fea.dataset.price = pro.price;
                fea.setAttribute("id", pro.id)
                feabutton.addEventListener("click", (e) => { singleProduct(e, "Home/") })
                featured.appendChild(feabutton);
            }
            featured.appendChild(title);
            main.appendChild(featured);
        }
    }


    //Browse View
    //this is for product list
    function browseView(product) {//work on filters
        main.innerHTML = "";
        pageHeading.textContent = "Browse Products";
        const maindiv = document.createElement("div");
        maindiv.setAttribute("id", "forBrowse");
        const prod = document.createElement("ul");
        prod.setAttribute("id", "prod");


        const pro = document.createElement("div");//for anything product browsing related
        pro.setAttribute("id", "department");

        //to build product view
        for (let p of product.products) {
            productPage(pro, prod, p);
        }

        const sidebar = document.createElement("div");//this is for the filters
        sidebar.setAttribute("id", "departments");
        const stitle = document.createElement("h2");
        stitle.textContent = "Departments";

        //for name filter
        const nom = document.createElement("h3");
        nom.textContent = "Name";
        const nomn = document.createElement("input");
        nomn.setAttribute("type", "text");
        nomn.setAttribute("id", "name");
        nomn.setAttribute("placeholder", "Search for a product");
        const nbut = document.createElement("button");
        nbut.textContent = "Search";
        nbut.addEventListener("click", () => {
            pro.innerHTML = "";
            for (let p of product.products) {
                const match = p.title.toLowerCase();
                if (match.includes(nomn.value)) {
                    productPage(prod, pro, p);
                }
                //  else{
                //     pro.textContent = "No matches";
                // }
            }
        });

        //nomn.className = "hidden";
        const nomButton = document.createElement("button");
        nomButton.setAttribute("id", "accordion");
        nom.appendChild(nomButton);
        nom.appendChild(nomn);
        nom.appendChild(nbut);

        //for category filter
        const cate = document.createElement("div");
        const ctitle = document.createElement("h3");
        ctitle.textContent = "Category";
        cate.appendChild(ctitle);
        // cate.className = "hidden";
        const list = new Set();
        // const format = 
        for (let p of product.products) {
            list.add(p.category.charAt(0).toUpperCase() + p.category.slice(1));
            //making first letter capital reference: https://medium.com/@python-javascript-php-html-css/javascript-tip-capitalizing-the-first-letter-576251c62144
        }
        const allCats = document.createElement("div");
        for (let l of list) {
            const cat = document.createElement("div");
            const rad = document.createElement("input");
            rad.setAttribute("type", "radio");
            rad.setAttribute("id", l);
            const radLabel = document.createElement("label");
            radLabel.setAttribute("for", l);
            radLabel.textContent = l;
            cat.appendChild(rad);
            cat.appendChild(radLabel);
            cat.addEventListener("click", (e) => {
                for (let p of product.products) {
                    const format = p.category.charAt(0).toUpperCase() + p.category.slice(1)
                    if (format == e.target.id) {
                        productPage(prod, pro, p);
                    }
                }
            });
            allCats.appendChild(cat);
        }
        const cateButton = document.createElement("button");
        cateButton.setAttribute("id", "accordion");
        cate.appendChild(cateButton);
        cate.appendChild(allCats);

        //for rating filter
        const rate = document.createElement("h3");
        rate.textContent = "Rating";
        // rate.className = "hidden";
        const rateButton = document.createElement("button");
        rateButton.setAttribute("id", "accordion");
        const star = document.createElement("div");
        star.setAttribute("id", "star");
        for (let i = 1; i <= 5; i++) {
            const s = document.createElement("button");
            s.setAttribute("id", "star" + i);
            s.value = i;
            s.textContent = i;
            s.addEventListener("click", (e) => {
                pro.innerHTML = "";
                for (let p of product.products) {
                    if (Number(p.rating) >= Number(e.target.value) && Number(p.rating) < Number(e.target.value) + 1) {
                        productPage(prod, pro, p);
                    } else {
                        //pro.textContent = "No matches";
                    }
                }
            });
            star.appendChild(s);
        }
        rate.appendChild(rateButton);
        rate.appendChild(star);

        //for price filter
        const price = document.createElement("h3");
        price.textContent = "Price";
        //  price.className = "hidden";
        const priceButton = document.createElement("button");
        priceButton.setAttribute("id", "accordion");
        price.appendChild(priceButton);

        //to turn all filters into accordions
        const acc = document.querySelectorAll("#accordion");
        for (let a of acc) {
            a.addEventListener("click", (e) => {
                e.target.nextSibling.className = "visible";
            })
        }

        sidebar.appendChild(stitle);
        sidebar.appendChild(nom);
        sidebar.appendChild(cate);
        sidebar.appendChild(rate);
        sidebar.appendChild(price);

        const p = document.createElement("p");
        const b = document.createElement("b");
        b.textContent = "Results ";
        p.appendChild(b);

        const clear = document.createElement("button");
        clear.textContent = "X Clear All"
        clear.addEventListener("click", () => { filter() });//this is to clear filters
        p.appendChild(clear);
        p.style.textAlign = "center";
        const d = document.createElement("div");
        d.appendChild(p);
        d.setAttribute("id", "Clear")
        pro.appendChild(d);
        pro.appendChild(prod);
        maindiv.appendChild(sidebar);
        maindiv.appendChild(pro);
        main.appendChild(maindiv);
    }

    function filter() {

    }

    function productPage(maindiv, prod, pro) {
        let count = 0;
        maindiv.innerHTML = "";
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = pro.title;
        const btn = document.createElement("button");
        btn.addEventListener("click", (e) => { addToCart(e, count) });
        btn.setAttribute("id", pro.id);
        btn.textContent = "+";
        p.appendChild(btn);
        const image = document.createElement("img");
        image.src = pro.thumbnail;
        //image.style.border = "2px black";//check later
        const button = document.createElement("button");
        image.setAttribute("id", pro.id);
        image.dataset.title = pro.title;
        image.dataset.thumbnail = pro.thumbnail;
        image.dataset.price = pro.price;
        button.appendChild(image);
        btn.dataset.title = pro.title;
        btn.dataset.thumbnail = pro.thumbnail;
        btn.dataset.price = pro.price;
        btn.className = "productimg";
        button.addEventListener("click", (e) => { singleProduct(e, "Browse Products/") });
        const price = document.createElement("p");
        price.textContent = "$" + pro.price;
        li.appendChild(button);
        li.appendChild(p);
        li.appendChild(price);
        prod.appendChild(li);
    }



});