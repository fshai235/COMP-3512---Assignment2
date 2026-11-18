document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("#mainView");
    const pageHeading = document.querySelector("main h2");
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
            //Home View
            //if featuring products, link it to respective single product view
            const home = document.querySelector("#HOME");
            home.addEventListener("click", homeView)
            function homeView(e) {
                main.innerHTML = "";
                pageHeading.textContent = "Home";

                const featured = document.createElement("div");
                for (let pro of product.products) {
                    if (Number(pro.rating) >= 4) {
                        const fea = document.createElement("img");
                    }
                    main.appendChild(featured);
                    //main.appendChild(document.createElement("h3").textContent="Featured Products!");
                }
            }

            //Browse View
            //this is for product list
            const browse = document.querySelector("#BROWSE");
            browse.addEventListener("click", browseView)

            function browseView() {//work on filters, why is this so long
                main.innerHTML = "";
                pageHeading.textContent = "Browse Products";
                const maindiv = document.createElement("div");
                maindiv.setAttribute("id", "forBrowse");
                const prod = document.createElement("ul");
                prod.setAttribute("id", "prod");

                const sidebar = document.createElement("div");//this is for the filter/ratings??
                sidebar.setAttribute("id", "departments");
                sidebar.style.backgroundColor = " rgba(208, 204, 213, 0.223)";
                const stitle = document.createElement("h2");
                stitle.textContent = "Departments";

                const nom = document.createElement("h3");
                nom.textContent = "Name";
                const nomn = document.createElement("input");
                nomn.setAttribute("type", "text");
                nomn.setAttribute("id", "name");
                //nomn.className = "hidden";
                const nomButton = document.createElement("button");
                nomButton.setAttribute("id", "accordion");
                nom.appendChild(nomButton);
                nom.appendChild(nomn);

                const cate = document.createElement("div");
                const ctitle = document.createElement("h3");
                ctitle.textContent = "Category";
                cate.appendChild(ctitle);
                // cate.className = "hidden";
                const list = new Set();
                for (let p of product.products) {
                    list.add(p.category.charAt(0).toUpperCase() + p.category.slice(1));
                    //making first letter capital reference: https://medium.com/@python-javascript-php-html-css/javascript-tip-capitalizing-the-first-letter-576251c62144
                }
                const allCats = document.createElement("div");
                for (let l of list) {
                    const cat = document.createElement("div");
                    const rad = document.createElement("input");
                    rad.setAttribute("type", "radio");
                    rad.setAttribute("id", "cate-" + l);
                    const radLabel = document.createElement("label");
                    radLabel.setAttribute("for", "cate-" + l);
                    radLabel.textContent = l;
                    radLabel.style
                    cat.appendChild(rad);
                    cat.appendChild(radLabel);
                    cat.addEventListener("click", ()=>{});
                    allCats.appendChild(cat);
                }
                const cateButton = document.createElement("button");
                cateButton.setAttribute("id", "accordion");
                cate.appendChild(cateButton);
                cate.appendChild(allCats);

                const rate = document.createElement("h3");
                rate.textContent = "Rating";
                // rate.className = "hidden";
                const rateButton = document.createElement("button");
                rateButton.setAttribute("id", "accordion");
                const star = document.createElement("div");
                star.setAttribute("id", "star");
                for (let i = 1; i <= 5; i++) {
                    // const but = document.createElement("button");
                    // but.addEventListener("click", ()=>{});
                    // const 

                    //  const r = document.createElement("option");
                    //  r.value = i;

                    //  s.appendChild(r);
                    const s = document.createElement("button");
                    s.setAttribute("id", "star" + i);
                    s.textContent = i;
                    s.addEventListener("click", (e) => {
                        for (let p of product.products) {
                            if (Number(p.rating) >= e.target.id) {
                                //productPage(maindiv, prod, p);
                                console.log(p + " found a match");
                            }
                        }
                    });
                    star.appendChild(s);
                }
                rate.appendChild(rateButton);
                rate.appendChild(star);

                const price = document.createElement("h3");
                price.textContent = "Price";
                //  price.className = "hidden";
                const priceButton = document.createElement("button");
                priceButton.setAttribute("id", "accordion");
                price.appendChild(priceButton);

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
                clear.addEventListener("click", () => { });//this is to clear filters
                p.appendChild(clear);
                p.style.textAlign = "center";
                const d = document.createElement("div");

                const pro = document.createElement("div");//for anything product browsing related

                d.appendChild(p);
                d.setAttribute("id", "Clear")
                for (let pro of product.products) {
                    productPage(maindiv, prod, pro);
                }
                pro.appendChild(d);
                pro.appendChild(prod);
                maindiv.appendChild(sidebar);
                maindiv.appendChild(pro);
                main.appendChild(maindiv);
            }

            function productPage(maindiv, prod, pro) {
                maindiv.innerHTML = "";
                const li = document.createElement("li");
                const p = document.createElement("p");
                p.textContent = pro.title;
                const btn = document.createElement("button");
                btn.addEventListener("click", () => { alert("Product ID: " + pro.id + "\nProduct Title: " + pro.title) });
                btn.setAttribute("id", "productimg");
                btn.textContent = "+";
                p.appendChild(btn);
                const image = document.createElement("img");
                image.src = pro.thumbnail;
                image.style.border = "2px black";//check later
                const button = document.createElement("button");
                button.appendChild(image);
                button.addEventListener("click", () => { alert("Product ID: " + pro.id) });//this event handler action needs to change to redirect to single prouduct view
                const price = document.createElement("p");
                price.textContent = "$" + pro.price;
                li.appendChild(button);
                li.appendChild(p);
                li.appendChild(price);
                prod.appendChild(li);
            }
        })
        .catch(err => { });//do something for error catching


    //Single Product View
    //This is for a single product: https://dummyjson.com/products/# just replace '#' with the product id
    function singleProduct(e) {
        main.innerHTML = "";
        pageHeading.textContent = "";
    }

    //Shopping Cart View
    //use localStorage to implement cart persistence (lab10)
    const cart = document.querySelector("#CART");
    cart.addEventListener("click", cartView)
    function cartView(e) {
        main.innerHTML = "";
        pageHeading.textContent = "Shopping Cart";
    }
    //About Us Dialog/Pop up (where does this go???)
});