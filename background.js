let activeTabId; // Global değişken olarak tanımla

// Aktif olan sekmeyi al
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // Aktif sekmenin ID'sini al ve global değişkene ata
    activeTabId = tabs[0].id;
  
    // JavaScript kodunu bu sekmeye enjekte ederek localStorage'ı oku
    chrome.tabs.executeScript(activeTabId, {
        code: `
            // localStorage içindeki 'emoji_' ve 'info_' ile başlayan tüm anahtar-değer çiftlerini al
            var localStorageData = {};
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.startsWith('emoji_') || key.startsWith('info_')) {
                    var value = localStorage.getItem(key);
                    localStorageData[key] = value;
                }
            }
            // Arka plan betiğine local storage verilerini gönder
            chrome.runtime.sendMessage({ data: localStorageData });
        `
    });
});

// Arka plandan gelen mesajları dinle
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.data) {
        // LocalStorage verilerini işle
        console.log("LocalStorage verileri alındı:", message.data);
        let localStorageData = message.data;
        console.log(localStorageData);

        // Verileri tabloya dönüştür
        let tableHTML = "<table id='table'>";
      //  tableHTML += "<thead><tr><th>Key</th><th>Value</th><th>Action</th></tr></thead>";
         tableHTML += "<thead><tr><th>Key</th><th>Action</th></tr></thead>";
        tableHTML += "<tbody>";

        for (let key in localStorageData) {
            if (localStorageData.hasOwnProperty(key)) {
                // Check if key starts with "info_" or "emoji_"
              //  let cleanKey = key.startsWith("info_") || key.startsWith("emoji_") ? key.substring(5) : key;
              let cleanKey = key.startsWith("info_") ? key.substring(5) : key;
              // tableHTML += `<tr data-key="${key}"><td data-key="${key}" class="key-cell">${cleanKey}</td><td  data-key="${key}" class="key-cell ">${localStorageData[key]}</td><td><button class="delete-btn">Delete</button></td></tr>`;
                tableHTML += `<tr data-key="${key}"><td  data-key="${cleanKey}" class="key-cell ">${localStorageData[key]}</td><td><button class="delete-btn">Delete</button></td></tr>`;

            }
        }

        tableHTML += "</tbody></table>";

        // Tabloyu localStorageTable elementine ekle
        document.getElementById("localStorageTable").innerHTML = tableHTML;

        // CSS'yi JavaScript ile ekle
        const style = document.createElement('style');
        style.innerHTML = `
        #localStorageTable {
            width: auto;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        #table{
            min-width: 400px;
            max-width:400px;
        }
        
        #localStorageTable th, #localStorageTable td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
            text-decoration: none;
         
        }
        
        #localStorageTable th {
            background-color: #4CAF50; /* Primary color for the header */
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 14px;
            
        }
        
        #localStorageTable td {
            background-color: #f9f9f9;
            color: #333;
            
        }
        
        #localStorageTable tr:nth-child(even) {
            background-color: #f2f2f2;
            
        }
        
        #localStorageTable tr:hover {
            background-color: #e0e0e0; /* Highlight row on hover */
        }
        
        #localStorageTable th, #localStorageTable td {
            transition: background-color 0.3s ease;
        }
        
            .delete-btn {
                background-color: #f44336;
                color: white;
                border: none;
                padding: 6px 10px;
                cursor: pointer;
                border-radius: 4px;
            }
            .delete-btn:hover {
                background-color: #cc0000;
            }
            .key-cell {
                cursor: pointer;
                text-decoration: underline;
                color: blue;
            }
        `;
        document.head.appendChild(style);

        // Delete buttons için event dinleyicisi ekle
        let deleteButtons = document.getElementsByClassName("delete-btn");
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", function(event) {
                console.log("Delete button clicked");
                // Tıklanan butonun içinde bulunduğu en yakın <tr> öğesini al
                let tr = this.closest("tr");
                if (tr) {
                    // Satırdan key değerini al
                    let key = tr.getAttribute("data-key");
                    if (key && localStorageData.hasOwnProperty(key)) {
                        // İlgili sekmeye localStorage'dan veriyi silmesi için script enjekte et
                        chrome.tabs.executeScript(activeTabId, {
                            code: `
                                localStorage.removeItem("${key}");
                            `
                        }, function() {
                            // localStorageData nesnesinden key'i sil
                            delete localStorageData[key];
                            // Tabloyu güncellemek için satırı kaldır
                            tr.remove();
                            // Arka plan betiğine güncellenmiş localStorage verilerini gönder
                            chrome.runtime.sendMessage({ data: localStorageData });
                        });
                    }
                }
            });
        }
    }
});





document.addEventListener("click", function(event) {
    if (event.target.classList.contains("key-cell")) {
      //  let key = event.target.textContent.trim(); 
      let key = event.target.dataset.key.trim();

        console.log("Tıklanan key:", key);

        // İlgili elementi bul ve odaklan
        chrome.tabs.executeScript(activeTabId, {
            code: `
                var element = document.getElementById("${key}");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.focus();
                    element.style.transition = "transform 3s ease"; // Transform işlemi için geçiş efekti tanımla
                    element.style.transform = "scale(2)"; // Elementi büyüt
                    
                    setTimeout(() => {
                        element.style.transform = "scale(1)"; // Normal boyuta dön
                    }, 2000); // 2 saniye sonra boyutu küçült
                    
                    

                }
            `
        });
    }
});






















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
        
        // Öğenin konumunu absolute olarak ayarla

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



















// Define the downloadTxt function
function downloadTxt(data, filename) {
    // Create a Blob containing the text data
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

// Listen for clicks on the element with ID "svgi"
document.addEventListener("click", function(event) {
    if (event.target.id === "svgi") {
        // Prepare data for text export (get text content of each cell)
        let tableData = "";
        let rows = document.querySelectorAll("#localStorageTable tbody tr");
        rows.forEach(row => {
            let cells = row.querySelectorAll("td");
            cells.forEach(cell => {
                // Exclude text content containing "Delete"
                let cellText = cell.innerText.trim();
                if (cellText.toLowerCase() !== "delete") {
                    tableData += cellText + "\t"; // Separate values with a tab
                }
            });
            tableData += "\n"; // New line for each row
        });

        // Trigger download using the defined function
        downloadTxt(tableData, 'EmojiNotes.txt');
    }
});



