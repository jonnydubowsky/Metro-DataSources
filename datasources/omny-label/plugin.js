var mc; // Keep a global ref to the client

/*
  The entry point.

  This function is called by Metro in order to initialize the DataSource
  Metro passes a reference to the MetroClient to the DataSource, and
  the DataSource can do whatever it wants after that.
*/
function initDataSource(metroClient) {
  mc = metroClient;
  createRightClickButton(mc);
}

/*
  Using the DataSource API, we create a right-click menu button which appears when an image
  is right-clicked.
  The 'functionName' is used to identify the function, the title is what the user sees, the
  contexts are the situations in which the button appears (image right-click), and the second
  argument is a callback function to be executed when the user presses the button
*/
const createRightClickButton = function() {

  mc.createContextMenuButton({
    functionName: 'omnyBrandLabel',
    buttonTitle: 'Omny Label',
    contexts: ['image']
  }, omnyRightClickCallback);
}

/*
  This is the callback for the right-click menu button.
  Does two things:
    1. Gets the URL of the image that was right-clicked
    2. Creates a floating (modal) input box for the user to label the image
      2.1. The modal input box takes a callback which runs after the user
            provides a label and presses enter
      2.2. That callback is where we send the image URL + label as a single
            datapoint
*/
const omnyRightClickCallback = function(contextInfo) {
  let imageUrl = contextInfo['srcUrl']; // Using the 'image' context gives us access to the srcUrl of the image

  // Using the DataSource API, we define an input modal which appears when the right-click menu button is clicked
  mc.createModalForm({
    description: 'Enter a brand label',
    submitCallback: function(inputText) {
      // Callback runs when the user submits the modal form
      // Receives one argument: the text input from the user
      if(omnyInputValid(inputText)) {
        omnySend(imageUrl, inputText);
      }
    }
  })

  return {status: 1, msg: 'success'}; // The DataSource expects a return object like this for r-click button functions
}

/*
  Gets the dimensions of the image and then sends the datapoint
*/
const omnySend = function(url, label) {
  $("<img/>").attr("src", url).on('load', function(){
    mc.sendDatapoint({
      'url': url,
      'label': label,
      'width': this.width,
      'height': this.height
    });
  });
}

/*
  Validate the label input from the user

  You can expand this as you please
*/
const omnyInputValid = function(text) {
  if(text.length == 0) {
    // We don't want to accept an empty label
    return false;
  }

  return true;
}
