const ZENIT_PATH = '/integration/zenit';

const styleIcon = 'background: teal; color: white; padding: 2px 5px; border-radius: 30px;';
const styleColor = 'color: teal;';
const styleEvent = 'font-style: italic; font-weight: normal;';
const styleNormal = 'font-style: inherit;'

chrome.devtools.network.onRequestFinished.addListener(
  (netevent) => {
    if (
      netevent &&
      netevent.request &&
      netevent.request.url && 
      netevent.request.url.includes(ZENIT_PATH)
    ) {
      const payload = JSON.parse(netevent.request.postData.text);
      const event = payload.records[0].value.eventName;

      let code = `
      (function () {
        console.groupCollapsed("%cZ%c Zenit - Send: %cevent: %c${event}", "${styleIcon}", "${styleColor}", "${styleEvent}", "${styleNormal}");
          console.log(unescape("${escape(netevent.request.url)}"));
          console.log(unescape("${escape(JSON.stringify(payload, null, 2))}"));
          console.groupCollapsed("Currently in memory:");
            console.log(JSON.parse(unescape("${escape(JSON.stringify(payload))}")));
          console.groupEnd();
        console.groupEnd();
      })()`;
      chrome.devtools.inspectedWindow.eval(code);
    }
  }
);