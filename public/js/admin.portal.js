var myAxios = axios.create({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});
myAxios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      // return authHelper.logOut("./sign-in.html");
    } else {
      return Promise.reject(error);
    }
  }
);
var authHelper = {
  isLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
      var userData = this.parseToken(token);
      var expirationDate = new Date(userData.exp * 1000);
      if (Date.now() > expirationDate) this.logOut();
      return true;
    } else {
      return false;
    }
  },
  parseToken(token) {
    if (token) {
      return JSON.parse(window.atob(token.split(".")[1]));
    }
  },
  logOut() {
    localStorage.removeItem("token");
  }
};
const PROD_API_URL = 'ec2-54-90-69-186.compute-1.amazonaws.com/api/'
const API_URL = "http://localhost:3000/api/";
const ADMIN_URL = "http://localhost:3000/admin/";

function getPendingListings(loader, page, text, pendingArr) {
 
  myAxios
    .get(ADMIN_URL + "pendingListings")
    .then(response => {
      const listings = response.data;
      console.log(response);
      // $(loader).css("display", "none");
      // $(page).fadeIn();
      if (listings.length !== 0) {
        listings.forEach(listing => {
          $(page)
            .append(`<div
            style="margin-bottom: 1rem; background: #f8f8f8"
            class="ui grid segment listingItem-search"
            id="list-item"
          >
            <div style="padding: 1rem; padding-right: 0px;" class="row">
              <div  class="five wide middle aligned column">
                <div class="ui image" >
                    <img 
                    style="max-height: 200px;"
                    class="ui rounded fluid image"
                    src="https://ha-images-02.s3-us-west-1.amazonaws.com/${listing.feature_image || "placeholder.png"}"
                  />
                </div>
              </div>
              <div class="eleven wide column">
                <div class="ui grid">
                    <div
                    style="padding: 1rem 0rem 0rem .5rem;"
                    class="ten wide column"
                  >
                    <a href="#" id="${listing.id}" class="listingTitle-search">
                      ${listing.business_title} <i class="tiny check circle icon" style="color: #1f7a8c;" ></i>
                    </a>
                    <p class="listingSubtitle-search">
                      ${listing.category || "" }
                    </p>
                    
                  </div>
                  <div
                  class="six wide computer only column"
                >
                  <p class="listing-info-text">
                    <i style="color: #1f7a8c;" class="small phone icon" ></i>${listing.phone || "999-999-9999"}
                  </p>
                  <p class="listing-info-text">
                    <i style="color: #1f7a8c;" class="location small arrow icon" ></i>${listing.city || listing.full_address}
                  </p>
                  <!-- <button style="margin-top: 1rem; background: #79bcb8; color: white; margin-right: 1.5rem;" class="ui right floated button">Preview</button> -->
                </div>
                
                <div id="listing-tagline-search" class="fourteen wide column">
                    ${listing.tagline} 
                </div>
                </div>
                </div>
              </div>
          </div>`);
          pendingArr.push(listing)
        });
        $(loader).css('display', 'none')
      } else {
        console.log('nothin')
        $(loader).css('display', 'none')
        $(text).css("display", '');
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function getAllListings(loader, page, text) {
 
  myAxios
    .get(ADMIN_URL + "allListings")
    .then(response => {
      const listings = response.data;
      console.log(response);
      // $(loader).css("display", "none");
      // $(page).fadeIn();
      if (listings.length !== 0) {
        listings.forEach(listing => {
          $(page)
            .append(`<div style="margin-bottom: 1rem;" class="listingItem ui grid">
                <div class="row">
                  <div class="six wide middle aligned column">
                    <p class="listingTitle">
                      ${listing.business_title}
                    </p>
                    <p class="listingSubtitle">${listing.business_description}</p>
                  </div>
                  <div class="six wide column"></div>
                  <div class="four wide column">
                    <a id="${listing.id}" class="viewButton">
                      <div style="color: white;" class="listing-buttons " id="${listing.id}">
                        <i style="pointer-events:none" class="eye icon"></i> View
                      </div>
                    </a>
                    <a id="${listing.id}" class="verifyButton">
                      <div  style="color: white;" class="listing-buttons ">
                        <i id="${listing.id}" style="pointer-events:none" style="color: red;" class="check icon"></i>
                        Verify
                      </div>
                    </a>
                  </div>
                </div>
              </div>`);
        });
        $(loader).css('display', 'none')
      } else {
        console.log('nothin')
        $(loader).css('display', 'none')
        $(text).css("display", '');
      }
    })
    .catch(err => {
      console.log(err);
    });
}

$(document).ready(function() {
  const loader = document.querySelector("div#loader-div");
  const page = document.querySelector("div#dashboard-container");
  const homeButton = document.querySelector("div#home-button");
  const pendingLoader = document.querySelector("div#pending-loader");
  const pendingDiv = document.querySelector("div#pending-div");
  const pendingText = document.querySelector('div#no-pending')

  const allLoader = document.querySelector('div#all-loader')
  const allDiv = document.querySelector('div#all-div'); 

  let pendingListings = []; 


  $(loader).css("display", "none");
  $(pendingLoader).css("display", "none");
  $(".vertical.menu .item").tab();

  // $(page).css("display", "none");
  // getPendingListings(loader, page);

  $("body").on("click", "#all-tab", function(event) {
    $(allLoader).css('display', '')
    getAllListings(allDiv, allLoader)
  });

  $("body").on("click", "#pending-tab", function(event) {
    $(pendingLoader).css("display", "");
    getPendingListings(pendingLoader, pendingDiv, pendingText, pendingListings);
  });

  $("body").on("click", "#home-button", function() {
    window.location.assign("index.html");
  });

  $("body").on("click", ".viewButton", function() {
    const id = $(this).attr("id");

    sessionStorage.setItem("currentAuthListing", id);
    window.location.assign("listing.auth.html");
  });

  $("body").on("click", "#newListing", function() {
    window.location.assign("listing.form.html");
  });

  $("body").on("click", "#home-icon-button", function() {
    window.location.assign("index.html");
  });

  $("body").on("click", "#logout-button", function() {
    localStorage.removeItem("token");
    window.location.assign("index.html");
  });

  $("body").on("click", ".verifyButton", function() {
    const id = $(this).attr("id");
    console.log(id);

    myAxios
      .post(ADMIN_URL + "verifyListing", { id: id })
      .then(response => {
        console.log(response);
        alert("user verified");
        $(this).fadeOut();
      })
      .catch(err => {
        console.log(err);
      });
  });

  $("body").on("click", "a.listingTitle-search", function(e) {
    const id = $(this).attr("id");
    // filter arr of all listings on page to find clicked on listing and get the id
    let getCoords = pendingListings.filter(x => x.id === id); 
    // set the last window location to search 
    sessionStorage.setItem('lastLocation', 'search')
    // set the current listing lat and lng in SS
    sessionStorage.setItem('listing-lat', getCoords[0].lat)
    sessionStorage.setItem('listing-lng', getCoords[0].lng)
    // set full address for if no coords 
    sessionStorage.setItem('listing-address', getCoords[0].full_address)
    sessionStorage.setItem("currentListing", id);
    window.location.assign("admin.listing.html");
  });
   
});
