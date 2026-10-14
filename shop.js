import { arProductUrl } from './config.js';
const escape = text => String(text).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const page = document.body.dataset.page;
const container = document.querySelector(page === 'list' ? '#products' : '#product');
try {
  const response = await fetch('products.json');
  if (!response.ok) throw new Error('products unavailable');
  const products = await response.json();
  if (page === 'list') {
    container.innerHTML = products.map(p => `<article class="product-card" id="item-${p.id}">
      <a class="product-photo" href="product.html?item=${p.id}"><img src="${p.image}" alt="${escape(p.name)}" loading="lazy"><span class="rank">${p.rank}</span></a>
      <h2><a href="product.html?item=${p.id}">${escape(p.name)}</a></h2>
      <p class="price">${escape(p.price)}<small>（税込み）</small></p>
      <a class="ar-link" aria-label="${escape(p.name)}をARで確認する" href="${arProductUrl(p.id, 'list')}">ARで確認する <span aria-hidden="true">→</span></a>
    </article>`).join('');
    if (location.hash) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
  } else {
    const p = products.find(p => p.id === new URLSearchParams(location.search).get('item'));
    if (!p) throw new Error('unknown product');
    document.title = `${p.name}｜深廣`;
    container.innerHTML = `<nav class="breadcrumb" aria-label="パンくず"><a href="index.html#item-${p.id}">商品一覧</a> <span>›</span> ${escape(p.name)}</nav>
    <a class="detail-ar ar-link" href="${arProductUrl(p.id, 'detail')}">ARで確認する <span aria-hidden="true">→</span></a>
    <img class="detail-photo" src="${p.image}" alt="${escape(p.name)}">
    <h1 class="detail-title">${escape(p.name)}</h1><p class="detail-price">${escape(p.price)} <small>（税込み）</small></p>
    <a class="purchase-link" href="${escape(p.shopUrl)}">通販で購入する <span aria-hidden="true">↗</span></a>
    <a class="outline-link" href="index.html#item-${p.id}">← 商品一覧に戻る</a>`;
  }
} catch(error) {
  container.innerHTML = '<p role="alert">商品情報を表示できませんでした。</p><a class="outline-link" href="index.html">商品一覧へ戻る</a>';
}
const menuToggle=document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click',()=>{const expanded=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!expanded));document.querySelector('#shop-menu').hidden=expanded;});
