(function() {
  var begin = document.getElementById('begin');
  if (begin) begin.insertAdjacentHTML('afterend', 
    '<div class="version">Singular version ' + singular.version + '</div>');
})();
