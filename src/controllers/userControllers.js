const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
  try {
    let data = req.body
    let arr = Object.keys(data)
    let title = req.body.title
    let names = /^[a-zA-Z ]{2,30}$/.test(req.body.name);
    let mobile = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(req.body.phone);
    let emailId = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.email);
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(req.body.password);
    let address = req.body.address

    let Email = await userModel.findOne({ email: req.body.email });
    let mobileNo = await userModel.findOne({ phone: req.body.phone });

    if (arr.length == 0) {
      res.status(400).send({ status:false,message: "Invalid request ! Please provide details" })
    }
    else if (!req.body.name) {
      res.status(400).send({ status:false,message: "name missing" })
    }

    else if (!req.body.phone) {
      res.status(400).send({ status:false,message: "phone missing" })
    }
    // enum key value check
    else if (!["Mr", "Mrs", "Miss"].includes(title)) {
      return res.status(400).send({
        status: false,
        message: "Title Must be of these values [Mr, Mrs, Miss] ",
      });
    }

    else if (!req.body.email) {
      res.status(400).send({ status:false,message: "Email Id missing" })
    }
    else if (!req.body.password) {
      res.status(400).send({status:false, message: "Password missing" })
    }
    else if ((!data.address.street) && (!data.address.city) && (!data.address.pincode)) {
      res.status(400).send({status:false, message: "please provide street,city, pincode details in address" })
    }
    else if (!address) {
      res.status(400).send({ status:false,message: "address missing" })
    }
    else if (!data.address.street) {
      res.status(400).send({status:false, message: "please provide street" })
    }
    else if (!data.address.city) {
      res.status(400).send({status:false, message: "please provide city" })
    }
    else if (/^[a-zA-Z ]{2,30}$/.test(data.address.city) == false) {
      res.status(400).send({status:false,status: false, message: "Please provide a valid city" })
    }
    else if (!data.address.pincode) {
      res.status(400).send({ status:false,message: "please provide pincode" })
    }
    else if (/^[0-9]{6,6}$/.test(data.address.pincode) == false) {
      res.status(400).send({ status: false, message: "Please provide a valid pincode " })
    }
    else if (names == false) {
      res.status(400).send({status:false, message: "Please Enter valid name." });
    }
    else if (mobile == false) {
      res.status(400).send({ status:false,message: "Please Enter valid mobilenumber." });
    }
    else if (emailId == false) {
      res.status(400).send({ status:false,message: "Please Enter valid email." });
    }
    else if (password == false) {
      res.status(400).send({status:false,
        message: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
      });
    }
    else if (Email) {
      res.status(409).send({ status:false,message: "This email already exist" })
    } else if (mobileNo) {
      res.status(400).send({ status: false, message: "mobile number already exist!" })
    }
    else {
      //let data = req.body;
      let dataCreated = await userModel.create(data);
      res.status(201).send({status:true, message: 'Success',data: dataCreated });
    }
  } catch (err) {
    res.status(500).send({ status:false,message: "Server not responding", error: err.message });
  }
}


// login
const loginUser = async function (req, res) {

  try {
    let email1 = req.body.email;
    let password1 = req.body.password;

    if (!email1) {
      res
        .status(400)
        .send({ status: false, message: "Please enter an email address." });
    } else if (!password1) {
      res.status(400).send({ status: false, message: "Please enter Password." });
    } else {
      let user = await userModel.findOne({
        email: email1,
        password: password1,
      });
      if (!user)
        return res.status(400).send({
          status: false,
          message: "Email or the Password is incorrect.",
        });

      let token = jwt.sign(
        {
          userId: user._id.toString(),
          batch: "uranium",
          organisation: "FunctionUp",
        },
        "project3-uranium",
        { expiresIn: "48h" }
      );
      
      res.setHeader("x-api-key", token);
      res.status(200).send({ status: true, message: 'Success',data: token });
    }
  } catch (err) {
    res.status(500).send({ message: "Server not responding", error: err.message });
  }
};



module.exports = { createUser, loginUser }
