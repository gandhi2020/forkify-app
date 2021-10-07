class SearchView{
  _parentEl = document.querySelector('.search');

  getQuery() {
    // console.log("inside getQuery method in SearchView");
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      // console.log("inside addHandlerSearch method");
      // return handler();
      handler();
    });
  }
}

export default new SearchView();
