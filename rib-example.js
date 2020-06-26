//Load content into a constant using backticks to make HTML formatting easier
const ribbonContent = `
  <a id="acceptOffer" href="#myLink">
    <p class="rib__text">Psst... there's a secret sale. <span class="rib__cta" id="acceptOffer">See Details</span></p>
  </a>
`;

//Start rib
$(document).ready(function() {
  ribPlugin.rib({
    content: ribbonContent, //Content to include in the ribbon
    endDate: 'November 1 2020 23:59:00 GMT-0700', //Rib will not fire after this date
    maxWidth: 1000, //Rib will not fire on viewports wider than this
    cookieName: 'myRibCookie', //Name of cookie to create
    cookieExpire: 30, //Time for cookie to expire in days
    urlExclude: ['blog/','cart/'], //Pages to exclude if their URL includes these strings
    dismissId: 'acceptOffer', //ID for element that will dismiss Rib on engagement
    wrapper: 'class="myRib"', //Wrap Rib in a custom class or ID
    delay: 3, //Delay the ribbon firing by this amount of time in seconds
    timerDismissAmount: 10, //Dismiss after this amount of time in seconds
    scrollDismissAmount: 400, //Dismiss after this amount of scrolling in pixels-- in either direction
    fixOverlappingClasses: ['annoying','doubleannoying'], //Classes to watch to avoid overlap
    backgroundColor: '#2b2b2b',
    fontFamily: 'sans-serif',
    fontColor: '#ffffff',
    fontSize: '1em',
    lineHeight: '1.25',
    deskFontSize: '1.25em',
    xColor: '#ffffff' //Color of 'X' dismiss button
  });
});