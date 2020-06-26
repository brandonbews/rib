//Create namespace for Rib
let ribPlugin = {};

///////////////////////////
//Rib - Ribbon Plugin
//Dependencies: JQuery
///////////////////////////
ribPlugin.rib = function(settings) {

  //Track state of ribbon
  let ribIsOpen = false;
  
  //Track changes made to the DOM
  let ribChanges = {
    byClass: {
      zChanges: []
    }
  };
  
  //Simplify settings
  const r = settings;

  //Add ribbon to DOM and initialize
  function ribInit() { 
    const ribHTML = 
    `
    <div ${r.wrapper ? r.wrapper : ''}>
      <div class="rib__wrapper">
        <div class="rib__content">
          ${r.content ? r.content : 'Specify content for the ribbon.'}
        </div>
        <button id="closeRib" class="rib__dismiss">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
            <polygon class="close-x" points="40,3.7 36.3,0 20,16.3 3.7,0 0,3.7 16.3,20 0,36.3 3.7,40 20,23.7 36.3,40 40,36.3 23.7,20 "/>
          </svg>
        </button>
      </div>
    </div>
    <style>
      .myRib * {
        box-sizing: border-box;
      }
      .rib__wrapper {
        background-color: ${r.backgroundColor ? r.backgroundColor : '#2b2b2b'};
        padding: 40px 32px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        margin-bottom: -100%;
        display: block;
        width: 100%;
        -webkit-transition: margin 1s ease;
        transition: margin 1s ease;
        z-index: 3000000;
        box-shadow: 0 -1px 1px rgba(0,0,0,0.05), 
                    0 -2px 2px rgba(0,0,0,0.05), 
                    0 -4px 4px rgba(0,0,0,0.05), 
                    0 -8px 8px rgba(0,0,0,0.05), 
                    0 -16px 16px rgba(0,0,0,0.05);
      }
      .rib__wrapper--active {
        margin-bottom: 0;
      }
      .rib__content {
        color: ${r.fontColor ? r.fontColor : '#ffffff'};
        text-decoration: none;
        font-family: ${r.fontFamily ? r.fontFamily : 'sans-serif'};
        font-size: ${r.fontSize ? r.fontSize : '1em'};
        line-height: ${r.lineHeight ? r.lineHeight : 'normal' };
        text-align: center;
        margin: 0;
        padding: 0;
      }
      .rib__content a {
        color: ${r.fontColor ? r.fontColor : '#ffffff'};
        text-decoration: none;
      }
      @media (min-width: 960px) {
        .rib__content {
          font-size: ${r.deskFontSize ? r.deskFontSize : '1.25em' };
        }
      }
      .rib__dismiss {
        height: 48px;
        width: 48px;
        border: none;
        background: none;
        padding: 0;
        position: absolute;
        top: 0;
        right: 0;
      }
      .rib__dismiss svg {
        height: 16px;
        width: 16px;
      }
      .rib__dismiss svg .close-x {
        fill: ${r.xColor ? r.xColor : '#ffffff'};
      }
    </style>
    `;
    $('body').append(ribHTML);
    setTimeout( function() {
      ribIsOpen = true; //Set ribbon open state to true
      $('.rib__wrapper').addClass('rib__wrapper--active');
      //Overlapping element watch
      if (r.fixOverlappingClasses) { //Watch for overlaps by class
        let overlapTimeout = ribChanges.byClass.zChanges.push(ltkChatOverlapCheck(r.fixOverlappingClasses));
      }
      //Close button listener
      $('#closeRib').click(ribClose);
      //Scroll watch
      if (r.scrollDismissAmount) {
        scrollWatch(r.scrollDismissAmount);  
      }
      //Dismiss by ID
      if (r.dismissId) {
        closeById(r.dismissId);
      }
      //Set dismiss timer
      if (r.timerDismissAmount) {
        setTimeout( ribClose, (r.timerDismissAmount * 1000) );
      }
    }, (r.delay * 1000)); //Open ribbon after timer
  }

  //Fix anything overlapping the ribbon
  function ltkChatOverlapCheck(elements) {
    let changedElements = [];
    for (const element of elements) {
      const watchClass = '.' + element;
      let originalState = {
        class: watchClass,
        zIndex: ''
      }
      const elementWatcher = setInterval (function() {
        if (ribIsOpen) {
          let watchClassZ = $(watchClass).css('z-index');
          if (watchClassZ) {
            originalState.zIndex = watchClassZ;
            $(watchClass).css('z-index', '0');
            clearInterval(elementWatcher);
          }
        } 
      }, 10); //This should be shorter in production. Like 10ms
      changedElements.push(originalState);
    }
    return changedElements;
  }

  
  //Cleanup Ribbon and reverse any changes
  function ribCleanup(changes) {
    const classZChanges = changes.byClass.zChanges;
    for (const change of classZChanges[0]) {
      $(change.class).css('z-index', change.zIndex);
    }
   
  }
  
  //Close Ribbon
  function ribClose() {
    if (ribIsOpen) {
      $('.rib__wrapper').removeClass('rib__wrapper--active');
      ribIsOpen = false;
      ribCleanup(ribChanges);
    }
  };

  //Close ribbon on scroll
  function scrollWatch(amount) {
     const position = $(window).scrollTop();
     let scroll;
     $(window).scroll( function () {
       scroll = $(window).scrollTop();
       //Close ribbon if user scrolls a set amount of pixels in either direction
       if (scroll > (position + amount) || scroll < (position - amount)) {
         ribClose();
         return
       }
     });
  };

  //Close ribbon when clicking specific ID
  function closeById(id) {
    const closeId = '#' + id;
    $(closeId).click(ribClose);
  }

  //Create Cookie
  function createCookie(days=30, name, value=1) {
    date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    expires = value +'; expires='+date.toGMTString();
    document.cookie = name + '=' + expires +'; path=/';
  }

  //Check that a specific cookie exists
  function checkCookie(name) {
    if (document.cookie.indexOf(name) == -1) {
      return false;
    } else {
      return true; //Change to false for testing
    }
  }

  //Check if the ribbon should initialize
  function ribCheck () {
    
    //Check if URL contains
    if (r.urlExclude) {
      for (const url of r.urlExclude) { //Loop over URL contains values
        if (window.location.href.indexOf(url) == -1) {
        } else {
          return;  //Return if URL contains snippet.
        }
      }
    }
    
    //Check Date
    if (r.endDate) {
      const dateDelta = Date.parse(r.endDate) - Date.parse(new Date());
      if (dateDelta > 0) {
      } else {
        return; //Return if date not satisfied.
      }
    }
   
    //Check if cookie is present
    if (r.cookieName) {
      const cookieStatus = checkCookie(r.cookieName);
      if (cookieStatus == false) {
      } else {
        return; //Return if cookie is present.
      }
    }
    
    //Check that viewport size is allowed
    if (r.maxWidth) {
      const viewportWidth = $(window).width();
      if (viewportWidth <= r.maxWidth) {
      } else {
        return; //Return if viewport is too large
      }
    }
    
    return true; //If all checks pass, run the ribbon
     
  };

  //Main function to start ribbon
  function startRib() {
    const status = ribCheck();
    if (status) {
      if (r.cookieName) {
        createCookie(r.cookieExpire,r.cookieName,1);
      }
      ribInit(); //Kick off the ribbon
    }
  }; 

  startRib();
};
///////////////////////////
////END Ribbon Plugin
///////////////////////////