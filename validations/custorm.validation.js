const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.message('"{{#label}}" không đúng định dạng Id');
    }
    return value;
  };
  const password = (value, helpers) => {
    if (value.length < 8) {
      return helpers.message('Mật khẩu phải lớn hơn 8 ký tự');
    }
    if (!value.match(/\d/) || !value.match(/[a-z]/) || !value.match(/[A-Z]/)) {
      return helpers.message('Mật khẩu phải chứa ít nhất 1 ký tự chữ hoa, 1 ký tự chữ thường và 1 số');
    }
    return value;
  };

  const phoneNumberValidate = (value, helpers) => {

    // Kiểm tra độ dài số điện thoại
    if (value.length !== 10) {
      return helpers.message('Số điện thoại phải có đúng 10 chữ số');
    }
  
    // Kiểm tra chỉ chứa số
    if (!/^\d+$/.test(value)) {
      return helpers.message('Số điện thoại chỉ được chứa các chữ số');
    }
  
    return value;
  };
  
  
  module.exports = {
    password,
    objectId,
    phoneNumberValidate
  };
  
