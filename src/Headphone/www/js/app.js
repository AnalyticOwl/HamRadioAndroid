function log(_message, strConcat) {
      if (strConcat) {
            console.log(strConcat + " " + _message);
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
            console.log(strConcat + " " + _message);
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
                  beforeSend: function () {
                        ShowLoader();
                  },
                  method: "GET",
                  data: jsonData,
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
            }).fail(function () {
                  elog("error");
            }).always(function () {
                  HideLoader();
                  log("complete");
            });
      } else {
            return $.ajax({
                  url: _url,
                  beforeSend: function () {
                        ShowLoader();
                  },
                  method: "GET",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
            }).fail(function () {
                  elog("error");
            }).always(function () {
                  HideLoader();
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
            beforeSend: function () {
                  ShowLoader();
            },
            data: { 'data': _data },
      }).fail(function (data) {
            elog("error");
            elog(data);
      }).always(function () {
            HideLoader();
            log("complete");
      });
}
function gotoPage(_pageName) {
      if (_pageName.indexOf(".html") > 0) {
            log("going to html page");
            window.location.href = _pageName;
      }
      else {
            log(_pageName, "going to inner page");
            $.mobile.changePage("#" + _pageName, { allowSamePageTransition: true });
            //$.mobile.navigate( "#" + _pageName );
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
function ShowLoader(msg, isDisablescreen) {
      if (window.plugins) {
            if (isDisablescreen) {
                  window.plugins.spinnerDialog.show(null, msg, isDisablescreen);
            } else {
                  window.plugins.spinnerDialog.show(null, msg, null);
            }
      }
      log('loader show');
}
function HideLoader() {
      if (window.plugins) {
            window.plugins.spinnerDialog.hide();
      }
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
      //log(returnValue);
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
function goback() {
      parent.history.back();
}
