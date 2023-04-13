// Libraries
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

// Custom functions
const common = require("./common");

// MVC imports
const Restaurant = require("./models/restaurant");

// App parameters
const app = express();
const port = 3000;

// Database connection
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb connection error");
});

db.once("open", () => {
  console.log("mongodb connected");
});

// Common variables
const columnInputSettings = {
  name: {
    title: "餐廳名稱",
    type: "text",
  },
  name_en: {
    title: "餐廳名稱(英文)",
    type: "text",
  },
  category: {
    title: "餐廳類別",
    type: "text",
  },
  image: {
    title: "照片連結",
    type: "url",
  },
  location: {
    title: "地點",
    type: "text",
  },
  phone: {
    title: "電話",
    type: "tel",
  },
  google_map: {
    title: "Google地圖連結",
    type: "url",
  },
  rating: {
    title: "評分",
    type: "number",
  },
  description: {
    title: "簡介",
    type: "text",
  },
};

// App settings
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// 1. 首頁
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.error(error));
});

// 2. 搜尋頁面
app.get("/search", (req, res) => {
  const keywords = req.query.keyword.trim();

  // 無關鍵字, 回到首頁
  if (keywords.length === 0) {
    return res.redirect("/");
  }

  // 關鍵字字串處理
  const reg = /\s+/;
  const keywordsLowerCase = keywords
    .split(reg)
    .map((keyword) => keyword.toLowerCase());

  // 以 餐廳名稱 & 餐廳分類 比對搜尋關鍵字
  Restaurant.find({
    $or: [
      {
        name: {
          $in: keywordsLowerCase.map((keyword) => new RegExp(keyword, "i")),
        },
      },
      {
        category: {
          $in: keywordsLowerCase.map((keyword) => new RegExp(keyword, "i")),
        },
      },
    ],
  })
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.error(error));
});

// 3. 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  const endpoint = "/restaurants";
  const method = "POST";
  let forms = "";
  for (const [key, setting] of Object.entries(columnInputSettings)) {
    forms += common.getInputHtml(key, setting.title, setting.type);
  }
  res.render("new", { endpoint, method, forms });
});

// 4. 新增單一餐廳
app.post("/restaurants", (req, res) => {
  Restaurant.findOne()
    .select("id")
    .sort("-id")
    .lean()
    .then((maxIdObj) => {
      const id = maxIdObj.id + 1;

      // ORM新增餐廳資料
      Restaurant.create({
        id: id,
        name: req.body.name,
        name_en: req.body.name_en,
        category: req.body.category,
        image: req.body.image,
        location: req.body.location,
        phone: req.body.phone,
        google_map: req.body.google_map,
        rating:
          !isNaN(req.body.rating.trim()) && req.body.rating.trim().length > 0
            ? parseFloat(req.body.rating)
            : 0.0,
        description: req.body.description,
      });
    })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 5. 取得單一餐廳頁面
app.get("/restaurants/:restaurant_id", (req, res) => {
  Restaurant.findOne({ id: req.params.restaurant_id })
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => {
      console.log(error);
    });
});

// 5. 取得編輯餐廳頁面
app.get("/restaurants/:restaurant_id/edit", (req, res) => {
  Restaurant.findOne({ id: req.params.restaurant_id })
    .lean()
    .then((restaurant) => {
      const endpoint = `/restaurants/${restaurant.id}/edit`;
      const method = "POST";
      let forms = "";

      for (const [key, setting] of Object.entries(columnInputSettings)) {
        forms += common.getInputHtml(
          key,
          setting.title,
          setting.type,
          restaurant[key]
        );
      }

      res.render("new", { endpoint, method, forms });
    })
    .catch((error) => {
      console.log(error);
    });
});

// 6. 更新編輯餐廳資訊
app.post("/restaurants/:restaurant_id/edit", (req, res) => {
  Restaurant.findOne({ id: req.params.restaurant_id })
    .then((restaurant) => {
      restaurant.name = req.body.name;
      restaurant.name_en = req.body.name_en;
      restaurant.category = req.body.category;
      restaurant.image = req.body.image;
      restaurant.location = req.body.location;
      restaurant.phone = req.body.phone;
      restaurant.google_map = req.body.google_map;
      restaurant.rating =
        !isNaN(req.body.rating.trim()) && req.body.rating.trim().length > 0
          ? parseFloat(req.body.rating)
          : 0.0;
      restaurant.description = req.body.description;

      restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${req.params.restaurant_id}`))
    .catch((error) => console.log(error));
});

// 6. 刪除單一餐廳
app.post("/restaurants/:restaurant_id/delete", (req, res) => {
  Restaurant.findOne({ id: req.params.restaurant_id })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 服務器監聽
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
