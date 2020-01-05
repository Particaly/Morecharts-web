var mongoose = require('mongoose');
var CounterModel = require('./Counter');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log('Connection Error:' + err)
    }else{
        console.log('Connection success!')
    }
});

var tokenSchema = new Schema({
    token: String,
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1d' }
    }
});
var Token = mongoose.model('Token', tokenSchema);

var userSchema = new Schema({
    userId: {
        type: Number,
        default: 0
    },
    userInfo: {
        name: String,
        email: String,
        phone: String
    },
    userType: {
        type: String,
        required: true,
        default: 'normal'
    },
    userPass: String,
});
userSchema.pre('save',async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;
    this.userId = await CounterModel.increment('userId');
});
var User = mongoose.model('User', userSchema);

var projectSchema = new Schema({
    auther: String,

});


module.exports = { Token, User };
