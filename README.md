# Lesson App - Full Stack


## What is new in this version

![Frontend Developer](https://user-images.githubusercontent.com/116739961/216628393-b74adccc-03ed-47b7-8353-e99ad3b6da31.png)

- [x] Create a backend using Express.js, Node.js and MongoDB
- [x] Create a server with Express.js
- [x] Store data using MonoDB
- [x] Adding login functionality 
- [x] Adding 404 erorr page 
- [x] Connect API with Vue app using fetch method
- [x] All functionality works now with API server
   - [x] <b>GET</b> all lessons
   - [x] <b>POST</b> lesson to the cart
   - [x] <b>GET</b> user cart
   - [x] <b>GET</b> all lessons
   - [x] <b>DELETE</b> lesson from the cart
- [x] Upload the full-stack app at [railway](https://railway.app/) live-demo below 👇

## API JSON

when the path is <b>`https://lesson-shop.up.railway.app/api/lessons`</b> the server will return a list of lessons (example below) 
```json
[
    {
      "_id": "63dca1f1cf294db1247b790b",
      "lessonId": 1,
      "topic": "Algebra",
      "location": "London",
      "price": 200,
      "image": "https://therealschool.in/blog/wp-content/uploads/2021/06/algebra-games-for-kids-1.jpg",
      "icon": "fa-solid fa-square-root-variable"
    },
]
```

when the path is <b>`https://lesson-shop.up.railway.app/api/users`</b> the server will return a user details (example below) 
```json
{
"email": "user@email.com",
"password": "mypassword"
}
```

GitHub Repo: https://github.com/Elijahitiary/lesson-app-v2 <br />
Live Demo: https://lesson-shop.up.railway.app/

<a href='https://www.mongodb.com/cloud/atlas/lp/try4?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_prosp-brand_gic-null_emea-eg_ps-all_desktop_eng_lead&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624392&adgroup=115749716783&cq_cmp=12212624392&gclid=EAIaIQobChMI-fahtfr5_AIViPh3Ch2IzgT6EAAYASAAEgIjMPD_BwE'><img width='40px' src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Antu_mongodb.svg/1200px-Antu_mongodb.svg.png'/></a> <a href='https://railway.app/'><img width='40px' src='https://railway.app/brand/logo-dark.svg'/></a> <a href='https://nodejs.org/en/'><img width='40px' src='https://cdn-icons-png.flaticon.com/512/919/919825.png'/></a> <a href='https://expressjs.com/'><img width='40px' src='https://wsofter.ru/wp-content/uploads/2017/12/node-express.png'/></a> <a href='https://vuejs.org/'><img width='40px' src='https://www.openxcell.com/wp-content/uploads/2021/11/vuejs-inner.svg'/></a>
<hr/>


<b>previous version:</b> https://github.com/Elijahitiary/lesson-app
