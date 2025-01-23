
   const baseUrl="https://tarmeezacademy.com/api/v1"
   
   function profileClicked(){
    const user =  getCurrentUser()
     const userId= user.id

   window.location=`./profile.html?userid=${userId}`
   }  
   //ذا كان المستخدم قد سجل الدخول، يظهر زر إضافة المنشور وزر تسجيل الخروج.
function setupUI(){
  const token= localStorage.getItem("token")

  const loginDiv= document.getElementById("logged-in-div")
  
  const logoutbtn=document.getElementById("logout-btn")

  //add btn
  const addBtn= document.getElementById("add-button")
 
  if(token== null)//user is guest (not logged in)
  {
    if(addBtn !=null)
    {
      addBtn.style.setProperty("display","none","important")

    }
   
     loginDiv.style.setProperty("display","flex","important")
     logoutbtn.style.setProperty("display","none","important")
  } else{//for logged in user 
    if(addBtn !=null)
      {
        addBtn.style.setProperty("display","block","important")
      }
   
    loginDiv.style.setProperty("display","none","important")
     logoutbtn.style.setProperty("display","flex","important")

     const user = getCurrentUser()
     document.getElementById("nav-username").innerHTML=user.username
     document.getElementById("nav-user-image").src=user.profile_image
   
     
  }
}
//==========Auth Functions
function Logbtnclick(){
  let userName=document.getElementById("userName-input").value
 let password=document.getElementById("password-input").value

         const params=
                   {
                         "username":userName,
                         "password":password

                     }

        const Url=`${baseUrl}/login`
        toggleLoder(true)
        axios.post(Url,params)
          .then((response)=>{
            toggleLoder(false)
          // console.log(response.data)
            localStorage.setItem("token",response.data.token)
            //convert from json to string
            localStorage.setItem("user",JSON.stringify(response.data.user)) 
             
          // Close dialog
         const modal = document.getElementById("LoginModal");
         const modalInstance = bootstrap.Modal.getInstance(modal); 
      
             modalInstance.hide(); // إخفاء النافذة إذا كانت موجودة
           showAlert('You have successfully logged in!',"suceess");
          
           setupUI();
           }) .catch((error) => {
            //     // التعامل مع الأخطاء
                const message = error.response.data.message ;
                 showAlert(message,"danger");
            }).finally(() => {
              toggleLoder(false);
          });
      
         
}

function RegistebtnClicked() {
  let userName = document.getElementById("register-Name-input").value;
  let name = document.getElementById("register-userName-input").value;
  let password = document.getElementById("register-password-input").value;
  let image = document.getElementById("register-Image-input").files[0];


  let formData= new FormData()
  formData.append("username",userName)
  formData.append("name",name)
  formData.append("password",password)
  formData.append("image",image)

         const Headers= {
          "Content-Type":"multipart/form-data"
         }
        

  const url=`${baseUrl}/register`
  toggleLoder(true);
  axios.post(url, formData,{
    headers: Headers
  })
      .then((response) => {
        
        toggleLoder(false);

        console.log(response)
          // حفظ التوكن والمستخدم في التخزين المحلي
          localStorage.setItem("token", response.data.token); // تأكد أن مفتاح الـ Token مكتوب صحيحًا
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // إغلاق الـ modal
          const model = document.getElementById("RegisterModal");
          const modelInstance = bootstrap.Modal.getInstance(model); // تأكد من كتابة Modal وليس model
          modelInstance.hide();

          // عرض رسالة نجاح
          showAlert("New User Successfully Registered","suceess");
          setupUI();
      })
     .catch((error) => {
      //     // التعامل مع الأخطاء
          const message = error.response.data.message ;
           showAlert(message,"danger");
      }).finally(() => {
        toggleLoder(false);
    });

}

function logout(){
  localStorage.removeItem("token")
  localStorage.removeItem("user")
 showAlert('You have successfully logged out!');
  setupUI()
  
}

//showAlert()
function showAlert(customMessage,type="success") {
  // البحث عن مكان وضع التنبيه
  const alertPlaceholder = document.getElementById('SuccessAlert');

  // تعريف دالة لإنشاء التنبيه
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>',
    ].join('');
    console.log(alertPlaceholder)
    // إضافة التنبيه إلى العنصر الحاوي
    alertPlaceholder.append(wrapper);
  };

  // استدعاء دالة إنشاء التنبيه
  appendAlert(customMessage, 'success');

  // إخفاء التنبيه بعد 2 ثانية
  setTimeout(() => {
    const alertToHide = alertPlaceholder.querySelector('.alert'); // إيجاد أول تنبيه
    if (alertToHide) {
      alertToHide.remove(); // إزالة التنبيه من DOM
    }
  }, 2000);
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    try {
      user = JSON.parse(storageUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return user;
}


function editpostBtnClicked(postObject){
  let post= JSON.parse(decodeURIComponent(postObject))
  console.log(post)
  
  document.getElementById("post-modal-submit-btn").innerHTML="Update"
  document.getElementById("post-id-input").value=post.id
  document.getElementById("post-modal-title").innerHTML="Edit-Post"
   document.getElementById("Post-input").innerHTML=post.title
     document.getElementById("body-input").innerHTML=post.body
  let postModal =new bootstrap.Modal(document.getElementById("Creat-Post-Modal"),{})
  //to open or close modal
  postModal.toggle()
  }
  
  //delete
  function deletepostBtnClicked(postObject){
  
  let post= JSON.parse(decodeURIComponent(postObject))
  console.log(post)
  
  document.getElementById("delet-post-id-input").value=post.id
  let postModal =new bootstrap.Modal(document.getElementById("Delete-Post-Modal"),{})
  //to open or close modal
  postModal.toggle()
  
  }
  function ConfirmPostDelete(){
            let token = localStorage.getItem("token");
            if (!token) {
              showAlert("Token is missing. Please login again.", "danger");
              return;
            }
  
         // الحصول على PostId من الإدخال
          const PostId = document.getElementById("delet-post-id-input")?.value;
          if (!PostId) {
            showAlert("Post ID is missing. Please select a post to delete.", "danger");
            return;
          }
  
           const Url=`${baseUrl}/posts/${PostId}`
           const Headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        
          };
        
          axios.delete(Url,  {
            headers: Headers
          })
             .then((response)=>{
             // إغلاق المودال عند نجاح الطلب
              const modal = document.getElementById("Delete-Post-Modal");
              const modalInstance = bootstrap.Modal.getInstance(modal);
              modalInstance.hide();   
              // عرض رسالة نجاح
              showAlert("The post Has been Deleted Successfully", "success");
              getPosts()
              
              }) .catch((error) => {
                // التعامل مع الأخطاء
                const message = error.response?.data?.message || "An error occurred.";
                showAlert(message, "danger");
              });
          }
          document.getElementById("closeBtn").addEventListener("click", function() {
            const modalElement = document.getElementById("RegisterModal"); // استبدل 'myModal' بمعرف النافذة المنبثقة
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide(); // إغلاق النافذة
          });


      
function toggleLoder(show=true){

  if(show){
     document.getElementById("loader").style.visibility='visible'
  }else{    
      document.getElementById("loader").style.visibility='hidden'
   }

 }