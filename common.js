function Common() {}

// 生成 Form 的 Input 欄位
Common.prototype.getInputHtml = function (
  key,
  title,
  formType = "text",
  formValue = ""
) {
  // 只有 name 欄位是requried
  const keyRequired = ["name", "category", "image", "location", "phone"];
  const isRequired = keyRequired.includes(key) ? "required" : "";
  formValue =
    formType === "text" ? formValue.replace(/\s/g, "&#32;") : formValue;

  return `
    <div class="mb-3">
      <label for="${key}" class="form-label">${title}</label>
      <input type="${formType}" class="form-control" id="${key}" name="${key}" ${isRequired} value=${formValue}>
    </div>`;
};

module.exports = new Common();
