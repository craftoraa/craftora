import React, {useMemo, useState} from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingBag, Heart, User, Menu, X, ArrowRight, Star,
  Package, ShieldCheck, Truck, Sparkles, Plus, CheckCircle2,
  Clock3, LayoutDashboard, ChevronDown, LogOut
} from "lucide-react";
import "./styles.css";

const products = [
  {id:1,name:"Handwoven Uzbek Tote",seller:"Nargiza Studio",price:189000,category:"Bags",rating:4.9,image:"https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",location:"Tashkent",tag:"Bestseller"},
  {id:2,name:"Blue Ceramic Tea Set",seller:"Blue Clay",price:265000,category:"Home",rating:4.8,image:"https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=900&q=80",location:"Samarkand",tag:"New"},
  {id:3,name:"Minimal Silver Ring",seller:"Ziyo Jewelry",price:320000,category:"Jewelry",rating:5,image:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",location:"Bukhara",tag:"Handmade"},
  {id:4,name:"Walnut Desk Organizer",seller:"Wood & Form",price:215000,category:"Home",rating:4.7,image:"https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",location:"Tashkent",tag:"Popular"},
  {id:5,name:"Embroidered Silk Scarf",seller:"Atlas House",price:175000,category:"Clothing",rating:4.9,image:"https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=900&q=80",location:"Margilan",tag:"New"},
  {id:6,name:"Handmade Leather Wallet",seller:"Nomad Leather",price:240000,category:"Accessories",rating:4.8,image:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",location:"Tashkent",tag:"Bestseller"},
  {id:7,name:"Artisan Clay Vase",seller:"Samarkand Ceramics",price:145000,category:"Home",rating:4.6,image:"https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",location:"Samarkand",tag:"Handmade"},
  {id:8,name:"Traditional Embroidery",seller:"Meros Atelier",price:390000,category:"Art",rating:4.9,image:"https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=80",location:"Bukhara",tag:"Featured"}
];

const categories = ["All","Bags","Home","Jewelry","Clothing","Accessories","Art"];
const money = n => new Intl.NumberFormat("en-US").format(n) + " UZS";

function getSavedState(){
  try{
    const params=new URLSearchParams(window.location.search);
    const saved=JSON.parse(localStorage.getItem("craftora-state")||"{}");
    const hasMarketplaceFilter=!!(params.get("q") || params.get("category"));
    return {
      page: params.get("page") ?? (hasMarketplaceFilter ? "marketplace" : saved.page ?? "home"),
      query: params.get("q") ?? saved.query ?? "",
      category: params.get("category") ?? saved.category ?? "All"
    };
  }catch{
    return {page:"home",query:"",category:"All"};
  }
}

function saveState(page,query,category){
  try{
    localStorage.setItem("craftora-state",JSON.stringify({page,query,category}));
    const params=new URLSearchParams(window.location.search);
    if(page && page!=="home") params.set("page",page); else params.delete("page");
    if(query) params.set("q",query); else params.delete("q");
    if(category && category!=="All") params.set("category",category); else params.delete("category");
    const next=params.toString();
    window.history.replaceState({}, "", next ? `${window.location.pathname}?${next}` : window.location.pathname);
  }catch{}
}

function saveFilters(query,category){
  try{
    localStorage.setItem("craftora-filters",JSON.stringify({query,category}));
    const params=new URLSearchParams(window.location.search);
    if(query) params.set("q",query); else params.delete("q");
    if(category && category!=="All") params.set("category",category); else params.delete("category");
    const next=params.toString();
    window.history.replaceState({}, "", next ? `${window.location.pathname}?${next}` : window.location.pathname);
  }catch{}
}

function App(){
  const savedState=getSavedState();
  const [page,setPage]=useState(savedState.page);
  const [query,setQuery]=useState(savedState.query);
  const [category,setCategory]=useState(savedState.category);
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("craftora-cart")||"[]")}catch{return []}});
  const [liked,setLiked]=useState(()=>{try{return JSON.parse(localStorage.getItem("craftora-liked")||"[]")}catch{return []}});
  const [selected,setSelected]=useState(null);
  const [menu,setMenu]=useState(false);
  const [seller,setSeller]=useState(false);
  const [toast,setToast]=useState("");
  const [pageKey,setPageKey]=useState(0);

  React.useEffect(()=>saveState(page,query,category),[page,query,category]);
  React.useEffect(()=>localStorage.setItem("craftora-cart",JSON.stringify(cart)),[cart]);
  React.useEffect(()=>localStorage.setItem("craftora-liked",JSON.stringify(liked)),[liked]);

  const filtered=useMemo(()=>products.filter(p =>
    (category==="All" || p.category===category) &&
    (p.name+" "+p.seller+" "+p.category).toLowerCase().includes(query.toLowerCase())
  ),[query,category]);

  const addCart=(p)=>{
    setCart(c=>[...c,p]);
    setToast("Added to cart");
    setTimeout(()=>setToast(""),1800);
  };
  const toggleLike=(id)=>setLiked(l=>l.includes(id)?l.filter(x=>x!==id):[...l,id]);

  const go=(p)=>{
    if(p===page){window.scrollTo({top:0,behavior:"smooth"});return}
    setPageKey(k=>k+1);
    setPage(p);
    saveState(p,query,category);
    setMenu(false);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  return <div className="app">
    <header className="header">
      <div className="nav wrap">
        <button className="brand" onClick={()=>go("home")}><span className="brandMark"><Sparkles size={17}/></span>Craftora</button>
        <nav className={menu?"mobileNav":""}>
          <button onClick={()=>go("marketplace")}>Marketplace</button>
          <button onClick={()=>go("how")}>How it works</button>
          <button onClick={()=>setSeller(true)} className="sellLink">Become a seller</button>
        </nav>
        <div className="navActions">
          <div className="searchMini"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products..."/></div>
          <button className="iconBtn" onClick={()=>go("wishlist")}><Heart size={20}/>{liked.length>0&&<b>{liked.length}</b>}</button>
          <button className="iconBtn" onClick={()=>go("cart")}><ShoppingBag size={20}/>{cart.length>0&&<b>{cart.length}</b>}</button>
          <button className="iconBtn" onClick={()=>go("dashboard")}><User size={20}/></button>
          <button className="menuBtn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
        </div>
      </div>
    </header>

    <div key={`${page}-${pageKey}`} className="routeView">
    {page==="home" && <Home go={go} setCategory={setCategory} saveState={saveState} setSeller={setSeller} products={products} addCart={addCart} liked={liked} toggleLike={toggleLike}/>}
    {page==="marketplace" && <Marketplace filtered={filtered} category={category} setCategory={(c)=>{setCategory(c);saveState("marketplace",query,c)}} query={query} setQuery={(q)=>{setQuery(q);saveState("marketplace",q,category)}} addCart={addCart} liked={liked} toggleLike={toggleLike} setSelected={setSelected}/>}
    {page==="cart" && <Cart cart={cart} setCart={setCart} go={go}/>}
    {page==="wishlist" && <Wishlist products={products.filter(p=>liked.includes(p.id))} addCart={addCart} toggleLike={toggleLike} />}
    {page==="how" && <How/>}
    {page==="dashboard" && <Dashboard go={go}/>}
    {page==="checkout" && <Checkout cart={cart} go={go}/>}
    </div>
    {selected && <ProductModal p={selected} close={()=>setSelected(null)} addCart={addCart}/>}
    {seller && <SellerModal close={()=>setSeller(false)} setToast={setToast}/>}
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    <Footer/>
  </div>
}

function Home({go,setCategory,saveState,setSeller,products,addCart,liked,toggleLike}){
 return <main>
  <section className="hero">
   <div className="heroGlow one"></div><div className="heroGlow two"></div>
   <div className="wrap heroGrid">
    <div>
      <div className="eyebrow"><Sparkles size={15}/> A marketplace for makers</div>
      <h1>Made by people.<br/><em>Delivered to you.</em></h1>
      <p>Discover unique products created by independent makers and local creators. Every item has a story behind it.</p>
      <div className="heroBtns"><button className="primary" onClick={()=>go("marketplace")}>Explore products <ArrowRight size={18}/></button><button className="secondary" onClick={()=>document.querySelector(".sellerCTA")?.scrollIntoView({behavior:"smooth"})}>Start selling</button></div>
      <div className="trust"><span><ShieldCheck size={17}/> Verified creators</span><span><Truck size={17}/> Reliable delivery</span></div>
    </div>
    <div className="heroVisual">
      <div className="heroCard back"><img src={products[1].image}/></div>
      <div className="heroCard main"><img src={products[2].image}/><div className="heroCaption"><div><small>Featured creator</small><strong>Ziyo Jewelry</strong></div><span>5.0 <Star size={14} fill="currentColor"/></span></div></div>
      <div className="floating"><Sparkles size={17}/><span>100% creator-made</span></div>
    </div>
   </div>
  </section>

  <section className="section wrap">
   <div className="sectionHead"><div><span className="eyebrow">Explore</span><h2>Shop by category</h2></div><button className="textBtn" onClick={()=>go("marketplace")}>View all <ArrowRight size={16}/></button></div>
   <div className="catGrid">{categories.slice(1).map((c,i)=><button key={c} className="cat" onClick={()=>{setCategory(c);saveState("marketplace","",c);go("marketplace")}}><div className={"catImg c"+i}></div><strong>{c}</strong><span>{[24,31,18,27,22,16][i]}+ items</span></button>)}</div>
  </section>

  <section className="section soft"><div className="wrap">
   <div className="sectionHead"><div><span className="eyebrow">Curated for you</span><h2>Featured products</h2></div><button className="textBtn" onClick={()=>go("marketplace")}>See marketplace <ArrowRight size={16}/></button></div>
   <div className="productGrid">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p} addCart={addCart} liked={liked} toggleLike={toggleLike}/>)}</div>
  </div></section>

  <section className="howPreview wrap">
    <div className="sectionHead"><div><span className="eyebrow">Simple by design</span><h2>How Craftora works</h2></div></div>
    <div className="steps">{[["01","Create","Make something worth sharing."],["02","Submit","Send your product for review."],["03","Get approved","Our team checks every listing."],["04","We deliver","Sell while we handle delivery."]].map(x=><div className="step" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div>
  </section>

  <section className="sellerCTA"><div className="wrap sellerGrid"><div><span className="eyebrow">For creators</span><h2>Turn what you create<br/>into a real business.</h2><p>Join a growing community of independent makers. Submit your products, get approved, and reach customers without building your own store.</p><button className="primary" onClick={()=>setSeller(true)}>Become a seller <ArrowRight size={18}/></button></div><div className="sellerArt"><div><Package size={35}/><strong>Creator-first</strong><span>Built around your work.</span></div></div></div></section>
 </main>
}

function ProductCard({p,addCart,liked,toggleLike}){
 return <article className="productCard">
  <div className="productImg"><img src={p.image}/><span className="tag">{p.tag}</span><button className={"heart "+(liked.includes(p.id)?"liked":"")} onClick={()=>toggleLike(p.id)}><Heart size={18} fill={liked.includes(p.id)?"currentColor":"none"}/></button></div>
  <div className="productInfo"><div className="sellerName">{p.seller} · {p.location}</div><h3>{p.name}</h3><div className="rating"><Star size={14} fill="currentColor"/>{p.rating}</div><div className="productBottom"><strong>{money(p.price)}</strong><button onClick={(e)=>{e.stopPropagation();addCart(p)}}>Add <Plus size={15}/></button></div></div>
 </article>
}

function Marketplace({filtered,category,setCategory,query,setQuery,addCart,liked,toggleLike,setSelected}){
 return <main className="wrap pagePad"><div className="pageTitle"><div><span className="eyebrow">Discover</span><h1>Marketplace</h1><p>Products made by independent creators.</p></div><div className="resultCount">{filtered.length} products <span className="savedFilter"><CheckCircle2 size={12}/> filters saved</span></div></div>
 <div className="marketTools">
   <div className="marketSearch"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search creators, products, categories..."/>{query&&<button onClick={()=>setQuery("")}><X size={15}/></button>}</div>
   <div className="filters">{categories.map(c=><button className={category===c?"active":""} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div>
 </div>
 <div className="productGrid marketplaceGrid">{filtered.map(p=><div key={p.id} onClick={()=>setSelected(p)}><ProductCard p={p} addCart={(x)=>{event?.stopPropagation?.();addCart(x)}} liked={liked} toggleLike={toggleLike}/></div>)}</div>
 {filtered.length===0&&<div className="empty"><Search size={30}/><h3>No products found</h3><p>Try a different search or category.</p></div>}
 </main>
}

function Cart({cart,setCart,go}){
 const total=cart.reduce((a,p)=>a+p.price,0), delivery=cart.length?25000:0;
 return <main className="wrap pagePad"><div className="pageTitle"><div><span className="eyebrow">Your selection</span><h1>Shopping cart</h1></div></div>
 {cart.length===0?<div className="empty"><ShoppingBag size={34}/><h3>Your cart is empty</h3><p>Add something made by a creator.</p><button className="primary" onClick={()=>go("marketplace")}>Explore products</button></div>:
 <div className="cartLayout"><div className="cartItems">{cart.map((p,i)=><div className="cartItem" key={i}><img src={p.image}/><div className="cartItemInfo"><small>{p.seller}</small><h3>{p.name}</h3><strong>{money(p.price)}</strong></div><button className="remove" onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))}><X size={18}/></button></div>)}</div>
 <aside className="summary"><h3>Order summary</h3><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Delivery</span><strong>{money(delivery)}</strong></div><hr/><div className="grand"><span>Total</span><strong>{money(total+delivery)}</strong></div><button className="primary wide" onClick={()=>go("dashboard")}>Continue to checkout <ArrowRight size={17}/></button><p className="secure"><ShieldCheck size={15}/> Secure checkout</p></aside></div>}
 </main>
}

function Checkout({cart,go}){
 const [done,setDone]=useState(false);
 const total=cart.reduce((a,p)=>a+p.price,0), delivery=cart.length?25000:0;
 if(done) return <main className="wrap pagePad"><div className="empty successCheckout"><CheckCircle2 size={48}/><h1>Order placed</h1><p>Your demo order has been created successfully. In the production version, payment and delivery tracking will be connected here.</p><button className="primary" onClick={()=>go("home")}>Back to home</button></div></main>;
 return <main className="wrap pagePad"><div className="pageTitle"><div><span className="eyebrow">Secure checkout</span><h1>Complete your order</h1></div></div>
 <div className="checkoutLayout"><div className="checkoutForm">
   <section><h3>Delivery address</h3><div className="formGrid"><input placeholder="Full name"/><input placeholder="Phone number"/><input placeholder="Region"/><input placeholder="District"/><input className="full" placeholder="Street and house"/><textarea className="full" placeholder="Additional delivery information"></textarea></div></section>
   <section><h3>Payment</h3><div className="paymentOptions"><button className="payment active"><strong>Card</strong><span>Visa / Mastercard</span></button><button className="payment"><strong>Click / Payme</strong><span>Uzbekistan payments</span></button></div></section>
 </div><aside className="summary"><h3>Order summary</h3>{cart.map((p,i)=><div key={i}><span>{p.name}</span><strong>{money(p.price)}</strong></div>)}<hr/><div><span>Delivery</span><strong>{money(delivery)}</strong></div><div className="grand"><span>Total</span><strong>{money(total+delivery)}</strong></div><button className="primary wide" onClick={()=>setDone(true)}>Place demo order <ArrowRight size={17}/></button></aside></div></main>
}

function Wishlist({products,addCart,toggleLike}){return <main className="wrap pagePad"><div className="pageTitle"><div><span className="eyebrow">Saved</span><h1>Wishlist</h1></div></div>{products.length?<div className="productGrid">{products.map(p=><ProductCard key={p.id} p={p} addCart={addCart} liked={products.map(x=>x.id)} toggleLike={toggleLike}/>)}</div>:<div className="empty"><Heart size={34}/><h3>Your wishlist is empty</h3><p>Save products you love and find them here.</p></div>}</main>}

function How(){return <main className="wrap pagePad"><div className="centerTitle"><span className="eyebrow">The process</span><h1>Simple for everyone.</h1><p>We connect creators with customers and make the journey from idea to doorstep easier.</p></div><div className="howLarge">{[["01","Create","Make or source something you are proud of."],["02","Submit","Add photos, pricing and details to your listing."],["03","Get approved","Our moderation team reviews quality and safety."],["04","Sell","Your approved product goes live on Craftora."],["05","We deliver","We coordinate pickup and delivery to your customer."],["06","Get paid","After successful delivery, your balance is released."]].map(x=><div className="howBox" key={x[0]}><span>{x[0]}</span><h2>{x[1]}</h2><p>{x[2]}</p></div>)}</div></main>}

function Dashboard({go}){return <main className="wrap pagePad"><div className="dashTop"><div><span className="eyebrow">Creator dashboard</span><h1>Welcome back, Alex.</h1></div><button className="primary" onClick={()=>go("marketplace")}><ShoppingBag size={17}/> View marketplace</button></div><div className="stats">{[["Sales","1,240,000 UZS","↑ 18%"],["Orders","24","↑ 12%"],["Products","8","2 pending"],["Balance","780,000 UZS","Available"]].map(s=><div className="stat" key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong><small>{s[2]}</small></div>)}</div><div className="dashboardGrid"><div className="panel"><div className="panelHead"><h3>Product submissions</h3><button className="textBtn">View all</button></div>{[["Hand-painted Vase","Pending review","pending"],["Walnut Lamp","Approved","approved"],["Canvas Landscape","Changes requested","changes"]].map(x=><div className="submission" key={x[0]}><div className="subIcon"><Package size={18}/></div><div><strong>{x[0]}</strong><span>Submitted Aug 8, 2026</span></div><em className={x[2]}>{x[1]}</em></div>)}</div><div className="panel"><div className="panelHead"><h3>Quick actions</h3></div><button className="quick"><Plus size={18}/><div><strong>Add a product</strong><span>Submit something you created</span></div><ArrowRight size={16}/></button><button className="quick"><Truck size={18}/><div><strong>Track orders</strong><span>See active deliveries</span></div><ArrowRight size={16}/></button><button className="quick"><LayoutDashboard size={18}/><div><strong>View analytics</strong><span>Understand your sales</span></div><ArrowRight size={16}/></button></div></div></main>}

function ProductModal({p,close,addCart}){return <div className="overlay" onClick={close}><div className="modal productModal" onClick={e=>e.stopPropagation()}><button className="modalClose" onClick={close}><X/></button><img src={p.image}/><div className="modalBody"><span className="eyebrow">{p.category} · {p.location}</span><h2>{p.name}</h2><p className="sellerName">{p.seller}</p><div className="modalRating"><Star size={16} fill="currentColor"/>{p.rating} · 18 reviews</div><h3 className="modalPrice">{money(p.price)}</h3><p>Designed and crafted by an independent creator. Every piece is checked before it appears on the marketplace.</p><div className="deliveryNote"><Truck size={19}/><div><strong>Estimated delivery</strong><span>2–4 business days</span></div></div><button className="primary wide" onClick={()=>{addCart(p);close()}}>Add to cart <ShoppingBag size={17}/></button></div></div></div>}

function SellerModal({close,setToast}){const [submitted,setSubmitted]=useState(false);return <div className="overlay"><div className="modal sellerModal"><button className="modalClose" onClick={close}><X/></button>{submitted?<div className="success"><CheckCircle2 size={48}/><h2>Application submitted</h2><p>Our team will review your creator application. This demo does not send real data yet.</p><button className="primary" onClick={close}>Done</button></div>:<><span className="eyebrow">Creator application</span><h2>Start selling on Craftora.</h2><p className="muted">Tell us about what you make. In the full version, approved creators can submit products for moderation.</p><label>Your name<input placeholder="Alex Karimov"/></label><label>What do you create?<textarea placeholder="Handmade ceramics, clothing, jewelry..."></textarea></label><label>Instagram / portfolio<input placeholder="@yourhandle"/></label><button className="primary wide" onClick={()=>setSubmitted(true)}>Submit application <ArrowRight size={17}/></button></>}</div></div>}

function Footer(){return <footer><div className="wrap footerGrid"><div><button className="brand"><span className="brandMark"><Sparkles size={17}/></span>Craftora</button><p>A marketplace for things made with intention.</p></div><div><strong>Explore</strong><a>Marketplace</a><a>Categories</a><a>How it works</a></div><div><strong>For creators</strong><a>Become a seller</a><a>Creator guide</a><a>Delivery</a></div><div><strong>Support</strong><a>Help center</a><a>Contact</a><a>Privacy</a></div></div><div className="wrap copyright">© 2026 Craftora. Built for independent creators.</div></footer>}

createRoot(document.getElementById("root")).render(<App/>);
