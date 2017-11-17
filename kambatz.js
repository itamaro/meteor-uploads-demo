FS.debug = true;
Bills = new FS.Collection("bills", {
  stores: [new FS.Store.FileSystem("bills")]
});

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.uploadFile.events({
    'change .myFileInput': function(event, template) {
      FS.Utility.eachFile(event, function(file) {
        Bills.insert(file, function (err, fileObj) {
          //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        });
      });
    }
  });

  Template.uploadFile.events({
    // Catch the dropped event
    'dropped #dropzone': function(event, temp) {
      console.log('files dropped');
      FS.Utility.eachFile(event, function(file) {
        Bills.insert(file, function (err, fileObj) {
          //If !err, we have inserted new doc with ID fileObj._id, and
          //kicked off the data upload using HTTP
        });
      });
    }
  });

  Template.billView.helpers({
    bills: function() {
      return Bills.find();
    },
    'selectedClass': function() {
      if (this._id == Session.get('selectedItem')) {
        return "selected";
      }
    }
  });

  Template.billView.events({
    'click .billitem': function(event) {
      var selectedItem = this._id;
      Session.set('selectedItem', selectedItem);
      var selectedBill = Bills.findOne(selectedItem);
      console.log('bill item clicked ' + selectedItem);
      var url = selectedBill.url();
      // Create PDF
      PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
          // Fetch the first page
          pdf.getPage(1).then(function getPageHelloWorld(page) {
              var scale = 1;
              var viewport = page.getViewport(scale);

              // Prepare canvas using PDF page dimensions
              var canvas = document.getElementById('pdfcanvas');
              var context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              // Render PDF page into canvas context
              page.render({canvasContext: context, viewport: viewport}).promise.then(function () {

              });
          });
      });
    }
  });

  Template.billView.rendered = function() {
    console.log("Hey from rendered");
    // Set worker URL to package assets
    PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
