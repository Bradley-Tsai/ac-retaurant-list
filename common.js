function Common() {}

// Form生成
Common.prototype.getFormHtml = function (key, title, formValue) {
  return `
    <div class="mb-3">
      <label for="${key}" class="form-label">${title}</label>
      <input type="text" class="form-control" id="${key}" name="${key}" value=${formValue}>
    </div>`;
};

module.exports = new Common();
