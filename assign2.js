document.addEventListener("DOMContentLoaded", () => {
    //Home View
    //if featuring products, link it to respective single product view


    //Browse View
    //this is for product list
    const url = "https://dummyjson.com/products?limit=100";
    fetch(url)
        .then(result => result.json())
        .then(product => {
            const pageHeading = document.querySelector("main h2");
            const main = document.querySelector("#mainView");
            pageHeading.textContent = "Browse Products";
            const maindiv = document.createElement("div");
            maindiv.setAttribute("id", "forBrowse");
            const prod = document.createElement("ul");
            prod.setAttribute("id", "prod");

            const sidebar = document.createElement("div");//this is for the filter/ratings??
            const stitle = document.createElement("h2");
            stitle.textContent = "Departments";
            const nom = document.createElement("h3");
            nom.textContent = "Name";

            const cate = document.createElement("h3");
            cate.textContent = "Category";

            const rate = document.createElement("h3");
            rate.textContent = "Rating";

            const price = document.createElement("h3");
            price.textContent = "Price";

            sidebar.appendChild(stitle);
            sidebar.appendChild(nom);
            sidebar.appendChild(cate);
            sidebar.appendChild(rate);
            sidebar.appendChild(price);
        
            const p = document.createElement("p");
            p.textContent = "Results";
            p.style = "bold";
            const clear = document.createElement("button");
            clear.textContent = "X Clear All"
            clear.addEventListener("click", ()=>{});//this is to clear filters
            const d = document.createElement("div");
            
            d.appendChild(p);
            d.appendChild(clear);
            prod.appendChild(d);
            for (let pro of product.products) {
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
            maindiv.appendChild(sidebar);
            maindiv.appendChild(prod);
            main.appendChild(maindiv);

        })

    //Single Product View
    //This is for a single product: https://dummyjson.com/products/# just replace '#' with the product id

    //Shopping Cart View
    //use localStorage to implement cart persistence (lab10)

    //About Us Dialog/Pop up (where does this go???)
});