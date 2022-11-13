const express = require("express");
const exphbs = require("express-handlebars");
const restaurantsList = require("./restaurant.json");
const app = express();
const port = 3000;

// 設定模板引擎
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// 設定靜態檔案
app.use(express.static("public"));

// 設定路由
// 1. 首頁
app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurantsList.results });
});

// 2. 搜尋頁面
app.get("/search", (req, res) => {
  const keywords = req.query.keyword.trim();

  // 無關鍵字, 回到首頁
  if (keywords.length === 0) {
    return res.redirect("/");
  }

  // 處理關鍵字
  const reg = /\s+/;
  const keywordsLowerCase = keywords
    .split(reg)
    .map((keyword) => keyword.toLowerCase());

  // 以 餐廳名稱 & 餐廳分類 比對搜尋關鍵字
  res.render("index", {
    restaurants: restaurantsList.results.filter((restaurant) =>
      keywordsLowerCase.some(
        (kw) =>
          (restaurant.name.toLowerCase().includes(kw) ||
            restaurant.category.toLowerCase().includes(kw)) &&
          kw !== ""
      )
    ),
    keywords,
  });
});

// 3. 單一餐廳頁面
app.get("/restaurants/:restaurant_id", (req, res) => {
  res.render("show", {
    restaurant: restaurantsList.results.find(
      (restaurant) =>
        restaurant.id.toString() === req.params.restaurant_id.toString()
    ),
  });
});

// 服務器監聽
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
