import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  // loadAPI: Promise<any> = Promise.resolve(false);

  constructor() {
    // this.loadAPI = new Promise((resolve) => {
    //   this.loadScript();
    //   resolve(true);
    // });
  }

  loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script");
    if (!scripts) {
      return isFound;
    }
    console.log('scripts', scripts);
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src')?.includes("theme")) {
        isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = ["assets/js/theme.js"];

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = true;
        document.getElementById('script-loading')?.appendChild(node);
      }
      return isFound;
    }
    return isFound;
  }
}
