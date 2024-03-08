// creating HTML div for contain the translated word
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.padding = '5px';
tooltip.style.fontSize = "20px"
tooltip.style.background = 'white';
tooltip.style.color = "black"
tooltip.style.border = '1px solid black';
tooltip.style.borderRadius = '5px';
tooltip.style.display = 'none';
tooltip.style.zIndex = '1000';
document.body.appendChild(tooltip);

window.translated = false
// a function to the translation.json file
async function load_dictionary() {
    try {
        const response = await fetch(chrome.runtime.getURL("data/translations.json"));
        const text = await response.json();
        return text;
      
        
      } catch (error) {
        console.error('Error loading dictionary:', error);
        throw error; 
      }
}
// funciton for handling suffix
function handleSuffix(word, suffix) {
  // let prefix = ["g","n", "i"]
  let endWord = ""
  let flag = true
  let splittedWord = word.split("")
  splittedWord.reverse()
  for (let i = 0; i <= suffix.length-1; i++){
      if (splittedWord[i] != suffix[i]) {
        flag = false
      }
  }
  if (flag) {
    for (let i = splittedWord.length-1; i > suffix.length-1; i--){
      endWord += splittedWord[i]
    }
  }
  return endWord
}
//replacing  the translated div with a new translation
function translatedToDiv(translations) {
  return ('<div>' + translations.replaceAll("\n", '</div><div style="margin: 20px">') + '</div>')
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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

      // below function allows for sending the translated word to the tooltip
      function sendingToTooltip(event, translatedWord) {
        tooltip.innerHTML = translatedToDiv(translatedWord)
          tooltip.style.display = "block"
          tooltip.style.left = `${event.pageX + 3}px`
          tooltip.style.top = `${event.pageY + 5}px`
      }
      // this function handles the mouse over event on the words
      function handleMouseover(event) {
        if (event.target.classList.contains("hover-word")) {
          const word = event.target.textContent.trim()
          let endWord = ""
          let translatedWord = translatingDict[word] || translatingDict[word.toLowerCase()]
          if (translatedWord) {
            sendingToTooltip(event, translatedWord)
            
          } else if (word.includes("ing")) {
            let prefix = ["g","n", "i"]
            let flag = true
            let splittedWord = word.split("")
            splittedWord.reverse()
            for (let i = 0; i <= 2; i++){
                if (splittedWord[i] != prefix[i]) {
                  flag = false
                }
            }
            if (flag) {
              for (let i = splittedWord.length-1; i >2; i--){
                endWord += splittedWord[i]
              }
            }
            translatedWord = translatingDict[endWord] || translatingDict[endWord.toLowerCase()]
            if (translatedWord) {
              sendingToTooltip(event, translatedWord)
            } else {
              endWord += "e"
              let temp = translatingDict[endWord] || translatingDict[endWord.toLowerCase()]
              if (temp) {
                sendingToTooltip(event, temp)
              }
            } 
          } else if (word.includes("ed")) {
            let tempWord = handleSuffix(word, ["d", "e"])
            translatedWord = translatingDict[tempWord] || translatingDict[tempWord.toLowerCase()]
            if (translatedWord) {
              sendingToTooltip(event, translatedWord)
            } else {
              tempWord += "e"
              let temp = translatingDict[tempWord] || translatingDict[tempWord.toLowerCase()]
              if (temp) {
                sendingToTooltip(event, temp)
              }
            } 
          } else if (word.includes("s")) {
            let tempWord = handleSuffix(word, ["s"])
            translatedWord = translatingDict[tempWord] || translatingDict[tempWord.toLowerCase()]
            if (translatedWord) {
              sendingToTooltip(event, translatedWord)
            }
            // } else {
            //   tempWord += "e"
            //   let temp = translatingDict[tempWord] || translatingDict[tempWord.toLowerCase()]
            //   if (temp) {
            //     sendingToTooltip(event, temp)
            //   }
            // }
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
    //below is for handling the context menu sent message
  } else if (request.message === "translate_action") {
    var translatedWord = ""
    load_dictionary().then(translatingDict => {
      const selectedWord = request.selected.trim();
      translatedWord = translatingDict[selectedWord] || translatingDict[selectedWord.toLowerCase()]
      alert(translatedWord)
    })
  }
})

