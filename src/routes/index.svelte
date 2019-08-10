<style>
  nav {
    height: 3rem;
    padding: 16px 0;
  }

  nav>a {
    color: white;
    font-size: 20px;
  }

  nav>a:not(:first-child) {
    padding-left: 24px;
  }

  .lander {
    width: 100%;
    min-height: 20rem;
    color: white;
  }

  /*
  .footer {
    width: 100%;
    background-color: cornflowerblue;
    color: white;
    margin-top: 2rem;
    height: 4rem;
  }
  */

  .btn-google {
    margin: 16px 0;
  }
@media (min-width: 576) {
}

@media (min-width: 1024px) {
  h1 {
    max-width: 50%;
    margin-top: 2rem;
  }
}
</style>

<svelte:head>
  <title>Lapelio</title>
</svelte:head>

<script>
</script>

<div class="lander bg-dark">
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <nav>
          <a href=".">Lapelio</a>
          <a href="docs">Dokumentasi</a>
        </nav>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <h1>GAK PUNYA WAKTU UNTUK NGE-TEST API KAMU?</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div>
          Setup test case mu dengan Lapelio<br>
          dan jalankan testnya kapan aja, dimana aja
        </div><br>
        <a href="{process.env.CRED_HOST}/oauth/google/login" class="btn btn-danger btn-google">Sign In Pake Google</a>
      </div>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>Continuous Testing</h1>
      <span>
        Gak ada lagi alasan gak sempet nge-test<br>
        Cukup masuk ke Lapelio dan jalankan skenario test kapan saja<br>
        Sebelum, ataupun sesudah development
      </span>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <h1>Test On Cloud</h1>
      <span>
        Gak ada lagi alasan gak ngerti cara nge-test nya<br>
        Atau gak tau test datanya apa<br>
        Semua test case di simpan di cloud dan dapat diakses, kapan saja, dimana saja
      </span>
    </div>
  </div>
</div>