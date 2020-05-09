require('dotenv').config();
const utils = require("../utils");
const AWS = require("aws-sdk");

const awsConfig = {
    region: process.env.AWS_DYNAMO_REGION,
    endpoint: process.env.AWS_DYNAMO_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}
AWS.config.update(awsConfig);

const dbClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    authenticate: (req, res, next) => {
        /**Authenticate with AWS */    
        console.log("Body:", req.body);    
        try {
            dbClient.scan({
                TableName: "egenum-users",
                FilterExpression: "username= :username",
                ExpressionAttributeValues: {
                    ":username": req.body.userName
                }
            }, (error, data) => {
                if(error) {
                    console.log("Error with userName")
                    console.log("Error: ", error)
                    req.user_data = {};
                    req.user_errors = {
                        serveur: {
                            msg: "Une erreur serveur interne est survenue"
                        }
                    };
                    next();
                }
                else {
                    if(data.Count !== 1) {
                        console.log("Utilisateur introuvable")
                        req.user_data = {};
                        req.user_errors = {
                            userName: {
                                msg: "Le nom d'utilisateur est invalide !"
                            }
                        };
                        next();
                    }
                    else {
                        dbClient.scan({
                            TableName: "egenum-users",
                            FilterExpression: "username= :username AND password= :password",
                            ExpressionAttributeValues: {
                                ":username": req.body.userName,
                                ":password": utils.hashPassword(req.body.password)
                            }
                        }, (error, data) => {
                            if(error) {
                                console.log("Error with password")
                                console.log("Error: ", error)
                                req.user_data = {};
                                req.user_errors = {
                                    serveur: {
                                        msg: "Une erreur serveur interne est survenue"
                                    }
                                };
                                next();
                            }
                            else {
                                if(data.Count === 0) {
                                    console.log("Combinaison utilisateur/mot de passe introuvable")
                                    req.user_data = {};
                                    req.user_errors = {
                                        password: {
                                            msg: "Le mot de passe est invalide !"
                                        }
                                    };
                                    next();
                                }
                                else if (data.Count === 1) {
                                    console.log("Authentifié")
                                    req.user_data = {
                                        id: data.Items[0].id,
                                        userName: data.Items[0].username
                                    };
                                    req.user_errors = {};
                                    next();
                                }
                            }
                        })
                    }
                }
            })
        } catch (error) {
            console.log("Error: ", error)
            req.user_data = {};
            req.user_errors = {
                serveur: {
                    msg: "Une erreur serveur interne est survenue"
                }
            };
            next();
        }
    },

    /*********************/
    /**SUPER ADMIN Only */
    /** createUser: (req, res, next) => {

        dbClient.scan({
            TableName: 'egenum-users',
            FilterExpression: "username= :username",
            ExpressionAttributeValues: {
                ":username": req.body.userName
            }
        }, (error, data) => {
            if(error) {
                next(error);
            }
            else {
                // console.log("Data:", data)
                if(data.Count !== 0) {
                    res.status(403).json({
                        status: 403,
                        statusStr: "FORBIDDEN",
                        msg: "L'utilisateur " + req.body.userName + " existe déjà !"
                    })
                }
                else {
                    const newUser = {
                        id: utils.createID(),
                        username: req.body.userName,
                        password: utils.hashPassword(req.body.password)
                    }

                    dbClient.put({
                        TableName: 'egenum-users',
                        Item: newUser
                    }, (error, data) => {
                        if(error) {
                            console.log("CANNOT CREATE NEW USER")
                            next(error)
                        }
                        else {
                            //Success
                            res.status(200).json({
                                status: 200,
                                statusStr: "OK",
                                msg: "L'utilisateur " + newUser.username + " a créé avec succes",
                            })
                        }
                    })
                }
            }
        })
    }*/
}