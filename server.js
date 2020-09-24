var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));


app.post('/product',function(request , response)
    {
        var product = new Product();
        product.title = request.body.title;
        product.price = request.body.price;
        product.save(function(err, savedproduct)
            {
                if(err)
                    {
                        response.send(500).send({error:"Could not save product"});
                    }
                else
                    {
                        response.send(savedproduct);
                    }
            })
    });

app.get('/product',function(request,response)
    {
        Product.find({},function(err,products)
                {
                    if(err)
                        {
                            response.send(500).send({error:"could not fetch prodcuts"});
                        }
                    else
                        {
                            response.send(products);
                        }
                });
            
    });

app.post('/wishlist',function(request,response)
        {
            var wishList = new WishList();
            wishList.title = request.body.title;
            
            wishList.save(function(err,newwishlist)
                {
                    if(err)
                        {
                            response.status(500).send({error:"could not create wishlist"});
                        }
                    else
                        {
                            response.send(newwishlist);
                        }
                });
        });


app.get('/wishlist',function(request,response)
    {
        WishList.find({}).populate({path: 'products',model:'Product'}).exec(function(err,wishLists)
             {
                if(err){
                    response.send(500).send({error:"could not populate wishlist"});
                }
                else{
                    response.status(200).send(wishLists);
                }
            });
    });

// IMP FUNCTION **************************************

app.put('/wishlist/product/add',function(request,response)
    {
        Product.findOne({_id: request.body.productId}, function(err,product)
            {
                if(err)
                    {
                        response.status(500).send({error:"couldnot find item in wishlist"});
                    }
                else{
    WishList.update({_id:request.body.wishListId},{$addToSet:{products: product._id}},function(err, wishList){
                            if(err)
                            {
                                response.status(500).send({error:"could not find item in wishlist"});
                            }
                            else{
                                response.send(wishList);
                            }
                    });
                }
            });
    });  

        


            
            


app.listen(3000, function()
{
    console.log("swag shop api running on port 3000...");
});
