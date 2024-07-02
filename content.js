





// JavaScript kodu
let jsCode = `


function a() {
    // Belirli taglara sahip elementlere class ekleme
    let elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, li, lu, a');
    elements.forEach(element => {
        element.classList.add('clickable');
    });

    console.log("clickable eklendi.");
    ax(); // Bu fonksiyonun ne olduğunu ve nasıl tanımlandığını kontrol etmelisiniz
    localStorage.removeItem('savedJsCode');
    console.log("localStorage'den silindi.");








    // Olay dinleyicisini kaldırma
    document.body.removeEventListener('click', a);

}

// Olay dinleyicisini ekleme
document.body.addEventListener('click', a);
a();
// Yeni bir script elementi oluşturun
var script = document.createElement('script');

// Script elementinin src özelliğini ayarlayın (jQuery CDN adresi)
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';

// Script elementini HTML sayfanıza ekleyin
document.head.appendChild(script);


`;

// localStorage'ye kaydetme
localStorage.setItem('savedJsCode', jsCode);

// localStorage'den kodu alıp çalıştırma
let savedCode = localStorage.getItem('savedJsCode');
eval(savedCode); // Dikkat: eval kullanımı güvenlik riski oluşturabilir, güvenlik açısından dikkatli olunmalı


document.addEventListener('DOMContentLoaded', function() {
    // localStorage'den kaydedilen kodu alıp çalıştırma
    let savedCode = localStorage.getItem('savedJsCode');
    if (savedCode) {
        eval(savedCode); // Güvenlik açısından alternatif yöntemler tercih edilmelidir
    }
});





function ax() {
    let elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, li, lu, a');
    elements.forEach(element => {
        let xpath = getXPathForElement(element);
        let savedEmoji = localStorage.getItem(getIdFromXPath(xpath));
        if (savedEmoji) {
            addEmojiToElement(element, savedEmoji);
        }
    });
}










// localStorage'da emoji_ ile başlayan tüm anahtarları sil
function clearEmojiLocalStorage() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('emoji_')) {
            localStorage.removeItem(key);
        }
                if (key.startsWith('info_')) {
            localStorage.removeItem(key);
        }
    });
}
// Fonksiyonu çağırarak emoji_ ile başlayan tüm anahtarları sil
//clearEmojiLocalStorage();





// Sürükle ve bırak işlemleri için gerekli değişkenler
let draggableElement = null;
let offsetX = 0;
let offsetY = 0;

// Mouse hareketi başladığında sürükleyiciyi ayarla
document.addEventListener('mousedown', function(event) {
    if (event.target.classList.contains('info-div')) {
        draggableElement = event.target;
        offsetX = event.clientX - draggableElement.getBoundingClientRect().left;
        offsetY = event.clientY - draggableElement.getBoundingClientRect().top;

        // Z-index'i yüksek yaparak diğer elementlerin üzerine çıkmasını sağla
        draggableElement.style.zIndex = 9999;

        // Sürükleme sırasında sayfada seçim işaretçisini kaldır
        document.body.style.userSelect = 'none';

        // Cursor stilini sürükler gibi yap
        draggableElement.style.cursor = 'grabbing';
    }
});

// Mouse hareketi bittiğinde sürükleyiciyi bırak
document.addEventListener('mouseup', function() {
    if (draggableElement !== null) {
        // Z-index'i tekrar sıfırla
        draggableElement.style.zIndex = '9999';

        // Sürükleme sırasında kaldırılan seçim işaretçisini geri yükle
        document.body.style.userSelect = '';

        // Cursor stilini varsayılan yap
        draggableElement.style.cursor = 'grabbing';

        // Sürükleme bittiğinde sürükleyiciyi sıfırla
        draggableElement = null;
    }
});

// Mouse hareketi sırasında sürükleyiciyi hareket ettir
document.addEventListener('mousemove', function(event) {
    if (draggableElement !== null) {
        // Yeni pozisyonu hesapla
        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        // Sınırları belirle (isteğe bağlı olarak sayfa sınırları dahilinde sürükleme yapabilirsiniz)
        // Örneğin:
        // newX = Math.max(0, Math.min(newX, window.innerWidth - draggableElement.offsetWidth));
        // newY = Math.max(0, Math.min(newY, window.innerHeight - draggableElement.offsetHeight));

        // Yeni pozisyonu ayarla
        draggableElement.style.left = newX + 'px';
        draggableElement.style.top = newY + 'px';
    }
});


















// XPath'i belirli bir elemente dönüştür
function getXPathForElement(element) {
    let xpath = '';
    let currentNode = element;

    while (currentNode !== null) {
        let nodeSelector = currentNode.tagName.toLowerCase();
        let parent = currentNode.parentElement;

        if (parent) {
            let children = parent.children;
            let childIndex = [...children].indexOf(currentNode) + 1;
            nodeSelector += `[${childIndex}]`;
        }

        xpath = '/' + nodeSelector + xpath;
        currentNode = parent;
    }

    return xpath.toLowerCase();
}

// XPath'i belirli bir elemente dönüştür ve id olarak kullanılacak formatta geri döndür
function getIdFromXPath(xpath) {
    return `emoji_${xpath.replace(/[^\w\s]/gi, '')}`;
}

// Emojiyi local storage'da sakla
function saveEmojiForElement(xpath, emoji) {
    localStorage.setItem(getIdFromXPath(xpath), emoji);
}

// Bilgi divi oluştur
function createInfoDiv(emojiElement) {
    // Eğer bilgi divi zaten varsa kaldır
    let existingInfoDiv = emojiElement.parentElement.querySelector('.info-div');
    if (existingInfoDiv) {
        existingInfoDiv.remove();
        return; // Bilgi divi varsa işlemi sonlandır
    }

    // Div oluştur
    let infoDiv = document.createElement('div');
    infoDiv.classList.add('info-div');
    infoDiv.style.position = 'absolute';
    infoDiv.style.left = `${emojiElement.offsetLeft + emojiElement.offsetWidth}px`;
    infoDiv.style.top = `${emojiElement.offsetTop}px`;
    infoDiv.style.transform = 'translateY(-10%)';
    infoDiv.style.transition = 'opacity 0.3s ease-in-out';
    infoDiv.style.opacity = 0; // Başlangıçta görünmez yap
    infoDiv.style.backgroundColor = '#fcf59b'; // Arka plan rengi
    infoDiv.style.borderRadius = '0px 10px 250px / 0 200px 55px 250px';
    infoDiv.style.boxShadow = '-3px 5px 12px 0 rgba(0,0,0,0.3)';
    infoDiv.style.padding = '20px';
    infoDiv.style.minWidth = '250px'; // Minimum genişlik
    infoDiv.style.maxWidth = '300px'; // Maksimum genişlik
    infoDiv.style.minHeight = '150px'; // Minimum yükseklik
    infoDiv.style.zIndex = '1000';
    // Textarea oluştur ve bilgi panelini kaplasın
    let textarea = document.createElement('textarea');
    textarea.id = 'textarea';
    textarea.placeholder = 'Buraya yazabilirsiniz...'; // Placeholder ekle
    textarea.style.width = '100%';
    textarea.style.height = 'auto';
    textarea.style.border = 'none'; // Border'ı kaldır
    textarea.style.outline = 'none'; // Outline'ı kaldır
    textarea.style.backgroundColor = 'transparent'; // Arka plan rengini kaldır
    textarea.style.textAlign = 'left'; // Metni sola hizala
    textarea.style.verticalAlign = 'top'; // Metni yukarıda hizala
    textarea.style.resize = 'none'; // Boyutlandırmayı kapat
    textarea.style.wordWrap = 'break-word'; // Kelimeleri otomatik olarak satır sonuna koy
    textarea.style.wordBreak = 'break-all'; // Kelimeleri istenilen yerde kır
    textarea.style.fontFamily = 'Shadows Into Light, cursive'; // Font-family ayarla
    textarea.style.fontSize = '70%'; // Font-size ayarla
    textarea.style.fontWeight = 'bold'; // Font-weight ayarla
    infoDiv.appendChild(textarea);




    // Sağ üst köşeye close butonu ekle
    let closeButton = document.createElement('button');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';
    closeButton.style.color = '#333';
    closeButton.innerHTML = `
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;
    closeButton.addEventListener('click', function() {
        infoDiv.remove(); // Butona tıklanınca bilgi divini kaldır
    });
    infoDiv.appendChild(closeButton);

    // Bilgi divini body'ye ekle
    document.body.appendChild(infoDiv);











    // Local storage işlemleri
    let storageKey = `info_${emojiElement.id}`;
    let savedText = localStorage.getItem(storageKey);
    if (savedText) {
        textarea.value = savedText;
    }

    // Textarea değeri değiştiğinde local storage'a kaydet
    textarea.addEventListener('input', function() {
        localStorage.setItem(storageKey, textarea.value);
        updateInfoDivSize(); // Bilgi panelinin boyutunu güncelle
    });

    // Div'i emoji elementinin yanına ekle
    emojiElement.parentNode.appendChild(infoDiv);

    // Bilgi divini animasyonla görünür yap
    setTimeout(() => {
        infoDiv.style.opacity = 1;
    }, 50);

    // Emojiye tıklandığında bilgi divi oluştur
    emojiElement.addEventListener('click', function() {
        createInfoDiv(emojiElement);
    });

    // Bilgi panelinin boyutunu güncelleyen fonksiyon
    function updateInfoDivSize() {
        textarea.style.height = 'auto'; // Yüksekliği sıfırla
        textarea.style.height = `${textarea.scrollHeight}px`; // Yüksekliği ayarla
        infoDiv.style.height = `${textarea.scrollHeight + 20}px`; // Padding ile birlikte yüksekliği ayarla
    }

    // Textarea alanının yüksekliğini ve genişliğini başlangıçta ayarla
    updateInfoDivSize();

    // Emojiye tıklandığında bilgi divi kapat/aç
    emojiElement.addEventListener('click', function() {
        if (infoDiv.style.opacity === '1') {
            infoDiv.style.opacity = 0;
            setTimeout(() => {
                infoDiv.remove();
            }, 300);
        } else {
            infoDiv.style.opacity = 1;
        }
    });
}

// Emojiyi belirli bir elemente ekle
function addEmojiToElement(element, emoji) {
    let xpath = getXPathForElement(element); // Elementin XPath'ini al
    saveEmojiForElement(xpath, emoji); // Emojiyi local storage'da sakla

    let emojiElement = document.createElement('span');
    emojiElement.textContent = emoji;
    emojiElement.style.cursor = 'pointer'; // İşaretçi olarak ayarla
    emojiElement.id = getIdFromXPath(xpath); // XPath'i id olarak atayın
    element.appendChild(emojiElement);

    // Emojiye tıklandığında bilgi divi oluştur
    emojiElement.addEventListener('click', function() {
        createInfoDiv(emojiElement);
    });
}

// Sayfa yüklendiğinde local storage'dan emojiyi al ve ekle
document.addEventListener('DOMContentLoaded', function() {
    let elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, li, lu, a');
    elements.forEach(element => {
        let xpath = getXPathForElement(element);
        let savedEmoji = localStorage.getItem(getIdFromXPath(xpath));
        if (savedEmoji) {
            addEmojiToElement(element, savedEmoji);
        }
    });
});





// Tüm elementler için bir 'click' olay dinleyicisi ekle
document.addEventListener('click', function(event) {

    if (event.altKey && event.button === 0) {


    let clickedElement = event.target;
    if (clickedElement.matches('p, h1, h2, h3, h4, h5, li, lu, a')) {
        let xpath = getXPathForElement(clickedElement);
        clickedElement.classList.add('clickable');
        // Örnek olarak emoji seçenekleri
        let emojis = ['✔️','❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😓', '😔', '😕', '🙁', '☹️', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🥳', '🥺', '🤠', '🥳', '🤓', '🧐', '😎', '🥸', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🤑', '🤯', '😲', '😳', '🥵', '🥶', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🌸', '🌼', '🌻', '🌺', '🌷', '🌹', '🥀', '🌿', '🌱', '🍀', '🍃', '🍂', '🍁', '🌾', '🌵', '🌴', '🌲', '🌳', '🌷', '🌼', '🌻', '🌸', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮','🐸', '🐵', '🦄', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦓', '🦍', '🦧', '🦣', '🦒', '🦏', '🦛', '🐪', '🐫', '🐘', '🦘', '🦡', '🦙', '🦚', '🦜', '🦢', '🦩', '🦨', '🦥', '🦦', '🦀', '🦞', '🦐', '🦑', '🦪', '🐟', '🐠', '🐡', '🐬', '🐳', '🐋', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖'];
        let existingEmoji = clickedElement.querySelector('span');

        if (existingEmoji) {
            // Elementin içinde zaten bir emoji varsa, mevcut emojinin türüne göre işlem yap
            let currentIndex = emojis.indexOf(existingEmoji.textContent);
            let newIndex = (currentIndex + 1) % emojis.length;
            existingEmoji.textContent = emojis[newIndex];
            saveEmojiForElement(xpath, emojis[newIndex]);
        } else {
            
            // Elementin içinde emoji yoksa, ilk emojiyi ekleyin (örneğin ✔️)
            addEmojiToElement(clickedElement, emojis[0]);
        }


    }


  
}


});



// Tüm elementler için bir 'dblclick' olay dinleyicisi ekle
document.addEventListener('dblclick', function(event) {


    if (event.altKey && event.button === 0) {


        let clickedElement = event.target;
        if (clickedElement.matches('p, h1, h2, h3, h4, h5, li, lu, a')) {
            let xpath = getXPathForElement(clickedElement);
            clickedElement.classList.add('clickable');
            // Örnek olarak emoji seçenekleri
            let emojis = ['✔️','❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😓', '😔', '😕', '🙁', '☹️', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🥳', '🥺', '🤠', '🥳', '🤓', '🧐', '😎', '🥸', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🤑', '🤯', '😲', '😳', '🥵', '🥶', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🌸', '🌼', '🌻', '🌺', '🌷', '🌹', '🥀', '🌿', '🌱', '🍀', '🍃', '🍂', '🍁', '🌾', '🌵', '🌴', '🌲', '🌳', '🌷', '🌼', '🌻', '🌸', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮','🐸', '🐵', '🦄', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦓', '🦍', '🦧', '🦣', '🦒', '🦏', '🦛', '🐪', '🐫', '🐘', '🦘', '🦡', '🦙', '🦚', '🦜', '🦢', '🦩', '🦨', '🦥', '🦦', '🦀', '🦞', '🦐', '🦑', '🦪', '🐟', '🐠', '🐡', '🐬', '🐳', '🐋', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖'];
            let existingEmoji = clickedElement.querySelector('span');

            if (existingEmoji) {



                // Emoji listesi
                const emojis = ['✔️', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😓', '😔', '😕', '🙁', '☹️', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🥳', '🥺', '🤠', '🥳', '🤓', '🧐', '😎', '🥸', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🤑', '🤯', '😲', '😳', '🥵', '🥶', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🌸', '🌼', '🌻', '🌺', '🌷', '🌹', '🥀', '🌿', '🌱', '🍀', '🍃', '🍂', '🍁', '🌾', '🌵', '🌴', '🌲', '🌳', '🌷', '🌼', '🌻', '🌸', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮','🐸', '🐵', '🦄', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦓', '🦍', '🦧', '🦣', '🦒', '🦏', '🦛', '🐪', '🐫', '🐘', '🦘', '🦡', '🦙', '🦚', '🦜', '🦢', '🦩', '🦨', '🦥', '🦦', '🦀', '🦞', '🦐', '🦑', '🦪', '🐟', '🐠', '🐡', '🐬', '🐳', '🐋', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖'];

                // Emoji kutusu için div oluştur
                const emojiContainer = document.createElement('div');
                emojiContainer.classList.add('emoji-container');

                // Emoji listesini emoji kutusuna ekle
                emojis.forEach(emoji => {
                    const emojiItem = document.createElement('div');
                    emojiItem.classList.add('emoji-item');
                    emojiItem.textContent = emoji;
                    emojiItem.addEventListener('click', function() {
                        console.log('Seçilen emoji:', emoji);
                        existingEmoji.textContent = emoji;
                        saveEmojiForElement(xpath, emoji);
                        emojiContainer.remove();
                    });
                    emojiContainer.appendChild(emojiItem);



     
        

});

        // Sayfaya emoji kutusunu ekle
        document.body.appendChild(emojiContainer);

        // CSS'yi JavaScript ile ekle
        const styles = document.createElement('style');
        styles.innerHTML = `
            .emoji-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 10px;
                padding-top:40px;
                border: 1px solid #ccc;
                max-width: 50%;
                max-height: 170px;
                overflow-x: auto; /* Yatay kaydırma eklemek için */
                white-space: nowrap; /* Öğelerin yatay olarak sıralanmasını sağlar */
                background-color: white;
                z-index: 1000;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .emoji-item {
                cursor: pointer;
                font-size: 20px;
                padding: 5px;
            
                border-radius: 5px;
                background-color: #f0f0f0;
                transition: background-color 0.3s ease;
            }
            .emoji-item:hover {
                background-color: #e0e0e0;
            }
            .emoji-container::-webkit-scrollbar {
                width: 5px; /* Scroll çubuğunun genişliği */
            }
            
            .emoji-container::-webkit-scrollbar-track {
                background: #f1f1f1; /* Scroll yolu arka plan rengi */
            }
            
            .emoji-container::-webkit-scrollbar-thumb {
                background-color: #888; /* Scroll çubuğu rengi */
                border-radius: 5px; /* Scroll çubuğu köşe yarıçapı */
            }
            
            .emoji-container::-webkit-scrollbar-thumb:hover {
                background-color: #555; /* Scroll çubuğu hover durumunda rengi */
            }
        s    
        `;
        document.head.appendChild(styles);


        // Sağ üst köşeye close butonu ekle
        let closeButtonx = document.createElement('button');
        closeButtonx.style.position = 'absolute';
        closeButtonx.style.top = '5px';
        closeButtonx.style.right = '5px';
        closeButtonx.style.border = 'none';
        closeButtonx.style.background = 'none';
        closeButtonx.style.cursor = 'pointer';
        closeButtonx.style.fontSize = '20px';
        closeButtonx.style.color = '#333';
        closeButtonx.classList.add('close-button');

        closeButtonx.addEventListener('click', function() {
            emojiContainer.remove(); // Butona tıklanınca bilgi divini kaldır
        });
        document.body.appendChild(emojiContainer);
        emojiContainer.appendChild(closeButtonx);





                }


            }
}
});



















