var ImageElement = function(image){
  // console.log("IMAGE : "+JSON.stringify(image,null,'\t'));
  this.imgHolder = document.createElement("div");
  this.imgHolder.className = "image col-xs-6 col-md-3 col-lg-4 "+image._id;

  this.thumbHolder = document.createElement("div");
  this.thumbHolder.className = "thumbnail";

  this.img = document.createElement("img");
  this.img.src = 'scaled-images/'+image.path;

  this.caption = document.createElement("div");
  this.caption.className = "caption";

  this.caption.appendChild(new _ButtonToolbar(image));
  //this.caption.appendChild(this.imgLabel);

  this.thumbHolder.appendChild(this.img);
  this.thumbHolder.appendChild(this.caption);
  this.imgHolder.appendChild(this.thumbHolder);

  //console.log(this);
  return this.imgHolder;
};

var _ButtonToolbar = function(image){

  this.btntoolbar = document.createElement("div");
  this.btntoolbar.className = "btn-toolbar";
  this.btntoolbar.setAttribute("role", "toolbar");

  this.btngroup = document.createElement("div");
  this.btngroup.className = "btn-group";
  this.btngroup.setAttribute("role", "group");

  // this.btngroup.appendChild(new _Button(image,'details', 'search',false));
  this.btngroup.appendChild(new _Button(image,'approve', 'ok', image.approved));
  this.btngroup.appendChild(new _Button(image,'heart', 'heart', image.hearted));

  this.imagePath = document.createTextNode(image.path);
  this.imgLabel = document.createElement("p");
  this.imgLabel.appendChild(this.imagePath);
  this.imgLabel.className = "label inverse image-path";

  this.btntoolbar.appendChild(this.btngroup);
  this.btngroup.appendChild(this.imgLabel);

  return this.btntoolbar;
};



var _Button = function(image,cl,glyph,state){
  var _this = this;
  this.span = document.createElement("span");
  this.span.className = "glyphicon glyphicon-"+glyph;

  this.btn = document.createElement("button");

  if(cl === 'approve') this.btn.className = (state)? "btn btn-primary "+cl+" active" : "btn btn-default "+cl+" inactive";
  else if(cl === 'heart') this.btn.className = (state)? "btn btn-danger "+cl+" active" : "btn btn-default "+cl+" inactive";
  else this.btn.className = (state)? "btn btn-default "+cl+" disabled" : "btn btn-default "+cl;

  this.btn.setAttribute("role", "button");
  this.btn.setAttribute("type", "button");
  if(state === false){
    this.btn.addEventListener("click",function(e){
      switch(cl){
        case 'approve':
            socket.emit(cl,{_id: image._id});
            image.approved = true;
            _this.btn.className = "btn btn-primary "+cl+" active";
          break;
        case 'heart':
            socket.emit(cl,{_id: image._id});
            image.hearted = true;
            _this.btn.className = "btn btn-danger "+cl+" active";
          break;
        default:
          break;
      }
    });
  }
  this.btn.appendChild(this.span);

  return this.btn;
};
