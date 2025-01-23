let currentpage=1
let Lastpage=1
setupUI()
// Infinative scroll=========
window.addEventListener("scroll",function(){

//boleen هل المستخدم الى نهاية الصفحة من عدمه""التغير العمودي ويقارنه بطول الصفحة"

const endOfpage = window.innerHeight + window.scrollY >= document.body.scrollHeight;
 console.log(window.innerHeight ,window.scrollY, document.body.scrollHeight)

 
if(endOfpage&& currentpage< Lastpage){
 currentpage=currentpage+1
 //استدعاء البوستات
 getPosts(false,currentpage)
}
});

getPosts()
function getPosts(reload=true, page=1){
  toggleLoder(true)
// Make a request for a user with a given ID
axios.get(`${baseUrl}/posts?limit=2&page=${page}`)

.then(function (response) {
  toggleLoder(false)
 // handle success
 
const Posts=response.data.data
Lastpage= response.data.meta.last_page
if(reload){
document.getElementById("posts").innerHTML=""
}

 for(post of Posts){
   //console.log(Posts);
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
             <span onclick="userClicked(${author.id})" style="cursor: pointer;">
               <img  class="rounded-circle border border-2" src="${author.profile_image}" style="height: 40px; width: 40px;"/>
                <b>${author.username}</b>
               </span>
             
            
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
    document.getElementById("posts").innerHTML+=content
    
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

function postClicked(postId){

 window.location=`PostDetail.html?postId=${postId}`

 }

function CreatAnewPostClicked() {
  
  // استدعاء القيم من الحقول
  let postId = document.getElementById("post-id-input").value;
  let isCreat = postId == null || postId == "";

  let Title = document.getElementById("Post-input").value;
  let body = document.getElementById("body-input").value;
  let image = document.getElementById("Post-image-input").files[0];
  let token = localStorage.getItem("token");

  // التحقق من إدخال الحقول المطلوبة
  if (!Title || !body) {
    showAlert("Please fill all required fields", "danger");
    return;
  }

  // إعداد البيانات المرسلة
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", Title);

  // إضافة الصورة إذا كانت موجودة
  if (image) {
    formData.append("image", image);
  }

  // تعيين رابط الطلب
  let Url = "";
  if (isCreat) {
    Url = `${baseUrl}/posts`;


  } else {
    formData.append("_method", "PUT");
    Url = `${baseUrl}/posts/${postId}`;
  }

  // إعداد الترويسة
  const Headers = {
    "Content-Type":"multipart/form-data",
    Authorization: `Bearer ${token}`,

  };
 toggleLoder(true);
  // إرسال الطلب باستخدام Axios
  axios
    .post(Url, formData, {
      headers: Headers,
    })
    .then((response) => {
      toggleLoder(false);
      // إغلاق المودال عند نجاح الطلب
      const modal = document.getElementById("Creat-Post-Modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      // عرض رسالة نجاح
      showAlert("New Post Has been Created Successfully", "success");

      // تحديث قائمة المنشورات
      getPosts();
    })
    .catch((error) => {
      // التعامل مع الأخطاء
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      showAlert(message, "danger");
    }).finally(() => {
      toggleLoder(false);
  });

}



 

function addbtnClick(){


document.getElementById("post-modal-submit-btn").innerHTML="Creat"
document.getElementById("post-id-input").value=""
document.getElementById("post-modal-title").innerHTML="Creat Anew-Post"
 document.getElementById("Post-input").innerHTML=""
   document.getElementById("body-input").innerHTML=""
let postModal =new bootstrap.Modal(document.getElementById("Creat-Post-Modal"),{})
//to open or close modal
postModal.toggle()


}
//console.log("Test",postClicked(120))

function userClicked(userId){
  //alert(userId)
  
 window.location=`./profile.html?userid=${userId}`
}
