function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

// DONE: Instead of a global `articles = []` array, let's track this list of all articles directly on the
// constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves
// objects, which means we can add properties/values to them at any time. In this case, we have
// a key/value pair to track, that relates to ALL of the Article objects, so it does not belong on
// the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// DONE: There are some other functions that also relate to articles across the board, rather than
// just single instances. Object-oriented programming would call these "class-level" functions,
// that are relevant to the entire "class" of objects that are Articles.

// DONE: This function will take the rawData, how ever it is provided,
// and use it to instantiate all the articles. This code is moved from elsewhere, and
// encapsulated in a simply-named function for clarity.
Article.loadAll = function(rawData) {
  // console.log('The rawData vairable is: ' + rawData);
  // console.log('This is rawData: '+ rawData);
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
Article.fetchAll = function() {
  var storedEtag;
  $.ajax({
    type: 'HEAD',
    url: 'data/hackerIpsum.json',
    success: function(data, message, xhr) {
      storedEtag = xhr.getResponseHeader('etag');
      if (storedEtag === localStorage.etag && localStorage.rawData) {
        // console.log('We started the IF statement');
        // When rawData is already in localStorage,
        // we can load it by calling the .loadAll function,
        // and then render the index page (using the proper method on the articleView object).
        Article.loadAll(JSON.parse(localStorage.rawData)); //DONE: What do we pass in here to the .loadAll function?
        articleView.initIndexPage();//(); //DONE: Change this fake method call to the correct one that will render the index page.
        // console.log('We completed the IF statement');
      } else {
        // console.log('We started the ELSE statement');
        // DONE: When we don't already have the rawData, we need to:
        // 1. Retrieve the JSON file from the server with AJAX (which jQuery method is best for this?),
          //Use the getJSON call here.
        $.getJSON('/data/hackerIpsum.json', function (data) {
          Article.loadAll(data);
          localStorage.setItem('etag', storedEtag);
          localStorage.setItem('rawData', JSON.stringify(data));
          articleView.initIndexPage();
        });
        // console.log('rawData is: ' + rawData);
        // 2. Store the resulting JSON data with the .loadAll method,
          // console.log(rawData);
        // Article.loadAll(rawData);
        // 3. Cache it in localStorage so we can skip the server call next time, (index page...)
        // 4. And then render the index page (perhaps with an articleView method?).
        // console.log('We completed the ELSE statement');
      }
    }
  });
};
