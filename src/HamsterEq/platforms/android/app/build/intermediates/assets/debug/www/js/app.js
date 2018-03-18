
function log(_message, strConcat) {
      if (strConcat) {
            console.log(strConcat + _message);
      }
      else {
            console.log(_message);
      }
}

function elog(_message) {
      try {
            console.log(_message);
      } catch (exception) {
            console.log(exception);
      }

}
function jlog(_message, strConcat) {
      _message = JSON.stringify(_message);
      if (strConcat) {
            console.log(strConcat + _message);
      }
      else {
            console.log(_message);
      }
}

function msg(_message) {
      alert(_message);
}

// method to request data from server
function GetAjax(_url, _data) {
      jsonData = JSON.stringify(_data);
      if (_data) {
            return $.ajax({
                  url: _url,
                  method: "GET",
                  data: jsonData,
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",

            }).fail(function () {
                  elog("error");
            })
                  .always(function () {
                        log("complete");
                  });
      } else {
            return $.ajax({
                  url: _url,
                  method: "GET",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
            }).fail(function () {
                  elog("error");
            })
                  .always(function () {
                        log("complete");
                  });
      }

}

// method to post data to server
function PostAjax(_url, _data) {
      log('PostAjax starts');
      log('finalized json Object to be sent =  ' + _data);
      return $.ajax({
            method: "POST",
            url: _url,
            data: { 'data': _data },
      }).fail(function (data) {
            elog("error");
            elog(data);
      })
            .always(function () {
                  log("complete");
            });
}

function gotoPage(_pageName) {

      // $("body").pagecontainer("change", _pageName, {
      //       transition: 'flow',
      //       reload    : true
      //     });
      if (_pageName.indexOf(".html") > 0) {
            log("going to html page");
            $.mobile.pageContainer.pagecontainer("change", _pageName, { reloadPage: true });
      }
      else {
            log(_pageName, "going to inner page");
            $.mobile.changePage("#" + _pageName);
      }
}
function openDialog(_dialogName) {
      log(_dialogName, "going to dialog:");
      $.mobile.changePage('#' + _dialogName, { role: "dialog" });
}

function openPopup(_PopupName) {
      log(_PopupName, "going to Popup:");
      $.mobile.changePage('#' + _PopupName, { role: "popup" });
}

function ShowLoader() {
      if (window.plugins) {
            window.plugins.spinnerDialog.show();
      }
      log('loader show');
}
function HideLoader() {
      if (window.plugins) {
            window.plugins.spinnerDialog.hide();
      }
      log('loader hide');
}

function SaveLocal(_key, _val) {
      try {
            log(_key, "key=");
            log(_val, "val=");
            localStorage.setItem(_key, _val);
      }
      catch (exception) {
            elog(exception);
      }
}

function GetLocal(_key) {
      var returnValue = localStorage.getItem(_key);
      log(returnValue);
      return returnValue;
}
function RemoveLocal(_key) {
      localStorage.removeItem(_key);
}
function SaveSession(_key, _val) {
      try {
            sessionStorage.setItem(_key, _val);
      }
      catch (exception) {
            elog(exception);
      }

}
function GetSession(_key) {
      try {
            return sessionStorage.getItem(_key);
      }
      catch (exception) {
            elog(exception);
      }
}

function RemoveSession(_key) {
      try {
            sessionStorage.removeItem(_key);
      }
      catch (exception) {
            elog(exception);
      }
}