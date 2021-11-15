/**
 * @Author: alassane
 * @Date:   2018-11-09T20:33:38+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-08T17:37:59+01:00
 */

const { MDFiveConverter } = require(`${root}/rendererProcess/controller/MDFiveConverter.js`);

/** This class is a representation of QRCode unique in JSON format */
class QRCodeUnique {

  constructor(name = "", data = [], color = "") {

    /** Génération de l'id unique */
    var dataString = name + "unique" + color;
    for (var i = 0; i < data.length; i++) {
      if(data[i] instanceof Object) {
        if(data[i].type = 'text'){
          dataString += data[i].text;
        }
        else {
          dataString += data[i].name;
        }
      }
    }

    console.log(dataString);
    var md5Value = MDFiveConverter.convert(dataString);
    console.log(md5Value);

    this.qrcode = {
      /** ajout de id pour les QR unique &&*/
      id: md5Value,
      name: name,
      type: "unique",
      data: data,
      color: color
    };
  }

  getQRCode() {
    return this.qrcode;
  }
  getId() {
    return this.qrcode.id;
  }

  getName() {
    return this.qrcode.name;
  }

  setName(name) {
    this.qrcode.name = name;
  }

  getType() {
    return this.qrcode.type;
  }

  getColor() {
    return this.qrcode.color;
  }

  setColor(color) {
    this.qrcode.color = color;
  }
  
  getData(index = null) {
    if(this.qrcode.data[index].type = 'text'){
      return this.qrcode.data[index].text;
    }
    else {
      return this.qrcode.data[index].name;
    }
  }

  getDataAll() {
    return this.qrcode.data;
  }

  setData(data) {
    this.qrcode.data = data;
  }

  setId(id) {
    this.qrcode.id = id;
  }

  addData(element) {
    this.qrcode.data.push(element);
  }

  /** return qr code data which will be interpreted by phone */
  getDataString() {
    return JSON.stringify(this.qrcode);
  }

}

module.exports = {
  QRCodeUnique
};
