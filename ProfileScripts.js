setupUI()
getUser()
getPosts()
function currentGetUserId(){
    const urlparams = new URLSearchParams(window.location.search)
    const id= urlparams.get("userid")
    return id
}

function getUser(){
  const id=currentGetUserId()


  axios.get(`${baseUrl}/users/${id}`)

   .then(function (response) {
 const user= response.data.data
 document.getElementById("email-main-info").innerHTML=user.email
 document.getElementById("user-main-info").innerHTML=user.name
 document.getElementById("username-main-info").innerHTML=user.username
 document.getElementById("main-info-mage").src=user.profile_image
 document.getElementById("name-posts").innerHTML=user.username
 

 //post&&comment count
 document.getElementById("comment-count").innerHTML=user.comments_count
 document.getElementById("post-count").innerHTML=user.posts_count
   
   })
}


function getPosts(){

   const id=currentGetUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
    
    .then(function (response) {

    const Posts=response.data.data
      document.getElementById("user-post").innerHTML=""
     for(post of Posts){
  
       const author= post.author
      let PosstTitle= ""
     
      //showor hide (edit) button
      let user =getCurrentUser()
    //sure be usere 
      let isMyPost= user !=null && post.author.id ==user.id
    
      let buttonContent=``
    //اظهار+
      if(isMyPost){
        buttonContent=`
        
         
        <button class='btn btn btn-danger' style='  float:right;  margin-left: 5px;'
        onclick="deletepostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
        Delete</button>
        
        <button class='btn btn btn-secondary' style='float:right'
        onclick="editpostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
        Edit</button>`
        
      }
      if(PosstTitle !== "" && PosstTitle !== null){
      
      PosstTitle = post.title || "Untitled";
    
    
      }
       let content=
     `
           <div class="card  shadow " >
                 <div class="card-header">
                   <img  class="rounded-circle border border-2" src="${author.profile_image}" style="height: 40px; width: 40px;"/>
                 <b>${author.username}</b>
                 // <!--Edit-->
                      // <!--     لحل مشكلة كتابة html inside java script-->
                 ${buttonContent}
                 </div>
                 <div class="card-body" onclick="postClicked(${post.id})"style="cursor: pointer;">
                     <img style="width: 100%;"  src="${post.image}" />
                 <h6 style="color: rgb(193,193,193);" class="mt-1">
                    ${post.created_at}
                 </h6>
                <h5>
                ${PosstTitle}
                </h5>
                <p id="PostHtml">
                 ${post.body}
                </p>
                <hr/>
                <div>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                     <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                   </svg>
                 <span>
                   ${post.comments_count}Comments
                   <span id="post-tags-${post.id}">
    
                     </span>
                 </span>
                
               
             </div>
                 </div>
               
               </div>
     `
        document.getElementById("user-post").innerHTML+=content
        
        const currentPostTagId=`post-tags-${post.id}`
        document.getElementById(currentPostTagId).innerHTML=""
    
        for(tag of post.tags){
         console.log(tag.name)
    
         let tagsContent= 
         `
    
                     <button class="btn btn-5m rounded-5"
                     style="background-color:gray" color:"white">
                             ${tag.name}
                       </button>
    
         `
         document.getElementById(currentPostTagId).innerHTML+= tagsContent
    
        }
     }
    
    })
    }