document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("#mainView");
    const pageHeading = document.querySelector("main h2");
    const shoppingCart = [];

    const clic = document.querySelector("#cartCount");
    let amount = 0;
    const cartLocal = retrieveStorage();
    for (let p of cartLocal) {
        amount += Number(p.quantity);
    }
    clic.textContent = amount;

    function cartItem(id, name, price, quantity, thumbnail, description) {//constructor function
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.thumbnail = thumbnail;
        this.description = description;
    }

    function updateStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    }

    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('shoppingCart')) || [];
    }

    function removeStorage() {
        localStorage.removeItem('shoppingCart');
    }

    function addToCart(e, count) {
        //count += 1;//figure out different way to implement count
        const newItem = new cartItem(e.target.id, e.target.dataset.title, e.target.dataset.price, count, e.target.dataset.thumbnail, e.target.dataset.description);
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
        console.log(e.target.dataset.quantity)
        if (e.target.dataset.quantity > 1) {
            //e.target.dataset.quantity -= 1;
            updateStorage()
            cartView()
        } else {
            for (let i = 0; i < shoppingCart.length; i++) {
                if (shoppingCart[i].id == id) {
                    shoppingCart.splice(i, 1);
                }
            }
            // e.target.dataset.quantity = 0;
            updateStorage();
            cartView();
        }

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
        th3.textContent = "Price";
        const th5 = document.createElement("th");
        th4.textContent = "Quantity";
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
            //console.log(localCart);
            const tr = document.createElement("tr");
            const deleteItem = document.createElement("td");
            const del = document.createElement("button");
            del.textContent = "Remove Item";
            del.dataset.id = c.id;
            del.dataset.quantity = c.quantity;
            del.addEventListener("click", delItem);
            deleteItem.appendChild(del);
            const item = document.createElement("td");
            const p = document.createElement("p");
            p.textContent = c.name;
            p.style.textAlign = "center";
            const img = document.createElement("img");
            img.src = c.thumbnail;
            item.appendChild(p);
            item.appendChild(img);
            // item.textContent = c.name;

            const pris = document.createElement("td");
            pris.textContent = "$" + c.price;
            const quanti = document.createElement("td");
            quanti.textContent = c.quantity;
            quanti.style.textAlign = "center";
            const subtotal = document.createElement("td");
            subtotal.textContent = "$" + Number(c.price * c.quantity);

            tr.appendChild(deleteItem);
            tr.appendChild(item);
            tr.appendChild(pris);
            tr.appendChild(quanti);
            tr.appendChild(subtotal);
            itable.appendChild(tr);
        }
        // main.appendChild(itable);
        const cart = document.createElement("div");
        const delAll = document.createElement("button");
        delAll.textContent = "Remove all Items";
        delAll.setAttribute("id", "delAll");//test later
        delAll.addEventListener("click", () => {
            removeStorage();
            clic.textContent = "0";
            cartView();
        })
        cart.appendChild(itable);
        cart.appendChild(delAll);
       

        const shipSumm = document.createElement("div");
        shipSumm.setAttribute("id", "shipSumm");
        const ship = document.createElement("div");
        const innership = document.createElement("div");
        const tsh = document.createElement("h4");
        tsh.textContent = "Shipping";

        innership.appendChild(tsh);

       
        const shipsel = document.createElement("select");
        const stan = document.createElement("option");
        stan.textContent = "Standard";
        const exp = document.createElement("option");
        exp.textContent = "Express";
        const prio = document.createElement("option");
        prio.textContent = "Priority";
        shipsel.appendChild(stan);
        shipsel.appendChild(exp);
        shipsel.appendChild(prio);

         const consel = document.createElement("select");
        const can = document.createElement("option");
        can.textContent = "Canada";
        const US = document.createElement("option");
        US.textContent = "United States";
        const inter = document.createElement("option");
        inter.textContent = "International";
        consel.appendChild(can);
        consel.appendChild(US);
        consel.appendChild(inter);

        ship.appendChild(innership);
        ship.appendChild(shipsel);
        ship.appendChild(consel);

 cart.appendChild(shipSumm)
        main.appendChild(cart);

 const summ = document.createElement("div");
 const stitle = document.createElement("h4");
 stitle.textContent = "Summary";
 const sumTot = document.createElement("div");
 sumTot.style.border = "2px solid black";
 //look at restaurant lab for this
 summ.appendChild(stitle);
 summ.appendChild(sumTot);
 

        shipSumm.appendChild(ship);

        const summary = document.createElement("div");
        summary.style.border = "2px solid black";

        const checkoutButton = document.createElement("button");
        checkoutButton.setAttribute("id", "checkoutButton");
        checkoutButton.textContent = "Checkout";
        checkoutButton.addEventListener("click", () => { toasterMessage("Purchase complete. Thank you for shopping!") })

        //summary.appendChild(shipSumm);
        summary.appendChild(summ);
        summary.appendChild(checkoutButton);
        main.appendChild(summary);
    };

    //Single Product View
    function singleProduct(e, path) {
        let count = 0;
        main.innerHTML = "";
        pageHeading.textContent = path + "" + e.target.dataset.title;
        const prod = document.createElement("div");
        prod.setAttribute("id", "singleProduct")
        const prodImg = document.createElement("img");
        prodImg.src = e.target.dataset.thumbnail;
        const prodInfo = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = e.target.dataset.title;
        const h5 = document.createElement("h5");
        h5.textContent = "$" + e.target.dataset.price;
        const stock = document.createElement("h5");
        stock.textContent = e.target.dataset.stock + " in stock";
        const desc = document.createElement("p")
        desc.textContent = e.target.dataset.description;

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
        const quan = document.createElement("input");
        quan.setAttribute("type", "text");
        quan.setAttribute("placeholder", "Enter Quantity");

        const add = document.createElement("button");
        add.setAttribute("id", "ADD");
        add.textContent = "Add to Cart";
        //count += 1;

        prodInfo.appendChild(tags);
        prodInfo.appendChild(h3);
        prodInfo.appendChild(h5);
        prodInfo.appendChild(stock);
        prodInfo.appendChild(desc);
        prodInfo.appendChild(quan);
        prodInfo.appendChild(add);


        prod.appendChild(prodImg);
        prod.appendChild(prodInfo);
        //prod.appendChild(add);
        main.appendChild(prod);
        count = quan.value;
        add.addEventListener("click", () => { addToCart(e, quan.value) });
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
        const nwrapper = document.createElement("div");
        const nomn = document.createElement("input");
        nomn.setAttribute("type", "text");
        nomn.setAttribute("id", "name");
        nomn.setAttribute("placeholder", "Search for a product");
        const nomButton = document.createElement("input");
        nomButton.setAttribute("id", "accordion");
        nomButton.setAttribute("type", "checkbox");
        nom.appendChild(nomButton);
        nwrapper.appendChild(nomn);
        nom.appendChild(nwrapper);
        // nom.appendChild(nbut);
        nwrapper.className = "hidden";

        //for category filter
        const cate = document.createElement("div");
        const ctitle = document.createElement("h3");
        ctitle.textContent = "Category";
        cate.appendChild(ctitle);

        const list = new Set();
        for (let p of product.products) {
            list.add(p.category.charAt(0).toUpperCase() + p.category.slice(1));
            //making first letter capital reference: https://medium.com/@python-javascript-php-html-css/javascript-tip-capitalizing-the-first-letter-576251c62144
        }
        const allCats = document.createElement("div");
        allCats.className = "hidden";
        let cselect;//for filter
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
                cselect = e.target.id;
            });
            allCats.appendChild(cat);
        }
        const cateButton = document.createElement("input");
        cateButton.setAttribute("id", "accordion");
        cateButton.setAttribute("type", "checkbox");
        ctitle.appendChild(cateButton);
        ctitle.appendChild(allCats)

        //for rating filter
        const rate = document.createElement("h3");
        rate.textContent = "Rating";

        const rateButton = document.createElement("input");
        rateButton.setAttribute("id", "accordion");
        rateButton.setAttribute("type", "checkbox")
        const star = document.createElement("div");
        star.setAttribute("id", "star");
        star.className = "hidden";
        let r;//for filter
        for (let i = 1; i <= 5; i++) {
            const s = document.createElement("button");
            s.setAttribute("id", "star" + i);
            s.value = i;
            s.textContent = i;
            s.addEventListener("click", () => {
                r = s.value;
            });
            star.appendChild(s);
        }
        rate.appendChild(rateButton);
        rate.appendChild(star);

        //for price filter
        const price = document.createElement("h3");
        price.textContent = "Price";
        const pricerange = document.createElement("div");
        const min = document.createElement("input");
        min.setAttribute("type", "text");
        min.setAttribute("placeholder", "Minimum Price")
        const max = document.createElement("input");
        max.setAttribute("type", "text");
        max.setAttribute("placeholder", "Maximum Price")
        pricerange.appendChild(min);
        pricerange.appendChild(max);
        pricerange.className = "hidden";
        const priceButton = document.createElement("input");
        priceButton.setAttribute("id", "accordion");
        priceButton.setAttribute("type", "checkbox")
        price.appendChild(priceButton);
        price.appendChild(pricerange);


        const filterButton = document.createElement("button");
        filterButton.textContent = "Apply Filters";


        sidebar.appendChild(stitle);
        sidebar.appendChild(nom);
        sidebar.appendChild(cate);
        sidebar.appendChild(rate);
        sidebar.appendChild(price);
        sidebar.appendChild(filterButton);

        const p = document.createElement("p");
        const b = document.createElement("b");
        b.textContent = "Results ";
        p.appendChild(b);

        const clear = document.createElement("button");
        clear.textContent = "X Clear All"
        clear.addEventListener("click", () => {
            // for (let p of product.products) {
            //     productPage(pro, prod, p);
            // }
        });//this is to clear filters
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

        //to turn all filters into accordions
        const acc = document.querySelectorAll("#accordion");
        acc.forEach((a) => {

            a.addEventListener("click", () => {
                if (a.checked) {
                    a.nextElementSibling.className = "visible";
                } else {
                    a.nextElementSibling.className = "hidden";
                }
            });

        });

        //this is to set filters
        const li = prod.childNodes
        filterButton.addEventListener("click", () => {
            console.log(min.value + " " + max.value);
            filter(li, nomn.value, cselect, r, min.value, max.value)
        })

    }

    function filter(productlist, namef, cate, rating, minPrice, maxPrice) {
        productlist.forEach((i) => {
            i.className = "hidden";
            const match = i.dataset.title.toLowerCase();
            const rate = i.dataset.rating;
            const price = i.dataset.price;
            const category = i.dataset.category.charAt(0).toUpperCase() + i.dataset.category.slice(1);
            //p.category.charAt(0).toUpperCase() + p.category.slice(1)
            if (namef != "" && match.includes(namef)) {
                console.log("Match")
                i.className = "visible";
            }
            if (cate == category) {
                console.log(cate + " matches " + category);
                i.className = "visible";
            }
            if (Number(rate) >= Number(rating) && Number(rate) < Number(rating) + 1) {
                console.log(rate + " is around " + rating);
                i.className = "visible";
            }
            if (Number(price) >= Number(minPrice) && Number(price) <= Number(maxPrice)) {
                console.log(price + " is in range");
                i.className = "visible";
            }
            // if(namef != "" && match.includes(namef) && cate == category ){
            //     i.className = "visible";
            // }
            //how to do it so it works even if one filter wasnt set??
        })
    }

    function productPage(maindiv, prod, pro) {
        let count = 0;
        maindiv.innerHTML = "";
        const li = document.createElement("li");
        li.dataset.title = pro.title;
        li.dataset.price = pro.price;
        li.dataset.rating = pro.rating;
        li.dataset.category = pro.category;
        const p = document.createElement("p");
        p.textContent = pro.title;
        const btn = document.createElement("button");
        btn.setAttribute("id", pro.id);
        btn.dataset.title = pro.title;
        btn.dataset.thumbnail = pro.thumbnail;
        btn.dataset.price = pro.price;
        btn.dataset.description = pro.description;
        btn.className = "productimg";
        btn.textContent = "+";
        btn.addEventListener("click", (e) => { count++; addToCart(e, count) });
        p.appendChild(btn);
        const image = document.createElement("img");
        image.src = pro.thumbnail;
        const button = document.createElement("button");
        image.setAttribute("id", pro.id);
        image.dataset.title = pro.title;
        image.dataset.thumbnail = pro.thumbnail;
        image.dataset.price = pro.price;
        image.dataset.description = pro.description;
        image.dataset.stock = pro.stock;
        button.appendChild(image);
        button.addEventListener("click", (e) => { singleProduct(e, "Browse Products/") });
        const price = document.createElement("p");
        price.textContent = "$" + pro.price;
        li.appendChild(button);
        li.appendChild(p);
        li.appendChild(price);
        prod.appendChild(li);
    }



});