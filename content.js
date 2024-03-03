// creating HTML div for contain the translated word
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.padding = '5px';
tooltip.style.fontSize = "15px"
tooltip.style.background = 'white';
tooltip.style.color = "black"
tooltip.style.border = '1px solid black';
tooltip.style.borderRadius = '5px';
tooltip.style.display = 'none';
tooltip.style.zIndex = '1000';
document.body.appendChild(tooltip);

window.translated = false
async function load_dictionary() {
    try {
        const response = await fetch(chrome.runtime.getURL("data/translations.json"));
        const text = await response.json();
        return text;
        
      } catch (error) {
        console.error('Error loading dictionary:', error);
        throw error; // Re-throw the error to propagate it to the next handler
      }
}
//replacing  the translated div with a new translation
function translatedToDiv(translations) {
  return ('<div>' + translations.replaceAll("\n", '</div><div style="margin: 20px">') + '</div>')
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  if (request.message === "clicked_browser_action") {
    if (window.translated) {
      alert("Translation already added to this page")
    }
    alert("Translation is starting!")
    load_dictionary().then(translatingDict => {
      // this function used to get words from the web page
      function wrapWords(element) {
        if (element.hasChildNodes()) {
          element.childNodes.forEach(child => {
            if (child.nodeType === Text.TEXT_NODE) {
              var newHtml = child.textContent.replace(/([\w'А-]+)/g, '<span class="hover-word">$1</span>');
              let tempDiv = document.createElement("span")
              tempDiv.innerHTML = newHtml
              element.replaceChild(tempDiv, child)
            } else {
              wrapWords(child)
            }
              
          });
        }
      }
      // this function handles the mouse over event on the words
      function handleMouseover(event) {
        if (event.target.classList.contains("hover-word")) {
          const word = event.target.textContent.trim()

          const translatedWord = translatingDict[word] || translatingDict[word.toLowerCase()]
          if (translatedWord) {
            tooltip.innerHTML = translatedToDiv(translatedWord)
            tooltip.style.display = "block"
            tooltip.style.left = `${event.pageX + 3}px`
            tooltip.style.top = `${event.pageY + 5}px`
          }
        }
      }
      // this function handles the mouse out event
      function handleMouseout() {
        tooltip.style.display = "none"
      }

      wrapWords(document.body);
      document.querySelectorAll(".hover-word").forEach(word => {
        word.addEventListener("mouseover", handleMouseover);
        word.addEventListener("mouseout", handleMouseout)
      })

      alert("translation ready");
      window.translated = true
    });
  }
})

