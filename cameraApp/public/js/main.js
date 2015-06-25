


var socket = io.connect(window.location.hostname+':8080');

socket.on('init', function(images){
  console.log(">> socket.on: init");
  allImages = images;
  console.log("allImages length: "+allImages.length);
  IMAGE_TAKER = true;
  setupPages(null, function(imgIdx){
    loadImages(imgIdx, function(){ });
  });
});


socket.on('approved', function(image){
  console.log('approved: \n %s',JSON.stringify(image));
  var thisImgIdx = _.findIndex(allImages, {'_id':image._id});
  allImages[thisImgIdx].approved = true;

  var imageElm = document.getElementsByClassName(image._id)[0];
  if(imageElm){ //we are on the page of this newly approved item
    //console.log(imageElm);
    var button = imageElm.getElementsByClassName('approve')[0];
    button.className = "btn btn-primary approve active";
  }
});


socket.on('hearted', function(image){
  console.log('hearted: \n %s',JSON.stringify(image));
  var thisImgIdx = _.findIndex(allImages, {'_id':image._id});
  allImages[thisImgIdx].hearted = true;

  var imageElm = document.getElementsByClassName(image._id)[0];
  if(imageElm){
    //console.log(imageElm);
    var button = imageElm.getElementsByClassName('heart')[0];
    button.className = "btn btn-danger heart active";
  }
});


socket.on('new-image', function(image){
  allImages.push(image);
  console.log(">> socket.on: new-image, allImages length: "+allImages.length);
});


socket.on('finished', function(latestImages){
  console.log("socket: finished");
  console.log('recieved images:',JSON.stringify(latestImages));
  allImages = latestImages;
  loadImages(0, function(){});
  // for(var i; i< latestImages.length; i++){ //partial page (if last page has less than full pageSize)
  //   //console.log('allImages['+j+']');
  //   var thisImage = new ImageElement(latestImages[i]);
  //   imagesHolder.insertBefore(thisImage, imagesHolder.firstChild);
  // }
  $('#processingDialog').modal('hide');
  $('#loadingDialog').modal('hide');

  //location.reload();
  // if(!IMAGE_TAKER) IMAGE_TAKER = (currentPage == totalPages-1)? true : false; //if we're on the last page, then update
  // if(IMAGE_TAKER){
  //   setupPages(null, function(imgIdx){
  //     loadImages(imgIdx, function(){
  //       $('#processingDialog').modal('hide');
  //       $('#loadingDialog').modal('hide');
  //     });
  //   });
  // }
});


socket.on('loading', function(){
  console.log('received loading...');
  $('#processingDialog').modal('show');
});






/* session vars */
var pageSize = 10; //how many images per page to show
var totalPages;
var currentPage;
var allImages = [];
var IMAGE_TAKER = false;

$(document).ready(function(){
  console.log("pageSize: "+pageSize + " imgs per page");
  $('.take-photo').click(function(e){
    IMAGE_TAKER = true;
    $('#processingDialog').modal('show');
    socket.emit('snap',{snap: 0});
  });
});


var Pagination = function(thisPage, numPages){
  this.pagination = document.createElement("ul");
  this.pagination.className = "pagination pagination-lg";

  this.previous = document.createElement("li");
  this.previous.insertAdjacentHTML('afterbegin', '<a href="#" class="prev-page" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>');
  this.pagination.appendChild(this.previous);
  var pageStart = numPages;
  if(numPages > 6){
    pageStart = numPages-3;
    //this.pagination.insertAdjacentHTML('afterbegin', '...');
  }
  if(thisPage !== null){ //sometimes thisPage is '0'!
    //console.log("thisPage: "+thisPage);
    pageStart = thisPage;
  }
  // var below = (pageStart>3)? 3 : 3-pageStart;
  //console.log("-- pageStart: "+pageStart);
  var below = ((pageStart+3)>numPages)? 2+(numPages-pageStart) : 3;
  //console.log("-- below: "+below);
  //var above = ((pageStart-3)<=0) ? pageStart : 3;
  var above = (pageStart < 3)? (3+(3-pageStart)) : 3;
  //console.log("-- above: "+above);
  for(var i=pageStart-below; i<pageStart+above; i++){
    if(i<numPages && i>=0){
      this.page = document.createElement("li");
      this.pageLink = document.createElement("a");
      this.pageLink.className = "pagenum";
      this.pageLink.setAttribute("value", i);

      attachPageLinkListener(this.pageLink, i);

      this.pageNumber = document.createTextNode(i);
      this.pageLink.appendChild(this.pageNumber);
      this.page.appendChild(this.pageLink);
      this.pagination.appendChild(this.page);
    }
  }
  //if(pageStart+5 <numPages) this.pagination.insertAdjacentHTML('afterend','...');
  function attachPageLinkListener(_pageLink, pageNum){
    _pageLink.addEventListener("click",function(e){
      console.log("page click: "+pageNum);
      goToPage(pageNum);
    });
  }

  this.next = document.createElement("li");
  this.next.insertAdjacentHTML('afterbegin', '<a href="#" class="next-page" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>');
  this.pagination.appendChild(this.next);

  this.previous.addEventListener("click", function(e){
    if(currentPage>0) goToPage(currentPage-1);
  });
  this.next.addEventListener("click", function(e){
    if(currentPage<totalPages-1) goToPage(currentPage+1);
  });

  return this.pagination;
};



var setupPages = function(pageNum, cb){
  totalPages = Math.ceil(allImages.length / pageSize);
  console.log("setupPages, totalPages: "+totalPages);
  var navPageList = document.getElementById("page-list");
  navPageList.removeChild(navPageList.firstChild); //get rid of entire <ul>
  navPageList.appendChild(new Pagination(pageNum, totalPages));

  if(IMAGE_TAKER) currentPage = totalPages-1;
  else currentPage = pageNum;

  $("a.pagenum[value='"+currentPage+"']").parent().addClass("active");
  var imgIdx = (currentPage*pageSize);
  cb(imgIdx);
};


var loadImages = function(idx, cb){
  console.log("loadImages, idx: "+idx);

  var imagesHolder = document.getElementsByClassName("images")[0];
  clearHolder(imagesHolder, function(){
    for(var j=idx; j<idx+pageSize; j++){
      if(j < allImages.length){ //partial page (if last page has less than full pageSize)
        //console.log('allImages['+j+']');
        var thisImage = new ImageElement(allImages[j]);
        imagesHolder.insertBefore(thisImage, imagesHolder.firstChild);
      }
    }
    IMAGE_TAKER = false;
    cb();
  });
};


var goToPage = function(pageNum){
  console.log("goToPage: "+pageNum);
  $("a.pagenum").parent().removeClass("active");
  $("a.pagenum[value='"+pageNum+"']").parent().addClass("active");
  IMAGE_TAKER = false;
  setupPages(pageNum,function(imgIdx){
    loadImages(imgIdx, function(){
      currentPage = pageNum;
    });
  });
};


var clearHolder = function(holder, cb){
  while (holder.firstChild) {
    holder.removeChild(holder.firstChild); //clear out all current images
  }
  // return true;
  cb();
};







var ImageElement = function(image){
  // console.log("IMAGE : "+JSON.stringify(image,null,'\t'));
  this.imgHolder = document.createElement("div");
  this.imgHolder.className = "image col-xs-6 col-md-3 col-lg-4 "+image.camera;

  this.thumbHolder = document.createElement("div");
  this.thumbHolder.className = "thumbnail";

  this.img = document.createElement("img");
  this.img.src = 'images/'+image.path;

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
