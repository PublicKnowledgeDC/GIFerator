/** this extension was created with the assistance of the wiki hosted at
* https://developer.mozilla.org/en-US/docs/XUL/School_tutorial/Getting_Started_with_Firefox_Extensions#The_Hello_World_Extension
* in October 2013 and is released as CC0 in the public domain by Public Knowledge
*/


/**
 * GiferatorChrome namespace.
 */
if ("undefined" == typeof(GiferatorChrome)) {
  var GiferatorChrome = {};
};

/**
 * A class variable that records the last image number that was saved, to ensure
 * uniqueness of image names.
 */
GiferatorChrome.fileCount = 0;

/**
 * Controls the browser overlay for the Giferator extension.
 */
GiferatorChrome.BrowserOverlay = {

  /**
   * Makes the GIF image, by pressing the "Play" and "Make GIF" buttons.
   */
  makeGif : function(aEvent) {
    var doc = window.content.document;

    doc.getElementsByClassName("play")[0].click();
    doc.getElementsByClassName("make-gif")[0].click();

  },
  /**
   * Saves the animated GIF image, in response to a button press.
   */
  saveFile : function(aEvent) {
    Components.utils.import("resource://gre/modules/FileUtils.jsm");
    var doc = window.content.document;

    // This is the element where the created GIF image is stored.
    var images = doc.getElementsByClassName("image ui-draggable");
    if (images.length == 0) {
        return;
    }

    // Gather the GIF image, which is stored as a portion of the "src" attribute
    // of the images element.
    var imageData = atob(images[0].getAttribute("src").substring(22));

    // Identify an appropriate filename for saving the file. This is done by
    // starting from a class variable fileCount, incorporating the variable into
    // a filename, and repeatedly incrementing the variable until no file is
    // found using the name incorporating the variable..
    let directoryService = Cc["@mozilla.org/file/directory_service;1"].
        getService(Ci.nsIProperties);
    var file;
    do {
        GiferatorChrome.fileCount++;
        file = directoryService.get("Home", Ci.nsIFile);
        file.append("Dropbox"); file.append("Public"); file.append("gif");
        file.append("image_" + GiferatorChrome.fileCount + ".gif");
    } while (file.exists());

    // Write the image to file.
    var os = FileUtils.openFileOutputStream(file, 0x0a);
    os.write(imageData, imageData.length);
    os.close();
  }
};
