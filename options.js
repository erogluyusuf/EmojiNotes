

document.getElementById('font-select').addEventListener('change', function() {
    document.getElementById('z').style.fontFamily = this.value;
  });

  document.getElementById('font-size').addEventListener('input', function() {
    document.getElementById('z').style.fontSize = this.value + 'px';
  });

  document.getElementById('text-color').addEventListener('input', function() {
    document.getElementById('z').style.color = this.value;
  });

  document.getElementById('font-weight').addEventListener('change', function() {
    document.getElementById('z').style.fontWeight = this.value;
  });

  document.getElementById('font-style').addEventListener('change', function() {
    document.getElementById('z').style.fontStyle = this.value;
  });

  document.getElementById('line-height').addEventListener('input', function() {
    document.getElementById('z').style.lineHeight = this.value;
  });

  document.getElementById('text-shadow-color').addEventListener('input', function() {
    var x = document.getElementById('text-shadow-x').value;
    var y = document.getElementById('text-shadow-y').value;
    var blur = document.getElementById('text-shadow-blur').value;
    var color = this.value;
    document.getElementById('z').style.textShadow = `${x}px ${y}px ${blur}px ${color}`;
  });

  document.getElementById('text-shadow-x').addEventListener('input', function() {
    var color = document.getElementById('text-shadow-color').value;
    var y = document.getElementById('text-shadow-y').value;
    var blur = document.getElementById('text-shadow-blur').value;
    var x = this.value;
    document.getElementById('z').style.textShadow = `${x}px ${y}px ${blur}px ${color}`;
  });

  document.getElementById('text-shadow-y').addEventListener('input', function() {
    var color = document.getElementById('text-shadow-color').value;
    var x = document.getElementById('text-shadow-x').value;
    var blur = document.getElementById('text-shadow-blur').value;
    var y = this.value;
    document.getElementById('z').style.textShadow = `${x}px ${y}px ${blur}px ${color}`;
  });

  document.getElementById('text-shadow-blur').addEventListener('input', function() {
    var color = document.getElementById('text-shadow-color').value;
    var x = document.getElementById('text-shadow-x').value;
    var y = document.getElementById('text-shadow-y').value;
    var blur = this.value;
    document.getElementById('z').style.textShadow = `${x}px ${y}px ${blur}px ${color}`;
  });

  document.getElementById('text-decoration').addEventListener('change', function() {
    document.getElementById('z').style.textDecoration = this.value;
  });

  document.getElementById('text-transform').addEventListener('change', function() {
    document.getElementById('z').style.textTransform = this.value;
  });

  document.getElementById('text-padding').addEventListener('input', function() {
    document.getElementById('z').style.padding = this.value + 'px';
  });
  document.getElementById('text-align').addEventListener('change', function() {
    document.getElementById('z').style.textAlign = this.value;
  });











/*

 
  function saveCSS() {
    var cssCode = '';

    var fontFamily = document.getElementById('font-select').value;
    cssCode += `font-family: ${fontFamily};`;

    var fontSize = document.getElementById('font-size').value;
    cssCode += ` font-size: ${fontSize}px;`;

    var textColor = document.getElementById('text-color').value;
    cssCode += ` color: ${textColor};`;

    var fontWeight = document.getElementById('font-weight').value;
    cssCode += ` font-weight: ${fontWeight};`;

    var fontStyle = document.getElementById('font-style').value;
    cssCode += ` font-style: ${fontStyle};`;

    var lineHeight = document.getElementById('line-height').value;
    cssCode += ` line-height: ${lineHeight};`;

    var textShadowX = document.getElementById('text-shadow-x').value;
    var textShadowY = document.getElementById('text-shadow-y').value;
    var textShadowBlur = document.getElementById('text-shadow-blur').value;
    var textShadowColor = document.getElementById('text-shadow-color').value;
    cssCode += ` text-shadow: ${textShadowX}px ${textShadowY}px ${textShadowBlur}px ${textShadowColor};`;

    var textDecoration = document.getElementById('text-decoration').value;
    cssCode += ` text-decoration: ${textDecoration};`;

    var textTransform = document.getElementById('text-transform').value;
    cssCode += ` text-transform: ${textTransform};`;

    var textPadding = document.getElementById('text-padding').value;
    cssCode += ` padding: ${textPadding}px;`;

    var textAlign = document.getElementById('text-align').value;
    cssCode += ` text-align: ${textAlign};`;

    console.log(`Kaydedilen CSS kodu: '${cssCode}'`);

    // Apply the CSS styles to the textarea element
    document.getElementById('textarea').style.cssText = cssCode;

    // Save cssCode to localStorage
    localStorage.setItem('savedCSS', cssCode);
  }

  // Load saved CSS from localStorage on page load


  // Event listener for Save button
  document.getElementById('saveBttn').addEventListener('click', saveCSS);*/










  // Çerezin adı ve değeri
var cookieName = 'savedCSS';
var cookieValue = '';

// Kullanıcı girdilerine göre CSS kodunu oluştur
function generateCSS() {
  var cssCode = '';

  cssCode += `font-family: ${document.getElementById('font-select').value};`;
  cssCode += ` font-size: ${document.getElementById('font-size').value}px;`;
  cssCode += ` color: ${document.getElementById('text-color').value};`;
  cssCode += ` font-weight: ${document.getElementById('font-weight').value};`;
  cssCode += ` font-style: ${document.getElementById('font-style').value};`;
  cssCode += ` line-height: ${document.getElementById('line-height').value};`;
  cssCode += ` text-shadow: ${document.getElementById('text-shadow-x').value}px ${document.getElementById('text-shadow-y').value}px ${document.getElementById('text-shadow-blur').value}px ${document.getElementById('text-shadow-color').value};`;
  cssCode += ` text-decoration: ${document.getElementById('text-decoration').value};`;
  cssCode += ` text-transform: ${document.getElementById('text-transform').value};`;
  cssCode += ` padding: ${document.getElementById('text-padding').value}px;`;
  cssCode += ` text-align: ${document.getElementById('text-align').value};`;

  return cssCode;
}

// Kaydet butonu için olay dinleyicisi
document.getElementById('saveBttn').addEventListener('click', function() {
  // CSS kodunu oluştur
  cookieValue = generateCSS();

  // Çerezin süresi (360 gün)
  var expirationDays = 360;
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  // Tarih formatını uygun hale getir (UTC formatı)
  var expires = expirationDate.toUTCString();

  // Çerez oluştur
  document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; expires=${expires}; path=/`;

  console.log('CSS stil çereze kaydedildi:', cookieValue);
});

// Sayfa yüklendiğinde kaydedilmiş CSS çerezini yükle
window.addEventListener('load', function() {
  var cookies = document.cookie.split(';');
  cookies.forEach(function(cookie) {
    var parts = cookie.split('=');
    var name = parts[0].trim();
    if (name === cookieName) {
      var decodedValue = decodeURIComponent(parts[1]);
      document.getElementById('textarea').style.cssText = decodedValue;
      console.log('Kaydedilmiş CSS çerezden yüklendi:', decodedValue);
    }
  });
});
