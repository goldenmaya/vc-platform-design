
// トップページswiper
if (document.querySelector('.top-swiper') !== null) {
  const topSwiper = new Swiper('.top-swiper', {
    autoplay: {
      delay: 3000,
      disableOnInteraction: false, //ユーザー操作後もオートプレイ続行
    },
    loop: true,
    speed: 700,
    slidesPerView: 1,
    centeredSlides: true,
    grabCursor: true,
  });
}
