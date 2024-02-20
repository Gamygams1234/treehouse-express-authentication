var mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const saltRounds = 10;



var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});


// authenticate

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email}).exec(function(error, user){
        if(error){
            return callback(error)
        }else if (!user){
            let err = new Error("User not found")
            err.status = 401
            return callback(err)
        }
        bcrypt.compare(password, user.password, function(error, result){
            if (result === true){
                return callback(null, user)
            } else{
                return callback()
            }
        })
    })
}

// hashing the password

UserSchema.pre("save", function(next){
    var user = this;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
        console.log(user.password)
            if (err){
                return next(err)
            }
            user.password = hash
            next();
        });
    });
})


var User = mongoose.model('User', UserSchema);
module.exports = User;